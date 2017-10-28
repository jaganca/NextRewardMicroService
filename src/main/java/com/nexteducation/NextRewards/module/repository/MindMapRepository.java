package com.nexteducation.NextRewards.module.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.nexteducation.NextRewards.module.model.bo.MindMap;

public interface MindMapRepository extends JpaRepository<MindMap, Serializable> {

	public List<MindMap> findByChapter_Subject_Id(Long subjectId);

	@EntityGraph(attributePaths = { "parentChapter" })
	public List<MindMap> findByParentChapter_Id(Long chapterId);

	public MindMap findById(Long mindMapId);
}
