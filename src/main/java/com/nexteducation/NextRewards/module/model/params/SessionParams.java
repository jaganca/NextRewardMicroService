package com.nexteducation.NextRewards.module.model.params;

import javax.ws.rs.QueryParam;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * Fixed Fields.
 *
 * @author ashishpratap
 */
public class SessionParams {

	/** The branch id. */
	@NotEmpty(message = "Session Parameters: Branch is invalid!")
	@QueryParam("lbid")
	Long branchId;

	/** The academic session id. */
	@NotEmpty(message = "Session Parameters: Academic Session is invalid!")
	@QueryParam("lasid")
	Long academicSessionId;

	/** The user id. */
	@NotEmpty(message = "Session Parameters: User is invalid!")
	@QueryParam("luid")
	Long userId;

	/**
	 * Gets the branch id.
	 *
	 * @return the branch id
	 */
	public Long getBranchId() {
		return branchId;
	}

	/**
	 * Sets the branch id.
	 *
	 * @param branchId the new branch id
	 */
	public void setBranchId(Long branchId) {
		this.branchId = branchId;
	}

	/**
	 * Gets the academic session id.
	 *
	 * @return the academic session id
	 */
	public Long getAcademicSessionId() {
		return academicSessionId;
	}

	/**
	 * Sets the academic session id.
	 *
	 * @param academicSessionId the new academic session id
	 */
	public void setAcademicSessionId(Long academicSessionId) {
		this.academicSessionId = academicSessionId;
	}

	/**
	 * Gets the user id.
	 *
	 * @return the user id
	 */
	public Long getUserId() {
		return userId;
	}

	/**
	 * Sets the user id.
	 *
	 * @param userId the new user id
	 */
	public void setUserId(Long userId) {
		this.userId = userId;
	}

}
