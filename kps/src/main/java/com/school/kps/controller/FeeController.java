package com.school.kps.controller;

import com.school.kps.payload.*;
import com.school.kps.service.FeeServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students/fee")
@CrossOrigin("*")
public class FeeController {

    @Autowired
    private FeeServices feeServices;

    @PostMapping("/create/{studentId}")
    public ResponseEntity<FeeDto> addFee(@RequestBody FeeDto feeDto, @PathVariable Integer studentId) {
        FeeDto fee = this.feeServices.addFee(feeDto, studentId);
        return new ResponseEntity<>(fee, HttpStatus.OK);
    }

    @PutMapping("/{feeId}") //*********** Think and Do
    public ResponseEntity<FeeDto> updateFee(@RequestBody FeeDto feeDto, @PathVariable Integer feeId) {
        FeeDto fee = this.feeServices.updateFee(feeId, feeDto);
        return new ResponseEntity<>(fee, HttpStatus.OK);
    }

    @DeleteMapping("/{feeId}")
    public ResponseEntity<FeeDto> deleteFee(@PathVariable Integer feeId) {
        FeeDto fee = this.feeServices.deleteFee(feeId);
        return new ResponseEntity<>(fee, HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<FeeDto>> getAllFees() {
        List<FeeDto> fee = this.feeServices.getAllFees();
        return new ResponseEntity<>(fee, HttpStatus.OK);
    }

    @GetMapping("/fId/{feeId}")
    public ResponseEntity<FeeDto> getFee(@PathVariable Integer feeId) {
        FeeDto fee = this.feeServices.getFeeById(feeId);
        return new ResponseEntity<>(fee, HttpStatus.OK);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FeeDto>> getAllFeesByStatus(@PathVariable String status) {
        List<FeeDto> feeDtos = this.feeServices.getFeesByStatus(status);
        return new ResponseEntity<>(feeDtos, HttpStatus.OK);
    }

    @GetMapping("/sId/{studentId}")
    public ResponseEntity<List<FeeDto>> getAllFeesByStudentId(@PathVariable Integer studentId) {
        List<FeeDto> feeDtos = this.feeServices.getFeesByStudentId(studentId);
        return new ResponseEntity<>(feeDtos, HttpStatus.OK);
    }

    @GetMapping("/academicYear/{academicYear}")
    public ResponseEntity<List<FeeDto>> getFeesByAcademicYear(@PathVariable String academicYear) {
        List<FeeDto> feeDtos = this.feeServices.getFeesByAcademicYear(academicYear);
        return new ResponseEntity<>(feeDtos, HttpStatus.OK);
    }


    @GetMapping("/className/{className}")
    public ResponseEntity<List<FeeDto>> getFeesByStudentClassName(@PathVariable String className) {
        List<FeeDto> feeDtos = this.feeServices.getFeesByStudentClassName(className);
        return new ResponseEntity<>(feeDtos, HttpStatus.OK);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<FeeDto>> findFeesByStudentName(@PathVariable String name) {
        List<FeeDto> feeDtos = this.feeServices.findFeesByStudentName(name);
        return new ResponseEntity<>(feeDtos, HttpStatus.OK);
    }

    @GetMapping("/className/{className}/status/{status}")
    public ResponseEntity<List<FeeDto>>  findFeesByClassNameAndStatus(@PathVariable String className, @PathVariable String status ){
        List<FeeDto> feeDtos = this.feeServices.findFeesByClassNameAndStatus(className, status);
        return new ResponseEntity<>(feeDtos, HttpStatus.OK);
    }
    // 1️⃣ Fee Summary
    @GetMapping("/summary")
    public ResponseEntity<FeeSummaryDto> getFeeSummary() {
        return ResponseEntity.ok(this.feeServices.getFeeSummary());
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyFeeDto>> getMonthlyFeeTrend() {
        return ResponseEntity.ok(this.feeServices.getMonthlyFeeTrend());
    }

    // 3️⃣ Class-wise Collection
    @GetMapping("/classwise")
    public ResponseEntity<List<ClassWiseFeeDto>> getClassWiseCollection() {
        return ResponseEntity.ok(this.feeServices.getClassWiseCollection());
    }

    // 4️⃣ Payment Mode Distribution
    @GetMapping("/payment-modes")
    public ResponseEntity<List<PaymentModeDto>> getPaymentModeDistribution() {
        return ResponseEntity.ok(this.feeServices.getPaymentModeDistribution());
    }


}
