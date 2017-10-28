package com.nexteducation.NextRewards.module.model.params;

import javax.validation.constraints.NotNull;
import javax.ws.rs.QueryParam;

import com.nexteducation.NextRewards.util.NextRewardsUrls;

public class SubjectFetchParams {

	@NotNull(message = "CASTE ID should not be null")
	@QueryParam(NextRewardsUrls.STAFF_ID)
	private Long staffId;

	public Long getStaffId() {
		return staffId;
	}

	public void setStaffId(Long staffId) {
		this.staffId = staffId;
	}

}
