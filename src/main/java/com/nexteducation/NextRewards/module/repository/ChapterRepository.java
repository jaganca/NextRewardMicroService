package com.nexteducation.NextRewards.module.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexteducation.NextRewards.module.model.bo.Chapter;

public interface ChapterRepository extends JpaRepository<Chapter, Serializable> {

	public List<Chapter> findBySubject_Id(Long subjectId);
	
	public List<Chapter> findBySubject_StudyClass_Id(Long classId);

	public Chapter findById(Long chapterId);
}
