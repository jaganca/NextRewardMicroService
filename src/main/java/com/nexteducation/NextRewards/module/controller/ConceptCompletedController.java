package com.nexteducation.NextRewards.module.controller;

import java.util.List;

import javax.validation.Valid;
import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;

import com.nexteducation.NextRewards.module.mapper.ConceptCompletedMapper;
import com.nexteducation.NextRewards.module.model.bo.Chapter;
import com.nexteducation.NextRewards.module.model.bo.ConceptsCompleted;
import com.nexteducation.NextRewards.module.model.bo.Student;
import com.nexteducation.NextRewards.module.model.params.ConceptCompletedFetchParams;
import com.nexteducation.NextRewards.module.model.request.ConceptCompleteAddRequest;
import com.nexteducation.NextRewards.module.model.response.ConceptCompletedResponse;
import com.nexteducation.NextRewards.module.model.response.StatusResponse;
import com.nexteducation.NextRewards.module.repository.ChapterRepository;
import com.nexteducation.NextRewards.module.repository.ConceptCompletedRepository;
import com.nexteducation.NextRewards.module.repository.StudentRepository;
import com.nexteducation.NextRewards.util.NextRewardsUrls;
import com.nexteducation.NextService.util.ERPApp;

import io.swagger.annotations.ApiOperation;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Path(NextRewardsUrls.V1)
public class ConceptCompletedController {

	@Autowired
	ChapterRepository chapterRepository;

	@Autowired
	StudentRepository studentRepository;

	@Autowired
	ConceptCompletedRepository conceptCompletedRepository;

	@Autowired
	ConceptCompletedMapper conceptCompletedMapper;

	@POST
	@Path(NextRewardsUrls.CONCEPT_COMPLETED)
	@ApiOperation(value = "add Completed concepts", notes = "add completed Concepts")
	public StatusResponse addCompletedConcepts(@Valid ConceptCompleteAddRequest conceptCompleteAddRequest) {
		ConceptsCompleted conceptsCompleted = new ConceptsCompleted();
		Chapter chapter = chapterRepository.findById(conceptCompleteAddRequest.getChapterId());
		conceptsCompleted.setChapter(chapter);
		Student student = studentRepository.findById(conceptCompleteAddRequest.getStudentId());
		conceptsCompleted.setStudent(student);
		conceptCompletedRepository.save(conceptsCompleted);
		return new StatusResponse().withCode("200").withMsg("Added");
	}

	@POST
	@Path(NextRewardsUrls.CONCEPT_COMPLETED_ID)
	@ApiOperation(value = "fetch Completed concepts", notes = "fetch completed Concepts")
	public List<ConceptCompletedResponse> fetchCompletedConcepts(
			@Valid @BeanParam ConceptCompletedFetchParams conceptCompletedFetchParams,
			@Valid ConceptCompleteAddRequest conceptCompleteAddRequest) {
		List<ConceptsCompleted> conceptCompleted = conceptCompletedRepository
				.findByChapter_Id(conceptCompletedFetchParams.getChapterId());
		if (!ERPApp.isNullOrEmptyList(conceptCompleted)) {
			List<ConceptCompletedResponse> completedResponses = conceptCompletedMapper
					.conceptCompletedToConceptCompletedResponse(conceptCompleted);
			return completedResponses;
		}
		return null;
	}

}
