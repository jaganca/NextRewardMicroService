package com.nexteducation.NextRewards.annotations.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

/**
 * The Interface Password.
 */
@Documented
// PasswordConstraintValidator class implements the validation logic
@Constraint(validatedBy = PasswordConstraintValidator.class)
//Target specifies where the annotation can be applied(eg fields, methods etc)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface Password {
    
    /**
     * Message.
     *
     * @return the string
     */
    String message() default "Password is not valid.";
    
    /**
     * Groups.
     *
     * @return the class[]
     */
    Class<?>[] groups() default {};
     
    /**
     * Payload.
     *
     * @return the class<? extends payload>[]
     */
    Class<? extends Payload>[] payload() default {};
    
}
