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
@Table(name = "CONCEPTS_COMPLETED")
public class ConceptsCompleted {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "CONCEPTS_COMPLETED_ID", columnDefinition = "BIGINT(20)")
	private Long id;

	@JoinColumn(name = "CHAPTER_ID", nullable = false)
	@ManyToOne(fetch = FetchType.LAZY)
	private Chapter chapter;

	@JoinColumn(name = "STUDENT_ID", nullable = false)
	@ManyToOne(fetch = FetchType.EAGER)
	private Student student;
	
	@Column(name="BADGE")
	private String badge;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Chapter getChapter() {
		return chapter;
	}

	public void setChapter(Chapter chapter) {
		this.chapter = chapter;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

	public String getBadge() {
		return badge;
	}

	public void setBadge(String badge) {
		this.badge = badge;
	}

}
