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
@Table(name = "STUDENT_POINTS")
public class StudentPoints {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "POINT_ID", columnDefinition = "BIGINT(20)")
	private Long id;

	@Column(name = "NEGATIVE_POINTS")
	private Long negpoints;
	
	@Column(name = "POSITIVE_POINTS")
	private Long pospoints;
	
	@Column(name = "POINTS")
	private Long points;
	
	@Column(name = "DATE")
	private Date date;
	
	@JoinColumn(name = "STUDENT_ID", nullable = false)
	@ManyToOne(fetch = FetchType.EAGER)
	private Student student;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getNegpoints() {
		return negpoints;
	}

	public void setNegpoints(Long negpoints) {
		this.negpoints = negpoints;
	}

	public Long getPospoints() {
		return pospoints;
	}

	public void setPospoints(Long pospoints) {
		this.pospoints = pospoints;
	}

	public Long getPoints() {
		return points;
	}

	public void setPoints(Long points) {
		this.points = points;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}
}
