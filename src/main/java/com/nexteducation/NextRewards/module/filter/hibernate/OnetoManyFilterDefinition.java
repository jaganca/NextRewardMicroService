package com.nexteducation.NextRewards.module.filter.hibernate;

import java.util.Map;

import org.hibernate.engine.spi.FilterDefinition;
import org.hibernate.type.Type;

/**
 * The Class OnetoManyFilterDefinition.
 */
@SuppressWarnings("serial")
public class OnetoManyFilterDefinition extends FilterDefinition {

	/** The default column condition. */
	private String defaultColumnCondition = "";

	/** The display name. */
	private String displayName = "";

	/**
	 * Instantiates a new oneto many filter definition.
	 *
	 * @param name the name
	 * @param defaultCondition the default condition
	 * @param defaultColumnCondition the default column condition
	 * @param parameterTypes the parameter types
	 * @param displayName the display name
	 */
	public OnetoManyFilterDefinition(final String name, final String defaultCondition,
			final String defaultColumnCondition, final Map<String, Type> parameterTypes, final String displayName) {
		super(name, defaultCondition, parameterTypes);
		this.defaultColumnCondition = defaultColumnCondition;
		this.displayName = displayName;
		// TODO Auto-generated constructor stub
	}

	/**
	 * Gets the default column condition.
	 *
	 * @return the default column condition
	 */
	public String getDefaultColumnCondition() {
		return defaultColumnCondition;
	}

	/**
	 * Sets the default column condition.
	 *
	 * @param defaultColumnCondition the new default column condition
	 */
	public void setDefaultColumnCondition(final String defaultColumnCondition) {
		this.defaultColumnCondition = defaultColumnCondition;
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

}
