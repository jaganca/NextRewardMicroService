package com.nexteducation.NextRewards.module.filter.queryable;

import java.util.List;

/**
 * The Class Queryable.
 */
class Queryable {
	
	/** The pageable. */
	Pageable pageable;
	
	/** The filterable. */
	Filterable filterable;
	
	/** The sortables. */
	List<Sortable> sortables;

	/**
	 * Gets the pageable.
	 *
	 * @return the pageable
	 */
	public Pageable getPageable() {
		return pageable;
	}

	/**
	 * Sets the pageable.
	 *
	 * @param pageable the new pageable
	 */
	public void setPageable(Pageable pageable) {
		this.pageable = pageable;
	}

	/**
	 * Gets the filterable.
	 *
	 * @return the filterable
	 */
	public Filterable getFilterable() {
		return filterable;
	}

	/**
	 * Sets the filterable.
	 *
	 * @param filterable the new filterable
	 */
	public void setFilterable(Filterable filterable) {
		this.filterable = filterable;
	}

	/**
	 * Gets the sortables.
	 *
	 * @return the sortables
	 */
	public List<Sortable> getSortables() {
		return sortables;
	}

	/**
	 * Sets the sortables.
	 *
	 * @param sortables the new sortables
	 */
	public void setSortables(List<Sortable> sortables) {
		this.sortables = sortables;
	}

}