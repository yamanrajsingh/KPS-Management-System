package com.school.kps.service.Impl;

import com.school.kps.entity.Fee;
import com.school.kps.entity.Student;
import com.school.kps.exception.ResourceNotFoundException;
import com.school.kps.payload.*;
import com.school.kps.repository.FeeRepo;
import com.school.kps.repository.StudentRepo;
import com.school.kps.service.FeeServices;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FeeServicesImpl implements FeeServices {

    @Autowired
    private FeeRepo feeRepo;

    @Autowired
    private StudentRepo studentRepo;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public FeeDto addFee(FeeDto feeDto, Integer studentId) {
        // Manual mapping instead of ModelMapper for FeeDto -> Fee
        Fee fee = new Fee();
        fee.setTotalAmount(feeDto.getTotalAmount());
        fee.setAmountPaid(feeDto.getAmountPaid() != null ? feeDto.getAmountPaid() : BigDecimal.ZERO);
        fee.setPaymentMode(feeDto.getPaymentMode());
        fee.setPaymentDate(feeDto.getPaymentDate());
        fee.setRemarks(feeDto.getRemarks());
        fee.setAcademicYear(feeDto.getAcademicYear());

        // Find student
        Student student = this.studentRepo.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        fee.setStudent(student);

        // Calculate due amount
        BigDecimal dueAmount = fee.getTotalAmount().subtract(fee.getAmountPaid());
        if (dueAmount.compareTo(BigDecimal.ZERO) < 0) {
            dueAmount = BigDecimal.ZERO; // avoid negative
        }
        fee.setDueAmount(dueAmount);

        // Auto-set status
        if (fee.getAmountPaid().compareTo(fee.getTotalAmount()) >= 0) {
            fee.setStatus("Paid");
        } else if (fee.getAmountPaid().compareTo(BigDecimal.ZERO) == 0) {
            fee.setStatus("Pending");
        } else {
            fee.setStatus("Partially Paid");
        }

        // Generate unique receipt number
        fee.setReceiptNumber(generateReceiptNumber());

        // Save fee
        Fee savedFee = this.feeRepo.save(fee);

        // Map back to DTO (you can still use ModelMapper here safely)
        FeeDto savedDto = new FeeDto();
        savedDto.setId(savedFee.getId());
        savedDto.setTotalAmount(savedFee.getTotalAmount());
        savedDto.setAmountPaid(savedFee.getAmountPaid());
        savedDto.setDueAmount(savedFee.getDueAmount());
        savedDto.setPaymentMode(savedFee.getPaymentMode());
        savedDto.setPaymentDate(savedFee.getPaymentDate());
        savedDto.setStatus(savedFee.getStatus());
        savedDto.setReceiptNumber(savedFee.getReceiptNumber());
        savedDto.setRemarks(savedFee.getRemarks());
        savedDto.setAcademicYear(savedFee.getAcademicYear());

        // Include student info in DTO if needed
        savedDto.setStudentId(savedFee.getStudent().getId());


        return savedDto;
    }

    // Utility to generate receipt number
    private String generateReceiptNumber() {
        String datePart = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.BASIC_ISO_DATE);
        int randomPart = (int) (Math.random() * 900 + 100);
        return "RCP" + datePart + randomPart;
    }


    @Override
    public FeeDto updateFee(FeeDto feeDto, Integer id) {
        Fee fee = this.feeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("fee", "id", id));
