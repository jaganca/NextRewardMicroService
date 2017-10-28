package com.nexteducation.NextRewards.hibernate.datasourceRouting;

/**
 * The Class DbContextHolder.
 *
 * @author krishnakanthv
 */
public class DbContextHolder {

	/** The Constant contextHolder. */
	private static final ThreadLocal<DbType> contextHolder = new ThreadLocal<DbType>();

	/**
	 * Sets the db type.
	 *
	 * @param dbType the new db type
	 */
	public static void setDbType(final DbType dbType) {
		if (dbType == null) {
			throw new NullPointerException();
		}
		contextHolder.set(dbType);
	}

	/**
	 * Gets the db type.
	 *
	 * @return the db type
	 */
	public static DbType getDbType() {
		return contextHolder.get();
	}

	/**
	 * Clear db type.
	 */
	public static void clearDbType() {
		contextHolder.remove();
	}
}