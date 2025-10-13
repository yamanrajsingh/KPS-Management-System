package com.school.kps.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "fees")
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fee_id")
    private long id;

    @Column(length = 20, nullable = false)
    private String academicYear;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amountPaid;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal dueAmount;

    @Column
    private LocalDate paymentDate;

    @Column(length = 20)
    private String paymentMode;  // Cash, UPI, Cheque, etc.

    @Column(length = 50, unique = true)
    private String receiptNumber;

    @Column(length = 20)
    private String status;  // Paid, Pending, Partially Paid

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(updatable = false)
    private Date createdAt;

    @Column
    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
