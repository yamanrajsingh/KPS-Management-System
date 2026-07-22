package com.school.kps.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity // for defining that this class directly map with database table
@Getter // for getter method in the class
@Setter // for setter method in the class
@NoArgsConstructor // constructor without arguments
@Table(name = "students") // this annotation is used for name of the table in database ( want to change the table name by default is class name )
public class Student {
    @Id // this used for the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // automatically generate the unique value
    @Column(name = "student_id")  // specify the column in the table and name of the column
    private Integer id;

    @Column(length = 100, nullable = false, name = "first_name")
    private String firstName;
    @Column(length = 100, nullable = false, name = "last_name")
    private String lastName;
    @Column(length = 100, nullable = false, name = "class")
    private String className;
    @Column(length = 100, nullable = false, name = "gender")
    private String gender;
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
