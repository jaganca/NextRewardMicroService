package com.nexteducation.NextRewards.module.model.response;

public class MindMapResponse {

	private Long id;

	private ChapterResponse parentChapter;

	private ChapterResponse chapter;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public ChapterResponse getParentChapter() {
		return parentChapter;
	}

	public void setParentChapter(ChapterResponse parentChapter) {
		this.parentChapter = parentChapter;
	}

	public ChapterResponse getChapter() {
		return chapter;
	}

	public void setChapter(ChapterResponse chapter) {
		this.chapter = chapter;
	}

}
