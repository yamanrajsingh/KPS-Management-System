package com.school.kps.controller;

import com.school.kps.payload.TeacherDto;
import com.school.kps.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin("*")
public class TeacherController {
    @Autowired
    private TeacherService teacherService;

    @PostMapping("/create")
    public ResponseEntity<TeacherDto> addTeacher(@RequestBody TeacherDto teacherDto) {
        TeacherDto teacher = this.teacherService.createTeacher(teacherDto);
        return new ResponseEntity<>(teacher, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherDto> updateTeacher(@RequestBody TeacherDto teacherDto, @PathVariable Integer id) {
        TeacherDto teacher = this.teacherService.updateTeacher(teacherDto, id);
        return new ResponseEntity<>(teacher, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TeacherDto> deleteTeacher(@PathVariable Integer id) {
        TeacherDto teacher = this.teacherService.deleteTeacher(id);
        return new ResponseEntity<>(teacher, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<TeacherDto>> findAllTeachers() {
        List<TeacherDto> teachers = this.teacherService.findAllTeachers();
        return new ResponseEntity<>(teachers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDto> findTeacherById(@PathVariable Integer id) {
        TeacherDto teacher = this.teacherService.findTeacherById(id);
        return new ResponseEntity<>(teacher, HttpStatus.OK);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<TeacherDto>> findTeacherByName(@PathVariable String name) {
        List<TeacherDto> teacherDtos = this.teacherService.findTeacher(name);
        return new ResponseEntity<>(teacherDtos, HttpStatus.OK);

    }

}
