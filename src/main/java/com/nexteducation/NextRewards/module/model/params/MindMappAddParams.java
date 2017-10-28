package com.nexteducation.NextRewards.module.model.params;

import javax.validation.constraints.NotNull;
import javax.ws.rs.PathParam;

import com.nexteducation.NextRewards.util.NextRewardsUrls;

public class MindMappAddParams {

	@NotNull(message = "SUBJECT ID should not be null")
	@PathParam(NextRewardsUrls.SUBJECT_ID)
	private Long subjectId;

	public Long getSubjectId() {
		return subjectId;
	}

	public void setSubjectId(Long subjectId) {
		this.subjectId = subjectId;
	}

}
