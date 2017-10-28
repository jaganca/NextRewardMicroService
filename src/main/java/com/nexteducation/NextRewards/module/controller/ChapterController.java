package com.nexteducation.NextRewards.module.controller;

import java.util.ArrayList;
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

import com.amazonaws.Response;
import com.nexteducation.NextRewards.module.mapper.ChapterMapper;
import com.nexteducation.NextRewards.module.model.bo.Chapter;
import com.nexteducation.NextRewards.module.model.bo.MindMap;
import com.nexteducation.NextRewards.module.model.params.ChapterFetchParams;
import com.nexteducation.NextRewards.module.model.request.ChapterAddRequest;
import com.nexteducation.NextRewards.module.model.response.ChapterResponse;
import com.nexteducation.NextRewards.module.model.response.StatusResponse;
import com.nexteducation.NextRewards.module.repository.ChapterRepository;
import com.nexteducation.NextRewards.module.repository.ConceptCompletedRepository;
import com.nexteducation.NextRewards.module.repository.MindMapRepository;
import com.nexteducation.NextRewards.module.repository.SubjectRepository;
import com.nexteducation.NextRewards.util.NextRewardsUrls;
import com.nexteducation.NextService.util.ERPApp;

import io.swagger.annotations.ApiOperation;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Path(NextRewardsUrls.V1)
public class ChapterController {

	@Autowired
	ChapterRepository chapterRepository;
	
	@Autowired
	SubjectRepository subjectRepository;
	
	@Autowired
	ConceptCompletedRepository conceptCompletedRepository;

	@Autowired
	MindMapRepository mindMapRepository;

	
	@Autowired
	ChapterMapper chapterMapper;

	@GET
	@Path(NextRewardsUrls.CHAPTER)
	@ApiOperation(value = "Fetch Chapters", notes = "Fetch Chapters")
	public List<ChapterResponse> fetchChapter(@Valid @BeanParam ChapterFetchParams chapterFetchParams) {
		List<Chapter> chapters = chapterRepository.findBySubject_Id(chapterFetchParams.getSubjectId());
		if (!ERPApp.isNullOrEmptyList(chapters)) {
			List<ChapterResponse> chapterResponses = chapterMapper.chapterToChapterResponse(chapters);
			return chapterResponses;
		}
		return null;
	}

	@POST
	@Path(NextRewardsUrls.CHAPTER)
	@ApiOperation(value = "add Chapters", notes = "add Chapters")
	public StatusResponse addChapter(@Valid ChapterAddRequest chapterAddRequest) {
		Chapter chapter = new Chapter();
		chapter.setChapterName(chapterAddRequest.getChapterName());
		chapter.setDescription(chapterAddRequest.getDescription());
		chapter.setSubject(subjectRepository.findById(chapterAddRequest.getSubjectId()));
		chapterRepository.save(chapter);
		return new StatusResponse().withCode("200").withMsg("Chapters Added Successfully");
	}

	@GET
	@Path(NextRewardsUrls.CHAPTER + "/class")
	@ApiOperation(value = "Fetch Chapters", notes = "Fetch Chapters")
	public List<ChapterResponse> fetchChapterByClass(@Valid @BeanParam ChapterFetchParams chapterFetchParams) {
		List<Chapter> chapters = chapterRepository.findBySubject_StudyClass_Id(chapterFetchParams.getClassId());
		if (!ERPApp.isNullOrEmptyList(chapters)) {
			List<ChapterResponse> chapterResponses = chapterMapper.chapterToChapterResponse(chapters);
			return chapterResponses;
		}
		return null;
	}
	
	@POST
	@Path(NextRewardsUrls.CHAPTER + "/class")
	@ApiOperation(value = "Fetch Chapters", notes = "Fetch Chapters")
	public ChapterResponse fetchChapters(@Valid @BeanParam ChapterFetchParams chapterFetchParams) {
		

		ChapterResponse cresponse = new ChapterResponse();
		Chapter response = chapterRepository.findById(chapterFetchParams.getChapterId()); 
		List<MindMap> mindMapList = mindMapRepository.findByParentChapter_Id(chapterFetchParams.getChapterId());
		if(!com.nexteducation.NextRewards.util.ERPApp.isNullOrEmptyList(mindMapList)){
	        List<String> todo = new ArrayList<String>(); 
			for(int i=0;i<mindMapList.size();i++){
	        	 if(com.nexteducation.NextRewards.util.ERPApp.isEmptyObject(conceptCompletedRepository.findByChapter_IdAndStudent_Id(mindMapList.get(i).getChapter().getId(), chapterFetchParams.getStudentId()))){
	        		todo.add(mindMapList.get(i).getChapter().getChapterName()); 
	        	 }
	         }
			if(!com.nexteducation.NextRewards.util.ERPApp.isNullOrEmptyList(todo)){
				cresponse.setError(true);
				cresponse.setReason(todo);
			}else{
		       cresponse.setDescription(response.getDescription());
		       cresponse.setId(response.getId());
			}
		}else{
			cresponse.setDescription(response.getDescription());
			cresponse.setId(response.getId());
		}
		return cresponse;
 	}
}
