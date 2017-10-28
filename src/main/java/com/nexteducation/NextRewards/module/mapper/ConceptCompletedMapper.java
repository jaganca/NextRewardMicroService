package com.nexteducation.NextRewards.module.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.nexteducation.NextRewards.module.model.bo.ConceptsCompleted;
import com.nexteducation.NextRewards.module.model.response.ConceptCompletedResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {ChapterMapper.class })
public abstract class ConceptCompletedMapper {
   
	public abstract ConceptCompletedResponse conceptCompletedToConceptCompletedResponse(ConceptsCompleted conceptsCompleted);
	
	public abstract List<ConceptCompletedResponse> conceptCompletedToConceptCompletedResponse(List<ConceptsCompleted> conceptsCompleted);
}
