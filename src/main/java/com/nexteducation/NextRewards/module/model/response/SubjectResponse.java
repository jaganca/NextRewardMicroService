package com.nexteducation.NextRewards.module.model.response;

public class SubjectResponse {

	private Long id;

	private String subjectName;

	private StaffResponse staffResponese;

	private StudyClassResponse studyClassResponse;

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

	public StaffResponse getStaffResponese() {
		return staffResponese;
	}

	public void setStaffResponese(StaffResponse staffResponese) {
		this.staffResponese = staffResponese;
	}

	public StudyClassResponse getStudyClassResponse() {
		return studyClassResponse;
	}

	public void setStudyClassResponse(StudyClassResponse studyClassResponse) {
		this.studyClassResponse = studyClassResponse;
	}

}
