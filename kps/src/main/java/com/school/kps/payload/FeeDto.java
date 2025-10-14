package com.school.kps.payload;

import com.school.kps.entity.Student;
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
public class FeeDto {

    private Integer id;

    @NotNull(message = "Student ID is required")
    private Integer studentId;

    @NotBlank(message = "Academic year is mandatory")
    @Size(max = 20, message = "Academic year must be at most 20 characters")
    private String academicYear;

    @NotNull(message = "Total amount is mandatory")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;

    @NotNull(message = "Amount paid is mandatory")
    @DecimalMin(value = "0.0", inclusive = true, message = "Amount paid cannot be negative")
    private BigDecimal amountPaid;

    @NotNull(message = "Due amount is mandatory")
    @DecimalMin(value = "0.0", inclusive = true, message = "Due amount cannot be negative")
    private BigDecimal dueAmount;

    private LocalDate paymentDate;

    @Size(max = 20, message = "Payment mode must be at most 20 characters")
    private String paymentMode;  // Cash, UPI, Cheque, etc.

    @Size(max = 50, message = "Receipt number must be at most 50 characters")
    private String receiptNumber;

    @Size(max = 20, message = "Status must be at most 20 characters")
    private String status;  // Paid, Pending, Partially Paid

    private String remarks;



}