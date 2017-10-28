package com.nexteducation.NextRewards.module.mapper;

import com.nexteducation.NextRewards.module.model.bo.Question;
import com.nexteducation.NextRewards.module.model.response.QuestionResponse;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2017-10-28T11:28:00+0530",
    comments = "version: 1.0.0.Final, compiler: javac, environment: Java 1.8.0_131 (Oracle Corporation)"
)
@Component
public class QuestionMapperImpl extends QuestionMapper {

    @Override
    public QuestionResponse questionToQuestionResponse(Question question) {
        if ( question == null ) {
            return null;
        }

        QuestionResponse questionResponse = new QuestionResponse();

        questionResponse.setId( question.getId() );
        questionResponse.setDescription( question.getDescription() );
        questionResponse.setAnswer( question.getAnswer() );
        questionResponse.setValue( question.getValue() );

        return questionResponse;
    }

    @Override
    public List<QuestionResponse> questionToQuestionResponse(List<Question> question) {
        if ( question == null ) {
            return null;
        }

        List<QuestionResponse> list = new ArrayList<QuestionResponse>();
        for ( Question question_ : question ) {
            list.add( questionToQuestionResponse( question_ ) );
        }

        return list;
    }
}
