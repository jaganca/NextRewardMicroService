package com.nexteducation.NextRewards.module.service.client;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.nexteducation.NextService.module.service.client.RestTemplate;

import com.nexteducation.NextRewards.module.model.request.HelloRequest;
import com.nexteducation.NextRewards.module.service.core.HelloService;
import com.nexteducation.NextRewards.util.NextRewardsUrls;

/**
 * The Class HelloServiceClient.
 */
public class HelloServiceClient implements HelloService {

	
	/**
	 * Say hello.
	 *
	 * @param name the name
	 * @return the string
	 */
	@Override
	public String sayHello(String name) {
		final String REST_URI = NextRewardsUrls.SERVER_URL + NextRewardsUrls.HELLO_URL;
		final RestTemplate restTemplate = new RestTemplate();
		final HttpEntity<HelloRequest> requestEntity = new HttpEntity<HelloRequest>(new HelloRequest(name));
		final ResponseEntity<String> responseEntity = restTemplate.exchange(REST_URI, HttpMethod.POST, requestEntity,
				new ParameterizedTypeReference<String>() {
				});
		return responseEntity.getBody();
	}
}
