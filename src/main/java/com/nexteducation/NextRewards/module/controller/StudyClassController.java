
package com.nexteducation.NextRewards.module.controller;

import java.util.List;

import javax.validation.Valid;
import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;

import com.nexteducation.NextRewards.module.model.params.ClassFetchParams;
import com.nexteducation.NextRewards.module.model.response.StudyClassResponse;
import com.nexteducation.NextRewards.module.repository.SubjectRepository;
import com.nexteducation.NextRewards.util.NextRewardsUrls;

import io.swagger.annotations.ApiOperation;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Path(NextRewardsUrls.V1)
public class StudyClassController {
	
	@Autowired
	SubjectRepository subjectRepository;
	
	@GET
	@ApiOperation(value = "Fetch Classes", notes = "Fetch Classes")
	public List<StudyClassResponse> fetchClasses(@Valid @BeanParam ClassFetchParams classFetchParams) {
		return null;
	}

}
