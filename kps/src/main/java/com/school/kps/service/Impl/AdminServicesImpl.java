package com.school.kps.service.Impl;

import com.school.kps.entity.Admin;
import com.school.kps.payload.AdminDto;
import com.school.kps.payload.SalaryDto;
import com.school.kps.repository.AdminRepo;
import com.school.kps.service.AdminServices;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class AdminServicesImpl implements AdminServices {
    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<AdminDto> getAdmin() {
        List<Admin> admins = new ArrayList<>();
        this.adminRepo.findAll().forEach(admins::add); // Convert Iterable to List
        return admins.stream()
                .map(admin -> this.modelMapper.map(admin, AdminDto.class))
                .collect(Collectors.toList());
    }

}
