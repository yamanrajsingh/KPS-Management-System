package com.school.kps.repository;

import com.school.kps.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherRepo extends JpaRepository<Teacher, Integer> {
    List<Teacher> findByNameContainingIgnoreCase(String name);
}
