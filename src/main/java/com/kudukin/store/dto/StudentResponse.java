package com.kudukin.store.dto;

import com.kudukin.store.entity.Student;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class StudentResponse {

    private final String studentNumber;
    private final String name;
    private final String email;
    private final LocalDateTime createdAt;

    public StudentResponse(Student student) {
        this.studentNumber = student.getStudentNumber();
        this.name = student.getName();
        this.email = student.getEmail();
        this.createdAt = student.getCreatedAt();
    }
}