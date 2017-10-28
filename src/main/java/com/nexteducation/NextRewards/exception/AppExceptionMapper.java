/*package com.nexteducation.NextService.exception;

import java.util.Iterator;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.hibernate.validator.internal.engine.path.PathImpl;

@Provider
public class AppExceptionMapper implements ExceptionMapper<Exception> {

	@Override
	public Response toResponse(Exception exception) {
		exception.printStackTrace();
		ErrorResponse errorResponse = null;
		if (exception instanceof NextServiceClientException) {
			errorResponse = NextServiceClientExceptionMapper.INSTANCE
					.exceptionToResponse((NextServiceClientException) exception);
		} else if (exception instanceof ConstraintViolationException) {
			ConstraintViolationException ex = (ConstraintViolationException) exception;
			Set<ConstraintViolation<?>> set = ex.getConstraintViolations();
			NextServiceException e = new NextServiceException("NextRewards", "validationFailed", 400,
					"Provided data does not match constraints", "Validation failed.");
			for (Iterator<ConstraintViolation<?>> iterator = set.iterator(); iterator.hasNext();) {
				ConstraintViolation<?> next = iterator.next();
				String devMsg = next.getPropertyPath() + "|" + next.getMessage();
				String clientMsg = ((PathImpl) next.getPropertyPath()).getLeafNode().getName() + "|" + next.getMessage();
				e = new NextServiceException("NextRewards", "validationFailed", 400, devMsg, clientMsg);
				e.addException(e);
			}
			errorResponse = NextServiceClientExceptionMapper.INSTANCE.exceptionToResponse(e);
		} else {
			NextServiceException ex = new NextServiceException("NextRewards", "serverInternalError", 500,
					exception.getMessage(), "Something goes wrong.");
			errorResponse = NextServiceClientExceptionMapper.INSTANCE.exceptionToResponse(ex);
		}
		return Response.status(Status.fromStatusCode(errorResponse.getStatus())).entity(errorResponse.toString())
				.type(MediaType.APPLICATION_JSON).build();
	}

}*/