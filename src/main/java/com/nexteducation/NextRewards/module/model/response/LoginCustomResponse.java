package com.nexteducation.NextRewards.module.model.response;

import java.util.List;

import com.nexteducation.NextRewards.module.model.bo.Chapter;

public class LoginCustomResponse {

	private List<Chapter> chapterList;
	
	private Long studentId;
	
	private Long classId;

	public List<Chapter> getChapterList() {
		return chapterList;
	}

	public void setChapterList(List<Chapter> chapterList) {
		this.chapterList = chapterList;
	}

	public Long getStudentId() {
		return studentId;
	}

	public void setStudentId(Long studentId) {
		this.studentId = studentId;
	}

	public Long getClassId() {
		return classId;
	}

	public void setClassId(Long classId) {
		this.classId = classId;
	}
	
}
