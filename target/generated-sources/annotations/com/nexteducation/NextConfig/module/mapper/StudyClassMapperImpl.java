package com.nexteducation.NextRewards.module.mapper;

import com.nexteducation.NextRewards.module.model.bo.StudyClass;
import com.nexteducation.NextRewards.module.model.response.StudyClassResponse;
import javax.annotation.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2017-10-28T11:28:00+0530",
    comments = "version: 1.0.0.Final, compiler: javac, environment: Java 1.8.0_131 (Oracle Corporation)"
)
@Component
public class StudyClassMapperImpl extends StudyClassMapper {

    @Override
    public StudyClassResponse studyClassToStudyClassResponse(StudyClass studyClass) {
        if ( studyClass == null ) {
            return null;
        }

        StudyClassResponse studyClassResponse = new StudyClassResponse();

        studyClassResponse.setId( studyClass.getId() );
        studyClassResponse.setClassName( studyClass.getClassName() );

        return studyClassResponse;
    }
}
