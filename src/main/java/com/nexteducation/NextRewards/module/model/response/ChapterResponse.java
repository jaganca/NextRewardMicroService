package com.nexteducation.NextRewards.module.model.response;

import java.util.List;

public class ChapterResponse {

	private Long id;

	private String chapterName;

	private String description;

	private SubjectResponse subjectResponse;

	private Boolean error;

	private List<String> reason;

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

	public SubjectResponse getSubjectResponse() {
		return subjectResponse;
	}

	public void setSubjectResponse(SubjectResponse subjectResponse) {
		this.subjectResponse = subjectResponse;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Boolean getError() {
		return error;
	}

	public void setError(Boolean error) {
		this.error = error;
	}

	public List<String> getReason() {
		return reason;
	}

	public void setReason(List<String> reason) {
		this.reason = reason;
	}

}
