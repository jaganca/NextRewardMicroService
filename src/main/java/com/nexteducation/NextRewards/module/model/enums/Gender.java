package com.nexteducation.NextRewards.module.model.enums;

/**
 * The Enum Gender.
 */
public enum Gender {

	/** The Female. */
	Female(1, "Female"),
	/** The Male. */
	Male(2, "Male"),
	/** The Others. */
	Others(3, "Others");

	/** The val. */
	private int val;

	/** The gender. */
	private String gender;

	/**
	 * Gets the val.
	 *
	 * @return the val
	 */
	public int getVal() {
		return val;
	}

	/**
	 * Sets the val.
	 *
	 * @param val the new val
	 */
	public void setVal(final int val) {
		this.val = val;
	}

	/**
	 * Gets the gender.
	 *
	 * @return the gender
	 */
	public String getGender() {
		return gender;
	}

	/**
	 * Sets the gender.
	 *
	 * @param gender the new gender
	 */
	public void setGender(String gender) {
		this.gender = gender;
	}

	/**
	 * Instantiates a new gender.
	 *
	 * @param val the val
	 * @param gender the gender
	 */
	Gender(final int val, final String gender) {
		this.val = val;
		this.gender = gender;
	}

	/**
	 * Gets the ordinal.
	 *
	 * @return the ordinal
	 */
	public int getOrdinal() {
		return this.ordinal();
	}

	/**
	 * Gets the name.
	 *
	 * @return the name
	 */
	public String getName() {
		return this.name();
	}

	/**
	 * Value of.
	 *
	 * @param val the val
	 * @return the gender
	 */
	public static Gender valueOf(final byte val) {
		for (final Gender value : values()) {
			if (value.val == val) {
				return value;
			}
		}
		throw new IllegalArgumentException(String.valueOf(val));
	}

}
