package com.nexteducation.NextRewards.module.mapper;

import com.nexteducation.NextRewards.module.model.bo.Subject;
import com.nexteducation.NextRewards.module.model.response.SubjectResponse;
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
public class SubjectMapperImpl extends SubjectMapper {

    @Override
    public SubjectResponse subjectToSubjectResponse(Subject subject) {
        if ( subject == null ) {
            return null;
        }

        SubjectResponse subjectResponse = new SubjectResponse();

        subjectResponse.setId( subject.getId() );
        subjectResponse.setSubjectName( subject.getSubjectName() );

        return subjectResponse;
    }

    @Override
    public List<SubjectResponse> subjectToSubjectResponse(List<Subject> subjects) {
        if ( subjects == null ) {
            return null;
        }

        List<SubjectResponse> list = new ArrayList<SubjectResponse>();
        for ( Subject subject : subjects ) {
            list.add( subjectToSubjectResponse( subject ) );
        }

        return list;
    }
}
