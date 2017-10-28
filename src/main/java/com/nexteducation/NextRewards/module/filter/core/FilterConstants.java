package com.nexteducation.NextRewards.module.filter.core;

/**
 * The Class FilterConstants.
 */
public class FilterConstants {

	/** The Constant GREATER_THAN. */
	public static final String GREATER_THAN = ">";

	/** The Constant GREATER_THAN_SHORT_NAME. */
	public static final String GREATER_THAN_SHORT_NAME = "gt";

	/** The Constant GREATER_THAN_FULL_NAME. */
	public static final String GREATER_THAN_FULL_NAME = "Greater Than";

	/** The Constant LESSER_THAN. */
	public static final String LESSER_THAN = "<";

	/** The Constant LESSER_THAN_FULL_NAME. */
	public static final String LESSER_THAN_FULL_NAME = "Lesser Than";

	/** The Constant LESSER_THAN_SHORT_NAME. */
	public static final String LESSER_THAN_SHORT_NAME = "lt";

	/** The Constant GREATER_THAN_EQUAL. */
	public static final String GREATER_THAN_EQUAL = ">=";

	/** The Constant GREATER_THAN_EQUAL_FULL_NAME. */
	public static final String GREATER_THAN_EQUAL_FULL_NAME = "Greater Than or Equals";

	/** The Constant GREATER_THAN_EQUAL_SHORT_NAME. */
	public static final String GREATER_THAN_EQUAL_SHORT_NAME = "ge";

	/** The Constant LESSER_THAN_EQUAL. */
	public static final String LESSER_THAN_EQUAL = "<=";

	/** The Constant LESSER_THAN_EQUAL_FULL_NAME. */
	public static final String LESSER_THAN_EQUAL_FULL_NAME = "Lesser Than or Equals";

	/** The Constant LESSER_THAN_EQUAL_SHORT_NAME. */
	public static final String LESSER_THAN_EQUAL_SHORT_NAME = "le";

	/** The Constant EQUALS. */
	public static final String EQUALS = "=";

	/** The Constant EQUALS_FULL_NAME. */
	public static final String EQUALS_FULL_NAME = "Is";

	/** The Constant EQUALS_SHORT_NAME. */
	public static final String EQUALS_SHORT_NAME = "eq";

	/** The Constant NUMERIC_GREATER_THAN. */
	public static final String NUMERIC_GREATER_THAN = ">";

	/** The Constant NUMERIC_GREATER_THAN_SHORT_NAME. */
	public static final String NUMERIC_GREATER_THAN_SHORT_NAME = "num_gt";

	/** The Constant NUMERIC_GREATER_THAN_FULL_NAME. */
	public static final String NUMERIC_GREATER_THAN_FULL_NAME = "Greater Than";

	/** The Constant NUMERIC_LESSER_THAN. */
	public static final String NUMERIC_LESSER_THAN = "<";

	/** The Constant NUMERIC_LESSER_THAN_FULL_NAME. */
	public static final String NUMERIC_LESSER_THAN_FULL_NAME = "Lesser Than";

	/** The Constant NUMERIC_LESSER_THAN_SHORT_NAME. */
	public static final String NUMERIC_LESSER_THAN_SHORT_NAME = "num_lt";

	/** The Constant NUMERIC_GREATER_THAN_EQUAL. */
	public static final String NUMERIC_GREATER_THAN_EQUAL = ">=";

	/** The Constant NUMERIC_GREATER_THAN_EQUAL_FULL_NAME. */
	public static final String NUMERIC_GREATER_THAN_EQUAL_FULL_NAME = "Greater Than or Equals";

	/** The Constant NUMERIC_GREATER_THAN_EQUAL_SHORT_NAME. */
	public static final String NUMERIC_GREATER_THAN_EQUAL_SHORT_NAME = "num_ge";

	/** The Constant NUMERIC_LESSER_THAN_EQUAL. */
	public static final String NUMERIC_LESSER_THAN_EQUAL = "<=";

	/** The Constant NUMERIC_LESSER_THAN_EQUAL_FULL_NAME. */
	public static final String NUMERIC_LESSER_THAN_EQUAL_FULL_NAME = "Lesser Than or Equals";

