package com.kudukin.store.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
public class FeePaymentRequest {

    // ✅ Getter and Setter for studentNumber
    @NotBlank
    private String studentNumber;

    // ✅ Getter and Setter for paymentAmount
    @NotNull
    @DecimalMin(value = "0.01", message = "Payment must be greater than zero")
    private BigDecimal paymentAmount;

    @NotBlank
    @Size(min = 3, max = 3, message = "Currency must be a 3-letter code")
    private String currency;


    private String idempotencyKey;

    // ✅ Getter and Setter for paymentDate
    private LocalDate paymentDate;

}
