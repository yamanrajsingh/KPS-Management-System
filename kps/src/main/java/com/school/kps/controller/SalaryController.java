package com.school.kps.controller;

import com.school.kps.payload.SalaryDto;
import com.school.kps.service.SalaryServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/salary")
@CrossOrigin("*")
public class SalaryController {
    @Autowired
    private SalaryServices salaryServices;

    @GetMapping("/")
    public ResponseEntity<List<SalaryDto>> getAllSalaries(){
        List<SalaryDto> salaries = this.salaryServices.getAllSalaries();
        return new  ResponseEntity<>(salaries,HttpStatus.OK);

    }

    @PostMapping("/create/{id}")
    public ResponseEntity<SalaryDto> createSalary(@RequestBody SalaryDto salaryDto, @PathVariable Integer id){
        SalaryDto salary = this.salaryServices.createSalary(salaryDto,id);
        return new  ResponseEntity<>(salary,HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SalaryDto> updateSalary(@RequestBody SalaryDto salaryDto, @PathVariable Integer id){
        SalaryDto salary = this.salaryServices.updateSalary(salaryDto,id);
        return new  ResponseEntity<>(salary,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaryDto> getSalaryById(@PathVariable Integer id){
        SalaryDto salary = this.salaryServices.getSalaryById(id);
        return new  ResponseEntity<>(salary,HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SalaryDto> deleteSalary(@PathVariable Integer id){
        SalaryDto salary = this.salaryServices.deleteSalary(id);
        return new  ResponseEntity<>(salary,HttpStatus.OK);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<SalaryDto>> getSalaryByName(@PathVariable String name){
        List<SalaryDto> salaryDtos = this.salaryServices.findSalaryByTeacherName(name);
        return new  ResponseEntity<>(salaryDtos,HttpStatus.OK);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SalaryDto>> getSalaryByStatus(@PathVariable  String status){
        List<SalaryDto> salaryDtos = this.salaryServices.findSalaryByStatus(status);
        return new  ResponseEntity<>(salaryDtos,HttpStatus.OK);
    }


}
