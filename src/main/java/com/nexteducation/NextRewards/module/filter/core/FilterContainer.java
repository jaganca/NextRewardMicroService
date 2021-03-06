package com.nexteducation.NextRewards.module.filter.core;

import org.hibernate.engine.spi.FilterDefinition;
import org.hibernate.mapping.Property;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.FloatType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.ShortType;
import org.hibernate.type.StringType;
import org.hibernate.type.Type;

import com.nexteducation.NextRewards.module.filter.hibernate.CustomFilterDefinition;
import com.nexteducation.NextRewards.module.filter.hibernate.OnetoManyFilterDefinition;

/**
 * The Class FilterContainer.
 */
public class FilterContainer {

	/** The filter definition. */
	public FilterDefinition filterDefinition;

	/** The filter name. */
	public String filterName;

	/** The conditional operator. */
	public String conditionalOperator;

	/** The display name. */
	public String displayName = null;

	/**
	 * Instantiates a new filter container.
	 *
	 * @param filterDefinition the filter definition
	 * @param property the property
	 * @param boClass the bo class
	 */
	@SuppressWarnings("rawtypes")
	public FilterContainer(final FilterDefinition filterDefinition, final Property property, final Class boClass) {
		this.filterDefinition = filterDefinition;
		filterName = filterDefinition.getFilterName();
		filterDefinition.getDefaultFilterCondition();
		assignConditionalOperator(filterName, property);
		boClass.getDeclaredFields();
		if (filterDefinition instanceof OnetoManyFilterDefinition) {
			displayName = ((OnetoManyFilterDefinition) filterDefinition).getDisplayName();
		} else if (filterDefinition instanceof CustomFilterDefinition) {
			displayName = ((CustomFilterDefinition) filterDefinition).getDisplayName();
			/*
			 * for (int i = 0; i < declaredFields.length; i++) { final Field
			 * field = declaredFields[i]; field.getType();
			 * if(field.getName().equals(property.getName())){
			 * if(field.isAnnotationPresent(FieldMap.class)){ final FieldMap
			 * fieldMap = field.getAnnotation(FieldMap.class);
			 * if(!fieldMap.fieldCode().equals("")) { try{ displayName =
			 * ControllerSupportMetadata.getMessage(fieldMap.fieldCode());
			 * }catch(final Exception e){ LogMessage.error(e.getMessage(), e); }
			 * } if(displayName == null){ displayName = fieldMap.fieldName(); }
			 * if(displayName == null){ displayName = property.getName(); }
			 * break; } else{ displayName = property.getName(); } } }
			 */
		} else {
			displayName = property.getName();
		}
	}

	/**
	 * Assign conditional operator.
	 *
	 * @param filterName the filter name
	 * @param property the property
	 */
	public void assignConditionalOperator(final String filterName, final Property property) {
		final Type type = property.getType();
		if (type instanceof LongType || type instanceof IntegerType || type instanceof FloatType
				|| type instanceof DoubleType || type instanceof ShortType) {
			conditionalOperator = findIntegerOperator(filterName);
		} else if (type instanceof StringType) {
			conditionalOperator = findStringOperator(filterName);
		} else if (type instanceof DateType) {
			conditionalOperator = findDateOperator(filterName);
		} else {
			conditionalOperator = findOtherOperator(filterName);
		}
	}

