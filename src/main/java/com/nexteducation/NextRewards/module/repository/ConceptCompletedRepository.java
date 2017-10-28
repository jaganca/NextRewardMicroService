package com.nexteducation.NextRewards.module.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexteducation.NextRewards.module.model.bo.ConceptsCompleted;

public interface ConceptCompletedRepository extends JpaRepository<ConceptsCompleted, Serializable> {

	public List<ConceptsCompleted> findByChapter_Id(Long chapterId);
	
	public ConceptsCompleted findByChapter_IdAndStudent_Id(Long chapterId, Long studentId);
}