	/** The Constant NUMERIC_LESSER_THAN_EQUAL_SHORT_NAME. */
	public static final String NUMERIC_LESSER_THAN_EQUAL_SHORT_NAME = "num_le";

	/** The Constant NUMERIC_EQUALS. */
	public static final String NUMERIC_EQUALS = "=";

	/** The Constant NUMERIC_EQUALS_FULL_NAME. */
	public static final String NUMERIC_EQUALS_FULL_NAME = "Is";

	/** The Constant NUMERIC_EQUALS_SHORT_NAME. */
	public static final String NUMERIC_EQUALS_SHORT_NAME = "num_eq";

	/** The Constant NOT_EQUALS_1. */
	public static final String NOT_EQUALS_1 = "!=";

	/** The Constant NOT_EQUALS_FULL_NAME. */
	public static final String NOT_EQUALS_FULL_NAME = "Is Not";

	/** The Constant NOT_EQUALS_SHORT_NAME. */
	public static final String NOT_EQUALS_SHORT_NAME = "ne";

	/** The Constant NUMERIC_NOT_EQUALS_1. */
	public static final String NUMERIC_NOT_EQUALS_1 = "!=";

	/** The Constant NUMERIC_NOT_EQUALS_FULL_NAME. */
	public static final String NUMERIC_NOT_EQUALS_FULL_NAME = "Is Not";

	/** The Constant NUMERIC_NOT_EQUALS_SHORT_NAME. */
	public static final String NUMERIC_NOT_EQUALS_SHORT_NAME = "num_ne";

	/** The Constant NOT_EQUALS_2. */
	public static final String NOT_EQUALS_2 = "<>";

	/** The Constant LIKE. */
	public static final String LIKE = "LIKE";

	/** The Constant LIKE_FULL_NAME. */
	public static final String LIKE_FULL_NAME = "Contains";

	/** The Constant LIKE_SHORT_NAME. */
	public static final String LIKE_SHORT_NAME = "lk";

	/** The Constant NOT_LIKE. */
	public static final String NOT_LIKE = "NOT LIKE";

	/** The Constant NOT_LIKE_SHORT_NAME. */
	public static final String NOT_LIKE_SHORT_NAME = "nl";

	/** The Constant NOT_LIKE_FULL_NAME. */
	public static final String NOT_LIKE_FULL_NAME = "Not Contains";

	/** The Constant BETWEEN. */
	public static final String BETWEEN = "BETWEEN";

	/*
	 * public static final String BETWEEN_SHORT_NAME = "bw";
	 * 
	 * public static final String BETWEEN_FULL_NAME = "Ranges Between";
	 */

	/** The Constant AND. */
	public static final String AND = "AND";

	/** The Constant NUMERIC_OPERATORS. */
	public static final String[] NUMERIC_OPERATORS = { GREATER_THAN_EQUAL, LESSER_THAN_EQUAL, NUMERIC_NOT_EQUALS_1,
			GREATER_THAN, LESSER_THAN, NUMERIC_EQUALS };

	/** The Constant STRING_OPERATORS. */
	public static final String[] STRING_OPERATORS = { EQUALS, NOT_EQUALS_1, LIKE, NOT_LIKE };

	/** The Constant DATE_OPERATORS. */
	public static final String[] DATE_OPERATORS = { GREATER_THAN_EQUAL, LESSER_THAN_EQUAL, NOT_EQUALS_1, GREATER_THAN,
			LESSER_THAN, EQUALS, BETWEEN };

	/** The Constant NUMERIC_OPERATORS_SN. */
	public static final String[] NUMERIC_OPERATORS_SN = { NUMERIC_GREATER_THAN_EQUAL_SHORT_NAME,
			NUMERIC_LESSER_THAN_EQUAL_SHORT_NAME, NUMERIC_NOT_EQUALS_SHORT_NAME, NUMERIC_GREATER_THAN_SHORT_NAME,
			NUMERIC_LESSER_THAN_SHORT_NAME, NUMERIC_EQUALS_SHORT_NAME };

