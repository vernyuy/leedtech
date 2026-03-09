package com.kudukin.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kudukin.store.entity.FeePayment;

public interface FeePaymentRepository
        extends JpaRepository<FeePayment, Long> {

}