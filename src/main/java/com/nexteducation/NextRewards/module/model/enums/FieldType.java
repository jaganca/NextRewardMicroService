package com.nexteducation.NextRewards.module.model.enums;

/**
 * The Enum FieldType.
 */
public enum FieldType {

	/** The Checkbox. */
	Checkbox("checkbox"),
	/** The Color. */
	Color("color"),
	/** The Date. */
	Date("date"),
	/** The Datetime. */
	Datetime("datetime"),
	/** The Email. */
	Email("email"),
	/** The File. */
	File("file"),
	/** The Hidden. */
	Hidden("hidden"),
	/** The Image. */
	Image("image"),
	/** The List. */
	List("list"),
	/** The Multi select. */
	MultiSelect("multiselect"),
	/** The Number. */
	Number("number"),
	/** The Password. */
	Password("password"),
	/** The Paragraph. */
	Paragraph("paragraph"),
	/** The Radio. */
	Radio("radio"),
	/** The Range. */
	Range("range"),
	/** The Text. */
	Text("text"),
	/** The Time. */
	Time("time"),
	/** The Url. */
	Url("url");

	/** The field type. */
	private String fieldType;

	/**
	 * Instantiates a new field type.
	 *
	 * @param fieldType the field type
	 */
	FieldType(final String fieldType) {
		this.fieldType = fieldType;
	}

	/**
	 * Gets the field type.
	 *
	 * @return the field type
	 */
	public String getFieldType() {
		return fieldType;
	}

	/**
	 * Sets the field type.
	 *
	 * @param fieldType the new field type
	 */
	public void setFieldType(String fieldType) {
		this.fieldType = fieldType;
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
	 * @return the field type
	 */
	public static FieldType valueOf(final byte val) {
		for (final FieldType customFieldType : values()) {
			if (customFieldType.getOrdinal() == val) {
				return customFieldType;
			}
		}
		throw new IllegalArgumentException(String.valueOf(val));
	}

	/**
	 * From string.
	 *
	 * @param val the val
	 * @return the field type
	 */
	public static FieldType fromString(final String val) {
		for (final FieldType customFieldType : values()) {
			if (customFieldType.getFieldType().equalsIgnoreCase(val)) {
				return customFieldType;
			}
		}
		return null;
	}
}
