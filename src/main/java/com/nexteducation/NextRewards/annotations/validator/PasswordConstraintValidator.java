package com.nexteducation.NextRewards.annotations.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.nexteducation.NextRewards.annotations.validator.Password;

/**
 * The Class PasswordConstraintValidator.
 */
public class PasswordConstraintValidator implements ConstraintValidator<Password, String> {

	/** 
	 * @see javax.validation.ConstraintValidator#initialize(java.lang.annotation.Annotation)
	 */
	@Override
	public void initialize(Password password) {
		System.out.println("**************" + password.message() + "***********");
	}

	/** 
	 * @see javax.validation.ConstraintValidator#isValid(java.lang.Object, javax.validation.ConstraintValidatorContext)
	 */
	@Override
	public boolean isValid(String passwordfield, ConstraintValidatorContext context) {
		if (passwordfield == null)
			return false;

		return passwordfield.matches("[1-9]*");
//		return passwordfield.matches("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_]).{6,20})");
	}

}
