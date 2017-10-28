package com.nexteducation.NextRewards.util;

import java.util.Arrays;
import java.util.List;

public interface Constants {

	/* ########## Module Name ########## */
	public static String MODULE_NAME = "NextRewards";

	/* ########## Error Codes ########## */
	public static String ERROR_400 = "Bad Request";
	public static String ERROR_401 = "Unauthorized";
	public static String ERROR_402 = "Payment Required";
	public static String ERROR_403 = "Forbidden";
	public static String ERROR_404 = "Not Found";
	public static String ERROR_500 = "Internal Server Error";

	/* ########## Common Codes ########## */
	public static String FAILURE = "Failure";
	public static String INVALID_IDENTIFIER = "No Record Found With The Given Identifier";
	public static String MASTER_DATA_DELETE = "Master Data cannot be deleted";
	public static String RECORD_NOT_FOUND = "Record Not Found";
	public static String RECORDS_INSERTED = "Records Inserted Successfully";
	public static String RECORDS_NOT_INSERTED = "Records Not Inserted";
	public static String RECORDS_DELETED = "Records Deleted Successfully";
	public static String RECORDS_UPDATED = "Records Updated Successfully";
	public static String SUCCESS = "Success";

	public static List<String> getFormNames(String entityName) {
		switch (entityName) {
		case "Student":
			return Arrays.asList("StudentForm", "Student360Form");
		case "Staff":
			return Arrays.asList("StaffForm");
		case "Parent":
			return Arrays.asList("StudentForm", "Student360Form");
		case "Library Holding":
		case "LibraryHolding":
			return Arrays.asList("LibraryHoldingForm");
		case "AdmissionStudent":
			return Arrays.asList("AdmissionStudentForm");
		default:
			return null;
		}
	}

}
