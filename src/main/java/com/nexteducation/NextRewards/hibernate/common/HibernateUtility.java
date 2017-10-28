package com.nexteducation.NextRewards.hibernate.common;

import java.util.List;

import org.hibernate.Cache;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.proxy.HibernateProxy;
import org.hibernate.proxy.LazyInitializer;


/**
 * Utility methods for Hibernate !.
 *
 * @author Naveenkumara
 */
public class HibernateUtility {


	/**
	 * Clears complete second level cache.
	 *
	 * @param sessionFactory the session factory
	 */
	public static final void clearAllCache(SessionFactory sessionFactory){
		final Cache cache = sessionFactory.getCache();
		cache.evictEntityRegions();
		cache.evictCollectionRegions();
		cache.evictDefaultQueryRegion();
		cache.evictQueryRegions();
		/*cache.evictNaturalIdRegions();*/
	}

	/**
	 * Clears Second level cache for given Entity !.
	 *
	 * @param <T> the generic type
	 * @param clazz the clazz
	 * @param sessionFactory the session factory
	 */
	public static final <T> void clearCacheFor(final Class<T> clazz,final SessionFactory sessionFactory){
		final ClassMetadata meta = sessionFactory.getClassMetadata(clazz);
		if(meta == null) {
			return;
		}
		final Cache cache = sessionFactory.getCache();
		cache.evictEntityRegion(clazz);
		sessionFactory.getCurrentSession().clear();
	}

	/**
	 * Batch update to save list of entities !.
	 *
	 * @param <T> the generic type
	 * @param listOfEntitiesToBeSaved the list of entities to be saved
	 * @param sessionFactory the session factory
	 */
	@SuppressWarnings("deprecation")
	public static final <T> void batchSaveOrUpdateEntities(final List<T> listOfEntitiesToBeSaved,final SessionFactory sessionFactory){
		if(listOfEntitiesToBeSaved != null && !listOfEntitiesToBeSaved.isEmpty()){
			final Session session = sessionFactory.getCurrentSession();
			final int jdbcBatchSize = ((SessionFactoryImplementor)sessionFactory).getSettings().getJdbcBatchSize();
			final int count = 0;
			for(final T objectToSave:listOfEntitiesToBeSaved){
				if(objectToSave == null) {
					continue;
				}
				final ClassMetadata meta = sessionFactory.getClassMetadata(objectToSave.getClass());
				if(meta == null) {
					break;
				}
				session.saveOrUpdate(objectToSave);
				if(count % jdbcBatchSize == 0 || count == listOfEntitiesToBeSaved.size() -1){
					session.flush();
					session.clear();
				}
			}
		}
	}
	
	/**
	 * Deproxy.
	 *
	 * @param <T> the generic type
	 * @param obj the obj
	 * @return the t
	 */
	@SuppressWarnings("unchecked")
	public static <T>  T deproxy (final T obj) {
		if (obj == null) {
			return obj;
		}
		if (obj instanceof HibernateProxy) {
			// Unwrap Proxy;
			//      -- loading, if necessary.
			final HibernateProxy proxy = (HibernateProxy) obj;
			final LazyInitializer li = proxy.getHibernateLazyInitializer();
			return (T)  li.getImplementation();
		}
		return obj;
	}
	
	/**
	 * Checks if is proxy.
	 *
	 * @param obj the obj
	 * @return true, if is proxy
	 */
	public static boolean isProxy (final Object obj) {
		if (obj instanceof HibernateProxy) {
			return true;
		}
		return false;
	}
	
	/**
	 * Checks if is equal.
	 *
	 * @param o1 the o 1
	 * @param o2 the o 2
	 * @return true, if is equal
	 */
	// ----------------------------------------------------------------------------------
	public static boolean isEqual (final Object o1, final Object o2) {
		if (o1 == o2) {
			return true;
		}
		if (o1 == null || o2 == null) {
			return false;
		}
		final Object d1 = deproxy(o1);
		final Object d2 = deproxy(o2);
		if (d1 == d2 || d1.equals(d2)) {
			return true;
		}
		return false;
	}
	
	/**
	 * Not equal.
	 *
	 * @param o1 the o 1
	 * @param o2 the o 2
	 * @return true, if successful
	 */
	public static boolean notEqual (final Object o1, final Object o2) {
		return ! isEqual( o1, o2);
	}
	
	/**
	 * Checks if is same.
	 *
	 * @param o1 the o 1
	 * @param o2 the o 2
	 * @return true, if is same
	 */
	// ----------------------------------------------------------------------------------
	public static boolean isSame (final Object o1, final Object o2) {
		if (o1 == o2) {
			return true;
		}
		if (o1 == null || o2 == null) {
			return false;
		}
		final Object d1 = deproxy(o1);
		final Object d2 = deproxy(o2);
		if (d1 == d2) {
			return true;
		}
		return false;
	}
	
	/**
	 * Not same.
	 *
	 * @param o1 the o 1
	 * @param o2 the o 2
	 * @return true, if successful
	 */
	public static boolean notSame (final Object o1, final Object o2) {
		return ! isSame( o1, o2);
	}
	
	/**
	 * Gets the class without initializing proxy.
	 *
	 * @param obj the obj
	 * @return the class without initializing proxy
	 */
	// ----------------------------------------------------------------------------------
	@SuppressWarnings("rawtypes")
	public static Class getClassWithoutInitializingProxy (final Object obj) {
		if (obj instanceof HibernateProxy) {
			final HibernateProxy proxy = (HibernateProxy) obj;
			final LazyInitializer li = proxy.getHibernateLazyInitializer();
			return li.getPersistentClass();
		}
		// Not a Proxy.
		return obj.getClass();
	}
}

