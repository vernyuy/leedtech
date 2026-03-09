package com.kudukin.store.controller;

import com.kudukin.store.dto.StudentAccountRequest;
import com.kudukin.store.dto.StudentAccountResponse;
import com.kudukin.store.entity.StudentAccount;
import com.kudukin.store.service.StudentAccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/accounts")
public class StudentAccountController {

    private final StudentAccountService service;

    public StudentAccountController(StudentAccountService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<StudentAccountResponse> createAccount(
            @Valid @RequestBody StudentAccountRequest request) {

        StudentAccount account = service.createStudentAccount(request);

        return ResponseEntity.ok(new StudentAccountResponse(account));
    }

    @GetMapping
    public ResponseEntity<List<StudentAccountResponse>> getAllAccounts() {

        List<StudentAccountResponse> accounts =
                service.getAllAccounts()
                        .stream()
                        .map(StudentAccountResponse::new)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentAccountResponse> getAccount(
            @PathVariable Long id) {

        StudentAccount account = service.getAccount(id);

        return ResponseEntity.ok(new StudentAccountResponse(account));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentAccountResponse> updateAccount(
            @PathVariable Long id,
            @Valid @RequestBody StudentAccountRequest request) {

        StudentAccount account =
                service.updateAccount(id, request);

        return ResponseEntity.ok(new StudentAccountResponse(account));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @PathVariable Long id) {

        service.deleteAccount(id);

        return ResponseEntity.noContent().build();
    }
}
