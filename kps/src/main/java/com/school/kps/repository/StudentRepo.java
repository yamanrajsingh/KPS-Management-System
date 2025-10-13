package com.school.kps.repository;

import com.school.kps.entity.Student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepo  extends JpaRepository<Student,Integer> {
    List<Student> findByFirstNameIgnoreCase(String firstName);
    List<Student> findByClassNameContainingIgnoreCase(String className);
    List<Student> findByFirstNameContainingIgnoreCase(String firstName);
    List<Student> findByFirstNameContainingIgnoreCaseAndClassNameContainingIgnoreCase(String firstName, String className);

}
