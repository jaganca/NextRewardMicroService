package com.nexteducation.NextRewards.module.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.nexteducation.NextRewards.module.model.bo.Chapter;
import com.nexteducation.NextRewards.module.model.bo.Question;
import com.nexteducation.NextRewards.module.model.response.QuestionResponse;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,uses = { ChapterMapper.class })
public abstract class QuestionMapper {

	public abstract QuestionResponse questionToQuestionResponse(Question question);

	public abstract List<QuestionResponse> questionToQuestionResponse(List<Question> question);
}
