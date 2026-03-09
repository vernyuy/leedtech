package com.kudukin.store.dto;
import com.kudukin.store.entity.Student;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class StudentAccountRequest {

    @NotBlank
    private String studentNumber;

    @NotNull
    private BigDecimal balance;

    @NotNull
    private LocalDate nextDueDate;

    @NotBlank
    private String currency;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
