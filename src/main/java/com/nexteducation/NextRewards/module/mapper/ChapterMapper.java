package com.nexteducation.NextRewards.module.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.nexteducation.NextRewards.module.model.bo.Chapter;
import com.nexteducation.NextRewards.module.model.response.ChapterResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class ChapterMapper {

	public abstract ChapterResponse chapterToChapterResponse(Chapter chapter);

	public abstract List<ChapterResponse> chapterToChapterResponse(List<Chapter> chapter);
}
