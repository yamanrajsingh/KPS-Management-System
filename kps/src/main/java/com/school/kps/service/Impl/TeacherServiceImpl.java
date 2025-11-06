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
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepo teacherRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public TeacherDto createTeacher(TeacherDto teacherDto) {
        // Ensure display name exists: prefer provided name, else combine first+last
        if ((teacherDto.getName() == null || teacherDto.getName().isBlank())
                && (teacherDto.getFirstName() != null || teacherDto.getLastName() != null)) {
            String first = teacherDto.getFirstName() == null ? "" : teacherDto.getFirstName().trim();
            String last = teacherDto.getLastName() == null ? "" : teacherDto.getLastName().trim();
            teacherDto.setName((first + " " + last).trim());
        }

        // Set lastUpdated if not provided
        if (teacherDto.getLastUpdated() == null) {
            teacherDto.setLastUpdated(LocalDate.now());
        }

        Teacher teacher = modelMapper.map(teacherDto, Teacher.class);
        // If your entity uses Long id (auto-generated) do not set ID from DTO for create
        teacher.setId(null);

        Teacher saved = teacherRepo.save(teacher);
        return modelMapper.map(saved, TeacherDto.class);
    }

    @Override
    public TeacherDto updateTeacher(TeacherDto teacherDto, Integer id) {
        Teacher existing = teacherRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));

        // Update only fields present in DTO (null-checks) to avoid accidental overwrite
        if (teacherDto.getFirstName() != null) existing.setFirstName(teacherDto.getFirstName());
        if (teacherDto.getLastName() != null) existing.setLastName(teacherDto.getLastName());

        // If full name provided prefer it; otherwise rebuild from first+last if present
        if (teacherDto.getName() != null && !teacherDto.getName().isBlank()) {
            existing.setName(teacherDto.getName());
        } else if (teacherDto.getFirstName() != null || teacherDto.getLastName() != null) {
            String first = teacherDto.getFirstName() != null ? teacherDto.getFirstName().trim() : (existing.getFirstName() == null ? "" : existing.getFirstName().trim());
            String last = teacherDto.getLastName() != null ? teacherDto.getLastName().trim() : (existing.getLastName() == null ? "" : existing.getLastName().trim());
            existing.setName((first + " " + last).trim());
        }

        if (teacherDto.getQualification() != null) existing.setQualification(teacherDto.getQualification());
        if (teacherDto.getSubject() != null) existing.setSubject(teacherDto.getSubject());
        if (teacherDto.getAadhaarNumber() != null) existing.setAadhaarNumber(teacherDto.getAadhaarNumber());
        if (teacherDto.getJoinDate() != null) existing.setJoinDate(teacherDto.getJoinDate());
        if (teacherDto.getSalary() != null) existing.setSalary(teacherDto.getSalary());
        if (teacherDto.getAddress() != null) existing.setAddress(teacherDto.getAddress());
        if (teacherDto.getEmail() != null) existing.setEmail(teacherDto.getEmail());
        if (teacherDto.getPhone() != null) existing.setPhone(teacherDto.getPhone());
        if (teacherDto.getDob() != null) existing.setDob(teacherDto.getDob());
        if (teacherDto.getGender() != null) existing.setGender(teacherDto.getGender());
        if (teacherDto.getAssignedClass() != null) existing.setAssignedClass(teacherDto.getAssignedClass());
        if (teacherDto.getStatus() != null) existing.setStatus(teacherDto.getStatus());

        // update lastUpdated timestamp
        existing.setLastUpdated(LocalDate.now());

        Teacher updated = teacherRepo.save(existing);
        return modelMapper.map(updated, TeacherDto.class);
    }

    @Override
    public TeacherDto deleteTeacher(Integer id) {
        Teacher teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));
        teacherRepo.delete(teacher);
        return modelMapper.map(teacher, TeacherDto.class);
    }

    @Override
    public List<TeacherDto> findAllTeachers() {
        List<Teacher> teachers = teacherRepo.findAll();
        return teachers.stream()
                .map(t -> modelMapper.map(t, TeacherDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public TeacherDto findTeacherById(Integer id) {
        Teacher teacher = teacherRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));
        return modelMapper.map(teacher, TeacherDto.class);
    }

    @Override
    public List<TeacherDto> findTeacher(String name) {
        List<Teacher> teachers = teacherRepo.findByNameContainingIgnoreCase(name);
        return teachers.stream()
                .map(t -> modelMapper.map(t, TeacherDto.class))
                .collect(Collectors.toList());
    }
}
