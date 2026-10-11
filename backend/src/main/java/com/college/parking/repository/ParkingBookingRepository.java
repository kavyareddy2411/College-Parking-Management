package com.college.parking.repository;

import com.college.parking.model.ParkingBooking;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingBookingRepository extends JpaRepository<ParkingBooking, Long> {
    List<ParkingBooking> findByUser_IdOrderByDateAscTimeAsc(Long userId);

    List<ParkingBooking> findAllByOrderByCreatedAtDesc();

    long countByStatus(String status);
}
