package com.school.kps.service.Impl;

import com.school.kps.entity.Fee;
import com.school.kps.entity.Salary;
import com.school.kps.entity.Student;
import com.school.kps.entity.Teacher;
import com.school.kps.exception.ResourceNotFoundException;
import com.school.kps.payload.SalaryDto;
import com.school.kps.repository.SalaryRepo;
import com.school.kps.repository.TeacherRepo;
import com.school.kps.service.SalaryServices;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SalaryServicesImpl implements SalaryServices {

    @Autowired
    private SalaryRepo salaryRepo;

    @Autowired
    private TeacherRepo teacherRepo;


    @Autowired
    private ModelMapper modelMapper;


    @Override
    public SalaryDto createSalary(SalaryDto salaryDto, Integer teacherId) {
        Teacher teacher = this.teacherRepo.findById(teacherId).orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));
        Salary salary = this.modelMapper.map(salaryDto, Salary.class);
        salary.setTeacher(teacher);
        salary.setPaymentDate(LocalDate.now());

        Salary newSalary = this.salaryRepo.save(salary);
        return this.modelMapper.map(newSalary, SalaryDto.class);
    }

    @Override
    public SalaryDto updateSalary(SalaryDto salaryDto, Integer id) {
        Salary salary = this.salaryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("salary", "id", id));
        if (salaryDto.getId() != null) {
            Teacher teacher = this.teacherRepo.findById(salaryDto.getTeacher().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student", "id", salaryDto.getTeacher().getId()));
            salary.setTeacher(teacher);
        }
        Teacher teacher = teacherRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));
        salary.setStatus(salaryDto.getStatus());//
        salary.setRemarks(salaryDto.getRemarks());
        salary.setAmount(salaryDto.getAmount());
        salary.setPaymentDate(LocalDate.now());
        Salary newSalary = this.salaryRepo.save(salary);
        return this.modelMapper.map(newSalary, SalaryDto.class);
    }

    @Override
    public List<SalaryDto> getAllSalaries() {
        List<Salary> salaries = this.salaryRepo.findAll();
        return salaries.stream().map(sal -> this.modelMapper.map(sal, SalaryDto.class)).collect(Collectors.toList());

    }

    @Override
    public SalaryDto deleteSalary(Integer id) {
        Salary salary = this.salaryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Salary", "id", id));
        this.salaryRepo.delete(salary);
        return this.modelMapper.map(salary, SalaryDto.class);
    }

    @Override
    public List<SalaryDto> findSalaryByTeacherName(String name) {
        List<Salary> salarys = this.salaryRepo.findByTeacherName(name);
        return salarys.stream().map(sal -> this.modelMapper.map(sal, SalaryDto.class)).collect(Collectors.toList());
    }

    @Override
    public List<SalaryDto> findSalaryByStatus(String status) {
        List<Salary> salary = this.salaryRepo.findByStatus(status);
        return salary.stream().map(sal -> this.modelMapper.map(sal, SalaryDto.class)).collect(Collectors.toList());

    }


    @Override
    public List<SalaryDto> getSalariesByTeacherId(Integer teacherId) {

        return List.of();
    }

    @Override
    public SalaryDto getSalaryById(Integer id) {
        Salary salary = this.salaryRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Salary", "id", id));
        return this.modelMapper.map(salary, SalaryDto.class);

    }
}
