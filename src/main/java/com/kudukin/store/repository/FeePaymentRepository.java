package com.kudukin.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kudukin.store.entity.FeePayment;

import java.util.Optional;

public interface FeePaymentRepository
        extends JpaRepository<FeePayment, Long> {

    Optional<FeePayment> findByIdempotencyKey(String idempotencyKey);
}
