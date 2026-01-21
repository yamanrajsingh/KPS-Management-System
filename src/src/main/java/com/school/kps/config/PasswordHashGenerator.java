//package com.school.kps.config;
//
//import  org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//@Configuration
//public class PasswordHashGenerator {
//
//    @Bean
//    public CommandLineRunner generateAdminPasswordHash(PasswordEncoder passwordEncoder) {
//        return args -> {
//            String rawPassword = "admin@1234";
//            String hashedPassword = passwordEncoder.encode(rawPassword);
//
//            System.out.println("==================================");
//            System.out.println("Raw Password   : " + rawPassword);
//            System.out.println("Hashed Password: " + hashedPassword);
//            System.out.println("==================================");
//        };
//    }
//}