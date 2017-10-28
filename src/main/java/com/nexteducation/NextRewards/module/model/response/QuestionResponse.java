package com.nexteducation.NextRewards.module.model.response;

public class QuestionResponse {

	private Long id;

	private String description;

	private String answer;

	private Long value;

	private ChapterResponse chapterResponse;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public ChapterResponse getChapterResponse() {
		return chapterResponse;
	}

	public void setChapterResponse(ChapterResponse chapterResponse) {
		this.chapterResponse = chapterResponse;
	}

	public Long getValue() {
		return value;
	}

	public void setValue(Long value) {
		this.value = value;
	}

}
