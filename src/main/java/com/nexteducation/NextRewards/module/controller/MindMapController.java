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
import org.springframework.transaction.annotation.Transactional;

import com.nexteducation.NextRewards.module.mapper.MindMapMapper;
import com.nexteducation.NextRewards.module.model.bo.Chapter;
import com.nexteducation.NextRewards.module.model.bo.MindMap;
import com.nexteducation.NextRewards.module.model.params.MindMappAddParams;
import com.nexteducation.NextRewards.module.model.params.MindMappFetchParams;
import com.nexteducation.NextRewards.module.model.request.MindMapAddRequest;
import com.nexteducation.NextRewards.module.model.response.MindMapResponse;
import com.nexteducation.NextRewards.module.model.response.StatusResponse;
import com.nexteducation.NextRewards.module.repository.ChapterRepository;
import com.nexteducation.NextRewards.module.repository.MindMapRepository;
import com.nexteducation.NextRewards.util.NextRewardsUrls;
import com.nexteducation.NextService.util.ERPApp;

import io.swagger.annotations.ApiOperation;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@Path(NextRewardsUrls.V1)
public class MindMapController {

	@Autowired
	MindMapRepository mindMapRepository;

	@Autowired
	ChapterRepository chapterRepository;

	@Autowired
	MindMapMapper mindMapMapper;

	@POST
	@Path(NextRewardsUrls.MIND_MAP)
	@ApiOperation(value = "add mind map ", notes = "add mind map")
	public StatusResponse addMindMap(@Valid @BeanParam MindMappAddParams mindMappAddParams,
			@Valid MindMapAddRequest mindMapAddRequest) {
		List<Long> prerequisites = mindMapAddRequest.getPrerequisites();
		List<MindMap> mindMaps = new ArrayList<>();
		MindMap mindMap = null;
		Chapter chapter = chapterRepository.findById(mindMapAddRequest.getChapterId());
		if (!ERPApp.isNullOrEmptyList(prerequisites)) {
			for (Long prereqId : prerequisites) {
				mindMap = new MindMap();
				Chapter chapter2 = chapterRepository.findById(prereqId);
				mindMap.setParentChapter(chapter2);
				mindMap.setChapter(chapter);
				mindMaps.add(mindMap);
			}
			mindMapRepository.save(mindMaps);
			return new StatusResponse().withCode("200").withMsg("added Succefully");
		}
		mindMap = new MindMap();
		mindMap.setChapter(chapter);
		mindMap.setParentChapter(null);
		mindMapRepository.save(mindMap);
		return new StatusResponse().withCode("200").withMsg("added Succefully");
	}

	@GET
	@Path(NextRewardsUrls.MIND_MAP)
	@ApiOperation(value = "fetch prereq", notes = "fetch prereq")
	public List<MindMapResponse> fetchquestions(@Valid @BeanParam MindMappFetchParams MindMappFetchParams) {
		List<MindMap> mindMaps = mindMapRepository.findByParentChapter_Id(MindMappFetchParams.getChapterId());
		if (!ERPApp.isNullOrEmptyList(mindMaps)) {
			List<MindMapResponse> mapResponses = mindMapMapper.mindMapToMindMapResponse(mindMaps);
			return mapResponses;
		}
		return null;
	}
}
