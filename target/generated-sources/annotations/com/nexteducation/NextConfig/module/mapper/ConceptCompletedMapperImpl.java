package com.nexteducation.NextRewards.module.mapper;

import com.nexteducation.NextRewards.module.model.bo.ConceptsCompleted;
import com.nexteducation.NextRewards.module.model.response.ConceptCompletedResponse;
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
public class ConceptCompletedMapperImpl extends ConceptCompletedMapper {

    @Override
    public ConceptCompletedResponse conceptCompletedToConceptCompletedResponse(ConceptsCompleted conceptsCompleted) {
        if ( conceptsCompleted == null ) {
            return null;
        }

        ConceptCompletedResponse conceptCompletedResponse = new ConceptCompletedResponse();

        conceptCompletedResponse.setId( conceptsCompleted.getId() );

        return conceptCompletedResponse;
    }

    @Override
    public List<ConceptCompletedResponse> conceptCompletedToConceptCompletedResponse(List<ConceptsCompleted> conceptsCompleted) {
        if ( conceptsCompleted == null ) {
            return null;
        }

        List<ConceptCompletedResponse> list = new ArrayList<ConceptCompletedResponse>();
        for ( ConceptsCompleted conceptsCompleted_ : conceptsCompleted ) {
            list.add( conceptCompletedToConceptCompletedResponse( conceptsCompleted_ ) );
        }

        return list;
    }
}
