package com.nexteducation.NextRewards.module.controller;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.Date;
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

import com.nexteducation.NextRewards.module.mapper.QuestionMapper;
import com.nexteducation.NextRewards.module.model.bo.ConceptsCompleted;
import com.nexteducation.NextRewards.module.model.bo.Question;
import com.nexteducation.NextRewards.module.model.bo.Student;
import com.nexteducation.NextRewards.module.model.bo.StudentPoints;
import com.nexteducation.NextRewards.module.model.params.QuestionFetchParams;
import com.nexteducation.NextRewards.module.model.params.QuestionReplyRequest;
import com.nexteducation.NextRewards.module.model.request.QuestionAddRequest;
import com.nexteducation.NextRewards.module.model.response.CustomQuestionResponse;
import com.nexteducation.NextRewards.module.model.response.QuestionResponse;
import com.nexteducation.NextRewards.module.model.response.StatusResponse;
import com.nexteducation.NextRewards.module.repository.ChapterRepository;
import com.nexteducation.NextRewards.module.repository.ConceptCompletedRepository;
import com.nexteducation.NextRewards.module.repository.QuestionRepository;
import com.nexteducation.NextRewards.module.repository.StudentPointsRepository;
import com.nexteducation.NextRewards.module.repository.StudentRepository;
import com.nexteducation.NextRewards.util.NextRewardsUrls;
import com.nexteducation.NextService.util.ERPApp;

import io.swagger.annotations.ApiOperation;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Path(NextRewardsUrls.V1)
public class QuestionController {

	@Autowired
	ChapterRepository chapterRepository;
	
	@Autowired
	ConceptCompletedRepository conceptsCompletedRepository;

	@Autowired
	QuestionRepository questionRepository;

	@Autowired
	StudentRepository studentRepository;
	
	@Autowired
	StudentPointsRepository studentPointRepository;
	
	@Autowired
	QuestionMapper questionMapper;

	@POST
	@Path(NextRewardsUrls.QUESTION)
	@ApiOperation(value = "add questions", notes = "add questions")
	public StatusResponse addquestion(@Valid QuestionAddRequest questionAddRequest) {
		Question question = new Question();
		question.setDescription(questionAddRequest.getDescription());
		question.setAnswer(questionAddRequest.getAnswer());
		question.setChapter(chapterRepository.findById(questionAddRequest.getChapterId()));
		questionRepository.save(question);
		return new StatusResponse().withCode("200").withMsg("added successfully");
	}

	@GET
	@Path(NextRewardsUrls.QUESTION_ID)
	@ApiOperation(value = "fetch questions", notes = "fetch questions")
	public List<QuestionResponse> fetchquestions(@Valid @BeanParam QuestionFetchParams questionFetchParams) {
		List<Question> questions = questionRepository.findByChapter_Id(questionFetchParams.getChapterId());
		if (!ERPApp.isNullOrEmptyList(questions)) {
			List<QuestionResponse> questionResponses = questionMapper.questionToQuestionResponse(questions);
			return questionResponses;
		}
		return null;
	}
	
	@POST
	@Path(NextRewardsUrls.QUESTION_ID)
	@ApiOperation(value = "save questions", notes = "save questions")
	public CustomQuestionResponse savereplies(List<QuestionReplyRequest> questionReplyList) {
		
		Long studentId = questionReplyList.get(0).getStudentId();
		CustomQuestionResponse response = new CustomQuestionResponse();
	 Long chapter = questionReplyList.get(0).getChapterId();
		Long marks = 0L;
		int correct = 0;
		int wrong = 0;
		for(int i=0;i<questionReplyList.size();i++){
			Question question = questionRepository.findById(questionReplyList.get(i).getQuestionId());
			if(question.getAnswer().equals(questionReplyList.get(i).getAnswer())){
				marks += question.getValue();
				correct +=1;
			}else{
				wrong +=1;
			}
		}
		
		
		String badge = null;
		if(correct>wrong){
			badge="Gold Badge";
		}
		if(correct==wrong){
			badge="Silver Badge";
		}
		if(correct<wrong){
			badge ="Bronze Badge";
		}
		
		//save to conceptCompleted
				ConceptsCompleted concept = new ConceptsCompleted();
				concept.setStudent(studentRepository.findById(questionReplyList.get(0).getStudentId()));
				concept.setBadge(badge);
				concept.setChapter(chapterRepository.findById(chapter));
				conceptsCompletedRepository.save(concept);
		
        
		LocalDateTime date1 = LocalDateTime.now();	
		Date date = new Date();
		date.setMonth(date1.getMonthValue());
		date.setYear(date1.getYear());
		date.setDate(date1.getDayOfMonth());
		
		//check if its there
		
		
		//save marks in two tables
		/*StudentPoints studentPoints = new StudentPoints();
		studentPoints.setDate(date);
		studentPoints.setPoints(marks);
		*/
		
		Student student = studentRepository.findById(studentId);
		student.setPoints(student.getPoints()+marks);
		studentRepository.save(student);
		 
		response.setBadge(badge);
		response.setCorrect(correct);
		response.setWrong(wrong);
		return response;
	}
}
