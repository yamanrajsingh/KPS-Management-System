package com.school.kps.repository;

import com.school.kps.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Repository
public interface SalaryRepo extends JpaRepository<Salary,Integer> {
    // Optional: Find salary by teacher name
    @Query("SELECT s FROM Salary s WHERE LOWER(s.teacher.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Salary> findByTeacherName(String name);

    List<Salary> findByStatus(String status);
}
