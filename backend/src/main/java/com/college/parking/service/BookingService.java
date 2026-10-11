package com.college.parking.service;

import com.college.parking.model.ParkingBooking;
import com.college.parking.model.ParkingSlot;
import com.college.parking.model.UserAccount;
import com.college.parking.repository.ParkingBookingRepository;
import com.college.parking.repository.ParkingSlotRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BookingService {
    private final ParkingBookingRepository bookings;
    private final ParkingSlotRepository slots;

    public BookingService(ParkingBookingRepository bookings, ParkingSlotRepository slots) {
        this.bookings = bookings;
        this.slots = slots;
    }

    @Transactional(readOnly = true)
    public List<BookingView> listForUser(UserAccount user) {
        return bookings.findByUser_IdOrderByDateAscTimeAsc(user.getId()).stream().map(BookingView::from).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingView> listAll() {
        return bookings.findAllByOrderByCreatedAtDesc().stream().map(BookingView::from).toList();
    }

    @Transactional
    public BookingView create(UserAccount user, CreateBookingRequest request) {
        if (request == null || request.slotId() == null)
            throw badRequest("Choose a parking space");
        LocalDate date = request.date();
        LocalTime time = request.time();
        if (date == null || date.isBefore(LocalDate.now()))
            throw badRequest("Choose today or a future date");
        if (time == null)
            throw badRequest("Choose an arrival time");
        if (request.duration() < 1 || request.duration() > 8)
            throw badRequest("Duration must be between 1 and 8 hours");
        String plate = request.plate() == null || request.plate().isBlank()
                ? user.getPlate()
                : request.plate().trim().toUpperCase(Locale.ROOT);
        if (plate == null || plate.isBlank() || plate.length() > 20)
            throw badRequest("Enter a valid vehicle registration");

        ParkingSlot slot = slots.findByIdForUpdate(request.slotId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking space not found"));
        if (!"available".equals(slot.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That parking space is no longer available");
        }
        slot.setStatus("reserved");
        return BookingView.from(bookings.save(new ParkingBooking(user, slot, date, time, request.duration(), plate)));
    }

    @Transactional
    public BookingView cancel(Long bookingId, UserAccount requester, boolean administrator) {
        ParkingBooking booking = bookings.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        if (!administrator && !booking.getUser().getId().equals(requester.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found");
        }
        if ("active".equals(booking.getStatus())) {
            booking.setStatus("cancelled");
            booking.getSlot().setStatus("available");
        }
        return BookingView.from(booking);
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    public record CreateBookingRequest(String slotId, LocalDate date, LocalTime time, int duration, String plate) {
    }

    public record BookingView(String id, Long userId, String userName, String email, String slotId, String zone,
            String date, String time, int duration, String plate, String status, String createdAt) {
        static BookingView from(ParkingBooking booking) {
            return new BookingView("PK-" + booking.getId(), booking.getUser().getId(), booking.getUser().getName(),
                    booking.getUser().getEmail(), booking.getSlot().getId(), booking.getSlot().getZone(),
                    booking.getDate().toString(), booking.getTime().toString(), booking.getDuration(),
                    booking.getPlate(),
                    booking.getStatus(), booking.getCreatedAt().toString());
        }
    }
}
