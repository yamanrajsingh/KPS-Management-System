package com.school.kps.service.Impl;

import com.school.kps.entity.Student;
import com.school.kps.exception.ResourceNotFoundException;
import com.school.kps.payload.StudentDto;
import com.school.kps.repository.StudentRepo;
import com.school.kps.service.StudentServices;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServicesImpl implements StudentServices {

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public StudentDto createStudent(StudentDto studentDto) {
        Student newStudent = this.modelMapper.map(studentDto, Student.class);

        LocalDate currdate = LocalDate.now();
        System.out.println("Current date: " + currdate);
        newStudent.setAdmissionDate( LocalDate.now());
        LocalDate birthDate = studentDto.getDob();
        int age = Period.between(birthDate, currdate).getYears();
         newStudent.setAge(age);
        Student savedStudent = this.studentRepo.save(newStudent);
        return this.modelMapper.map(savedStudent, StudentDto.class);
    }

    @Override
    public StudentDto updateStudent(StudentDto studentDto, Integer id) {
        Student student = this.studentRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student", "Student_Id", id));
        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setClassName(studentDto.getClassName());
        student.setDob(studentDto.getDob());
        student.setAddress(studentDto.getAddress());
        student.setPhone(studentDto.getPhone());
        student.setAadhaarNumber(studentDto.getAadhaarNumber());
        student.setGuardianName(studentDto.getGuardianName());
        student.setGuardianPhone(studentDto.getGuardianPhone());
        student.setAdmissionDate(LocalDate.now());
        Student updateStudent = this.studentRepo.save(student);
        return this.modelMapper.map(updateStudent, StudentDto.class);

    }

    @Override
    public StudentDto deleteStudent(Integer id) {
        Student student = this.studentRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student", "Student_Id", id));
        this.studentRepo.deleteById(id);
        return this.modelMapper.map(student, StudentDto.class);
    }

    @Override
    public StudentDto findStudentById(Integer id) {
        Student student = this.studentRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Student", "Student_Id", id));
        return this.modelMapper.map(student, StudentDto.class);
    }

    @Override
    public List<StudentDto> findAllStudents() {
        List<Student> students = this.studentRepo.findAll();
        List<StudentDto> studentDtos = students.stream().map(student -> this.modelMapper.map(student, StudentDto.class)).collect(Collectors.toList());
        return studentDtos;
    }

    @Override
    public List<StudentDto> getStudentsByName(String firstName) {
        List<Student> students = this.studentRepo.findByFirstNameIgnoreCase(firstName);
        List<StudentDto> studentDtos = students.stream().map(student -> this.modelMapper.map(student, StudentDto.class)).collect(Collectors.toList());
        return studentDtos;
    }

    @Override
    public List<StudentDto> getStudentsByClassName(String className) {
        List<Student> students = this.studentRepo.findByClassNameContainingIgnoreCase(className);
        List<StudentDto> studentDtos = students.stream().map(student -> this.modelMapper.map(student, StudentDto.class)).collect(Collectors.toList());
        return studentDtos;
    }

    @Override
    public List<StudentDto> searchStudents(String name, String className) {
        // If both parameters are null or empty, return all students
        if ((name == null || name.isEmpty()) && (className == null || className.isEmpty())) {
            return findAllStudents();
        }

        // If only name is provided
        if (name != null && !name.isEmpty() && (className == null || className.isEmpty())) {
            return this.studentRepo.findByFirstNameContainingIgnoreCase(name)
                    .stream().map(student -> this.modelMapper.map(student, StudentDto.class)).toList();
        }

        // If only className is provided
        if ((name == null || name.isEmpty()) && className != null && !className.isEmpty()) {
            return this.studentRepo.findByClassNameContainingIgnoreCase(className)
                    .stream().map(student -> this.modelMapper.map(student, StudentDto.class)).toList();
        }

        // If both name and className are provided
        return this.studentRepo.findByFirstNameContainingIgnoreCaseAndClassNameContainingIgnoreCase(name, className)
                .stream().map(student -> this.modelMapper.map(student, StudentDto.class)).toList();
    }


}
