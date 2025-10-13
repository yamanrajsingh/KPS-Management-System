package com.school.kps.payload;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class StudentDto {

    private Integer id;

    @NotBlank(message = "First name is mandatory")
    @Size(min = 3, max = 100, message = "First name must be at most 100 characters")
    private String firstName;

    @NotBlank(message = "Last name is mandatory")
    @Size(min= 3, max = 100, message = "Last name must be at most 100 characters")
    private String lastName;

    @NotBlank(message = "Class is mandatory")
    @Size(max = 100, message = "Class name must be at most 100 characters")
    private String className;

    @NotNull(message = "Date of birth is mandatory")
    private LocalDate dob;

    @Size(min =1,max = 2, message = "Age must be 2 digit")
    private int age;

    @NotBlank(message = "Address is mandatory")
    @Size(min =10,max = 100, message = "Address must be at most 100 characters")
    private String address;

    @NotBlank(message = "Phone number is mandatory")
    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
    private String phone;

    @NotBlank(message = "Aadhaar number is mandatory")
    @Pattern(regexp = "\\d{12}", message = "Aadhaar number must be 12 digits")
    private String aadhaarNumber;

    @NotBlank(message = "Guardian name is mandatory")
    @Size(min= 3, max = 100, message = "Guardian name must be at most 100 characters")
    private String guardianName;

    @NotBlank(message = "Guardian phone is mandatory")
    @Pattern(regexp = "\\d{10}", message = "Guardian phone must be 10 digits")
    private String guardianPhone;


    private LocalDate admissionDate;


}