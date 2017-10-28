package com.nexteducation.NextRewards.module.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.nexteducation.NextRewards.module.model.bo.MindMap;
import com.nexteducation.NextRewards.module.model.response.MindMapResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = { ChapterMapper.class })
public abstract class MindMapMapper {

	public abstract MindMapResponse mindMapToMindMapResponse(MindMap mindMap);

	public abstract List<MindMapResponse> mindMapToMindMapResponse(List<MindMap> mindMap);
}
