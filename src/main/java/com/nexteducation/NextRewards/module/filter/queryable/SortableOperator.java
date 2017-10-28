package com.nexteducation.NextRewards.module.filter.queryable;

/**
 * The Enum SortableOperator.
 */
enum SortableOperator {
	
	/** The Descending. */
	Descending(-1), 
 /** The Ascending. */
 Ascending(1);
	
	/** The value. */
	int value;

	/**
	 * Instantiates a new sortable operator.
	 *
	 * @param value the value
	 */
	SortableOperator(int value) {
		this.value = value;
	}

	/**
	 * Gets the value.
	 *
	 * @return the value
	 */
	public int getValue() {
		return value;
	}

	/**
	 * Sets the value.
	 *
	 * @param value the new value
	 */
	public void setValue(int value) {
		this.value = value;
	}

}