package com.nexteducation.NextRewards.module.model.params;

import javax.validation.constraints.NotNull;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;

import com.nexteducation.NextRewards.util.NextRewardsUrls;

public class QuestionFetchParams {

	@NotNull(message = "chapter Id should not be null")
	@QueryParam(NextRewardsUrls.CHAPTER_ID)
	private Long chapterId;

	public Long getChapterId() {
		return chapterId;
	}

	public void setChapterId(Long chapterId) {
		this.chapterId = chapterId;
	}

}
