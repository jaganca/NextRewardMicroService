//package com.nexteducation.NextRewards.annotations.validator;
//
//import java.lang.annotation.Documented;
//import java.lang.annotation.ElementType;
//import java.lang.annotation.Retention;
//import java.lang.annotation.RetentionPolicy;
//import java.lang.annotation.Target;
//
//import javax.validation.Constraint;
//import javax.validation.Payload;
//
//@Documented
//@Constraint(validatedBy = UuidConstraintValidator.class)
//@Target({ ElementType.METHOD, ElementType.FIELD })
//@Retention(RetentionPolicy.RUNTIME)
//public @interface Uuid {
//
//	String message() default "{Uuid}";
//
//	Class<?>[] groups() default {};
//
//	Class<? extends Payload>[] payload() default {};
//
//}