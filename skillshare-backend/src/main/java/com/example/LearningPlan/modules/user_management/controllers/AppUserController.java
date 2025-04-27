package com.example.LearningPlan.modules.user_management.controllers;



import com.example.LearningPlan.modules.user_management.dtos.AccountDeactivationDTO;
import com.example.LearningPlan.modules.user_management.dtos.AppUserDTO;
import com.example.LearningPlan.modules.user_management.dtos.UserProfileDTO;
import com.example.LearningPlan.modules.user_management.services.AppUserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/users")
public class AppUserController {

    @Autowired
    private AppUserService appUserService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AppUserDTO appUserDTO) {
        try {
            return ResponseEntity.ok(appUserService.createUser(appUserDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @GetMapping
    public ResponseEntity<List<UserProfileDTO>> getAllUsers() {
        return ResponseEntity.ok(appUserService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDTO> getUserById(@PathVariable String id) {
        Optional<UserProfileDTO> user = appUserService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfileDTO> updateUser(@PathVariable String id, @RequestBody AppUserDTO appUserDTO) {
        Optional<UserProfileDTO> updatedUser = appUserService.updateUser(id, appUserDTO);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (appUserService.deleteUser(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<UserProfileDTO> deactivateAccount(
            @PathVariable String id,
            @RequestBody AccountDeactivationDTO deactivationDTO) {
        try {
            UserProfileDTO deactivatedUser = appUserService.deactivateAccount(id, deactivationDTO);
            return ResponseEntity.ok(deactivatedUser);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
