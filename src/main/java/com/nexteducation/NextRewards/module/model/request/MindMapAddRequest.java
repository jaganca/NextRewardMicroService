package com.nexteducation.NextRewards.module.model.request;

import java.util.List;

public class MindMapAddRequest {


	private List<Long> prerequisites;

	private Long chapterId;

	public List<Long> getPrerequisites() {
		return prerequisites;
	}

	public void setPrerequisites(List<Long> prerequisites) {
		this.prerequisites = prerequisites;
	}

	public Long getChapterId() {
		return chapterId;
	}

	public void setChapterId(Long chapterId) {
		this.chapterId = chapterId;
	}

}
