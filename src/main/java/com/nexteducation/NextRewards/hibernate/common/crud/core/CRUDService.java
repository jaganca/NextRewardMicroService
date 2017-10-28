package com.nexteducation.NextRewards.hibernate.common.crud.core;

import java.util.List;

/**
 * The Interface CRUDService.
 *
 * @author ashishpratap
 * @param <T> the generic type
 * @param <E> the element type
 */
public interface CRUDService<T, E> {

	/**
	 * Saves the.
	 *
	 * @param obj the obj
	 * @return the t
	 */
	T save(T obj);

	/**
	 * Delete.
	 *
	 * @param obj the obj
	 */
	void delete(T obj);

	/**
	 * Update.
	 *
	 * @param obj the obj
	 * @return the t
	 */
	T update(T obj);

	/**
	 * Find by id.
	 *
	 * @param id the id
	 * @return the t
	 */
	T findById(E id);

	/**
	 * Find all.
	 *
	 * @param obj the obj
	 * @return the list
	 */
	List<T> findAll(Class<T> obj);

	/**
	 * Count.
	 *
	 * @param obj the obj
	 * @return the int
	 */
	int count(Class<T> obj);
}
