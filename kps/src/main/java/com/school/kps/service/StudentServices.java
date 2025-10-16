package com.school.kps.service;

import com.school.kps.entity.Student;
import com.school.kps.payload.StudentDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


public interface StudentServices {

    StudentDto createStudent(StudentDto studentDto);
    StudentDto updateStudent(StudentDto studentDto, Integer id);
    StudentDto deleteStudent(Integer id);
    StudentDto findStudentById(Integer id);
    List<StudentDto> getStudentsByName(String firstName);
    List<StudentDto> findAllStudents();
    List<StudentDto> getStudentsByClassName(String className);
    List<StudentDto> searchStudents(String name, String className);
    Map<String, Long> getStudentStats();
    long getStudentCountByClassName(String className);
}
