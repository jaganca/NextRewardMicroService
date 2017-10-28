package com.nexteducation.NextRewards.module.mapper;

import com.nexteducation.NextRewards.module.model.bo.Staff;
import com.nexteducation.NextRewards.module.model.response.StaffResponse;
import javax.annotation.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2017-10-28T11:28:00+0530",
    comments = "version: 1.0.0.Final, compiler: javac, environment: Java 1.8.0_131 (Oracle Corporation)"
)
@Component
public class StaffMapperImpl extends StaffMapper {

    @Override
    public StaffResponse staffToStaffResponse(Staff staff) {
        if ( staff == null ) {
            return null;
        }

        StaffResponse staffResponse = new StaffResponse();

        return staffResponse;
    }
}
