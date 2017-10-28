package com.nexteducation.NextRewards.module.model.bo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "MINDMAP")
public class MindMap {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "MINDMAP_ID", columnDefinition = "BIGINT(20)")
	private Long id;

	@JoinColumn(name = "PREREQUISITE")
	@ManyToOne(fetch = FetchType.EAGER)
	private Chapter parentChapter;

	@JoinColumn(name = "CHAPTER_ID", nullable = false)
	@ManyToOne(fetch = FetchType.EAGER)
	private Chapter chapter;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Chapter getParentChapter() {
		return parentChapter;
	}

	public void setParentChapter(Chapter parentChapter) {
		this.parentChapter = parentChapter;
	}

	public Chapter getChapter() {
		return chapter;
	}

	public void setChapter(Chapter chapter) {
		this.chapter = chapter;
	}

}
