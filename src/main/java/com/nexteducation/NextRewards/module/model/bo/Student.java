package com.nexteducation.NextRewards.module.model.bo;

import java.util.Date;

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
@Table(name = "STUDENT")
public class Student {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "STUDENT_ID", columnDefinition = "BIGINT(20)")
	private Long id;

	@JoinColumn(name = "CLASS_ID", nullable = false)
	@ManyToOne(fetch = FetchType.EAGER)
	private StudyClass studyClass;

	@Column(name = "STUDENTNAME")
	private String studentName;

	@Column(name = "POINTS")
	private Long points;
	
	
	@Column(name = "CREATED_ON", nullable = false)
	private Date createdOn;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public StudyClass getStudyClass() {
		return studyClass;
	}

	public void setStudyClass(StudyClass studyClass) {
		this.studyClass = studyClass;
	}

	public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	public Long getPoints() {
		return points;
	}

	public void setPoints(Long points) {
		this.points = points;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}
	

}
