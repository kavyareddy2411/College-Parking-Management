package com.college.parking.api;

import com.college.parking.model.ParkingSlot;
import com.college.parking.repository.ParkingSlotRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/slots")
public class ParkingController {
    private final ParkingSlotRepository slots;

    public ParkingController(ParkingSlotRepository slots) {
        this.slots = slots;
    }

    @GetMapping
    public List<SlotView> listSlots() {
        return slots.findAll(Sort.by("id")).stream().map(SlotView::from).toList();
    }

    public record SlotView(String id, String zone, String location, String status) {
        static SlotView from(ParkingSlot slot) {
            return new SlotView(slot.getId(), slot.getZone(), slot.getLocation(),
                    slot.getStatus().toLowerCase(Locale.ROOT));
        }
    }
}
