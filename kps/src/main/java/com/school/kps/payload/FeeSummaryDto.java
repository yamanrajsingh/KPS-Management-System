package com.school.kps.payload;

import lombok.*;

import java.math.BigDecimal;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FeeSummaryDto {
    private BigDecimal totalCollected;
    private BigDecimal totalPending;
    private BigDecimal totalOverdue;
    private int totalTransactions;
    private int collectionRate; // percentage
}
