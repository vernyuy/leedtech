package com.kudukin.store.service;

import com.kudukin.store.entity.*;
import com.kudukin.store.exception.AccountNotFoundException;
import com.kudukin.store.exception.StudentNotFoundException;
import com.kudukin.store.repository.*;

import jakarta.persistence.OptimisticLockException;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;
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
                                     String currency,
                                     String idempotencyKey,
                                     LocalDate paymentDate) {

        if (paymentAmount == null ||
                paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment must be greater than zero");
        }

        if (currency == null || currency.isBlank()) {
            throw new IllegalArgumentException("Currency is required");
        }

//        if (idempotencyKey == null || idempotencyKey.isBlank()) {
//            throw new IllegalArgumentException("Idempotency key is required");
//        }

        // Return existing payment if already processed
        FeePayment existingPayment =
                paymentRepository.findByIdempotencyKey(idempotencyKey).orElse(null);
        if (existingPayment != null) {
            return existingPayment;
        }

        int maxRetries = 3;
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                Student student = studentRepository.findById(studentNumber)
                        .orElseThrow(() ->
                                new StudentNotFoundException("Student not found: " + studentNumber));

                StudentAccount account = accountRepository
                        .findByStudent(student)
                        .orElseThrow(() ->
                                new AccountNotFoundException("Account not found for student: " + studentNumber));

                if (!account.getCurrency().equalsIgnoreCase(currency)) {
                    throw new IllegalArgumentException("Currency mismatch for account");
                }

                BigDecimal previousBalance = account.getBalance();

                // 1) Calculate incentive rate
                BigDecimal rate = calculateRate(paymentAmount);

                // 2) Calculate incentive amount
                BigDecimal incentiveAmount = paymentAmount
                        .multiply(rate)
                        .setScale(2, RoundingMode.HALF_UP);

                // 3) Total reduction
                BigDecimal totalReduction = paymentAmount.add(incentiveAmount);

                // 4) Update balance with guard
                BigDecimal newBalance = previousBalance.subtract(totalReduction);
                if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException("Insufficient balance for payment");
                }
                account.setBalance(newBalance);

                // 5) Calculate next due date
                LocalDate nextDueDate = calculateNextDueDate(paymentDate);
                account.setNextDueDate(nextDueDate);

                accountRepository.save(account);
                accountRepository.flush();

                // 6) Save payment record
                FeePayment payment = new FeePayment();
                payment.setStudent(student);
                payment.setPaymentAmount(paymentAmount);
                payment.setCurrency(currency.toUpperCase());
                payment.setPreviousBalance(previousBalance);
                payment.setNewBalance(newBalance);
                payment.setIncentiveRate(rate);
                payment.setIncentiveAmount(incentiveAmount);
                payment.setTotalReduction(totalReduction);
                if (idempotencyKey == null || idempotencyKey.isBlank()){
                    payment.setIdempotencyKey(generateIdempotencyKey());
                }else{
                    payment.setIdempotencyKey(idempotencyKey);
                }
                payment.setPaymentDate(paymentDate);

                FeePayment saved = paymentRepository.save(payment);
                paymentRepository.flush();
                return saved;
            } catch (DataIntegrityViolationException ex) {
                FeePayment alreadySaved =
                        paymentRepository.findByIdempotencyKey(idempotencyKey).orElse(null);
                if (alreadySaved != null) {
                    return alreadySaved;
                }
                throw ex;
            } catch (OptimisticLockException ex) {
                if (attempt == maxRetries) {
                    throw ex;
                }
            }
        }

        throw new IllegalStateException("Payment processing failed");
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
    private String generateIdempotencyKey() {
        String studentNumber = "IDK" + System.currentTimeMillis();

        return studentNumber;
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
