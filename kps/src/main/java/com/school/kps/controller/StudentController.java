package com.school.kps.controller;

import com.school.kps.payload.StudentDto;
import com.school.kps.service.StudentServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin("*")
public class StudentController {

    @Autowired
    private StudentServices studentServices;

    @PostMapping("/create")
    public ResponseEntity<StudentDto> createStudent(@RequestBody StudentDto studentDto) {
        StudentDto student = this.studentServices.createStudent(studentDto);
        return new ResponseEntity<>(student, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateStudent(@RequestBody StudentDto studentDto, @PathVariable Integer id) {
        StudentDto student = this.studentServices.updateStudent(studentDto, id);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StudentDto> deleteStudent(@PathVariable Integer id) {
        StudentDto student = this.studentServices.deleteStudent(id);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudent(@PathVariable Integer id) {
        StudentDto student = this.studentServices.findStudentById(id);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        List<StudentDto> student = this.studentServices.findAllStudents();
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    @GetMapping("/search/name/{name}")
    public ResponseEntity<List<StudentDto>> getStudentByName(@PathVariable String name) {
        List<StudentDto> student = this.studentServices.getStudentsByName(name);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    @GetMapping("/search/class/{className}")
    public ResponseEntity<List<StudentDto>> getStudentsByClassName(@PathVariable String className) {
        List<StudentDto> student = this.studentServices.getStudentsByClassName(className);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    @GetMapping("/search/{name}/{className}")
    public ResponseEntity<List<StudentDto>> getStudentsByName(@PathVariable String name, @PathVariable String className) {
        List<StudentDto> student = this.studentServices.searchStudents(name, className);
        return new ResponseEntity<>(student, HttpStatus.OK);
    }

    @GetMapping("/stats")
    public Map<String, Long> getStudentStats() {
        return this.studentServices.getStudentStats();
    }

    @GetMapping("/count/{className}")
    public Long getStudentCountByClassName(@PathVariable String className) {
        return this.studentServices.getStudentCountByClassName(className);
    }

    @GetMapping("/class-distribution")
    public Map<String, Long> getClassDistribution() {
        return this.studentServices.getClassWiseStudentCount();
    }

}
