package com.kudukin.store.service;

import com.kudukin.store.entity.*;
import com.kudukin.store.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;

@Service
public class FeePaymentService {

    private final StudentRepository studentRepository;
    private final StudentAccountRepository accountRepository;
    private final FeePaymentRepository paymentRepository;

    public FeePaymentService(StudentRepository studentRepository,
                             StudentAccountRepository accountRepository,
                             FeePaymentRepository paymentRepository) {

        this.studentRepository = studentRepository;
        this.accountRepository = accountRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public FeePayment processPayment(String studentNumber,
                                     BigDecimal paymentAmount,
                                     LocalDate paymentDate) {

        if (paymentAmount == null ||
                paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment must be greater than zero");
        }

        Student student = studentRepository.findById(studentNumber)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        StudentAccount account = accountRepository
                .findByStudent(student)
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        BigDecimal previousBalance = account.getBalance();

        // 1️⃣ Calculate incentive rate
        BigDecimal rate = calculateRate(paymentAmount);

        // 2️⃣ Calculate incentive amount
        BigDecimal incentiveAmount = paymentAmount
                .multiply(rate)
                .setScale(2, RoundingMode.HALF_UP);

        // 3️⃣ Total reduction
        BigDecimal totalReduction = paymentAmount.add(incentiveAmount);

        // 4️⃣ Update balance
        BigDecimal newBalance = previousBalance.subtract(totalReduction);
        account.setBalance(newBalance);

        // 5️⃣ Calculate next due date
        LocalDate nextDueDate = calculateNextDueDate(paymentDate);
        account.setNextDueDate(nextDueDate);

        accountRepository.save(account);

        // 6️⃣ Save payment record
        FeePayment payment = new FeePayment();
        payment.setStudent(student);
        payment.setPaymentAmount(paymentAmount);
        payment.setIncentiveRate(rate);
        payment.setIncentiveAmount(incentiveAmount);
        payment.setTotalReduction(totalReduction);
        payment.setPaymentDate(paymentDate);

        return paymentRepository.save(payment);
    }

    private BigDecimal calculateRate(BigDecimal amount) {

        if (amount.compareTo(new BigDecimal("100000")) < 0) {
            return new BigDecimal("0.01");
        }

        if (amount.compareTo(new BigDecimal("500000")) < 0) {
            return new BigDecimal("0.03");
        }

        return new BigDecimal("0.05");
    }

    private LocalDate calculateNextDueDate(LocalDate paymentDate) {

        LocalDate dueDate = paymentDate.plusDays(90);

        if (dueDate.getDayOfWeek() == DayOfWeek.SATURDAY) {
            dueDate = dueDate.plusDays(2);
        }

        if (dueDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
            dueDate = dueDate.plusDays(1);
        }

        return dueDate;
    }
}