package com.nexteducation.NextRewards.module.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.nexteducation.NextRewards.module.model.bo.Staff;
import com.nexteducation.NextRewards.module.model.response.StaffResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class StaffMapper {

	public abstract StaffResponse staffToStaffResponse(Staff staff);
}
