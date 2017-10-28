package com.nexteducation.NextRewards.module.repository;

import java.io.Serializable;
import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexteducation.NextRewards.module.model.bo.Student;
import com.nexteducation.NextRewards.module.model.bo.StudentPoints;

public interface StudentPointsRepository extends JpaRepository<StudentPoints, Serializable>  {

	public StudentPoints findByStudent_Id(Long studentId);
	
	public StudentPoints findByStudent_IdAndDate(Long studentId,Date date);
	
}
