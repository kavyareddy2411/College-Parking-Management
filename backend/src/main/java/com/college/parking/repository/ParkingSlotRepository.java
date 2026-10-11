package com.college.parking.repository;

import com.college.parking.model.ParkingSlot;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, String> {
    long countByStatus(String status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select slot from ParkingSlot slot where slot.id = :id")
    Optional<ParkingSlot> findByIdForUpdate(@Param("id") String id);
}
