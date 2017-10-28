package com.nexteducation.NextRewards.module.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(value = Include.NON_NULL)
public class StatusResponse {

	private String code;

	private String message;

	private Long id;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public StatusResponse withCode(String code) {
		this.code = code;
		return this;
	}

	public StatusResponse withMsg(String message) {
		this.message = message;
		return this;
	}

	public StatusResponse withId(Long id) {
		this.id = id;
		return this;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

}
