package com.kudukin.store.service;

import com.kudukin.store.dto.StudentRequest;
import com.kudukin.store.entity.Student;
import com.kudukin.store.repository.StudentRepository;
import com.kudukin.store.exception.*;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    // CREATE
    @Transactional
    public Student createStudent(StudentRequest request) {

//        if (repository.existsById(request.getStudentNumber())) {
//            throw new StudentAlreadyExistsException(
//                    "Student already exists: " + request.getStudentNumber());
//        }

        Student student = new Student();
        student.setStudentNumber(generateStudentNumber());
        student.setName(request.getName());
        student.setEmail(request.getEmail());

        return repository.save(student);
    }

    // READ BY ID
    public Student getStudentById(String studentNumber) {

        return repository.findById(studentNumber)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student not found: " + studentNumber));
    }

    // PAGINATED READ
    public Page<Student> getAllStudents(int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return repository.findAll(pageable);
    }

    // UPDATE
    @Transactional
    public Student updateStudent(String studentNumber,
                                 StudentRequest request) {

        Student student = getStudentById(studentNumber);

        student.setName(request.getName());
        student.setEmail(request.getEmail());

        return repository.save(student);
    }

    // DELETE
    @Transactional
    public void deleteStudent(String studentNumber) {

        Student student = getStudentById(studentNumber);

        repository.delete(student);
    }

    private String generateStudentNumber() {
        String studentNumber;

        do {
            studentNumber = "STU" + System.currentTimeMillis();
        } while (repository.existsById(studentNumber));

        return studentNumber;
    }
}