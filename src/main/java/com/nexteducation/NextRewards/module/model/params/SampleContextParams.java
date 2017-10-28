package com.nexteducation.NextRewards.module.model.params;

import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;

/**
 * The Class SampleContextParams.
 */
public class SampleContextParams {

	/** The Long. */
	@QueryParam("Long")
	String Long;

	/** The path long. */
	@PathParam("pathLong")
	String pathLong;

	/**
	 * Gets the long.
	 *
	 * @return the long
	 */
	public String getLong() {
		return Long;
	}

	/**
	 * Sets the long.
	 *
	 * @param Long the new long
	 */
	public void setLong(String Long) {
		this.Long = Long;
	}

	/**
	 * Gets the path long.
	 *
	 * @return the path long
	 */
	public String getPathLong() {
		return pathLong;
	}

	/**
	 * Sets the path long.
	 *
	 * @param pathLong the new path long
	 */
	public void setPathLong(String pathLong) {
		this.pathLong = pathLong;
	}

	/** 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "SampleContextParams [" + (Long != null ? "Long=" + Long + ", " : "")
				+ (pathLong != null ? "pathLong=" + pathLong : "") + "]";
	}

}
