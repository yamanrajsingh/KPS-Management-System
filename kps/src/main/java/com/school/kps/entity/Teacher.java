package com.school.kps.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "teachers")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teacher_id")
    private Long id;
    @Column(length = 100, nullable = false, name = "name")
    private String name;
    @Column(length = 100, nullable = false)
    private String qualification;
    @Column(length = 100, nullable = false)
    private String subject;
    @Column(length = 10, nullable = false, name = "phone_number")
    private String phone;
    @Column(length = 100, nullable = false)
    private String email;
    @Column(length = 100, nullable = false)
    private String address;
    @Column(length = 12, nullable = false, name = "aadhaar_number")
    private String aadhaarNumber;
    @Column(length = 100, nullable = false, name = "joining_date")
    private LocalDate joiningDate;
    @Column(length = 100, nullable = false)
    private BigDecimal salary;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Salary> salaries;
}

