package com.nexteducation.NextRewards.module.model.enums;

public enum LoginType {

	STAFF(0), STUDENT(1);

	private int val;

	LoginType(final int val) {
		this.val = val;
	}

	public int getVal() {
		return val;
	}

	public void setVal(final byte val) {
		this.val = val;
	}

	public int getOrdinal() {
		return this.ordinal();
	}

	public String getName() {
		return this.name();
	}

	public static LoginType valueOf(final int val) {
		for (final LoginType loginType : values()) {
			if (loginType.val == val) {
				return loginType;
			}
		}
		throw new IllegalArgumentException(String.valueOf(val));
	}

}
