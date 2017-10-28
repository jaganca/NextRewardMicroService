//package com.nexteducation.NextRewards.annotations.validator;
//
//import javax.validation.ConstraintValidator;
//import javax.validation.ConstraintValidatorContext;
//
//public class LongConstraintValidator implements ConstraintValidator<Long, String> {
//
//	@Override
//	public void initialize(Long constraintAnnotation) {
//		System.out.println("**************" + constraintAnnotation.message() + "***********");
//
//	}
//
//	@Override
//	public boolean isValid(String value, ConstraintValidatorContext context) {
//		boolean isValid = false;
//		if (value == null || value.matches("[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}")) {
//			isValid = true;
//		}
//		return isValid;
//	}
//
//}
