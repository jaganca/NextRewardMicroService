/*package com.nexteducation.NextService.exception;

*//**
 * Custom exception class.
 * 
 * @author ashishpratap
 *
 *//*
public class NextServiceException extends NextServiceClientException {
	private static final long serialVersionUID = 1L;
	
	*//**
	 * no arguments constructor
	 *//*
	public NextServiceException() {
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
	public NextServiceException(Throwable t, String domain, String code, int status, String debugMessage,
			String clientMessage) {
		super(t, domain, code, status, debugMessage, clientMessage);
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
	public NextServiceException(Throwable t, String domain, String code, int status, String debugMessage,
			String clientMessage, String moreInfoLink) {
		super(t, domain, code, status, debugMessage, clientMessage, moreInfoLink);
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
	public NextServiceException(String domain, String code, int status, String debugMessage, String clientMessage) {
		super(domain, code, status, debugMessage, clientMessage);
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
	public NextServiceException(String domain, String code, int status, String debugMessage, String clientMessage,
			String moreInfoLink) {
		super(domain, code, status, debugMessage, clientMessage, moreInfoLink);
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