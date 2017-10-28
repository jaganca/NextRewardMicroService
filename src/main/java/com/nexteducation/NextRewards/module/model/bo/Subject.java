package com.nexteducation.NextRewards.module.model.bo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.Table;

@Entity
@Table(name = "SUBJECT")
@NamedEntityGraph(name = "graph.subject.all", attributeNodes = {
		@NamedAttributeNode(value = "staff"),
		@NamedAttributeNode(value = "studyClass")})
public class Subject {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "SUBJECT_ID", columnDefinition = "BIGINT(20)")
	private Long id;

	@Column(name = "SUBJECT_NAME")
	private String subjectName;

	@JoinColumn(name = "STAFF_ID", nullable = false)
	@ManyToOne(fetch = FetchType.EAGER)
	private Staff staff;

	@JoinColumn(name = "CLASS_ID", nullable = false)
	@ManyToOne(fetch = FetchType.EAGER)
	private StudyClass studyClass;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSubjectName() {
		return subjectName;
	}

	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}

	public Staff getStaff() {
		return staff;
	}

	public void setStaff(Staff staff) {
		this.staff = staff;
	}

	public StudyClass getStudyClass() {
		return studyClass;
	}

	public void setStudyClass(StudyClass studyClass) {
		this.studyClass = studyClass;
	}

}
