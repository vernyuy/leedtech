package com.kudukin.store.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(
        name = "fee_payments",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_fee_payment_idempotency", columnNames = "idempotency_key")
        }
)
public class FeePayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne
    @JoinColumn(name = "student_number", nullable = false)
    private Student student;

    @Setter
    @Column(name = "payment_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal paymentAmount;

    @Setter
    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Setter
    @Column(name = "previous_balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal previousBalance;

    @Setter
    @Column(name = "new_balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal newBalance;

    @Setter
    @Column(name = "incentive_rate", precision = 5, scale = 2)
    private BigDecimal incentiveRate;

    @Setter
    @Column(name = "incentive_amount", precision = 15, scale = 2)
    private BigDecimal incentiveAmount;

    @Setter
    @Column(name = "total_reduction", precision = 15, scale = 2)
    private BigDecimal totalReduction;

    @Setter
    @Column(name = "idempotency_key", nullable = false, updatable = false, length = 64)
    private String idempotencyKey;

    @Setter
    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
