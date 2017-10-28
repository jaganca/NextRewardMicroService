package com.nexteducation.NextRewards.module.model.params;

import javax.ws.rs.QueryParam;

import com.nexteducation.NextRewards.util.NextRewardsUrls;

public class ClassFetchParams {

	@QueryParam(NextRewardsUrls.STAFF_ID)
	private Long staffId;

	public Long getStaffId() {
		return staffId;
	}

	public void setStaffId(Long staffId) {
		this.staffId = staffId;
	}
	
	
}
