package com.nexteducation.NextRewards.module.controller;

import java.util.Date;
import java.util.List;

import javax.ws.rs.BeanParam;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;

import com.nexteducation.NextRewards.module.model.bo.StudentPoints;
import com.nexteducation.NextRewards.module.repository.StudentPointsRepository;
import com.nexteducation.NextRewards.util.NextRewardsUrls;

import io.swagger.annotations.ApiOperation;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Path(NextRewardsUrls.V1)
public class StudentPointsController {

	
	@Autowired
	StudentPointsRepository studentPointsRepository;
	
	@GET
	@Path("/scores")
	@ApiOperation(value = "fetch scores", notes = "fetch scores")
	public List<StudentPoints> fetchScores() {
		return studentPointsRepository.findAll();
	}
}
