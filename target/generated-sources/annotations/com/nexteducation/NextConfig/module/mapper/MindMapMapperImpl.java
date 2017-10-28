package com.nexteducation.NextRewards.module.mapper;

import com.nexteducation.NextRewards.module.model.bo.MindMap;
import com.nexteducation.NextRewards.module.model.response.MindMapResponse;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2017-10-28T11:28:00+0530",
    comments = "version: 1.0.0.Final, compiler: javac, environment: Java 1.8.0_131 (Oracle Corporation)"
)
@Component
public class MindMapMapperImpl extends MindMapMapper {

    @Autowired
    private ChapterMapper chapterMapper;

    @Override
    public MindMapResponse mindMapToMindMapResponse(MindMap mindMap) {
        if ( mindMap == null ) {
            return null;
        }

        MindMapResponse mindMapResponse = new MindMapResponse();

        mindMapResponse.setId( mindMap.getId() );
        mindMapResponse.setParentChapter( chapterMapper.chapterToChapterResponse( mindMap.getParentChapter() ) );
        mindMapResponse.setChapter( chapterMapper.chapterToChapterResponse( mindMap.getChapter() ) );

        return mindMapResponse;
    }

    @Override
    public List<MindMapResponse> mindMapToMindMapResponse(List<MindMap> mindMap) {
        if ( mindMap == null ) {
            return null;
        }

        List<MindMapResponse> list = new ArrayList<MindMapResponse>();
        for ( MindMap mindMap_ : mindMap ) {
            list.add( mindMapToMindMapResponse( mindMap_ ) );
        }

        return list;
    }
}
