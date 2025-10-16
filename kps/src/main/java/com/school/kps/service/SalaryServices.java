package com.school.kps.service;

import com.school.kps.payload.SalaryDto;

import java.util.List;


public interface SalaryServices {

    SalaryDto createSalary(SalaryDto salaryDto, Integer teacherId);

    SalaryDto updateSalary(SalaryDto salaryDto, Integer teacherId);

    List<SalaryDto> getAllSalaries();

    SalaryDto deleteSalary(Integer id);

    List<SalaryDto> findSalaryByTeacherName(String name);

    List<SalaryDto> findSalaryByStatus(String status);

    List<SalaryDto> getSalariesByTeacherId( Integer teacherId);

    SalaryDto getSalaryById(Integer id);


}
