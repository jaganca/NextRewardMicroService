package com.nexteducation.NextRewards.module.model.enums;

/**
 * The Enum Type.
 */
public enum Type {

	/** The Voucher no. */
	/*EnrollmentNo,*/
	VoucherNo,

	/** The Admission registration no. */
	AdmissionRegistrationNo,

	/** The Receipt no. */
	ReceiptNo,

	/** The Accession no. */
	AccessionNo,

	/** The Resource no. */
	ResourceNo,

	/** The Letter format no. */
	LetterFormatNo,

	/** The Bank ref no. */
	BankRefNo,

	/** The Leave pass no. */
	LeavePassNo,

	/** The Admission step. */
	AdmissionStep,

	/** The Challan no. */
	ChallanNo,

	/** The Item no. */
	ItemNo,

	/** The Purchase order no. */
	PurchaseOrderNo,

	/** The Inventory receipts no. */
	InventoryReceiptsNo,

	/** The Lib membership no. */
	LibMembershipNo,

	/** The employee id. */
	employeeId,

	/** The Enquiry no. */
	EnquiryNo,

	/** The Ledger code. */
	Ledger_Code,

	/** The Group code. */
	Group_Code,

	/** The Admission online fee payment. */
	AdmissionOnlineFeePayment,

	/** The Visitor pass. */
	VisitorPass;

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
	 * Checks for sub type.
	 *
	 * @return true, if successful
	 */
	public boolean hasSubType() {
		if (this.ordinal() == 1) {
			return true;
		}
		return false;
	}
};
