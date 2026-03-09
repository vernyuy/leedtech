package com.kudukin.store.controller;

import com.kudukin.store.dto.StudentRequest;
import com.kudukin.store.dto.StudentResponse;
import com.kudukin.store.entity.Student;
import com.kudukin.store.service.StudentService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<StudentResponse> createStudent(
            @Valid @RequestBody StudentRequest request) {

        Student student = service.createStudent(request);

        return ResponseEntity.ok(new StudentResponse(student));
    }

    // PAGINATED READ
    @CrossOrigin(origins = "*")
    @GetMapping
    public ResponseEntity<Page<StudentResponse>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Student> studentPage =
                service.getAllStudents(page, size);

        Page<StudentResponse> responsePage =
                studentPage.map(StudentResponse::new);

        return ResponseEntity.ok(responsePage);
    }

    // READ BY ID
    @GetMapping("/{studentNumber}")
    public ResponseEntity<StudentResponse> getStudent(
            @PathVariable String studentNumber) {

        Student student = service.getStudentById(studentNumber);

        return ResponseEntity.ok(new StudentResponse(student));
    }

    // UPDATE
    @PutMapping("/{studentNumber}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable String studentNumber,
            @Valid @RequestBody StudentRequest request) {

        Student updated =
                service.updateStudent(studentNumber, request);

        return ResponseEntity.ok(new StudentResponse(updated));
    }

    // DELETE
    @DeleteMapping("/{studentNumber}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable String studentNumber) {

        service.deleteStudent(studentNumber);

        return ResponseEntity.noContent().build();
    }
}