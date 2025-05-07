package com.skillshare.app.user.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillshare.app.config.TokenProvider;
import com.skillshare.app.user.dto.UserDto;
import com.skillshare.app.user.dto.Varification;
import com.skillshare.app.user.exception.UserException;
import com.skillshare.app.user.model.User;
import com.skillshare.app.user.repository.UserRepository;
import com.skillshare.app.user.service.CustomUserDetailsServiceImplementation;



@RestController
@RequestMapping("/api/auth") 

public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenProvider jwtProvider;

    @Autowired
    private CustomUserDetailsServiceImplementation customerUserDetails;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody UserDto userDto) throws UserException{

        System.out.println("UserDto: " + userDto);

        String email = userDto.getEmail();
        String password = userDto.getPassword();
        String fullName = userDto.getFullName();
        String birthDate = userDto.getBirthDate();
        

        User isEmailExist = userRepository.findByEmail(email);
        if(isEmailExist != null){
            throw new UserException("Email already exists");
        }
        
        User createdUser = new User();
        createdUser.setEmail(email);
        createdUser.setFullName(fullName);
        createdUser.setBirthDate(birthDate);
        createdUser.setPassword(passwordEncoder.encode(password));
        createdUser.setVerification(new Varification());

        User savedUser = userRepository.save(createdUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse(token,true);

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin (@RequestBody UserDto userDto){
        String username = userDto.getEmail();
        String password = userDto.getPassword();

        Authentication authentication = authenticate(username, password);

        String token = jwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse(token,true);

        return new ResponseEntity<>(authResponse, HttpStatus.ACCEPTED);
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customerUserDetails.loadUserByUsername(username);

        if(userDetails == null){
            throw new BadCredentialsException("Invalid username...");
        }
        if(!passwordEncoder.matches(password, userDetails.getPassword())){
            throw new BadCredentialsException("Invalid username or password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }



}
