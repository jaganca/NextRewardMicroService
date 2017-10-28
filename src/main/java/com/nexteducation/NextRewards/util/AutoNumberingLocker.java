//package com.nexteducation.NextRewards.util;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//import com.nexteducation.NextRewards.module.mapper.AutoNumberingMapper;
//import com.nexteducation.NextRewards.module.model.bo.AutoNumbering;
//import com.nexteducation.NextRewards.module.model.response.AutoNumberingResponse;
//import com.nexteducation.NextRewards.module.repository.AutoNumberingRepository;
//
//@Component
//public class AutoNumberingLocker extends DistributedLocker {
//
//	@Autowired
//	AutoNumberingRepository autoNumberingRepository;
//
//	@Autowired
//	AutoNumberingMapper autoNumberingMapper;
//	
//	public AutoNumberingLocker(String ipAddress, String port) {
//		super(ipAddress, port);
//	}
//
//	@Override
//	protected void perform() {
//		AutoNumbering autoNumbering=autoNumberingRepository.findByLong();
//		autoNumbering.setVariableStart(autoNumbering.getVariableStart()+1);
//		autoNumberingRepository.save(autoNumbering);
////		AutoNumberingResponse autoNumberingResponse=autoNumberingMapper.AutoNumberingToAutoNumberingResponse(autoNumbering);
////		return autoNumberingResponse;	
//	}
//
//}
