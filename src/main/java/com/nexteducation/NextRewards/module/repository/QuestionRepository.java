package com.nexteducation.NextRewards.module.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexteducation.NextRewards.module.model.bo.Question;

public interface QuestionRepository extends JpaRepository<Question, Serializable> {

	public List<Question> findByChapter_Id(Long chapterId);
	
	public Question findById(Long questionId);
}