	/**
	 * Find integer operator.
	 *
	 * @param filterName the filter name
	 * @return the string
	 */
	public String findIntegerOperator(final String filterName) {
		if (filterName.endsWith(FilterConstants.GREATER_THAN_EQUAL_SHORT_NAME)) {
			return FilterConstants.GREATER_THAN_EQUAL_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.LESSER_THAN_EQUAL_SHORT_NAME)) {
			return FilterConstants.LESSER_THAN_EQUAL_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.NOT_EQUALS_SHORT_NAME)) {
			return FilterConstants.NOT_EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.EQUALS_SHORT_NAME)) {
			return FilterConstants.EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.GREATER_THAN_SHORT_NAME)) {
			return FilterConstants.GREATER_THAN_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.LESSER_THAN_SHORT_NAME)) {
			return FilterConstants.LESSER_THAN_FULL_NAME;
		}
		return null;

	}

	/**
	 * Find string operator.
	 *
	 * @param filterName the filter name
	 * @return the string
	 */
	public String findStringOperator(final String filterName) {
		if (filterName.endsWith(FilterConstants.NOT_EQUALS_SHORT_NAME)) {
			return FilterConstants.NOT_EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.EQUALS_SHORT_NAME)) {
			return FilterConstants.EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.NOT_LIKE_SHORT_NAME)) {
			return FilterConstants.NOT_LIKE_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.LIKE_SHORT_NAME)) {
			return FilterConstants.LIKE_FULL_NAME;
		}

		return null;
	}

	/**
	 * Find date operator.
	 *
	 * @param filterName the filter name
	 * @return the string
	 */
	public String findDateOperator(final String filterName) {
		if (filterName.endsWith(FilterConstants.GREATER_THAN_EQUAL_SHORT_NAME)) {
			return FilterConstants.GREATER_THAN_EQUAL_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.LESSER_THAN_EQUAL_SHORT_NAME)) {
			return FilterConstants.LESSER_THAN_EQUAL_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.NOT_EQUALS_SHORT_NAME)) {
			return FilterConstants.NOT_EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.EQUALS_SHORT_NAME)) {
			return FilterConstants.EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.GREATER_THAN_SHORT_NAME)) {
			return FilterConstants.GREATER_THAN_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.LESSER_THAN_SHORT_NAME)) {
			return FilterConstants.LESSER_THAN_FULL_NAME;
		}
		/*
		 * else if(filterName.endsWith(FilterConstants.BETWEEN_SHORT_NAME)){
		 * return FilterConstants.BETWEEN_FULL_NAME; }
		 */
		return null;
	}

	/**
	 * Find other operator.
	 *
	 * @param filterName the filter name
	 * @return the string
	 */
	public String findOtherOperator(final String filterName) {
		if (filterName.endsWith(FilterConstants.GREATER_THAN_EQUAL_SHORT_NAME)) {
			return FilterConstants.GREATER_THAN_EQUAL_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.LESSER_THAN_EQUAL_SHORT_NAME)) {
			return FilterConstants.LESSER_THAN_EQUAL_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.NOT_EQUALS_SHORT_NAME)) {
			return FilterConstants.NOT_EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.EQUALS_SHORT_NAME)) {
			return FilterConstants.EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.GREATER_THAN_SHORT_NAME)) {
			return FilterConstants.GREATER_THAN_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.LESSER_THAN_SHORT_NAME)) {
			return FilterConstants.LESSER_THAN_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.NOT_EQUALS_SHORT_NAME)) {
			return FilterConstants.NOT_EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.EQUALS_SHORT_NAME)) {
			return FilterConstants.EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.NOT_LIKE_SHORT_NAME)) {
			return FilterConstants.NOT_LIKE_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.LIKE_SHORT_NAME)) {
			return FilterConstants.LIKE_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.GREATER_THAN_EQUAL_SHORT_NAME)) {
			return FilterConstants.GREATER_THAN_EQUAL_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.LESSER_THAN_EQUAL_SHORT_NAME)) {
			return FilterConstants.LESSER_THAN_EQUAL_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.NOT_EQUALS_SHORT_NAME)) {
			return FilterConstants.NOT_EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.EQUALS_SHORT_NAME)) {
			return FilterConstants.EQUALS_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.GREATER_THAN_SHORT_NAME)) {
			return FilterConstants.GREATER_THAN_FULL_NAME;
		} else if (filterName.endsWith(FilterConstants.LESSER_THAN_SHORT_NAME)) {
			return FilterConstants.LESSER_THAN_FULL_NAME;
		}
		/*
		 * else if(filterName.endsWith(FilterConstants.BETWEEN_SHORT_NAME)){
		 * return FilterConstants.BETWEEN_FULL_NAME; }
		 */
		return null;
	}

	/**
	 * Gets the filter definition.
	 *
	 * @return the filter definition
	 */
	public FilterDefinition getFilterDefinition() {
		return filterDefinition;
	}

	/**
	 * Sets the filter definition.
	 *
	 * @param filterDefinition the new filter definition
	 */
	public void setFilterDefinition(final FilterDefinition filterDefinition) {
		this.filterDefinition = filterDefinition;
	}

	/**
	 * Gets the filter name.
	 *
	 * @return the filter name
	 */
	public String getFilterName() {
		return filterName;
	}

	/**
	 * Sets the filter name.
	 *
	 * @param filterName the new filter name
	 */
	public void setFilterName(final String filterName) {
		this.filterName = filterName;
	}

	/**
	 * Gets the conditional operator.
	 *
	 * @return the conditional operator
	 */
	public String getConditionalOperator() {
		return conditionalOperator;
	}

	/**
	 * Sets the conditional operator.
	 *
	 * @param conditionalOperator the new conditional operator
	 */
	public void setConditionalOperator(final String conditionalOperator) {
		this.conditionalOperator = conditionalOperator;
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
