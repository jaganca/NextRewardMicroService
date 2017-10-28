package com.nexteducation.NextRewards.module.mapper;

import com.nexteducation.NextRewards.module.model.bo.Chapter;
import com.nexteducation.NextRewards.module.model.response.ChapterResponse;
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
public class ChapterMapperImpl extends ChapterMapper {

    @Override
    public ChapterResponse chapterToChapterResponse(Chapter chapter) {
        if ( chapter == null ) {
            return null;
        }

        ChapterResponse chapterResponse = new ChapterResponse();

        chapterResponse.setId( chapter.getId() );
        chapterResponse.setChapterName( chapter.getChapterName() );
        chapterResponse.setDescription( chapter.getDescription() );

        return chapterResponse;
    }

    @Override
    public List<ChapterResponse> chapterToChapterResponse(List<Chapter> chapter) {
        if ( chapter == null ) {
            return null;
        }

        List<ChapterResponse> list = new ArrayList<ChapterResponse>();
        for ( Chapter chapter_ : chapter ) {
            list.add( chapterToChapterResponse( chapter_ ) );
        }

        return list;
    }
}
