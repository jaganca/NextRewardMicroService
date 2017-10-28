package com.nexteducation.NextRewards.module.model.params;

import javax.validation.constraints.NotNull;
import javax.ws.rs.PathParam;

import com.nexteducation.NextRewards.util.NextRewardsUrls;

public class ConceptCompletedFetchParams {

	@NotNull(message = "chapter Id should not be null")
	@PathParam(NextRewardsUrls.CHAPTER_ID)
	private Long chapterId;

	public Long getChapterId() {
		return chapterId;
	}

	public void setChapterId(Long chapterId) {
		this.chapterId = chapterId;
	}

}
