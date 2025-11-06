package com.school.kps.service;

import com.school.kps.payload.AdminDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdminServices {
    List<AdminDto> getAdmin();
}
