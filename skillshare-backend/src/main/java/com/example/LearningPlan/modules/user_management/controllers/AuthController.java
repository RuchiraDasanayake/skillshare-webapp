package com.example.LearningPlan.modules.user_management.controllers;

import com.example.LearningPlan.modules.user_management.dtos.LoginDTO;
import com.example.LearningPlan.modules.user_management.dtos.OAuth2UserDto;
import com.example.LearningPlan.modules.user_management.models.AppUser;
import com.example.LearningPlan.modules.user_management.repositories.AppUserRepository;
import com.example.LearningPlan.security.JwtAuthResponse;
import com.example.LearningPlan.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AppUserRepository userRepository;

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginDTO loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsername(),
                        loginDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);

        Optional<AppUser> user= userRepository.findByUsername(loginDto.getUsername());

        if(user.isEmpty()) return ResponseEntity.ok(new JwtAuthResponse(token, ""));

        AppUser u = user.get();
        if (isAccountDeactivated(u)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Your account is deactivated. Please try again later.");
        }


        return ResponseEntity.ok(new JwtAuthResponse(token, user.get().getId()));
    }

    @GetMapping("/oauth2/user")
    public ResponseEntity<?> getOAuth2User(Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(null);
        }

        OAuth2User oAuth2User = (OAuth2User) ((Authentication) principal).getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Extract user info from OAuth2 attributes
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        Optional<AppUser> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            AppUser user = userOptional.get();
            if (isAccountDeactivated(user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Account is temporarily deactivated"));
            }
        }

        // Check if user exists, if not create new user
        AppUser user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    AppUser newUser = new AppUser();
                    newUser.setEmail(email);
                    newUser.setUsername(email);
                    newUser.setFirstName(name);
                    newUser.setLastName("");
                    return userRepository.save(newUser);
                });

        OAuth2UserDto userDto = new OAuth2UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getFirstName());
        userDto.setEmail(user.getEmail());

        return ResponseEntity.ok(userDto);
    }
    private boolean isAccountDeactivated(AppUser user) {
        if (!user.isDeactivateStatus()) {
            return false;
        }

        Date currentDate = new Date();
        Date startDate = user.getDeactivateStartDate();
        Date endDate = user.getDeactivateEndDate();

        if (startDate == null) {
            return false;
        }

        // Check if current date is after start date
        boolean afterStart = currentDate.after(startDate);

        // If end date is null, account is indefinitely deactivated after start date
        if (endDate == null) {
            return afterStart;
        }

        // Check if current date is before end date
        boolean beforeEnd = currentDate.before(endDate);

        // Account is deactivated if current date is between start and end dates
        return afterStart && beforeEnd;
    }
}
