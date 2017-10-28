package com.nexteducation.NextRewards.hibernate.datasourceRouting;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * The Interface ReadOnlyConnection.
 *
 * @author krishnakanthv
 */
@Target({ ElementType.METHOD, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface ReadOnlyConnection {

}
