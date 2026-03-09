package com.kudukin.store.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentRequest {

    @NotBlank
    private String studentNumber;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;
}