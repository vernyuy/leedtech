package com.kudukin.store.dto;

import com.kudukin.store.entity.FeePayment;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;

@Getter
public class FeePaymentResponse {

    private final String studentNumber;
    private final BigDecimal paymentAmount;
    private final String currency;
    private final BigDecimal previousBalance;
    private final BigDecimal newBalance;
    private final BigDecimal incentiveRate;
    private final BigDecimal incentiveAmount;
    private final BigDecimal totalReduction;
    private final String idempotencyKey;
    private final LocalDate paymentDate;

    public FeePaymentResponse(FeePayment payment) {
        this.studentNumber = payment.getStudent().getStudentNumber();
        this.paymentAmount = payment.getPaymentAmount();
        this.currency = payment.getCurrency();
        this.previousBalance = payment.getPreviousBalance();
        this.newBalance = payment.getNewBalance();
        this.incentiveRate = payment.getIncentiveRate();
        this.incentiveAmount = payment.getIncentiveAmount();
        this.totalReduction = payment.getTotalReduction();
        this.idempotencyKey = payment.getIdempotencyKey();
        this.paymentDate = payment.getPaymentDate();
    }
}
