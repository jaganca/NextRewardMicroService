package com.nexteducation.NextRewards.module.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.nexteducation.NextRewards.module.model.bo.Subject;
import com.nexteducation.NextRewards.module.model.response.SubjectResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = { StudyClassMapper.class ,StaffMapper.class})
public abstract class SubjectMapper {

	public abstract SubjectResponse subjectToSubjectResponse(Subject subject);

	public abstract List<SubjectResponse> subjectToSubjectResponse(List<Subject> subjects);
}
