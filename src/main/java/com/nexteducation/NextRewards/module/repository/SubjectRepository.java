package com.nexteducation.NextRewards.module.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;

import com.nexteducation.NextRewards.module.model.bo.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Serializable> {


	@EntityGraph(value = "graph.subject.all", type = EntityGraphType.LOAD)
	public List<Subject> findByStaff_Id(Long staffId);
	
	public Subject findById(Long subjectId);
	
	public List<Subject> findByStudyClass_Id(Long studyClassId);
}
