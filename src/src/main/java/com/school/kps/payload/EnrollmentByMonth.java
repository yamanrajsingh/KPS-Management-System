package com.school.kps.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentByMonth {
    private String month;   // "Jan", "Feb", ...
    private long students;  // count
}