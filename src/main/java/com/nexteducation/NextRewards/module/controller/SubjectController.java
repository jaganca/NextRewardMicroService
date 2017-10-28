package com.nexteducation.NextRewards.module.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;

import com.nexteducation.NextRewards.module.mapper.StudyClassMapper;
import com.nexteducation.NextRewards.module.mapper.SubjectMapper;
import com.nexteducation.NextRewards.module.model.bo.Subject;
import com.nexteducation.NextRewards.module.model.params.SubjectFetchParams;
import com.nexteducation.NextRewards.module.model.response.SubjectResponse;
import com.nexteducation.NextRewards.module.repository.SubjectRepository;
import com.nexteducation.NextRewards.util.NextRewardsUrls;
import com.nexteducation.NextService.util.ERPApp;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Path(NextRewardsUrls.V1)
@Api(value = "Subjects")
public class SubjectController {

	@Autowired
	SubjectRepository subjectRepository;

	@Autowired
	SubjectMapper subjectMapper;

	@Autowired
	StudyClassMapper studyClassMapper;

	@GET
	@Path(NextRewardsUrls.SUBJECT)
	@ApiOperation(value = "Fetch Subjects", notes = "Fetch Subjects")
	public List<SubjectResponse> fetchSubject(@Valid @BeanParam SubjectFetchParams SubjectFetchParams) {
		List<Subject> subjects = subjectRepository.findByStaff_Id(SubjectFetchParams.getStaffId());
		List<SubjectResponse> subjectResponses = new ArrayList<>();
		SubjectResponse subjectResponse = null;
		if (!ERPApp.isNullOrEmptyList(subjects)) {
			for (Subject subject : subjects) {
				subjectResponse = subjectMapper.subjectToSubjectResponse(subject);
				subjectResponse.setStudyClassResponse(
						studyClassMapper.studyClassToStudyClassResponse(subject.getStudyClass()));
				subjectResponses.add(subjectResponse);
			}

			return subjectResponses;
		}
		return null;
	}

}
