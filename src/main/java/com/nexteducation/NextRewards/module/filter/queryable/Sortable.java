package com.nexteducation.NextRewards.module.filter.queryable;

/**
 * The Class Sortable.
 */
class Sortable {
	
	/** The Field. */
	String Field;
	
	/** The operator. */
	SortableOperator operator;

	/**
	 * Gets the field.
	 *
	 * @return the field
	 */
	public String getField() {
		return Field;
	}

	/**
	 * Sets the field.
	 *
	 * @param field the new field
	 */
	public void setField(String field) {
		Field = field;
	}

	/**
	 * Gets the operator.
	 *
	 * @return the operator
	 */
	public SortableOperator getOperator() {
		return operator;
	}

	/**
	 * Sets the operator.
	 *
	 * @param operator the new operator
	 */
	public void setOperator(SortableOperator operator) {
		this.operator = operator;
	}

}