//        if (feeDto.getStudentId() != null) {
//            Student student = this.studentRepo.findById(feeDto.getStudentId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Student", "id", feeDto.getStudentId()));
//            fee.setStudent(student);
//        }
        fee.setAcademicYear(feeDto.getAcademicYear());
        fee.setTotalAmount(feeDto.getTotalAmount());
        fee.setAmountPaid(feeDto.getAmountPaid());
        fee.setDueAmount(feeDto.getTotalAmount().subtract(feeDto.getAmountPaid()));
        fee.setPaymentDate(feeDto.getPaymentDate());
        fee.setPaymentMode(feeDto.getPaymentMode());
        fee.setRemarks(feeDto.getRemarks());


        // Auto status update
        if (fee.getAmountPaid().compareTo(fee.getTotalAmount()) >= 0)
            fee.setStatus("Paid");
        else if (fee.getAmountPaid().compareTo(BigDecimal.ZERO) == 0)
            fee.setStatus("Pending");
        else
            fee.setStatus("Partially Paid");

        Fee updatedFee = this.feeRepo.save(fee);
        return this.modelMapper.map(updatedFee, FeeDto.class);

    }

    @Override
    public FeeDto deleteFee(Integer id) {
        Fee fee = this.feeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("fee", "id", id));
        this.feeRepo.delete(fee);
        return this.modelMapper.map(fee, FeeDto.class);
    }

    public Page<FeeDto> getAllFees(
            int pageNumber, int pageSize, String sortBy, String sortDir,
            String className, String paymentStatus, String paymentMode,
            String dateFrom, String dateTo, String search
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Specification<Fee> spec = (Specification<Fee>) (root, query, cb) -> cb.conjunction();


        if (className != null && !className.isEmpty())
            spec = spec.and((root, query, cb) -> cb.equal(root.get("student").get("className"), className));

        if (paymentStatus != null && !paymentStatus.isEmpty())
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), paymentStatus));

        if (paymentMode != null && !paymentMode.isEmpty())
            spec = spec.and((root, query, cb) -> cb.equal(root.get("paymentMode"), paymentMode));

        if (dateFrom != null && !dateFrom.isEmpty())
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("paymentDate"), dateFrom));

        if (dateTo != null && !dateTo.isEmpty())
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("paymentDate"), dateTo));

        if (search != null && !search.isEmpty())
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("student").get("firstName")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("student").get("lastName")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("receiptNumber")), "%" + search.toLowerCase() + "%")
            ));

        Page<Fee> feePage = feeRepo.findAll(spec, pageable);
        List<FeeDto> feeDtos = feePage.getContent()
                .stream()
                .map(f -> modelMapper.map(f, FeeDto.class))
                .toList();

        return new PageImpl<>(feeDtos, pageable, feePage.getTotalElements());
    }


    @Override
    public FeeDto getFeeById(Integer id) {
        Fee fee = this.feeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("fee", "id", id));
        return this.modelMapper.map(fee, FeeDto.class);
    }

    @Override
    public List<FeeDto> getFeesByStudentId(Integer id) {
        Student student = this.studentRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("student", "id", id));
        List<Fee> fees = this.feeRepo.findByStudent(student);
        return fees.stream().map(fee -> this.modelMapper.map(fee, FeeDto.class)).collect(Collectors.toList());
    }


    @Override
    public List<FeeDto> getFeesByStatus(String status) {
        List<Fee> fees = this.feeRepo.findByStatus(status);
        return fees.stream().map(fee -> this.modelMapper.map(fee, FeeDto.class)).collect(Collectors.toList());
    }

    @Override
    public List<FeeDto> getFeesByAcademicYear(String academicYear) {
        List<Fee> fees = this.feeRepo.findByAcademicYear(academicYear);
        return fees.stream().map(fee -> this.modelMapper.map(fee, FeeDto.class)).collect(Collectors.toList());

    }

    @Override
    public List<FeeDto> getFeesByStudentClassName(String className) {
        List<Fee> fees = this.feeRepo.findByStudentClassName(className);
        return fees.stream().map(fee -> this.modelMapper.map(fee, FeeDto.class)).collect(Collectors.toList());
    }

    @Override
    public List<FeeDto> findFeesByStudentName(String name) {
        List<Fee> fees = this.feeRepo.findByStudentName(name);
        return fees.stream().map(fee -> this.modelMapper.map(fee, FeeDto.class)).collect(Collectors.toList());
    }

    @Override
    public List<FeeDto> findFeesByClassNameAndStatus(String className, String status) {
        List<Fee> fees = this.feeRepo.findFeesByFilters(className, status);
        return fees.stream().map(fee -> this.modelMapper.map(fee, FeeDto.class)).collect(Collectors.toList());

    }

    @Override
    public FeeSummaryDto getFeeSummary() {
        List<Fee> fees = this.feeRepo.findAll();

        BigDecimal totalCollected = fees.stream()
                .filter(f -> "Paid".equalsIgnoreCase(f.getStatus()))
                .map(Fee::getAmountPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPending = fees.stream()
                .filter(f -> "Pending".equalsIgnoreCase(f.getStatus()))
                .map(Fee::getDueAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalOverdue = fees.stream()
                .filter(f -> "Partially Paid".equalsIgnoreCase(f.getStatus()))
                .map(Fee::getDueAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalTransactions = fees.size();

        int collectionRate = (totalCollected.add(totalPending).add(totalOverdue).compareTo(BigDecimal.ZERO) > 0) ?
                totalCollected.multiply(BigDecimal.valueOf(100))
                        .divide(totalCollected.add(totalPending).add(totalOverdue), BigDecimal.ROUND_HALF_UP)
                        .intValue() : 0;

        return new FeeSummaryDto(totalCollected, totalPending, totalOverdue, totalTransactions, collectionRate);
    }

    @Override
    public List<MonthlyFeeDto> getMonthlyFeeTrend() {
        List<Fee> fees = this.feeRepo.findAll();

        Map<Month, MonthlyFeeDto> monthMap = new LinkedHashMap<>();
        for (Month month : Month.values()) {
            monthMap.put(month, new MonthlyFeeDto(
                    month.getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO
            ));
        }

        for (Fee f : fees) {
            if (f.getPaymentDate() == null) continue;
            Month m = f.getPaymentDate().getMonth();
            MonthlyFeeDto dto = monthMap.get(m);
            switch (f.getStatus().toLowerCase()) {
                case "paid":
                    dto.setCollected(dto.getCollected().add(f.getAmountPaid()));
                    break;
                case "pending":
                    dto.setPending(dto.getPending().add(f.getDueAmount()));
                    break;
                case "partially paid":
                    dto.setOverdue(dto.getOverdue().add(f.getDueAmount()));
                    break;
            }
        }

        return new ArrayList<>(monthMap.values());
    }

    @Override
    public List<ClassWiseFeeDto> getClassWiseCollection() {
        List<Fee> fees = this.feeRepo.findAll();

        Map<String, BigDecimal> classMap = new HashMap<>();
        for (Fee f : fees) {
            if (!"Paid".equalsIgnoreCase(f.getStatus())) continue;
            String className = f.getStudent().getClassName(); // adjust if different
            classMap.put(className, classMap.getOrDefault(className, BigDecimal.ZERO).add(f.getAmountPaid()));
        }

        return classMap.entrySet().stream()
                .map(e -> new ClassWiseFeeDto(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    @Override
    // 4️⃣ Payment Mode Distribution
    public List<PaymentModeDto> getPaymentModeDistribution() {
        List<Fee> fees = this.feeRepo.findAll();
        int total = fees.size();

        Map<String, Long> modeCount = fees.stream()
                .collect(Collectors.groupingBy(Fee::getPaymentMode, Collectors.counting()));

        return modeCount.entrySet().stream()
                .map(e -> new PaymentModeDto(e.getKey(), (int) ((e.getValue() * 100) / total)))
                .collect(Collectors.toList());
    }


}
