package com.nexteducation.NextRewards.module.repository;

import java.io.Serializable;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexteducation.NextRewards.module.model.bo.Student;

public interface StudentRepository extends JpaRepository<Student, Serializable> {

	public Student findById(Long studentId);
	
	public Student findByStudentName(String student);
}
