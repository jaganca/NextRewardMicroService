package com.nexteducation.NextRewards.module.service.impl;

import org.springframework.stereotype.Service;

import com.nexteducation.NextRewards.module.service.core.HelloService;

/**
 * The Class HelloServiceImpl.
 */
@Service("helloService")
public class HelloServiceImpl implements HelloService {

	/**
	 * Say hello.
	 *
	 * @param name the name
	 * @return the string
	 */
	@Override
	public String sayHello(String name) {
		return "Hello! " + name;
	}
}
