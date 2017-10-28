package com.nexteducation.NextRewards.module.controller;

import java.util.List;

import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.nexteducation.NextRewards.module.model.bo.Chapter;
import com.nexteducation.NextRewards.module.model.bo.Student;
import com.nexteducation.NextRewards.module.model.bo.Subject;
import com.nexteducation.NextRewards.module.model.bo.UserRegistration;
import com.nexteducation.NextRewards.module.model.request.UserRegistrationFetchRequest;
import com.nexteducation.NextRewards.module.model.request.UserRegistrationRequest;
import com.nexteducation.NextRewards.module.model.response.LoginCustomResponse;
import com.nexteducation.NextRewards.module.model.response.StatusResponse;
import com.nexteducation.NextRewards.module.repository.ChapterRepository;
import com.nexteducation.NextRewards.module.repository.StudentRepository;
import com.nexteducation.NextRewards.module.repository.SubjectRepository;
import com.nexteducation.NextRewards.module.repository.UserRegistrationRepository;
import com.nexteducation.NextRewards.util.NextRewardsUrls;
import com.nexteducation.NextService.util.DU;
import com.nexteducation.NextService.util.ERPApp;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Path(NextRewardsUrls.V1)
public class UserRegistrationController {

	@Autowired
	UserRegistrationRepository userRegistrationRepository;
	
	@Autowired
	ChapterRepository chapterRepository;
	
	@Autowired
	StudentRepository studentRepository;

	@Autowired
	SubjectRepository subjectRepository;

	@POST
	@Path(NextRewardsUrls.LOGIN)
	@Transactional
	public StatusResponse registerUser(@Valid UserRegistrationRequest userRegistrationRequest) {
		UserRegistration registrationInRepository = userRegistrationRepository.findByLoginTypeAndUserName(
				userRegistrationRequest.getLoginType(), userRegistrationRequest.getUserName());
		if (!ERPApp.isEmptyObject(registrationInRepository)) {
			return new StatusResponse().withCode("400").withMsg("userName is already Taken");
		}
		UserRegistration userRegistration = new UserRegistration();
		userRegistration.setUserName(userRegistrationRequest.getUserName());
		userRegistration.setLoginType(userRegistrationRequest.getLoginType());
		userRegistration.setPassword(userRegistrationRequest.getPassword());
		userRegistration.setCreatedOn(DU.now());
		userRegistration.setModifiedOn(DU.now());
		userRegistrationRepository.save(userRegistration);
		return new StatusResponse().withCode("200").withMsg("Registered SUccessfully");
	}

	@POST
	@Path(NextRewardsUrls.LOGIN+"/id")
	public LoginCustomResponse registerAuthenticity(@Valid UserRegistrationFetchRequest userRegistrationFetchRequest) {
		UserRegistration registrationInRepository = userRegistrationRepository.findByLoginTypeAndUserNameAndPassword(
				userRegistrationFetchRequest.getLoginType(), userRegistrationFetchRequest.getUserName(),
				userRegistrationFetchRequest.getPassword());
		if (!ERPApp.isEmptyObject(registrationInRepository)) {
			//send the chapter list
			Student student = studentRepository.findByStudentName(registrationInRepository.getUserName());
			List<Subject> subjectList = subjectRepository.findByStudyClass_Id(student.getStudyClass().getId());
			List<Chapter> chapterList = chapterRepository.findBySubject_Id(subjectList.get(0).getId());
			
			LoginCustomResponse response = new LoginCustomResponse();
			response.setClassId(student.getStudyClass().getId());
			response.setStudentId(student.getId());
			response.setChapterList(chapterList);
			return response;
		}
		//return new StatusResponse().withCode("400").withMsg("Check UserName And Password");
		return null;
	}
}
