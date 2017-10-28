/*package com.nexteducation.NextService.exception;

import java.util.Iterator;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;

import org.hibernate.validator.internal.engine.path.PathImpl;

public class ConstraintViolationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {

	@Override
	public Response toResponse(final ConstraintViolationException ex) {
		ex.printStackTrace();
		Set<ConstraintViolation<?>> set = ex.getConstraintViolations();
		NextServiceException e = new NextServiceException("NextRewards", "validationFailed", 400,
				"Provided data does not match constraints", "Validation failed.");
		for (Iterator<ConstraintViolation<?>> iterator = set.iterator(); iterator.hasNext();) {
			ConstraintViolation<?> next = iterator.next();
			String devMsg = next.getPropertyPath() + "|" + next.getMessage();
			String clientMsg = ((PathImpl) next.getPropertyPath()).getLeafNode().getName() + "|" + next.getMessage();
			NextServiceException exc = new NextServiceException("NextRewards", "validationFailed", 400, devMsg, clientMsg);
			e.addException(exc);
		}
		e.printStackTrace();
		ErrorResponse errorResponse = NextServiceClientExceptionMapper.INSTANCE.exceptionToResponse(e);
		return Response.status(Status.fromStatusCode(errorResponse.getStatus()))
				.entity(errorResponse.toString()).type(MediaType.APPLICATION_JSON)
				.build();
	}
}
*/