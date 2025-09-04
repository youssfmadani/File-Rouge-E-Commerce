package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200", "http://localhost:64496", "http://127.0.0.1:64496", "http://localhost:*"}, allowCredentials = "true")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "");
        String role = email.toLowerCase().contains("admin") ? "ADMIN" : "USER";

        Map<String, String> result = new HashMap<>();
        result.put("token", "dummy-token");
        result.put("role", role);
        return ResponseEntity.ok(result);
    }
}
