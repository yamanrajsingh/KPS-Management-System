package com.school.kps.service;

import com.school.kps.entity.Student;
import com.school.kps.payload.EnrollmentByMonth;
import com.school.kps.payload.StudentDto;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


public interface StudentServices {

    StudentDto createStudent(StudentDto studentDto);
    StudentDto updateStudent(StudentDto studentDto, Integer id);
    StudentDto deleteStudent(Integer id);
    StudentDto findStudentById(Integer id);
    List<StudentDto> getStudentsByName(String firstName);
    Page<StudentDto> findAllStudents(Integer page, Integer size, String sortBy, String sortDir, String search,String className, String gender,String location);
    List<StudentDto> getStudentsByClassName(String className);
//    Page<StudentDto> searchStudents(String name, String className);
    Map<String, Long> getStudentStats();
    long getStudentCountByClassName(String className);
    Map<String, Long> getClassWiseStudentCount();
     List<EnrollmentByMonth> getEnrollmentByMonth(Integer year);
}
