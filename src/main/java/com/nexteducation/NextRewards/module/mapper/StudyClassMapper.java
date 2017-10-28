package com.nexteducation.NextRewards.module.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.nexteducation.NextRewards.module.model.bo.StudyClass;
import com.nexteducation.NextRewards.module.model.response.StudyClassResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class StudyClassMapper {

	public abstract StudyClassResponse studyClassToStudyClassResponse(StudyClass studyClass);
}
