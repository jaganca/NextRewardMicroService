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
@Table(name = "CHAPTER")
public class Chapter {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "CHAPTER_ID", columnDefinition = "BIGINT(20)")
	private Long id;

	@Column(name = "CHAPTER_NAME")
	private String chapterName;

	@Column(name = "DESCRIPTION")
	private String description;

	@JoinColumn(name = "SUBJECT_ID", nullable = false)
	@ManyToOne(fetch = FetchType.EAGER)
	private Subject subject;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getChapterName() {
		return chapterName;
	}

	public void setChapterName(String chapterName) {
		this.chapterName = chapterName;
	}

	public Subject getSubject() {
		return subject;
	}

	public void setSubject(Subject subject) {
		this.subject = subject;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
