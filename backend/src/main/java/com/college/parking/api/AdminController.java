package com.college.parking.api;

import com.college.parking.repository.ParkingBookingRepository;
import com.college.parking.repository.ParkingSlotRepository;
import com.college.parking.repository.UserAccountRepository;
import com.college.parking.service.BookingService;
import com.college.parking.service.BookingService.BookingView;
import com.college.parking.service.SessionService;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final SessionService sessions;
    private final BookingService bookings;
    private final ParkingSlotRepository slots;
    private final ParkingBookingRepository parkingBookings;
    private final UserAccountRepository users;

    public AdminController(SessionService sessions, BookingService bookings, ParkingSlotRepository slots,
            ParkingBookingRepository parkingBookings, UserAccountRepository users) {
        this.sessions = sessions;
        this.bookings = bookings;
        this.slots = slots;
        this.parkingBookings = parkingBookings;
        this.users = users;
    }

    @GetMapping("/summary")
    public Summary summary(HttpSession session) {
        sessions.requireAdmin(session);
        return new Summary(slots.count(), slots.countByStatus("available"), parkingBookings.countByStatus("active"),
                users.count());
    }

    @GetMapping("/bookings")
    public List<BookingView> listBookings(HttpSession session) {
        sessions.requireAdmin(session);
        return bookings.listAll();
    }

    @DeleteMapping("/bookings/{id}")
    public BookingView cancelBooking(@PathVariable Long id, HttpSession session) {
        return bookings.cancel(id, sessions.requireAdmin(session), true);
    }

    public record Summary(long totalSpaces, long availableSpaces, long activeBookings, long registeredUsers) {
    }
}
