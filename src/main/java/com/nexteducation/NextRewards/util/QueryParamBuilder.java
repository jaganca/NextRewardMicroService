package com.nexteducation.NextRewards.util;

import java.lang.reflect.Field;
import java.net.URI;

import javax.ws.rs.QueryParam;

import org.springframework.web.util.UriComponentsBuilder;

public class QueryParamBuilder {

	public URI build(Object object, String restUri) {

		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(restUri);
		for (Field field : object.getClass().getDeclaredFields()) {
			QueryParam[] annotations = field.getDeclaredAnnotationsByType(QueryParam.class);
			if (annotations.length > 0) {
				try {
					builder.queryParam(annotations[0].value(), (String) field.get(object));
				} catch (IllegalArgumentException e) {
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				}
			}

		}
		return builder.build().encode().toUri();
	}
}