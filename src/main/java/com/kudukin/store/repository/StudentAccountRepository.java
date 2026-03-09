package com.kudukin.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kudukin.store.entity.StudentAccount;
import com.kudukin.store.entity.Student;

import java.util.Optional;

public interface StudentAccountRepository
        extends JpaRepository<StudentAccount, Long> {

    Optional<StudentAccount> findByStudent(Student student);
}