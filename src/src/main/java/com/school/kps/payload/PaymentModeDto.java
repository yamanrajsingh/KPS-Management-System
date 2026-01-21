package com.school.kps.payload;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentModeDto {
    private String name; // Cash, UPI, Cheque, etc.
    private int value; // percentage

}
