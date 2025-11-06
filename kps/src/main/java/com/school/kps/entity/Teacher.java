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
    private Integer id;

    @Column(length = 100, nullable = false, name = "first_name")
    private String firstName;

    @Column(length = 100, nullable = false, name = "last_name")
    private String lastName;

    @Column(length = 200, nullable = false, name = "name") // full name e.g. Dr. Rajesh Kumar
    private String name;

    @Column(length = 50, nullable = false)
    private String gender;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(length = 100, nullable = false, name = "qualification")
    private String qualification;

    @Column(length = 100, nullable = false, name = "subject")
    private String subject;

    @Column(length = 100, nullable = false, name = "assigned_class")
    private String assignedClass;

    @Column(length = 15, nullable = false, name = "phone_number")
    private String phone;

    @Column(length = 100, nullable = false, name = "email")
    private String email;

    @Column(length = 255, nullable = false, name = "address")
    private String address;

    @Column(length = 12, nullable = false, name = "aadhaar_number")
    private String aadhaarNumber;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joinDate;

    @Column(nullable = false)
    private BigDecimal salary;

    @Column(length = 20, nullable = false)
    private String status; // Active / Inactive

    @Column(name = "last_updated")
    private LocalDate lastUpdated;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Salary> salaries;
}
