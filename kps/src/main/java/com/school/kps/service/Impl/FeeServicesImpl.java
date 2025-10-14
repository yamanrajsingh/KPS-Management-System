package com.school.kps.service.Impl;

import com.school.kps.entity.Fee;
import com.school.kps.entity.Student;
import com.school.kps.exception.ResourceNotFoundException;
import com.school.kps.payload.FeeDto;
import com.school.kps.repository.FeeRepo;
import com.school.kps.repository.StudentRepo;
import com.school.kps.service.FeeServices;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

import java.util.List;
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
        Fee fee = this.modelMapper.map(feeDto, Fee.class);
        Student studnet = this.studentRepo.findById(studentId).orElseThrow(() -> new ResourceNotFoundException("student", "id", studentId));
        // Auto-set status
        if (fee.getAmountPaid().compareTo(fee.getTotalAmount()) >= 0)
            fee.setStatus("Paid");
        else if (fee.getAmountPaid().compareTo(BigDecimal.ZERO) == 0)
            fee.setStatus("Pending");
        else
            fee.setStatus("Partially Paid");
        fee.setStudent(studnet);
        Fee newFee = this.feeRepo.save(fee);
        return this.modelMapper.map(newFee, FeeDto.class);
    }

    @Override
    public FeeDto updateFee(Integer id, FeeDto feeDto) {
        Fee fee = this.feeRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("fee", "id", id));
        if (feeDto.getStudentId() != null) {
            Student student = this.studentRepo.findById(feeDto.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student", "id", feeDto.getStudentId()));
            fee.setStudent(student);
        }
        fee.setAcademicYear(feeDto.getAcademicYear());
        fee.setTotalAmount(feeDto.getTotalAmount());
        fee.setAmountPaid(feeDto.getAmountPaid());
        fee.setDueAmount(feeDto.getTotalAmount().subtract(feeDto.getAmountPaid()));
        fee.setPaymentDate(feeDto.getPaymentDate());
        fee.setPaymentMode(feeDto.getPaymentMode());
        fee.setReceiptNumber(feeDto.getReceiptNumber());
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

    @Override
    public List<FeeDto> getAllFees() {
        List<Fee> fees = this.feeRepo.findAll();
        return fees.stream().map(fee -> this.modelMapper.map(fee, FeeDto.class)).collect(Collectors.toList());
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


}
