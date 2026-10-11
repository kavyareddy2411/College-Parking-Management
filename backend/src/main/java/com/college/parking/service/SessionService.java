package com.college.parking.service;

import com.college.parking.model.UserAccount;
import com.college.parking.repository.UserAccountRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class SessionService {
    public static final String USER_ID = "parksideUserId";
    private final UserAccountRepository users;

    public SessionService(UserAccountRepository users) {
        this.users = users;
    }

    public UserAccount currentUser(HttpSession session) {
        if (session == null || !(session.getAttribute(USER_ID) instanceof Long userId))
            return null;
        return users.findById(userId).orElse(null);
    }

    public UserAccount requireUser(HttpSession session) {
        UserAccount user = currentUser(session);
        if (user == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sign in to continue");
        return user;
    }

    public UserAccount requireAdmin(HttpSession session) {
        UserAccount user = requireUser(session);
        if (!"admin".equals(user.getRole()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Administrator access is required");
        return user;
    }
}
