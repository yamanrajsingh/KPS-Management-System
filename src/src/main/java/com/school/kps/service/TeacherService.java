package com.school.kps.service;

import com.school.kps.payload.TeacherDto;

import java.util.List;

public interface TeacherService {

    TeacherDto createTeacher(TeacherDto teacherDto);

    TeacherDto updateTeacher(TeacherDto teacherDto, Integer id);

    TeacherDto deleteTeacher(Integer id);

    List<TeacherDto> findAllTeachers();

    TeacherDto findTeacherById(Integer id);

    List<TeacherDto> findTeacher(String name);

}
