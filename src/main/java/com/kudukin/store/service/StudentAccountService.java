package com.kudukin.store.service;

import com.kudukin.store.dto.StudentAccountRequest;
import com.kudukin.store.dto.StudentAccountResponse;
import com.kudukin.store.dto.StudentRequest;
import com.kudukin.store.entity.Student;
import com.kudukin.store.entity.StudentAccount;
import com.kudukin.store.repository.StudentAccountRepository;
import com.kudukin.store.repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentAccountService {
    private final StudentAccountRepository stdAcnRepository;
    private final StudentRepository stdRepository;
    public StudentAccountService(StudentAccountRepository stdAcnRepository, StudentRepository stdRepository){
        this.stdAcnRepository = stdAcnRepository;
        this.stdRepository = stdRepository;
    }

//    Create Student Account
    @Transactional
    public StudentAccount createStudentAccount(StudentAccountRequest request){
//        Check is student exist.
        Student student = stdRepository.findById(request.getStudentNumber()).orElseThrow(
                () -> new RuntimeException("Student Not Found")
        );

        StudentAccount stdAcn = new StudentAccount();
        stdAcn.setStudent(student);
        stdAcn.setBalance(request.getBalance());
        stdAcn.setNextDueDate(request.getNextDueDate());
        stdAcn.setCurrency(request.getCurrency());

        return stdAcnRepository.save(stdAcn);
    }

    public List<StudentAccount> getAllAccounts(){
        return stdAcnRepository.findAll();
    }

    public StudentAccount getAccount(long id){
        return stdAcnRepository.findById(id).orElseThrow(() -> new RuntimeException("Account Not Found"));
    }

    @Transactional
    public StudentAccount updateAccount(long id, StudentAccountRequest request){
        StudentAccount account = getAccount(id);

        account.setBalance(request.getBalance());
        account.setNextDueDate(request.getNextDueDate());

        return stdAcnRepository.save(account);
    }

    @Transactional
    public void deleteAccount(long id){
        StudentAccount account = getAccount(id);
        stdAcnRepository.delete(account);
    }
}
