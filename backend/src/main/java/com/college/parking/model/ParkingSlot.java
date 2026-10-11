package com.college.parking.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "parking_slots")
public class ParkingSlot {
    @Id
    private String id;

    @Column(nullable = false, length = 30)
    private String zone;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false, length = 20)
    private String status;

    protected ParkingSlot() {
    }

    public ParkingSlot(String id, String zone, String location, String status) {
        this.id = id;
        this.zone = zone;
        this.location = location;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public String getZone() {
        return zone;
    }

    public String getLocation() {
        return location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
