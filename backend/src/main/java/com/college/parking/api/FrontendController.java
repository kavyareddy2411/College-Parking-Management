package com.college.parking.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {
    @GetMapping({"/login", "/register", "/booking", "/parking", "/my-bookings", "/admin"})
    public String serveFrontend() {
        return "forward:/index.html";
    }
}
