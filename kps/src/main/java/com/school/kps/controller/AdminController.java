package com.school.kps.controller;


import com.school.kps.payload.AdminDto;
import com.school.kps.service.AdminServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminServices adminServices;

    @GetMapping
    public ResponseEntity<List<AdminDto>> getAdmin() {
        List<AdminDto> adminDto = adminServices.getAdmin();
        return ResponseEntity.ok().body(adminDto);
    }
}
