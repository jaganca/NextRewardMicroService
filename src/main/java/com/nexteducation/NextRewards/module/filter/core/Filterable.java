package com.nexteducation.NextRewards.module.filter.core;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;

/**
 * The Interface Filterable.
 */
@Retention(RUNTIME)
public @interface Filterable {
	
	/**
	 * Field specifiers.
	 *
	 * @return the string[]
	 */
	public abstract String[] fieldSpecifiers() default {};

	/**
	 * Field names.
	 *
	 * @return the string[]
	 */
	public abstract String[] fieldNames() default {};

	/**
	 * Lhs.
	 *
	 * @return the string
	 */
	public abstract String lhs() default "";
}
