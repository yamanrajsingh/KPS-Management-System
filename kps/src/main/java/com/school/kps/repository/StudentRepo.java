package com.school.kps.repository;

import com.school.kps.entity.Student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepo  extends JpaRepository<Student,Integer>, JpaSpecificationExecutor<Student> {
    List<Student> findByFirstNameIgnoreCase(String firstName);
    List<Student> findByClassNameContainingIgnoreCase(String className);
    List<Student> findByFirstNameContainingIgnoreCase(String firstName);
    List<Student> findByFirstNameContainingIgnoreCaseAndClassNameContainingIgnoreCase(String firstName, String className);
    // Total number of students
    @Query("SELECT COUNT(s) FROM Student s")
    long countTotalStudents();

    // Count male students
    @Query("SELECT COUNT(s) FROM Student s WHERE LOWER(s.gender) = 'male'")
    long countMaleStudents();

    // Count female students
    @Query("SELECT COUNT(s) FROM Student s WHERE LOWER(s.gender) = 'female'")
    long countFemaleStudents();

    @Query("SELECT COUNT(s) FROM Student s WHERE LOWER(s.className) = LOWER(:className)")
    long countStudentsByClassName(String className);

}
