package com.college.parking.api;

import com.college.parking.model.UserAccount;
import com.college.parking.repository.UserAccountRepository;
import com.college.parking.service.PasswordHasher;
import com.college.parking.service.SessionService;
import jakarta.servlet.http.HttpSession;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserAccountRepository users;
    private final PasswordHasher passwords;
    private final SessionService sessions;

    public AuthController(UserAccountRepository users, PasswordHasher passwords, SessionService sessions) {
        this.users = users;
        this.passwords = passwords;
        this.sessions = sessions;
    }

    @PostMapping("/register")
    public ResponseEntity<UserView> register(@RequestBody RegisterRequest request, HttpSession session) {
        String name = request.name() == null ? "" : request.name().trim();
        String email = normalizeEmail(request.email());
        String password = request.password() == null ? "" : request.password();
        String role = request.role() == null ? "student" : request.role().trim().toLowerCase(Locale.ROOT);
        if (name.length() < 2 || name.length() > 100)
            throw badRequest("Enter a name between 2 and 100 characters");
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
            throw badRequest("Enter a valid email address");
        if (password.length() < 6 || password.length() > 100)
            throw badRequest("Password must be 6 to 100 characters");
        if (!role.equals("student") && !role.equals("staff"))
            throw badRequest("Choose student or staff account type");
        if (users.existsByEmailIgnoreCase(email))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with that email already exists");

        String plate = normalizePlate(request.plate());
        UserAccount user = users.save(new UserAccount(name, email, passwords.hash(password), role, plate));
        session.setAttribute(SessionService.USER_ID, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(UserView.from(user));
    }

    @PostMapping("/login")
    public UserView login(@RequestBody LoginRequest request, HttpSession session) {
        String email = normalizeEmail(request.email());
        String password = request.password() == null ? "" : request.password();
        UserAccount user = users.findByEmailIgnoreCase(email)
                .filter(account -> passwords.matches(password, account.getPasswordHash()))
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email or password is incorrect"));
        session.setAttribute(SessionService.USER_ID, user.getId());
        return UserView.from(user);
    }

    @GetMapping("/me")
    public ResponseEntity<UserView> me(HttpSession session) {
        UserAccount user = sessions.currentUser(session);
        return user == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(UserView.from(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        if (session != null)
            session.invalidate();
        return ResponseEntity.noContent().build();
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizePlate(String plate) {
        return plate == null ? "" : plate.trim().toUpperCase(Locale.ROOT);
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    public record LoginRequest(String email, String password) {
    }

    public record RegisterRequest(String name, String email, String password, String role, String plate) {
    }

    public record UserView(Long id, String name, String email, String role, String plate) {
        static UserView from(UserAccount user) {
            return new UserView(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getPlate());
        }
    }
}
