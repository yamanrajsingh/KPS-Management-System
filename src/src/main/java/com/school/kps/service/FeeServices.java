package com.school.kps.service;

import com.school.kps.entity.Fee;
import com.school.kps.payload.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface FeeServices {

    FeeDto addFee(FeeDto feeDto, Integer studentId);

    FeeDto updateFee(FeeDto feeDto, Integer id);

    FeeDto deleteFee(Integer id);

    Page<FeeDto> getAllFees(int pageNumber, int pageSize, String sortBy, String sortDir,
                            String className, String paymentStatus, String paymentMode,
                            String dateFrom, String dateTo, String search);

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
