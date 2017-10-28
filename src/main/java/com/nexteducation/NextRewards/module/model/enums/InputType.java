package com.nexteducation.NextRewards.module.model.enums;

/**
 * The Enum InputType.
 */
public enum InputType {
	/*Input("input"), Textarea("textarea"), Select("select");*/

	/** The String. */
	String("string"),
	/** The Number. */
	Number("number");

	/** The input type. */
	private String inputType;

	/**
	 * Instantiates a new input type.
	 *
	 * @param inputType the input type
	 */
	InputType(final String inputType) {
		this.inputType = inputType;
	}

	/**
	 * Gets the input type.
	 *
	 * @return the input type
	 */
	public String getInputType() {
		return inputType;
	}

	/**
	 * Sets the input type.
	 *
	 * @param inputType the new input type
	 */
	public void setInputType(String inputType) {
		this.inputType = inputType;
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
	 * @return the input type
	 */
	public static InputType valueOf(final byte val) {
		for (final InputType customFieldType : values()) {
			if (customFieldType.getOrdinal() == val) {
				return customFieldType;
			}
		}
		throw new IllegalArgumentException();
	}
}