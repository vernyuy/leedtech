package com.kudukin.store.controller;

import com.kudukin.store.dto.FeePaymentRequest;
import com.kudukin.store.dto.FeePaymentResponse;
import com.kudukin.store.entity.FeePayment;
import com.kudukin.store.service.FeePaymentService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/payments")
public class FeePaymentController {

    private final FeePaymentService paymentService;

    public FeePaymentController(FeePaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/one-time")
    public ResponseEntity<FeePaymentResponse> processOneTimePayment(
            @Valid @RequestBody FeePaymentRequest request) {

        LocalDate paymentDate =
                request.getPaymentDate() != null
                        ? request.getPaymentDate()
                        : LocalDate.now();

        System.out.println("controller");
        System.out.println(request.getPaymentAmount());
        System.out.println(request.getStudentNumber());

        FeePayment payment = paymentService.processPayment(
                request.getStudentNumber(),
                request.getPaymentAmount(),
                paymentDate
        );

        FeePaymentResponse response = new FeePaymentResponse(payment);

        return ResponseEntity.ok(response);
    }
}