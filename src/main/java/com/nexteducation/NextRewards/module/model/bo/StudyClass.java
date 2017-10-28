package com.nexteducation.NextRewards.module.model.bo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "CLASS")
public class StudyClass {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "CLASS_ID", columnDefinition = "BIGINT(20)")
	private Long id;

	@Column(name = "CLASS_NAME")
	private String className;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

}
