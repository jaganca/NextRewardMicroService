package com.nexteducation.NextRewards.annotations.filtering;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.glassfish.hk2.api.AnnotationLiteral;
import org.glassfish.jersey.message.filtering.EntityFiltering;

/**
 * The Interface IgnorableView.
 */
@Target({ ElementType.TYPE, ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@EntityFiltering
public @interface IgnorableView {

	/**
	 * Factory class for creating instances of {@code ProjectDetailedView}
	 * annotation.
	 */
	public static class Factory extends AnnotationLiteral<IgnorableView> implements IgnorableView {

		/**
		 * Instantiates a new factory.
		 */
		private Factory() {
		}

		/**
		 * Gets the.
		 *
		 * @return the ignorable view
		 */
		public static IgnorableView get() {
			return new Factory();
		}
	}
}
