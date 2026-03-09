package com.kudukin.store.dto;

import com.kudukin.store.entity.Student;
import com.kudukin.store.entity.StudentAccount;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class StudentAccountResponse {

    private final Long id;
    private final String studentNumber;
    private final BigDecimal balance;
    private final LocalDate nextDueDate;
    private final String currency;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public StudentAccountResponse(StudentAccount account) {
        this.id = account.getId();
        this.studentNumber = account.getStudent().getStudentNumber();
        this.balance = account.getBalance();
        this.nextDueDate = account.getNextDueDate();
        this.currency = account.getCurrency();
        this.createdAt = account.getCreatedAt();
        this.updatedAt = account.getUpdatedAt();
    }
}