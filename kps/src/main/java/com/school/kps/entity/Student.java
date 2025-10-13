package com.school.kps.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Integer id;
    @Column(length = 100, nullable = false, name = "first_name")
    private String firstName;
    @Column(length = 100, nullable = false, name = "last_name")
    private String lastName;
    @Column(length = 100, nullable = false, name = "class")
    private String className;
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dob;
    @Column(length = 100, nullable = false)
    private String address;
    @Column(length = 10, nullable = false, name = "phone_number")
    private String phone;
    @Column(length = 12, nullable = false, name = "aadhaar_number")
    private String aadhaarNumber;
    @Column(length = 100, nullable = false, name = "guardian_name")
    private String guardianName;
    @Column(length = 10, nullable = false, name = "guardian_phone")
    private String guardianPhone;
    @Column(length = 2, nullable = false)
    private int age;
    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Fee> fees = new ArrayList<>();


}
