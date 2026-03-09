package com.kudukin.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kudukin.store.entity.Student;

public interface StudentRepository extends JpaRepository<Student, String> {

}