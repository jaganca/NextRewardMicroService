package com.nexteducation.NextRewards.module.filter.hibernate;

import java.util.Map;

import org.hibernate.engine.spi.FilterDefinition;
import org.hibernate.mapping.Property;
import org.hibernate.type.Type;

/**
 * The Class CustomFilterDefinition.
 */
@SuppressWarnings("serial")
public class CustomFilterDefinition extends FilterDefinition {

	/** The display name. */
	private String displayName = "";

	/** The property. */
	private Property property;

	/**
	 * Instantiates a new custom filter definition.
	 *
	 * @param name the name
	 * @param defaultCondition the default condition
	 * @param parameterTypes the parameter types
	 * @param displayName the display name
	 * @param property the property
	 */
	public CustomFilterDefinition(final String name, final String defaultCondition,
			final Map<String, Type> parameterTypes, final String displayName, final Property property) {
		super(name, defaultCondition, parameterTypes);
		this.displayName = displayName;
		this.property = property;
		// TODO Auto-generated constructor stub
	}

	/**
	 * Gets the display name.
	 *
	 * @return the display name
	 */
	public String getDisplayName() {
		return displayName;
	}

	/**
	 * Sets the display name.
	 *
	 * @param displayName the new display name
	 */
	public void setDisplayName(final String displayName) {
		this.displayName = displayName;
	}

	/**
	 * Gets the property.
	 *
	 * @return the property
	 */
	public Property getProperty() {
		return property;
	}

	/**
	 * Sets the property.
	 *
	 * @param property the new property
	 */
	public void setProperty(final Property property) {
		this.property = property;
	}
}
