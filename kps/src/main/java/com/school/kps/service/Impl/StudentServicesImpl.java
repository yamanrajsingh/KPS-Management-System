package com.school.kps.service.Impl;

import com.school.kps.entity.Student;
import com.school.kps.exception.ResourceNotFoundException;
import com.school.kps.payload.EnrollmentByMonth;
import com.school.kps.payload.StudentDto;
import com.school.kps.repository.StudentRepo;
import com.school.kps.service.StudentServices;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import jakarta.persistence.criteria.Predicate;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;
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
    public Page<StudentDto> findAllStudents(
            Integer page,
            Integer size,
            String sortBy,
            String sortDir,
            String search,
            String className,
            String gender,
            String location) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Student> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 🔍 Search across multiple fields
            if (search != null && !search.isEmpty()) {
                String likeSearch = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("firstName")), likeSearch),
                        cb.like(cb.lower(root.get("lastName")), likeSearch),
                        cb.like(cb.lower(root.get("guardianName")), likeSearch),
                        cb.like(cb.lower(root.get("guardianPhone")), likeSearch)
                ));
            }

            // 🎓 Filter by class
            if (className != null && !className.isEmpty()) {
                predicates.add(cb.equal(root.get("className"), className));
            }

            // 🚻 Filter by gender
            if (gender != null && !gender.isEmpty()) {
                predicates.add(cb.equal(root.get("gender"), gender));
            }

            // 📍 Filter by address/location (case-insensitive, partial)
            if (location != null && !location.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("address")), "%" + location.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Student> studentPage = studentRepo.findAll(spec, pageable);
        return studentPage.map(student -> modelMapper.map(student, StudentDto.class));
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
    public Map<String, Long> getStudentStats() {
        long total = this.studentRepo.countTotalStudents();
        long male = this.studentRepo.countMaleStudents();
        long female =this.studentRepo.countFemaleStudents();

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalStudents", total);
        stats.put("maleStudents", male);
        stats.put("femaleStudents", female);

        return stats;
    }

    @Override
    public long getStudentCountByClassName(String className) {
        return this.studentRepo.countStudentsByClassName(className);
    }

//    @Override
//    public Page<StudentDto> searchStudents(String name, String className) {
//        // If both parameters are null or empty, return all students
//        if ((name == null || name.isEmpty()) && (className == null || className.isEmpty())) {
//            Integer page =0;
//            Integer size =10;
//            String sortBy = "id";
//            String sortDir = "asc";
//            return findAllStudents(page, size, sortBy, sortDir);
//        }

//        // If only name is provided
//        if (name != null && !name.isEmpty() && (className == null || className.isEmpty())) {
//            return this.studentRepo.findByFirstNameContainingIgnoreCase(name)
//                    .stream().map(student -> this.modelMapper.map(student, StudentDto.class)).toList();
//        }
//
//        // If only className is provided
//        if ((name == null || name.isEmpty()) && className != null && !className.isEmpty()) {
//            return this.studentRepo.findByClassNameContainingIgnoreCase(className)
//                    .stream().map(student -> this.modelMapper.map(student, StudentDto.class)).toList();
//        }
//
//        // If both name and className are provided
//        return this.studentRepo.findByFirstNameContainingIgnoreCaseAndClassNameContainingIgnoreCase(name, className)
//                .stream().map(student -> this.modelMapper.map(student, StudentDto.class)).toList();
//    }


    @Override
    public List<EnrollmentByMonth> getEnrollmentByMonth(Integer year) {
        List<Object[]> rows = this.studentRepo.countStudentsGroupedByMonth(year);

        // Map monthNumber -> count
        Map<Integer, Long> counts = new HashMap<>();
        for (Object[] row : rows) {
            // nativeQuery returns numeric types; cast carefully
            Integer monthNumber = ((Number) row[0]).intValue(); // 1..12
            Long cnt = ((Number) row[1]).longValue();
            counts.put(monthNumber, cnt);
        }

        List<EnrollmentByMonth> result = new ArrayList<>(12);
        for (int m = 1; m <= 12; m++) {
            // Short English month name like "Jan", "Feb"
            String shortName = Month.of(m).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            long c = counts.getOrDefault(m, 0L);
            result.add(new EnrollmentByMonth(shortName, c));
        }
        return result;
    }
    @Override
    public Map<String, Long> getClassWiseStudentCount() {
        return this.studentRepo.findAll().stream()
                .collect(Collectors.groupingBy(Student::getClassName, Collectors.counting()));
    }


}
