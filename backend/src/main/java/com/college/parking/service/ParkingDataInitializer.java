package com.college.parking.service;

import com.college.parking.model.ParkingSlot;
import com.college.parking.model.UserAccount;
import com.college.parking.repository.ParkingSlotRepository;
import com.college.parking.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ParkingDataInitializer implements ApplicationRunner {
    private final UserAccountRepository users;
    private final ParkingSlotRepository slots;
    private final PasswordHasher passwords;
    private final String studentPassword;
    private final String adminPassword;

    public ParkingDataInitializer(UserAccountRepository users, ParkingSlotRepository slots, PasswordHasher passwords,
            @Value("${app.demo.student-password:student123}") String studentPassword,
            @Value("${app.demo.admin-password:admin123}") String adminPassword) {
        this.users = users;
        this.slots = slots;
        this.passwords = passwords;
        this.studentPassword = studentPassword;
        this.adminPassword = adminPassword;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        createDemoUser("Alex Morgan", "student@college.edu", studentPassword, "student", "CAMPUS 01");
        createDemoUser("Campus Admin", "admin@college.edu", adminPassword, "admin", "");
        if (slots.count() == 0)
            seedSlots();
    }

    private void createDemoUser(String name, String email, String password, String role, String plate) {
        if (!users.existsByEmailIgnoreCase(email)) {
            users.save(new UserAccount(name, email, passwords.hash(password), role, plate));
        }
    }

    private void seedSlots() {
        String[][] zones = {
                { "North", "Library entrance", "N" },
                { "South", "Student centre", "S" },
                { "East", "Science block", "E" }
        };
        for (String[] zone : zones) {
            for (int number = 1; number <= 12; number++) {
                String status = number == 2 || number == 6 || number == 10 ? "occupied" : "available";
                slots.save(new ParkingSlot(zone[2] + String.format("-%02d", number), zone[0], zone[1], status));
            }
        }
    }
}
