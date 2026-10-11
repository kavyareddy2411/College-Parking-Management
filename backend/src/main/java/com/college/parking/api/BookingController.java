package com.college.parking.api;

import com.college.parking.model.UserAccount;
import com.college.parking.service.BookingService;
import com.college.parking.service.BookingService.BookingView;
import com.college.parking.service.BookingService.CreateBookingRequest;
import com.college.parking.service.SessionService;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookings;
    private final SessionService sessions;

    public BookingController(BookingService bookings, SessionService sessions) {
        this.bookings = bookings;
        this.sessions = sessions;
    }

    @GetMapping("/mine")
    public List<BookingView> mine(HttpSession session) {
        return bookings.listForUser(sessions.requireUser(session));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingView create(@RequestBody CreateBookingRequest request, HttpSession session) {
        return bookings.create(sessions.requireUser(session), request);
    }

    @DeleteMapping("/{id}")
    public BookingView cancel(@PathVariable Long id, HttpSession session) {
        UserAccount user = sessions.requireUser(session);
        return bookings.cancel(id, user, "admin".equals(user.getRole()));
    }
}
