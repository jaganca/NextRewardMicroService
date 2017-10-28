/*package com.nexteducation.NextService.exception;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class NextServiceClientException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	protected String domain;
	protected String code;
	protected int status;
	protected String debugMessage;
	protected String clientMessage;
	protected String moreInfoLink;
	protected List<NextServiceClientException> errors = new ArrayList<NextServiceClientException>();

	*//**
	 * no arguments constructor
	 *//*
	public NextServiceClientException() {
		super();
	}
	
	*//**
	 * @param domain
	 *            Service or Module name.
	 * @param code
	 *            Service local error codes. Like fileNotFound,
	 *            requestFoundNull.
	 * @param status
	 *            HttpStatus codes. Like 4XX, 5XX.
	 * @param debugMessage
	 *            message for developer.
	 * @param clientMessage
	 *            message for client.
	 *//*
	public NextServiceClientException(Throwable t, String domain, String code, int status, String debugMessage,
			String clientMessage) {
		super(t);
		this.domain = domain;
		this.code = code;
		this.status = status;
		this.debugMessage = debugMessage;
		this.clientMessage = clientMessage;
	}

	*//**
	 *
	 * @param domain
	 *            Service or Module name.
	 * @param code
	 *            Service local error codes. Like fileNotFound,
	 *            requestFoundNull.
	 * @param status
	 *            HttpStatus codes. Like 4XX, 5XX.
	 * @param debugMessage
	 *            message for developer.
	 * @param clientMessage
	 *            message for client.
	 * @param moreInfoLink
	 *            moreInfoLink for accessing error database.
	 *//*
	public NextServiceClientException(Throwable t, String domain, String code, int status, String debugMessage,
			String clientMessage, String moreInfoLink) {
		super(t);
		this.domain = domain;
		this.code = code;
		this.status = status;
		this.debugMessage = debugMessage;
		this.clientMessage = clientMessage;
		this.moreInfoLink = moreInfoLink;
	}

	*//**
	 * @param domain
	 *            Service or Module name.
	 * @param code
	 *            Service local error codes. Like fileNotFound,
	 *            requestFoundNull.
	 * @param status
	 *            HttpStatus codes. Like 4XX, 5XX.
	 * @param debugMessage
	 *            message for developer.
	 * @param clientMessage
	 *            message for client.
	 *//*
	public NextServiceClientException(String domain, String code, int status, String debugMessage,
			String clientMessage) {
		this.domain = domain;
		this.code = code;
		this.status = status;
		this.debugMessage = debugMessage;
		this.clientMessage = clientMessage;
	}

	*//**
	 *
	 * @param domain
	 *            Service or Module name.
	 * @param code
	 *            Service local error codes. Like fileNotFound,
	 *            requestFoundNull.
	 * @param status
	 *            HttpStatus codes. Like 4XX, 5XX.
	 * @param debugMessage
	 *            message for developer.
	 * @param clientMessage
	 *            message for client.
	 * @param moreInfoLink
	 *            moreInfoLink for accessing error database.
	 *//*
	public NextServiceClientException(String domain, String code, int status, String debugMessage,
			String clientMessage, String moreInfoLink) {
		this.domain = domain;
		this.code = code;
		this.status = status;
		this.debugMessage = debugMessage;
		this.clientMessage = clientMessage;
		this.moreInfoLink = moreInfoLink;
	}

	*//**
	 * Used to add NextServiceExceptions
	 * 
	 * @param exception
	 *//*
	public void addException(NextServiceClientException exception) {
		this.errors.add(exception);
	}

	public String getDomain() {
		return domain;
	}

	public String getCode() {
		return code;
	}

	public int getStatus() {
		return status;
	}

	public String getDebugMessage() {
		return debugMessage;
	}

	public String getClientMessage() {
		return clientMessage;
	}

	public String getMoreInfoLink() {
		return moreInfoLink;
	}

	public List<NextServiceClientException> getErrors() {
		return errors;
	}

	@JsonIgnore
	@Override
	public synchronized Throwable getCause() {
		return super.getCause();
	}

	@JsonIgnore
	@Override
	public StackTraceElement[] getStackTrace() {
		return super.getStackTrace();
	}

	@JsonIgnore
	@Override
	public String getLocalizedMessage() {
		return super.getLocalizedMessage();
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public void setDebugMessage(String debugMessage) {
		this.debugMessage = debugMessage;
	}

	public void setClientMessage(String clientMessage) {
		this.clientMessage = clientMessage;
	}

	public void setMoreInfoLink(String moreInfoLink) {
		this.moreInfoLink = moreInfoLink;
	}

	public void setErrors(List<NextServiceClientException> errors) {
		this.errors = errors;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append(getClass().getName());
		builder.append(" {\n\t");
		if (domain != null) {
			builder.append("domain: ");
			builder.append(domain);
			builder.append("\n\t");
		}
		if (code != null) {
			builder.append("code: ");
			builder.append(code);
			builder.append("\n\t");
		}
		builder.append("status: ");
		builder.append(status);
		builder.append("\n\t");
		if (debugMessage != null) {
			builder.append("debugMessage: ");
			builder.append(debugMessage);
			builder.append("\n\t");
		}
		if (clientMessage != null) {
			builder.append("clientMessage: ");
			builder.append(clientMessage);
			builder.append("\n\t");
		}
		if (moreInfoLink != null) {
			builder.append("moreInfoLink: ");
			builder.append(moreInfoLink);
			builder.append("\n\t");
		}
		if (errors != null && !errors.isEmpty()) {
			builder.append("errors: ");
			builder.append(errors);
		}
		builder.append("\n}");
		return builder.toString();
	}

}*/