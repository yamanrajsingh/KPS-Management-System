package com.school.kps.repository;

import com.school.kps.entity.Fee;
import com.school.kps.entity.Student;
import com.school.kps.payload.FeeDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRepo extends JpaRepository<Fee, Integer> {
    List<Fee> findByStudent(Student student);

    List<Fee> findByStatus(String status);


    @Query("SELECT f FROM Fee f WHERE  f.student.className = :className")
    List<Fee> findByStudentClassName(String className);

    // Find fees by student name (first name or last name)
    @Query("SELECT f FROM Fee f WHERE LOWER(f.student.firstName) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "OR LOWER(f.student.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Fee> findByStudentName(String name);

    List<Fee> findByAcademicYear(String academicYear);

    List<Fee> findByStudentAndAcademicYear(Student student, String academicYear);

    @Query("SELECT f FROM Fee f WHERE " +
            "(:className IS NULL OR f.student.className = :className) AND " +
            "(:status IS NULL OR f.status = :status)")
    List<Fee> findFeesByFilters(@Param("className") String className,

                                @Param("status") String status);


}
