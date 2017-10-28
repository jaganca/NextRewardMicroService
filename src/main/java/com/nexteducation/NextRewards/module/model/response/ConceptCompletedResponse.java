package com.nexteducation.NextRewards.module.model.response;

public class ConceptCompletedResponse {

	private Long id;

	private ChapterResponse chapterResponse;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public ChapterResponse getChapterResponse() {
		return chapterResponse;
	}

	public void setChapterResponse(ChapterResponse chapterResponse) {
		this.chapterResponse = chapterResponse;
	}

}
