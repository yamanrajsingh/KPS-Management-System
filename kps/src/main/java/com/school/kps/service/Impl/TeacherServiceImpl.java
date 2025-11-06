package com.school.kps.service.Impl;

import com.school.kps.entity.Teacher;
import com.school.kps.exception.ResourceNotFoundException;
import com.school.kps.payload.TeacherDto;
import com.school.kps.repository.TeacherRepo;
import com.school.kps.service.TeacherService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherServicerImpl implements TeacherService {
    @Autowired
    private TeacherRepo teacherRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public TeacherDto createTeacher(TeacherDto teacherDto) {
        Teacher teacher = modelMapper.map(teacherDto, Teacher.class);
        Teacher newTeacher = teacherRepo.save(teacher);
        return modelMapper.map(newTeacher, TeacherDto.class);
    }

    @Override
    public TeacherDto updateTeacher(TeacherDto teacherDto, Integer id) {

        Teacher teacher = this.teacherRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));
        teacher.setName(teacherDto.getName());
        teacher.setQualification(teacherDto.getQualification());
        teacher.setSubject(teacherDto.getSubject());
        teacher.setAadhaarNumber(teacherDto.getAadhaarNumber());
        teacher.setJoiningDate(LocalDate.now());
        teacher.setSalary(teacherDto.getSalary());
        teacher.setAddress(teacherDto.getAddress());
        teacher.setEmail(teacherDto.getEmail());
        teacher.setPhone(teacherDto.getPhone());
        Teacher updateTeacher = this.teacherRepo.save(teacher);
        return modelMapper.map(updateTeacher, TeacherDto.class);

    }

    @Override
    public TeacherDto deleteTeacher(Integer id) {
        Teacher deleteTeacher = this.teacherRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));
        this.teacherRepo.delete(deleteTeacher);
        return modelMapper.map(deleteTeacher, TeacherDto.class);
    }

    @Override
    public List<TeacherDto> findAllTeachers() {
        List<Teacher> teachers = this.teacherRepo.findAll();
        List<TeacherDto> teacherDtos = teachers.stream().map(teacher -> this.modelMapper.map(teacher, TeacherDto.class)).collect(Collectors.toList());
        return teacherDtos;
    }

    @Override
    public TeacherDto findTeacherById(Integer id) {
        Teacher teacher = this.teacherRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));
        return modelMapper.map(teacher, TeacherDto.class);
    }

    @Override
    public List<TeacherDto> findTeacher(String name) {
        List<Teacher> teachers = this.teacherRepo.findByNameContainingIgnoreCase(name);
        List<TeacherDto> teacherDtos = teachers.stream().map(teacher -> this.modelMapper.map(teacher, TeacherDto.class)).collect(Collectors.toList());
        return teacherDtos;
    }
}
