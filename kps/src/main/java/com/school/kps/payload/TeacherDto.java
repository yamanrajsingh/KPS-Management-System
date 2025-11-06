package com.school.kps.payload;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDto {

    private Integer id;

    // 🧍 Basic Info
    @Size(max = 100, message = "First name must be at most 100 characters")
    private String firstName;

    @Size(max = 100, message = "Last name must be at most 100 characters")
    private String lastName;

    @NotBlank(message = "Full name is mandatory")
    @Size(max = 150, message = "Name must be at most 150 characters")
    private String name; // e.g. "Dr. Rajesh Kumar"

    // 🎓 Professional Info
    @NotBlank(message = "Qualification is mandatory")
    @Size(max = 100, message = "Qualification must be at most 100 characters")
    private String qualification;

    @NotBlank(message = "Subject is mandatory")
    @Size(max = 100, message = "Subject must be at most 100 characters")
    private String subject;

    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be greater than 0")
    private BigDecimal salary;

    // 📞 Contact Info
    @NotBlank(message = "Phone number is mandatory")
    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
    private String phone;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Address is mandatory")
    @Size(max = 200, message = "Address must be at most 200 characters")
    private String address;

    @NotBlank(message = "Aadhaar number is mandatory")
    @Pattern(regexp = "\\d{12}", message = "Aadhaar number must be 12 digits")
    private String aadhaarNumber;

    // 📅 Dates & Other Info
    @NotNull(message = "Join date is mandatory")
    private LocalDate joinDate; // renamed from joiningDate to match frontend

    private LocalDate dob;

    @Size(max = 10, message = "Gender must be at most 10 characters")
    private String gender;

    @Size(max = 50, message = "Assigned class must be at most 50 characters")
    private String assignedClass;

    @Size(max = 20, message = "Status must be at most 20 characters")
    private String status = "Active";

    private LocalDate lastUpdated;
}
