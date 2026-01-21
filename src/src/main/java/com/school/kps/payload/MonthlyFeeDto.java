package com.school.kps.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyFeeDto {
    private String month;
    private BigDecimal collected;
    private BigDecimal pending;
    private BigDecimal overdue;
}
