package com.nexteducation.NextRewards.module.filter.core;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;

/**
 * The Interface HistoryProperty.
 */
@Retention(RUNTIME)
public @interface HistoryProperty {
	
	/**
	 * Field name.
	 *
	 * @return the string
	 */
	public abstract String fieldName() default "";
	
	/**
	 * Order.
	 *
	 * @return the int
	 */
	public  abstract int order() default 0;
}