	/** The Constant STRING_OPERATORS_SN. */
	public static final String[] STRING_OPERATORS_SN = { EQUALS_SHORT_NAME, NOT_EQUALS_SHORT_NAME, LIKE_SHORT_NAME,
			NOT_LIKE_SHORT_NAME };

	/** The Constant DATE_OPERATORS_SN. */
	public static final String[] DATE_OPERATORS_SN = { GREATER_THAN_EQUAL_SHORT_NAME, LESSER_THAN_EQUAL_SHORT_NAME,
			NOT_EQUALS_SHORT_NAME, GREATER_THAN_SHORT_NAME, LESSER_THAN_SHORT_NAME, EQUALS_SHORT_NAME };

	/**
	 * Gets the short name.
	 *
	 * @param operator the operator
	 * @return the short name
	 */
	public static String getShortName(final String operator) {
		if (operator.equals(GREATER_THAN)) {
			return GREATER_THAN_SHORT_NAME;
		} else if (operator.equals(LESSER_THAN)) {
			return LESSER_THAN_SHORT_NAME;
		} else if (operator.equals(GREATER_THAN_EQUAL)) {
			return GREATER_THAN_EQUAL_SHORT_NAME;
		} else if (operator.equals(LESSER_THAN_EQUAL)) {
			return LESSER_THAN_EQUAL_SHORT_NAME;
		} else if (operator.equals(EQUALS)) {
			return EQUALS_SHORT_NAME;
		} else if (operator.equals(NOT_EQUALS_1) || operator.equals(NOT_EQUALS_2)) {
			return NOT_EQUALS_SHORT_NAME;
		} else if (operator.equalsIgnoreCase(LIKE)) {
			return LIKE_SHORT_NAME;
		} else if (operator.equalsIgnoreCase(NOT_LIKE)) {
			return NOT_LIKE_SHORT_NAME;
		}
		/*
		 * else if(operator.equalsIgnoreCase(BETWEEN)){ return
		 * BETWEEN_SHORT_NAME; }
		 */
		return null;
	}

	/**
	 * Gets the operators.
	 *
	 * @param shortName the short name
	 * @return the operators
	 */
	public static String getOperators(final String shortName) {
		if (shortName.equals(NUMERIC_GREATER_THAN_SHORT_NAME)) {
			return NUMERIC_GREATER_THAN;
		} else if (shortName.equals(NUMERIC_LESSER_THAN_SHORT_NAME)) {
			return NUMERIC_LESSER_THAN;
		} else if (shortName.equals(NUMERIC_GREATER_THAN_EQUAL_SHORT_NAME)) {
			return NUMERIC_GREATER_THAN_EQUAL;
		} else if (shortName.equals(NUMERIC_LESSER_THAN_EQUAL_SHORT_NAME)) {
			return NUMERIC_LESSER_THAN_EQUAL;
		} else if (shortName.equals(NUMERIC_EQUALS_SHORT_NAME)) {
			return NUMERIC_EQUALS;
		} else if (shortName.equals(NUMERIC_NOT_EQUALS_SHORT_NAME)) {
			return NUMERIC_NOT_EQUALS_1;
		} else if (shortName.equals(EQUALS_SHORT_NAME)) {
			return EQUALS;
		} else if (shortName.equals(NOT_EQUALS_SHORT_NAME)) {
			return NOT_EQUALS_1;
		} else if (shortName.equalsIgnoreCase(LIKE_SHORT_NAME)) {
			return LIKE;
		} else if (shortName.equalsIgnoreCase(NOT_LIKE_SHORT_NAME)) {
			return NOT_LIKE;
		}
		/*
		 * else if(shortName.equalsIgnoreCase(BETWEEN_SHORT_NAME)){ return
		 * BETWEEN; }
		 */
		if (shortName.equals(GREATER_THAN_SHORT_NAME)) {
			return GREATER_THAN;
		} else if (shortName.equals(LESSER_THAN_SHORT_NAME)) {
			return LESSER_THAN;
		} else if (shortName.equals(GREATER_THAN_EQUAL_SHORT_NAME)) {
			return GREATER_THAN_EQUAL;
		} else if (shortName.equals(LESSER_THAN_EQUAL_SHORT_NAME)) {
			return LESSER_THAN_EQUAL;
		}
		return null;
	}

}
