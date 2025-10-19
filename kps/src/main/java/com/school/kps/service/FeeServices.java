package com.school.kps.service;

import com.school.kps.entity.Fee;
import com.school.kps.payload.*;

import java.util.List;

public interface FeeServices {

    FeeDto addFee(FeeDto feeDto, Integer studentId);

    FeeDto updateFee(Integer id, FeeDto feeDto);

    FeeDto deleteFee(Integer id);

    List<FeeDto> getAllFees();

    FeeDto getFeeById(Integer id);

    List<FeeDto> getFeesByStudentId(Integer id);

    List<FeeDto> getFeesByStatus(String status);

    List<FeeDto> getFeesByAcademicYear(String academicYear);

    List<FeeDto> getFeesByStudentClassName(String className);

    List<FeeDto> findFeesByStudentName(String name);

    List<FeeDto> findFeesByClassNameAndStatus(String className, String status);

    FeeSummaryDto getFeeSummary();

    List<MonthlyFeeDto> getMonthlyFeeTrend();

    List<PaymentModeDto> getPaymentModeDistribution();

    List<ClassWiseFeeDto> getClassWiseCollection();

}
