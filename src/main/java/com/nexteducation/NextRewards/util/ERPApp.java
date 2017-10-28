package com.nexteducation.NextRewards.util;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.time.DateUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

final public class ERPApp {
	/** Default constructor */
	private ERPApp() {
		super();
		LogMessage.debug("ERPApp");
	}

	public static final int COA_GROUP_TYPE = 110;
	public static final int VOUCHER_TYPE = 111;
	// public static long NE_BRANCH = 113393;
	public static long NE_BRANCH = 100000000082L;
	static public long LIFERAY_COMPANY_ID = 0;
	public static final String CAROUSEL_EXTENSION = "_ERP_CAROUSEL";
	public static final String CONTENT_CAROUSEL_EXTENSION = "_ERP_CONTENT_CAROUSEL";
	public static final String GALLERY_EXTENSION = "_ERP_GALLERY";
	public static final String YOUTUBE_EXTENSION = "_ERP_YOUTUBE";
	public static final String VIDEO_EXTENSION = "_ERP_VIDEO";
	public static final String AUDIO_EXTENSION = "_ERP_AUDIO";
	public static final String FLASH_EXTENSION = "_ERP_FLASH";
	public static final String DOCUMENT_EXTENSION = "_ERP_DOCUMENT";
	public static final String[] DOC_MIME_TYPES = { "image/jpeg" };
	public static final String GALLERY_STRUCTURE_KEY_PREFIX = "GALLERY_";
	public static final String SLIDESHOW_STRUCTURE_KEY_PREFIX = "SLIDESHOW_";
	public static final String ANNOUNCEMENT_STRUCTURE_KEY_PREFIX = "ANNOUNCEMENT_";
	public static final String YOUTUBE_STRUCTURE_KEY_PREFIX = "YOUTUBE_";
	public static final String VIDEO_STRUCTURE_KEY_PREFIX = "VIDEO_";
	public static final String AUDIO_STRUCTURE_KEY_PREFIX = "AUDIO_";
	public static final String FLASH_STRUCTURE_KEY_PREFIX = "FLASH_";
	public static final String DOCUMENT_STRUCTURE_KEY_PREFIX = "DOCUMENT_";
	public static final String YOUTUBE_URL_PREFIX = "https://www.youtube.com/embed/";

	public static final String VIDEO_SEARCH_KHAN_ACADEMY = "khanAcademy";

	static public String adminStaffDesignationStr = "Administrator";
	static public String adminStaffDepartmentStr = "Admin";
	static public String adminStaffRoleStr = "Administrator";
	static public String separatorStr = " : ";

	public static String INDEPENDENT_STR = "INDEPENDENT";

	// Email Template type
	public static final String HTML_TEMPLATE = "HTML";
	public static final String CONTENT_TEMPLATE = "CONTENT";

	// html for active and inactive statuses
	public static final String GREEN_COLOR_HTML = "'<span class=\"label label-success\">'";
	public static final String RED_COLOR_HTML = "'<span class=\"label label-important\">'";
	public static final String BLUE_COLOR_HTML = "'<span class=\"label label-info\">'";
	public static final String NEW_LINE = "<BR>";

	public static final int ATTENDANCE_MARK_TYPE = 33;
	public static final int COLOR = 34;

	// constants
	public static final String LANG_DATA_DELIM = String.valueOf((char) 5);
	public static final String LANG_DATA_TYPE_DELIM = String.valueOf((char) 6);

	public static final int MAX_LENGTH_OF_STR_JSP = 20;

	// user details
	public static final String GET_USER_INFO = "/getUserInfo/";

	// genericReport
	public static final long urlGroupId = 95;

	/**
	 * Erp Url Group Id for Admission Module.
	 */
	public static final long ADMISSION_URL_GROUP_ID = 2;

	// inventory constants
	public static final long INV_PURCHASE = 0;
	public static final long INV_SALE = 1;
	public static final long INV_ISSUE = 2;
	public static final long INV_RETURN = 3;
	public static final long INV_TRANSFER = 4;
	public static final long INV_LOST = 5;
	public static final long INV_DAMAGE = 6;
	public static final long INV_PAYMENT = 7;
	public static final long INV_GOODS_RECEIPT_NOTE = 8;

	// Type master constants
	public static final long ACTIVE_STATUS = 41;
	public static final long INACTIVE_STATUS = 42;
	public static final long DELETED_STATUS = 1444;
	public static final long PENDING_STATUS = 1430;
	public static final long REJECT_STATUS = 1432;
	public static final long ACTIVATION_PENDING_STATUS = 1338;
	public static final long BRANCH_TRANSFER_STATUS = 1350;
	public static final long STAFF_TEACHER_TYPE = 78;
	public static final long STAFF_DRIVER_TYPE = 954;
	public static final long STAFF_CLEANER_TYPE = 975;
	public static final long STAFF_CONDUCTOR_TYPE = 1394;
	public static final long SUCCESS_STATUS_CODE = 200;

	public static final long GOOD = 1027;
	public static final long BAD = 1028;
	public static final long DISCARD = 1029;

	public static final long PROMOTED = 134;
	public static final long PENDINGPROMOTION = 135;
	public static final long PROMOTIONREJECTED = 136;

	public static final long BOYS = 137;
	public static final long GIRLS = 138;

	public static final long TRANSFER_APPROVAL_PENDING_STATUS = 127;
	public static final long TRANSFER_REJECTED_STATUS = 128;
	public static final long TRANSFER_APPROVED_STATUS = 126;

	public static final long STUDENT_TRANSFERED_STATUS = 963;
	public static final long LEAVE_MASTER_COMP_OFF_TYPE = 964;
	public static final String LEAVE_COMP_OFF_STR = "Comp Off";

	public static final long ASSIGNMENT_INACTIVE_STATUS = 771;
	public static final long ASSIGNMENT_RESULT_PUBLISHED_STATUS = 772;
	public static final long ASSIGNMENT_RESULT_PENDING_STATUS = 773;
	public static final long ASSIGNMENT_NOT_PUBLISHED_STATUS = 774;

	public static final long HOMEWORK_INACTIVE_STATUS = 1647;
	public static final long HOMEWORK_RESULT_PUBLISHED_STATUS = 1646;
	public static final long HOMEWORK_RESULT_PENDING_STATUS = 1645;
	public static final long HOMEWORK_NOT_PUBLISHED_STATUS = 1644;
	public static final long HOMEWORK_SUBMISSION_END_STATUS = 1662;

	public static final long ADMISSION_TEST_INACTIVE_STATUS = 948;
	public static final long ADMISSION_TEST_RESULT_PUBLISHED_STATUS = 949;
	public static final long ADMISSION_TEST_RESULT_PENDING_STATUS = 950;
	public static final long ADMISSION_TEST_NOT_PUBLISHED_STATUS = 951;

	// Admission Page type consatants
	public static final long ADMISSION_PAGE_ENQUIRY = 1297;
	public static final long ADMISSION_PAGE_APPLICATION = 1298;
	public static final long ADMISSION_PAGE_REGISTRATION = 1299;
	public static final long ADMISSION_PAGE_EXAMINATION = 1300;
	public static final long ADMISSION_PAGE_INTERVIEW = 1301;
	public static final long ADMISSION_PAGE_ADMISSION = 1302;

	public static final long SUB_TYPE_CASH = 955;
	public static final long SUB_TYPE_PETTY_CASH = 946;
	public static final long SUB_TYPE_FEE_TYPE = 962;
	public static final long SUB_TYPE_BANK = 944;
	public static final long SUB_TYPE_CREDIT = 956;

	// these will be used for insertion in WORKING_DAYS, TIME_TABLE_DETAIL
	public static final long MONDAY_ID = 775;
	public static final long TUESDAY_ID = 776;
	public static final long WEDNESDAY_ID = 777;
	public static final long THURSDAY_ID = 778;
	public static final long FRIDAY_ID = 779;
	public static final long SATURDAY_ID = 780;
	public static final long SUNDAY_ID = 781;

	// these will be used for insertion in ATTENDANCE tables
	public static final long JANUARY_ID = 782;
	public static final long FEBRUARY_ID = 783;
	public static final long MARCH_ID = 784;
	public static final long APRIL_ID = 785;
	public static final long MAY_ID = 786;
	public static final long JUNE_ID = 787;
	public static final long JULY_ID = 788;
	public static final long AUGUST_ID = 789;
	public static final long SEPTEMBER_ID = 790;
	public static final long OCTOBER_ID = 791;
	public static final long NOVEMBER_ID = 792;
	public static final long DECEMBER_ID = 793;

	/// this is used for attendance mark
	public static final long PRESENT_ID = 806;
	public static final long HOLIDAY_ID = 1222;
	public static final long HALF_DAY_ID = 1223;
	public static final long ABSENT_ID = 807;
	public static final long SICK_ID = 808;
	public static final long DISCIPLINE_ID = 809;
	public static final long LEAVE_ATTENDANCE_MARK_TYPE = 1421;
	public static final long LATE_ID = 1418;
	public static final long OTHERS_ID = 1671;

	public static final long HALF_DAY = 1223;
	// String Array used in Student Attendnace
	public static final String[] MONTH_NAMES = { "January", "February", "March", "April", "May", "June", "July",
			"August", "September", "October", "November", "December" };
	public static final String[] DAY_NAMES = { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
			"Saturday" };
	public static final String[] MONTH_NAMES_SHORT_FORM = { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
			"Sep", "Oct", "Nov", "Dec" };
	// these will be used in LEAVE_REQUEST
	public static final long LEAVE_APPROVE_ID = 863;
	public static final long LEAVE_REJECT_ID = 864;
	public static final long LEAVE_PENDING_ID = 865;
	public static final long ABSENT_LEAVE_FOR_STUDENT = 1417;
	public static final long HOSTEL_LEAVE = 1443;
	public static final long COMPOFF_PENDING_ID = 1666;
	public static final long COMPOFF_REJECT_ID = 1667;
	public static final long COMPOFF_APPROVE_ID = 1668;
	public static final long LEAVE_CANCELED_ID = 1672;

	// these will be used in APPROVAL_STATIC
	public static final long ENQUIRY_ID = 818;
	public static final long APPLIED_ID = 819;
	public static final long APPROVED_ID = 820;
	public static final long REJECTED_ID = 821;
	public static final long PENDING_ID = 822;
	public static final long WAITING_ID = 823;
	public static final long ENROLLED_ID = 824;
	public static final long SCRUTINY_COMPLETED = 837;

	// settings constants
	public static final long DATE_FORMAT_SETTING = 1;
	public static final long DATETIME_FORMAT_SETTING = 2;
	public static final long CLASS_TEACHER_SETTING_VALUE = 3;
	public static final long CLASS_TEST_SETTING_VALUE = 4;
	public static final long SECTION_TEST_SETTING_VALUE = 5;
	public static final long CURRENT_ACADEMIC_SESSION = 6;
	public static final long SUBJECT_TEACHER_SETTING_VALUE = 7;
	public static final long LEFT_NAVIGATION_KEY = 8;
	public static final long HOSTEL_WARDEN_SETTING_VALUE = 9;
	public static final String SETTING_TYPE_DATE = "DATE_FORMAT";
	public static final String SETTING_TYPE_DATETIME = "DATE_TIME_FORMAT";
	public static final String SETTING_TYPE_DATEVALUE = "dd-MMM-yyyy";
	public static final String SETTING_TYPE_DATETIMEVALUE = "dd-MMM-yyyy HH:mm";

	// promotion string constants
	public static final String PROMOTE = "PROMOTE";
	public static final String PROMOTION_PENDING = "PROMOTION_PENDING";
	public static final String PROMOTION_REJECTED = "PROMOTION_REJECTED";

	// Type Master Group ID's
	public static final int PRNT_GRP_ID_ZERO = 0;
	public static final int STATE_ID = 1;
	public static final int LANGUAGE_ID = 2;
	public static final int RELIGION_ID = 3;
	public static final int STATUS_ID = 4;
	public static final int EDUCATION_ID = 5;
	public static final int SPECIALIZATION_ID = 6;
	public static final int ANNUAL_INCOME_ID = 7;
	public static final int STAFF_TYPE_ID = 8;
	public static final int FATHR_PROFESIN_ID = 9;
	public static final int MOTHR_PROFESIN_ID = 10;
	public static final int BOARD_ID = 11;
	public static final int CLASS_ID = 12;
	public static final int TRANSFER_STATUS = 13;
	public static final int FILE_TYPE = 14;
	public static final int PRMTION_GRP_ID = 15;
	public static final int GENDER_ID = 16;
	public static final int FOLDER_ID = 17;
	public static final int CLASS_DATA_IN_SETTINGS = 18;
	public static final int SECTION_DATA_IN_SETTINGS = 19;
	public static final int FILE_ACCESS_TYPE = 20;
	public static final int DISTRICT_ID = 21;
	public static final int MARITAL_STATUS = 22;
	public static final int NATIONALITY = 23;
	public static final int CATEGORY_ID = 24;
	public static final int JOB_LOCATION_ID = 25;
	public static final int SUBJECT_TYPE = 26;
	public static final int DEPARTMENT = 27;
	public static final int ASSIGNMENT_STATUS = 28;
	public static final int WEEK_DAY_ID = 29;
	public static final int MONTH_ID = 30;
	public static final int CURRENCY_ID = 31;
	public static final int FREQUENCY_ID = 32;
	public static final int SUBJECT_ALLOCATION = 35;
	public static final int ADMISSION_STATUS = 36;
	public static final int SYLLABUS_STATUS = 37;
	public static final int STEP_GROUP_TYPE = 38;
	// Sms Template Type
	public static final int TEMPLATE_TYPE_ID = 39; // TYPE_MASTER_ID = 901
													// (Single) & TYPE_MASTER_ID
													// = 902 (double)
	public static final int FA_ACTIVITY_TYPE = 41;
	public static final int ALLOWANCE_BASED_ON_ID = 42;
	public static final int ALLOWANCE_EXPRESSION_ID = 43;
	public static final int ALLOWANCE_TYPE_ID = 44;
	public static final int LEFT_NAVIGATION = 45;
	public static final int LEAVE_STATUS = 50;
	public static final int CCE_RULE = 57;

	public static final String ACTIVE = "AC";
	public static final String DEACTIVE = "DA";
	public static final String APPROVE = "AP";
	public static final String REJECT = "RJ";
	public static final String WAITING = "WA";
	public static final String SCRUTINYCOMPLETED = "CS";

	public static final String ACTIVE_STR = "Active";
	public static final String INACTIVE_STR = "InActive";

	public static final long WORKING = 1; // this will be used for insertion in
											// WORKING_DAYS table
	public static final long NON_WORKING = 0; // this will be used for insertion
												// in WORKING_DAYS table

	// will be used in Vehicle screens
	public static final long VEHICLE_IN = 1; // this will be used for insertion
												// in VECHICLE_IN_OUT table
	public static final long VEHICLE_OUT = 0; // this will be used for insertion
												// in VECHICLE_IN_OUT table

	// LN Client related constants
	public static final long NOTE_LIST = 3; // UserDataCategory(User class) enum
											// in LN
	public static final String FETCH_METHOD = "fetch";
	public static final String STORE_METHOD = "store";
	public static final String DELETE_METHOD = "delete";

	// dashBoard id
	public static final long DASHBOARD_ID = 1;
	// assignment related grouping (radio boxes)
	public static final long ASSIGN_GRP_CLASS = 1;
	public static final long ASSIGN_GRP_SECTION = 2;
	public static final long ASSIGN_GRP_GROUP = 3;
	public static final long ASSIGN_GRP_INDIVIDUAL = 4;

	// academic term activeSession
	public static final int ACTIVE_SESSION = 1;
	public static final int INACTIVE_SESSION = 0;

	// Fee Type related (if expense)
	public static final long EXPENSE = 1;
	public static final long NOT_EXPENSE = 0;

	// these are being used in Fee Type screens
	public static final long CLASS_DEPENDENT_FT = 1;
	public static final long GROUP_DEPENDENT_FT = 2;

	// schoolUser constants (IF_STUDENT column values)
	public static final long STAFF_PROFILE = 0;
	public static final long STUDENT_PROFILE = 1;

	//
	public static final int STUDENT_ROLE = 0;
	public static final int STAFF_ROLE = 1;

	// subject type constants
	public static final long SUBJECT_TYPE_MANDATORY = 765;
	public static final long SUBJECT_TYPE_OPTIONAL = 766;
	public static final long SUBJECT_TYPE_ADMISSION = 829;
	public static final long SUBJECT_TYPE_SCHOLASTIC = 855;
	public static final long SUBJECT_TYPE_CO_SCHOLASTIC = 856;
	public static final long SUBJECT_TYPE_ACTIVITY = 1251;

	// subject allocation constants
	public static final long SUBJECT_ALLOCATION_YES = 816;
	public static final long SUBJECT_ALLOCATION_NO = 817;

	// step Type constants
	public static final long STEP_TYPE_APPROVAL = 827;
	public static final long STEP_TYPE_SCRUTINY = 828;

	public static final long ADMISSION_STUDENT_STATUS = 832;

	public static final long ADMISSION_SUBJECTS = 829;

	// these will be used for frequency types
	public static final long DAILY_ID = 801;
	public static final long MONTHLY_ID = 802;
	public static final long WEEKLY_ID = 803;
	public static final long YEARLY_ID = 805;

	public static final long COA_TYPE_ID = 2;

	// leaveMaster
	public static final short LEAVE_STUDENT = 1;
	public static final short LEAVE_STAFF = 2;
	public static final short LEAVE_STUDENT_STAFF = 3;

	public static final String YES = "Yes";
	public static final String NO = "No";
	public static final String CLASS_STR = "Class";
	public static final String GROUP_STR = "Group";
	public static final String FOREIGN_KEY_CONSTRAINT_STR = "addBatch";

	public static final String FILTER_CLASS = "class";
	public static final String FILTER_SECTION = "section";
	public static final String FILTER_GROUP = "group";

	// icon checks used to represent attendance mark
	public static final long GREEN_ICON_CHECK = 810;
	public static final long BLUE_ICON_CHECK = 811;
	public static final long YELLOW_ICON_CHECK = 812;
	public static final long VIOLET_ICON_CHECK = 813;
	public static final long RED_ICON_CHECK = 814;
	public static final long ORANGE_ICON_CHECK = 815;

	public final static String STATUS_SAVE = "S";
	public final static String STATUS_PUBLISH = "P";
	public final static String STATUS_RESULT = "R";
	public final static String STATUS_RESULT_POPOVER = "PR";
	public final static String STATUS_SUBMISSION_END = "SE";

	public final static String STATUS_INACTIVE = "D";

	// constant for setting marks to -1 when records are inserted in
	// AssignmentGrades and AdmissionGrades table
	public static final double GRADE_MARKS = -1;
	public static final double INVALID_MARKS = -1;
	public static final double MARKS_NOT_PRESENT = 0;
	public static final int NO_SUBJECT_PRESENT = 0;
	public static final double SHOW_NUMBER = 2;
	public static final double SHOW_MARKS = 1;
	public static final double NO_MARKS_PRESENT = -2;

	public static final int FIXED_ALLOWANCE = 844;
	public static final int FORMULA_BASED_ALLOWANCE = 845;
	public static final int CONDITION_BASED_ALLOWANCE = 1405;

	public static final String COVERED_STR = "C";
	public static final String PENDING_STR = "P";

	// Assessment Branch Page
	public static final long CONTINUOUS = 1;
	public static final long NOT_CONTINUOUS = 0;

	public static final long SYLLABUS_COVERED_STATUS = 825;
	public static final long SYLLABUS_PENDING_STATUS = 826;
	public static final long OVERALL_DEFAULT_RECEIPT = -1;
	public static final long DEFAULT_RECEIPT_VALUE = 4;

	// Principal login
	public static final long PRINCIPAL = 1201;
	public static final long TEACHER_PROFILE = 1214;
	public static final long PRINCIPAL_ADMIN = 1217;
	public static final long STUDENT_LOGIN = 1210;
	public static final long PARENT_LOGIN = 1211;
	public static final long SCHOOL_PRINCIPAL = 1305;

	// master login

	public static final long MASTER_LOGIN = 1203;

	// Late Fee constants (LATE_FEE_FIXED column values)
	public static final long LATE_FEE_FIXED = 1;
	public static final long LATE_FEE_DAYWISE = 0;
	public static final long PRIMARY_CONTACT = 1;
	public static final long SECONDARY_CONTACT = 2;
	public static final long TERTIARY_CONTACT = 3;
	public static final String FEATURE_ID_MAX = "MAX_NO_OF_PAGES_ON_SCREEN";
	public static final String FEATURE_ID_PAGINATION = "PAGINATION";
	public static final String FEATURE_ID_SEQ_CNT = "SEQUENCE_COUNT";

	public static final String CLASS_SEQ_CNT = "CLASS_SEQ_COUNT";

	public static final String FEATURE_ID_STUD_PAGIN = "STUDENT_PAGINATION";
	public static final String FEATURE_ID_STEP_COUNT = "STEP_COUNT";
	public static final String FEATURE_ID_STUDENT_XL_TEMPLATE = "STUDENT_EXCEL_TEMPLATE";
	public static final String FEATURE_ID_STAFF_XL_TEMPLATE = "STAFF_EXCEL_TEMPLATE";
	public static final String FEATURE_ID_SUPPLIER_XL_TEMPLATE = "SUPPLIER_EXCEL_TEMPLATE";
	public static final String FEATURE_ID_MCB_TEMPLATE = "MCB_TEMPLATE";
	public static final String FEATURE_ID_ROCKVALE_TEMPLATE = "ROCKVALE_TEMPLATE";
	public static final String ATTACH_ADMISSION_NUMBER_OR_NOT = "NEED_TO_LOG_MANUAL_ENTRY_ADMISSION";
	public static final String PUT_UNIQUE_TEACHER_VALIDATION_OR_NOT = "NEED_UNIQUE_TEACHING_VALIDATION";
	public static final String DOWNLOAD_SMS = "DOWNLOAD_SMS";
	public static final String CUB_PID = "CUB_PID";
	public static final String CUB_PID_VERF = "CUB_PID_VERF";
	public static final String INVENTORY_FEE = "INVENTORY_FEE";
	public static final String STUDENT_AUTO_GENERATE_ROLL_NO = "STUDENT_AUTO_GENERATE_ROLL_NO";
	public static final String FEATURE_DESC_MAX = "Contains the value of number of pages on screen during pagination";
	public static final String FEATURE_DESC_REC = "Contains the number of records that are to be shown on a single page";
	public static final String FEATURE_DESC_SEQ = "Contains the number of sequence that are to be shown on  step add page";
	public static final String FEATURE_DESC_STUD_PAGIN = "Contains the number of records that are to be shown on student search page";
	public static final String FEATURE_DESC_STEP_COUNT = "Contains the maximum number of  steps for admission workflow";
	public static final long FEATURE_VAL_MAX = 4;
	public static final long FEATURE_VAL_PAGIN = 20;
	public static final long FEATURE_VAL_SEQ = 21;
	public static final long FEATURE_VAL_STUD = 5;
	public static final long FEATURE_VAL_STEP_COUNT = 20;
	public static final String FEATURE_ID_ABSENT_STR = "ABSENT_STR";
	public static final String FEATURE_ID_DONT_CONSIDER_STR = "DONT_CONSIDER_STR";
	public static final String PAYMENT_ONLINE_POPUP_MSG = "PAYMENT_ONLINE_POPUP_MSG";
	public static final String PAYMENT_ONLINE_HELP_MSG = "PAYMENT_ONLINE_HELP_MSG";
	public static final String DISABLE_ALL_INPUT_IN_PAYMENT_COLLECTION_SCREEN = "DISABLE_ALL_INPUT";

	// Strings for the system events.
	public static final String JUST_FOR_TESTING = "JustForTesting";
	public static final String LOGIN_EVENT = "LoginEvent";
	public static final String PASSWORD_EVENT = "PasswordEvent";
	public static final String STUDENT_ATTENDANCE_EVENT = "StudentAttendanceEvent";
	public static final String STUDENT_ATTENDANCE_PERCENTAGE_EVENT = "StudentAttendancePercentageEvent";
	public static final String PAYMENT_COLLECTION_EVENT = "PaymentCollectionEvent";
	public static final String ANNOUNCEMENT_EVENT = "AnnouncementEvent";
	public static final String ADMIN_PUBLISH_REPORTCARD_EVENT = "AdminPublishReportCardEvent";
	public static final String STUDENT_PUBLISH_REPORTCARD_EVENT = "StudentPublishReportCardEvent";
	public static final String ADMIN_PUBLISHED_ASSIGNMENT_EVENT = "AdminPublishedAssignmentEvent";
	public static final String STUDENT_PUBLISHED_ASSIGNMENT_EVENT = "StudentPublishedAssignmentEvent";
	public static final String ADMIN_LEAVE_UPDATED_EVENT = "AdminLeaveUpdatedEvent";
	public static final String STUDENT_LEAVE_UPDATED_EVENT = "StudentLeaveUpdatedEvent";
	public static final String STUDENT_LEAVE_APPLY_EVENT = "StudentLeaveApplyEvent";
	public static final String STUDENT_LEAVE_PASS_EVENT = "StudentLeavePassEvent";
	public static final String STUDENT_GATE_PASS_EVENT = "StudentGatePassEvent";
	public static final String STAFF_GATE_PASS_EVENT = "StaffGatePassEvent";
	public static final String STUDENT_LEAVE_APPROVE_OR_REJECT_EVENT = "StudentLeaveApproveOrRejectEvent";
	public static final String STUDENT_TRANSPORT_LEAVE_EVENT = "StudentTransportLeaveEvent";
	public static final String STUDENT_TRANSPORT_LEAVE_PASS_EVENT = "StudentTransportLeavePassEvent";
	public static final String STAFF_TRANSPORT_LEAVE_PASS_EVENT = "StaffTransportLeavePassEvent";
	public static final String STAFF_LEAVE_UPDATED_EVENT = "StaffLeaveUpdatedEvent";
	public static final String ADMIN_COMPLEMENT_LEAVE_GRANTED_EVENT = "AdminCompLeaveGrantedEvent";
	// public static final String STUDENT_COMPLEMENT_LEAVE_GRANTED_EVENT =
	// "StudentCompLeaveGrantedEvent";
	public static final String EXPENSE_REGISTERED_EVENT = "ExpenseRegisteredEvent";
	public static final String ADMIN_HOSTEL_RESOURCE_ISSUED_EVENT = "AdminHostelResourceIssuedEvent";
	public static final String STUDENT_HOSTEL_RESOURCE_ISSUED_EVENT = "StudentHostelResourceIssuedEvent";
	public static final String ADMIN_HOSTEL_RESOURCE_COLLECTED_EVENT = "AdminHostelResourceCollectedEvent";
	public static final String STUDENT_HOSTEL_RESOURCE_COLLECTED_EVENT = "StudentHostelResourceCollectedEvent";
	public static final String ADMIN_HOSTEL_ROOM_ALLOCATED_EVENT = "AdminHostelRoomAllocatedEvent";
	public static final String STUDENT_HOSTEL_ROOM_ALLOCATED_EVENT = "StudentHostelRoomAllocatedEvent";
	public static final String STUDENT_HOSTEL_ATTENDANCE_ABSENT_EVENT = "StudentHostelAttendanceAbsentEvent";
	public static final String ADMIN_HOSTEL_ATTENDANCE_ABSENT_EVENT = "AdminHostelAttendanceAbsentEvent";
	public static final String STD_USER_CREATION_EVENT = "StudentUserCreationEvent";
	public static final String STAFF_USER_CREATION_EVENT = "StaffUserCreationEvent";
	public static final String PARENT_USER_CREATION_EVENT = "ParentUserCreationEvent";
	public static final String DOWNLOAD_EVENT = "DownloadEvent";
	public static final String DAILY_SMS_REPORT_ALERT = "DailySMSReportAlert";
	public static final String FEE_DUE_ALERT = "FeeDueAlert";
	public static final String REPORT_CARD_PUBLISH_ALERT_WITH_MARKS = "reportCardPublishAlertWithMark";
	public static final String MONTHLY_STUDENT_ATTENDANCE_REPORT = "MonthlyStudentAttendanceReport";
	public static final String DAILY_BDAY_ALERT = "DailyBDayAlert";
	public static final String STAFF_DAILY_BDAY_ALERT = "StaffDailyBDayAlert";
	public static final String STAFF_DAILY_ANNV_ALERT = "StaffDailyAnnvAlert";
	public static final String PARENT_DAILY_BDAY_ALERT = "ParentDailyBDayAlert";
	public static final String STAFF_SALARY_ALERT = "StaffSalaryAlert";
	public static final String TEACHER_SUBSTITUTION_EVENT = "StaffSubstitutionEvent";
	public static final String LEAVE_APPROVE_ALERT = "leaveApproveAlert";
	public static final String LEAVE_REJECT_ALERT = "leaveRejectAlert";
	public static final String PETTY_CASH_ALERT = "PettyCashDayAlert";
	public static final String DAILY_BUSSTART_ALERT = "DailyBusStartAlert";
	public static final String DAILY_BUSREACHED_ALERT = "DailyBusReachedAlert";
	public static final String DAILY_NEXTBUSSTOP_ALERT = "DailyNextBusStopAlert";
	public static final String SUBSTITUTION_EVENT = "SubstitutionEvent";
	public static final String RASH_DRIVING_EVENT = "rashDrivingEvent";
	public static final String STAFF_SWIPE_IN_EVENT = "staffSwipeInEvent";
	public static final String STUDENT_SWIPE_IN_EVENT = "studentSwipeInEvent";
	public static final String STUDENT_LATE_ARRIVAL_EVENT = "StudentLateArrival";
	public static final long LATE_MARKED_ID = 1418;
	public static final int IF_RUBRIC = 1;
	public static final int IF_NOT_RUBRIC = 0;
	public static final String STAFF_ABSENT_EVENT = "StaffAbsentEvent";
	public static final String STUDENT_FESTIVAL_EVENT = "StudentFestivalEvent";
	public static final String STAFF_FESTIVAL_EVENT = "StaffFestivalEvent";
	public static final String HOLIDAY_CALENDAR_EVENT = "HolidayCalendarEvent";
	public static final String CALENDAR_FESTIVAL_EVENT = "CalenderFestivalAlert";
	public static final String CALENDAR_SCHOOL_EVENT_ALERT = "CalendarSchoolEventAlert";
	public static final String PARENT_MARRIAGE_ANNIVERSARY_EVENT = "ParentAnnaversaryEvent";
	public static final String ENQUIRY_CONFIRMATION_EVENT = "EnquiryConfirmationEvent";
	public static final String APPLICATION_CONFIRMATION_EVENT = "ApplicationConfirmationEvent";
	public static final String REGISTRATION_CONFIRMATION_EVENT = "RegistrationConfirmationEvent";
	public static final String ADMISSION_CONFIRMATION_EVENT = "AdmissionConfirmationEvent";
	public static final String HALL_TICKET_GENERATION_EVENT = "HallTicketGenerationEvent";
	public static final String FEE_PAYMENT_SUCCESS_EVENT = "FeeTransactionSuccessEvent";
	public static final String FEE_PAYMENT_FAILED_EVENT = "FeeTransactionFailedEvent";

	// transport cancellation request
	public static final long CANCELLATION_BUT_FEE_NOT_COLLECTED = 851;
	public static final long CANCELLED = 852;
	public static final long REJECTED = 853;
	public static final long PENDING = 854;
	public static final int TRANSPORT_CANCELLATION_REQUEST = 46;
	public static final String ACCEPT = "AT";
	public static final String CANCEL = "CANCEL";
	public static final String REJECTREQ = "RT";
	public static final String PEND = "PD";
	public static final int ROUTEACTIVESTATUS = 1;

	// Announcement constants
	public static final long STUDENT_BASED = 1;
	public static final long STAFF_BASED = 2;
	public static final long PARENT_BASED = 3;

	public static final long STUDENT = 1;
	public static final long STAFF = 2;
	public static final long STUDENT_STAFF = 3;

	public static final long INDEPENDENT_FT = 3;

	public static final String PRESENT_STR = "PRESENT";

	/* Contacts Page */
	public static final long STUDENT_TYPE_CONTACT = 1;
	public static final long PARENT_TYPE_CONTACT = 2;
	public static final long STAFF_TYPE_CONTACT = 3;
	public static final long PRIMARY_TYPE_CONTACT = 4;

	/* RelationShips */
	public static final long FATHER_RELATION_ID = 884;
	public static final long MOTHER_RELATION_ID = 885;
	public static final long BOTHER_RELATION_ID = 886;
	public static final long SISTER_RELATION_ID = 887;
	public static final long UNCLE_RELATION_ID = 888;
	public static final long AUNTY_RELATION_ID = 889;
	public static final long NONE_RELATION_ID = 1341;
	public static final long LOCAL_GUARDIAN_RELATION_ID = 1145;
	public static final String PARENT_RELATION_IDs = "884,885";
	public static final String LEGAL_GUARDIAN_RELATION_IDs = "886,887,888,889,1341";

	// leaveDetail
	public static final String DEBIT_STR = "debit";
	public static final String CREDIT_STR = "credit";
	public static final long CREDIT = 866;
	public static final long DEBIT = 867;

	// leave Calendar
	public static final boolean LEAVE_YES = true;
	public static final boolean LEAVE_NO = false;

	// income Expense
	public static final long INCOME_EXPENSE_INCOME = 1;
	public static final long INCOME_EXPENSE_EXPENSE = 2;
	public static final boolean IF_INCOME = false;
	public static final boolean IF_EXPENSE = true;

	// academic session
	public static final boolean IF_CURRENT_NO = false;
	public static final boolean IF_CURRENT_YES = true;

	public final static short STUDENT_PT_ID = 0; // STUDENT_PASSENGER_TYPE_ID
	public final static short STAFF_PT_ID = 1; // STAFF_PASSENGER_TYPE_ID
	public final static int NEW_REQ = 1; // NEW TRANSPORT REQUEST
	public final static int CAN_REQ = 0; // CANCELLATION TRANSPORT REQUEST

	// MimeTypes / content types

	// .xls file
	public static final String MIME_TYPE_XLS = "application/vnd.ms-excel";
	// .xlsx
	public static final String MIME_TYPE_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

	public static final String MIME_TYPE_PDF = "application/pdf";
	public static final String MIME_TYPE_ZIP = "application/zip";

	public static final String MIME_TYPE_ODT = "application/vnd.oasis.opendocument.text";
	public static final String MIME_TYPE_DOC = "application/msword";
	public static final String MIME_TYPE_DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
	public static final String MIME_TYPE_PPT = "application/vnd.ms-powerpoint";
	public static final String MIME_TYPE_PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
	public static final String MIME_TYPE_ODP = "application/vnd.oasis.opendocument.presentation";

	public static final String fatherDesignationCustomPFStr = "FATHER_DESGN_CUSTOM_FIELD_ID";
	// cce rules
	public static final long CCERULE_BEST_OF_ALL = 893;
	public static final long CCERULE_AVG_OF_ALL = 894;
	public static final long CCERULE_BEST_OF_2 = 895;

	// master grade radio button selection
	public static final long CLASS_BASED_DIV = 2;
	public static final long SUBJECT_BASED_DIV = 3;
	public static final long CLASS_BASED_CO_DIV = 4;

	// It will be used to check which update function is going on
	public static final long UPDATE_STATUS = 1;
	public static final long UPDATE_RECORD = 2;
	public static final long UPDATE_STATUS_ACTIVE = 3;

	// PROFILE TYPES
	public static final long TEACHER_PROFILE_ID = 678;
	public static final long STUDENT_PROFILE_ID = 679;

	// discipline remark type
	public static final long POSITIVE_DISCIPLINE_REMARK = 906;
	public static final long NEGATIVE_DISCIPLINE_REMARK = 907;
	public static final long HIEGHT_DISCIPLINE_REMARK = 1154;
	public static final long WEIGHT_DISCIPLINE_REMARK = 1155;
	public static final long GOALS_DISCIPLINE_REMARK = 1184;
	public static final long STRENGTHS_DISCIPLINE_REMARK = 1185;
	public static final long MY_INTERESTS_AND_HOBBIES_DISCIPLINE_REMARK = 1186;
	public static final long RESPONSIBILITIES_DISCIPLINE_REMARK = 1187;
	public static final long ACHIEVEMENTS_DISCIPLINE_REMARK = 1188;
	public static final long SUGGESTIONS_DISCIPLINE_REMARK = 1189;
	public static final long GENERAL_DISCIPLINE_REMARK = 1190;
	public static final long SPECIAL_PROGRESS_DISCIPLINE_REMARK = 1374;
	public static final long RANK_DISCIPLINE_REMARK = 1196;
	public static final long RESULT_DISCIPLINE_REMARK = 1197;
	public static final long APPLICATION_DISCIPLINE_REMARK = 1402;
	public static final long COCURRICULAR_ACTIVITIES_DISCIPLINE_REMARK = 1403;
	// Use this for reportCards
	public static final long SPECIFIC_PARTICIPATION_DISCIPLINE_REMARK = 1219;
	public static final long ABSENT_DISCIPLINE_REMARK = 1208;
	public static final long MEDICAL_LEAVE_DISCIPLINE_REMARK = 1209;

	// for supplimentary exam discipline
	public static final long SUPPLIMENTARY_SUBJECT_REMARK = 1389;
	public static final long SUPPLIMENTARY_SUBJECT_MARK_REMARK = 1390;
	public static final long SUPPLIMENTARY_RESULT_REMARK = 1391;

	// DON'T USE THIS FOR reportCard
	// DUPLICATE AS SPECIFIC_PARTICIPATION_DISCIPLINE_REMARK
	public static final long SPECIFIC_PARTICIPATION = 1219;

	public static final long CULTURAL_ACTIVITIES_DISCIPLINE_REMARK = 1252;
	public static final long LITERARY_ACTIVITIES_DISCIPLINE_REMARK = 1253;
	public static final long RESPONSIBILITY_DISCIPLINE_REMARK = 1254;
	public static final long SPORTS_AND_GAMES_DISCIPLINE_REMARK = 1255;
	public static final long SELF_MOTIVATED_AND_WORKS_INDEPENDENTLY = 1256;
	public static final long WORKS_ENTHUSIASTICALLY_AND_TAKES_INTEREST = 1257;
	public static final long VERY_ATTENTIVE_TO_HIS_HER_DAILY_LESSON_AND_HOME_WORKS = 1258;
	public static final long MANNERS_AND_CONDUCT_ARE_APPRECIATIVE = 1259;
	public static final long COMES_TO_SCHOOL_IN_NEAT_N_CLEAN_UNIFORM = 1260;
	public static final long GENERAL_CONDUCT_DISCIPLINE_REMARK = 1261;
	public static final long PUNCTUALITY_REGULARITY_DISCIPLINE_REMARK = 1262;
	public static final long CONFIDENCE_DISCIPLINE_REMARK = 1263;
	public static final long NEATNESS_IN_WORK_DISCIPLINE_REMARK = 1264;
	public static final long MANNERS_DISCIPLINE_REMARK = 1265;
	public static final long APPEARANCE_DISCIPLINE_REMARK = 1266;
	public static final long LEADERSHIP_QUALITY_DISCIPLINE_REMARK = 1267;
	public static final long PERSONAL_APPEARANCE_DISCIPLINE_REMARK = 1268;
	public static final long HANDWRITING_DISCIPLINE_REMARK = 1269;
	public static final long PARENTAL_CO_OPERATION_DISCIPLINE_REMARK = 1270;
	public static final long HEALTH_STATUS_DISCIPLINE_REMARK = 1271;
	// public static final long PROMOTED_TO_DISCIPLINE_REMARK = 1272;
	public static final long DETAINED_DISCIPLINE_REMARK = 1273;
	public static final long SPOKEN_ENGLISH_DISCIPLINE_REMARK = 1274;
	public static final long SHARING_CARING_DISCIPLINE_REMARK = 1275;
	public static final long HOUSE_DISCIPLINE_REMARK = 1276;

	public static final long TEACHER_COMMENTS = 1278;
	public static final long COOPERATION_REMARKS = 1279;
	public static final long CONCENTRATION_REMARKS = 1280;
	public static final long ORGANIZATION_REMARKS = 1281;
	public static final long PRESENTATION_REMARKS = 1282;
	public static final long ANALYTICAL_SKILL_REMARKS = 1283;
	public static final long PRINCIPAL_REMARKS = 1284;

	public static final long PASSED_DISCIPLINE = 1289;
	public static final long PROMOTED_DISCIPLINE = 1290;
	public static final long NEEDS_TO_DISCIPLINE = 1291;
	public static final long RETEST_DISCIPLINE = 1292;
	public static final long SCHOOL_REPOENS_ON_DISCIPLINE = 1293;
	public static final long AT_DISCIPLINE = 1294;
	public static final long ATTENDANCE_DISCIPLINE = 1295;

	public static final long PHYSICAL_EDUCATION_DISCIPLINE = 1306;
	public static final long REMARK_DISCIPLINE = 1308;

	public static final long OVERALL_RESULT_DISCIPLINE = 1320;
	public static final long YEAR_END = 1333;

	public static final long MANNER_CONDUCT_DISCIPLINE_REMARK = 1256;
	public static final long PROMOTION_DISCIPLINE_REMARK = 1272;
	public static final long PERSONAL_CLEANLINESS_DISCIPLINE_REMARK = 1357;
	public static final long REGULARITY_DISCIPLINE_REMARK = 1358;
	public static final long READING_HABITS_DISCIPLINE_REMARK = 1359;
	public static final long DISCIPLINE_DISCIPLINE_REMARK = 1360;
	public static final long CONDUCT_DISCIPLINE_REMARK = 1361;
	public static final long COURTESY_DISCIPLINE_REMARK = 1362;
	public static final long SOCIABILITY_DISCIPLINE_REMARK = 1363;
	public static final long CO_OPERATION_DISCIPLINE_REMARK = 1364;
	public static final long INDUSTRY_DISCIPLINE_REMARK = 1365;
	public static final long TOPICS_REMARK = 1366;

	public static final long REMARKS_DISCIPLINE = 1296;
	public static final long National_Song_DISCIPLINE = 1321;
	public static final long Knowledge_Of_Symbols_DISCIPLINE = 1322;
	public static final long Slogan_Making_DISCIPLINE = 1323;
	public static final long Colours_DISCIPLINE = 1324;
	public static final long Touch_DISCIPLINE = 1325;
	public static final long Smells_DISCIPLINE = 1326;
	public static final long Taste_DISCIPLINE = 1327;
	public static final long Sound_DISCIPLINE = 1328;
	public static final long Knowledge_Of_Flag_DISCIPLINE = 1329;
	public static final long SPECIFIC_AILMENT = 1330;

	// Enquiry
	public static final String REPLIED_STR = "Replied";
	public static final String REPLY_PENDING_STR = "Reply Pending";
	public static final long REPLIED = 1;
	public static final long REPLY_PENDING = 2;

	// BUDGET VIEW TYPES
	public static final long MONTHLY = 919;
	public static final long QUATRLY = 920;
	public static final long HALF_YEARLY = 921;
	public static final long YEARLY = 922;

	// General Ledger
	public static final boolean AMOUNT_DEBIT = true;
	public static final boolean AMOUNT_CREDIT = false;

	// Examination Result
	public static final String REPORT_PENDING_STR = "Report Pending";
	public static final String REPORT_PUBLISH_STR = "Report Published";
	public static final String REPORT_PUBLISH_STARTED_STR = "Report Publish Started";
	public static final long REPORT_PENDING = 1;
	public static final long REPORT_PUBLISH = 2;
	public static final long REPORT_PUBLISH_STARTED = 3;

	// Products
	public static final long PRODUCTS_INCOME_ACCOUNT = 942;
	public static final long PRODUCTS_EXPENSE_ACCOUNT = 940;

	// Cash Type
	public static final long PETTYCASH_ID = 930;
	public static final long BANK_ID = 931;
	// Account type
	public static final long BANK_TYPE = 944;
	public static final long PETTY_CASH_TYPE = 946;

	public static final long CASH = 955;
	public static final long CREDIT_CARD = 956;

	// feedback_student answer
	public static final int MAX_PERCENTAGE = 100;

	public static final long ACCEPTED = 947;
	public static final long CANCELLATION_PENDING = 1030;
	public static final long TRANS_CANCELLED = 1031;
	public static final long TRANS_FACILITY_CANCELLED = 1404;

	// Discount Types
	public static final long GROUP_BASED_DISCOUNT = 957;
	public static final long STUDENT_BASED_DISCOUNT = 958;

	// admission_student_status
	public static final long ADM_STUD_ACTIVE = 959;
	public static final long ADM_STUD_INACTIVE = 960;
	public static final long ADM_STUD_CONFIRM = 961;
	public static final long ADM_STUD_APPROVE = 1330;
	public static final long ADM_STUD_REJECT = 1331;

	public static final long ADM_STUD_PENDING = 1425;
	public static final long ADM_STUD_DELETE = 1449;

	// Banking Status page wise
	public static final long CHEQUE_EXPENSE_ID = 969;
	public static final long CASH_OTHER_EXPENSE_ID = 970;
	public static final long CREDIT_CARD_EXPENSE_ID = 971;
	public static final long DEPOSIT_ID = 972;
	public static final long TRANSFER_ID = 973;
	public static final short CHEQUE_EXPENSE = 1;
	public static final short CREDIT_CARD_EXPENSE = 2;
	public static final short CASH_OTHER_EXPENSE = 3;

	// levels in report card
	public static final long RUBRIC_LEVEL = 1630;
	public static final long ACTIVITY_LEVEL = 1631;
	public static final long ASSESSMENT_LEVEL = 1632;
	public static final long TERM_LEVEL = 1634;
	public static final long OVERALL_LEVEL = 1635;
	public static final long GRAND_TOT_LEVEL = 1636;

	// levels used for pass-fail
	public static final long ACTIVITY_TERM_LAVEL = 1639;
	public static final long ACTIVITY_OVERALL_LEVEL = 1640;
	public static final long SUB_ASSESSMENT_LEVEL = 1641;
	public static final long ASSESSMENT_OVERALL_LEVEL = 1660;
	public static final long SUB_ACTIVITY__LAVEL = 1661;
	public static final long SUB_TERM_LEVEL = 1642;
	public static final long TERM_OVERALL_LEVEL = 1665;
	public static final long SUB_OVERALL_LEVEL = 1643;

	// Subject Group Id
	public static final long SUB_GROUP_ID = 85;

	public static final long SUB_GROUP_OTHER = 1146;

	// message templates related
	public static final String DEFAULT_USER_ADDED_MAIL_TEMPLATE = "DEFAULT_USER_ADDED_MAIL_TEMPLATE";
	public static final String DEFAULT_USER_ADDED_SMS_TEMPLATE = "DEFAULT_USER_ADDED_SMS_TEMPLATE";

	public static final long[] WEEK_DAY_ARRAY = new long[] { 0, 781, 775, 776, 777, 778, 779, 780 };
	public static final long ATTENDANCE_MARK_PRESENT_ID = 1;

	public static String HOST_IDENTIFIER = "";

	public static final String COA_TYPE_ASSET = "Asset";
	public static final String COA_TYPE_EXPENSE = "Expense";
	public static final String COA_TYPE_INCOME = "Income";
	public static final String COA_TYPE_EQUITY = "Equity";
	public static final String COA_TYPE_LIABILITY = "Liability";

	public static final String CCE_TYPE_PRACTICAL = "Practical";
	public static final String CCE_TYPE_THEORY = "Theory";

	// fee_due_status
	public static final long FEE_DUE_PENDING_STATUS_ID = 965;
	public static final long FEE_DUE_CATEGORY_CHANGED_STATUS_ID = 1419;
	public static final long CARRY_FORWARDED_CHANGED_STATUS_ID = 1669;
	public static final long FEE_DUE_CANCELLED_STATUS_ID = 966;
	public static final long FEE_DUE_ACTIVE_STATUS_ID = 967;
	public static final long FEE_DUE_TRANSPORT_CANCELLED_STATUS_ID = 968;

	public static final long MALE = 1016;
	public static final long FEMALE = 1017;
	public static final long SR_CITIZEN = 1018;

	public static final long TDS_PENDING = 1023;
	public static final long TDS_COLLECTED = 1021;
	public static final long TDS_DUE = 1024;

	public static final long UNPAID_LEAVE_TYPE = 1025;
	public static final long OTHER_PAYMENT_LEAVE_TYPE = 1;
	public static final long SELECT_ALL_CLASS_ID = -1;
	public static final long SELECT_ALL_DEPT_ID = -1;

	// Library Issue Status
	public static final long RETURNED = 1053;
	public static final long ISSUED = 1054;
	public static final long RESERVED = 1055;
	public static final long UNRESERVED = 1056;

	public static final long HOLIDAY_EVENT_TYPE = 1147;
	public static final long HOSTEL_EVENT_TYPE = 1148;
	public static final long STUDENT_SCHOOL_EVENT = 1149;
	// Festival
	public static final long STUDENT_FESTIVAL_TYPE = 1250;
	public static final long STAFF_FESTIVAL_TYPE = 1431;
	public static final long STUDENT_HOLIDAY__TYPE = 902;
	// Staff Holiday Event Type
	public static final long STAFF_HOLIDAY_EVEVT_TYPE = 1392;
	public static final long STAFF_HOLIDAY_TYPE = 1393;

	/**
	 * Letter Format master template id
	 */
	public static final long LETTER_MASTER_TEMPLATE_ID = 1;

	/**
	 * Student List master template id
	 */
	public static final long MASTER_TEMPLATE_ID = 1523;

	/**
	 * Staff master template id
	 */
	public static final long STAFF_MASTER_TEMPLATE_ID = 1591;

	/**
	 * Holding master template id
	 */
	public static final long HOLDING_MASTER_TEMPLATE_ID = 1559;

	// branchcustomData
	public static final long BRANCH_MASTER_TEMPLATE_ID = 1560;

	// Fee Receipt Categories
	public static final int FEE_CLASS_INSTALLMENT = 0;
	public static final int FEE_TYPE_CLASS = 1;
	public static final int CLASS = 2;
	public static final int RECEIPT = 3;
	public static final int DEFAULT = 4;
	public static final int TRANSPORT = 5;
	public static final int HOSTEL = 6;
	public static final int SCHOLARSHIP = 7;
	// Status for fee cancellation
	public static final long ACTIVE_FEE = 1177;
	public static final long INACTIVE_FEE = 1178;
	public static final long CANCELLED_FEE = 1179;

	public static final long COUNTRY_INDIA = 857;

	public static final long TC_LETTER_TYPE = 1191;
	public static final long HOSTEL_HOLIDAY = 1151;

	public static final long LETTER_TYPE_FEE_CERTIFICATE = 1340;
	public static final long FEE_SUB_TYPE = 2;

	// Report Card activity and rubric names
	public static final String SHOW_NO_ACTIVITY = "Show No Activity";
	public static final String SHOW_NO_RUBRIC = "Show No Rubric";

	public static final long REPORT_CARD_COMPONENTS_STUDENT = 2;
	public static final long REPORT_CARD_COMPONENTS_BRANCH = 1;

	public static final String ABSENT_EXAM = "AB";
	public static final String DONT_CONSIDER_EXAM = "DC";

	// STAFF DESIGNATION
	public static final long PRINCIPAL_STAFF_TYPE = 1204;
	public static final long TRANSPORT_INCHARGE_STAFF_TYPE = 1324;

	// Admission Enquiry Status : type GroupId=102
	public static final long ADM_STATUS_INTERESTED = 1316;
	public static final long ADM_STATUS_NOT_INTERESTED = 1317;
	public static final long ADM_STATUS_PENDING = 1318;
	public static final long ADM_STATUS_COMPLETED = 1319;

	public static final long DEFAULT_CLASS_GROUP = 1378;

	// Setting variable for Best of 'N' subjects AssessmentWise
	public static final int SANJEEVAN_VAR = 5;

	// LEAVE_MASTER_TYPE
	public static final long FIRST_HALF = 860;
	public static final long SECOND_HALF = 861;
	public static final long COMP_OFF = 964;
	public static final long UNPAID_LEAVE = 1025;
	public static final long FULL_DAY_lEAVE = 1395;
	public static final long FULL_ABSENT = 1417;

	// Leave Type
	public static final int ANNUAL_LEAVE = 1422;
	public static final int MONTHLY_ACCUMULATE_LEAVE = 1423;
	public static final int MONTHLY_EXPIRY_LEAVE = 1424;
	public static final long FULL_DAY = 1395;

	// Resource Type constants

	public static final long RESOURCE_TYPE_ASSIGNMENT = 18;
	public static final long ASSET_TYPE_ASSIGNMENT = 24;
	public static final long RESOURCE_TYPE_ACTIVITY = 7;
	public static final long ASSET_TYPE_ACTIVITY = 9;
	public static final long ACTIVITY_TYPE_GROUP = 3;
	public static final long ACTIVITY_TYPE_INDIVIDUAL = 4;
	public static final long RESOURCE_TYPE_WORKSHEET = 14;
	public static final long ASSET_TYPE_WORKSHEET = 19;
	public static final long RESOURCE_TYPE_WIKI = 16;
	public static final long RESOURCE_TYPE_NOTEBOOK = 17;
	public static final String RESOURCE_TYPE_WIKI_TEXT = "Wiki";
	public static final long ASSET_TYPE_WIKI = 21;
	public static final long ASSET_TYPE_NOTEBOOK = 23;
	public static final String ASSET_TYPE_WIKI_TEXT = "Wiki";
	public static final String ASSET_TYPE_NOTEBOOK_TEXT = "NoteBook";
	public static final long SOURCE_TYPE_NEXT_EDUCATION = 1;
	public static final long SOURCE_TYPE_EXTERNAL = 2;

	public static final long ASSET_TYPE_DOCUMENT = 6;
	public static final long ASSET_TYPE_SPREADSHEET = 12;
	public static final long ASSET_TYPE_PRESENTATION = 13;

	public static final long RESOURCE_TYPE_DOCUMENT = 4;
	public static final long RESOURCE_TYPE_SPREADSHEET = 11;
	public static final long RESOURCE_TYPE_PRESENTATION = 12;

	// color codes
	public static final long Present = 806;
	public static final long Absent = 807;
	public static final long Sick = 808;
	public static final long Discipline = 809;
	public static final long Holiday = 1222;
	public static final long Half_Day = 1223;
	public static final long Late = 1418;
	public static final long Leave = 1421;

	// map for key & label
	public static Map<String, Object> systemCustomData = new TreeMap<String, Object>();
	public static Map<String, Object> systemCustomDataValues = new TreeMap<String, Object>();
	public static Map<String, Object> attendanceMap = new TreeMap<String, Object>();
	public static Map<String, Object> attendanceMapValues = new TreeMap<String, Object>();
	public static Map<String, Object> feeMap = new TreeMap<String, Object>();
	public static Map<String, Object> feeMapValues = new TreeMap<String, Object>();
	public static Map<String, Object> letterMap = new TreeMap<String, Object>();
	public static Map<String, Object> contactMap = new TreeMap<String, Object>();
	public static Map<String, Object> staffContactMap = new TreeMap<String, Object>();
	public static Map<String, Object> idCardDetails = new TreeMap<String, Object>();
	public static Map<String, Object> Transportdetails = new TreeMap<String, Object>();

	static {
		systemCustomData.put("systemDate", "System Date");
		systemCustomDataValues.put("systemDate", formatDate(DU.now()));
		attendanceMap.put("totalWDays", "Total Working Days");
		attendanceMap.put("totalPDays", "Total Preset Days");
		attendanceMap.put("totalADays", "Total Absent Days");
		attendanceMap.put("pPercent", "Preset Percent");
		attendanceMap.put("aPercent", "Absent Percent");
		attendanceMapValues.put("totalWDays", "getTotalWorkingDays");
		attendanceMapValues.put("totalPDays", "getTotalAttendanceTypeDays");
		attendanceMapValues.put("totalADays", "getTotalAttendanceTypeDays");
		attendanceMapValues.put("pPercent", "getAttendanceTypePercent");
		attendanceMapValues.put("aPercent", "getAttendanceTypePercent");
		feeMap.put("feeDues", "Fee Dues");
		feeMapValues.put("feeDues", "getFeeDueData");
		letterMap.put("letterNo", "Letter No");
		letterMap.put("letterType", "Letter Type");
		contactMap.put("fatherContactNo", "Father Contact No");
		contactMap.put("motherContactNo", "Mother Contact No");
		contactMap.put("localGuardianContactNo", "Local Guradian Contact No");
		contactMap.put("fatherEmail", "Father Email");
		contactMap.put("motherEmail", "Mother Email");
		contactMap.put("localGuardianEmail", "Local Guradian Email");
		contactMap.put("fatherAddress", "Father Address");
		contactMap.put("motherAddress", "Mother Address");
		contactMap.put("localGuardianAddress", "Local Guradian Address");
		idCardDetails.put("dateOfIssue", "Date of Issue");
		idCardDetails.put("validUpto", "Valid Upto");
		Transportdetails.put("routename", "Route Name");
		Transportdetails.put("pickup_stop_name", "PickUp Stop Name");
		staffContactMap.put("phoneNo", "Mobile No");
		staffContactMap.put("Address", "Address");
	}

	public static String formatDate(final Date date) {
		final SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yyyy");
		return sdf.format(date);
	}

	public static String getStackTraceString(final Exception exception) {
		final StringWriter stringWriter = new StringWriter();
		exception.printStackTrace(new PrintWriter(stringWriter));
		return stringWriter.toString();
	}

	/**
	 * This method will return the week day id of the week as per the date
	 * provided.
	 * 
	 * @param date
	 * @return
	 */
	static public long getWeekDayId(final Date date) {
		final Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		final int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
		return WEEK_DAY_ARRAY[dayOfWeek];
	}

	static public String replaceSpChars(final Object pStr) {
		Object str = pStr;
		// Convert problem characters to JavaScript Escaped values
		if (str == null) {
			str = "";
		}
		String tempStr = (String) str;
		tempStr = ERPApp.replace(tempStr, "\\", "\\\\"); // replace backslash
															// with \\
		tempStr = ERPApp.replace(tempStr, "'", "\\\'"); // replace an single
														// quote with \'
		tempStr = ERPApp.replace(tempStr, "\"", "\\\""); // replace a double
															// quote with \"
		tempStr = ERPApp.replace(tempStr, "\r", "\\r"); // replace CR with \r;
		tempStr = ERPApp.replace(tempStr, "\n", "\\n"); // replace LF with \n;

		return tempStr;
	}

	static public String replaceScript(final Object pStr) {
		Object str = pStr;
		if (str == null) {
			str = "";
		}
		String tempStr = (String) str;
		tempStr = ERPApp.replace(tempStr, "\\", "\\\\"); // replace backslash
															// with \\
		tempStr = ERPApp.replace(tempStr, "'", "\\\'"); // replace an single
														// quote with \'
		tempStr = ERPApp.replace(tempStr, "\"", "\\\""); // replace a double
															// quote with \"
		tempStr = ERPApp.replace(tempStr, "'", "%27");
		tempStr = ERPApp.replace(tempStr, "\"", "%22");
		tempStr = ERPApp.replace(tempStr, "\r", "");
		tempStr = ERPApp.replace(tempStr, "\n", "\\n");
		tempStr = ERPApp.replace(tempStr, "%", "%25");
		tempStr = ERPApp.replace(tempStr, "#", "%23");
		tempStr = ERPApp.replace(tempStr, "&", "%26");
		return tempStr;
	}

	static public String replaceDoubleQuotesForScript(final Object pStr) {
		Object str = pStr;
		if (str == null) {
			str = "";
		}
		String tempStr = (String) str;
		// t = ERPApp.replace(t,"\\","\\\\"); // replace backslash with \\
		// t = ERPApp.replace(t,"'","\\\'"); // replace an single quote with \'
		tempStr = ERPApp.replace(tempStr, "\"", "\\\""); // replace a double
															// quote with \"
		// t = ERPApp.replace(t,"'","%27");
		// t = ERPApp.replace(t,"\"","%22");
		// t = ERPApp.replace(t,"\r","");
		// t = ERPApp.replace(t,"\n","\\n");
		// t = ERPApp.replace(t,"%","%25");
		// t = ERPApp.replace(t, "#", "%23");
		// t = ERPApp.replace(t, "&", "%26");
		return tempStr;
	}

	static public String replace(final String string, final String one, final String another) {
		// In a string replace one substring with another
		final StringBuilder resSB = new StringBuilder();
		if (string != null && string.length() > 0) {
			int index = string.indexOf(one, 0);

			int lastpos = 0;
			while (index != -1) {
				resSB.append(string.substring(lastpos, index)).append(another);
				lastpos = index + one.length();
				index = string.indexOf(one, lastpos);

			}
			resSB.append(string.substring(lastpos)); // the rest
		}
		return resSB.toString();
	}

	public static String replaceNewLineWithBrTag(final String pInStr) {
		String inStr = pInStr;
		if (inStr == null) {
			inStr = "";
		}

		String outStr = inStr;
		outStr = replace(inStr, "\r\n", NEW_LINE);
		outStr = replace(outStr, " \n\r", NEW_LINE);
		outStr = replace(outStr, "\r ", NEW_LINE);
		outStr = replace(outStr, " \n", NEW_LINE);

		return outStr;

	}

	/**
	 * This method is used to check whether the object (which is a string) is
	 * empty or not. If it is empty, then true will be returned else false
	 *
	 * @param obj
	 *            Object which is to be converted into string at later stages
	 * @return true if it is empty else false
	 */
	static public boolean isEmptyObject(final Object obj) {
		boolean isValid = true;
		if (obj != null && obj.toString().length() != 0) {
			isValid = false;
		}
		return isValid;
	}

	/**
	 * This method validates the whether the given string is null or empty
	 *
	 * @param str
	 * @return false if the string is not empty.
	 */
	static public boolean isEmptyString(final String str) {
		boolean isValid = true;
		if (str != null && str.length() > 0) {
			isValid = false;
		}
		return isValid;
	}

	static public boolean isEmptyId(final Long Id) {
		boolean isValid = true;
		if (Id != 0 && Id > 0) {
			isValid = false;
		}
		return isValid;
	}

	/**
	 * This method will return true if the list is either empty or null. else it
	 * will return false.
	 *
	 * @param list
	 * @return
	 */
	static public boolean isNullOrEmptyList(final Collection<?> list) {
		boolean isValid = true;
		if (list != null && !list.isEmpty()) {
			isValid = false;
		}
		return isValid;
	}

	/**
	 * This method will return true if date is in correct format. else it will
	 * return false.
	 *
	 * @param inDate
	 * @param pattern
	 * @return false if the date is not in proper format
	 * @author Kapil Arora
	 */
	public static boolean isValidDate(final String inDate, String pattern) {
		if (pattern.isEmpty()) {
			pattern = "dd/mm/yyyy";
		}
		final SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
		dateFormat.setTimeZone(TimeZone.getDefault());
		try {
			dateFormat.parse(inDate.trim());
		} catch (final ParseException pe) {
			return false;
		}
		return true;
	}

	/**
	 * This method will return the page number based on the actual no. of
	 * records, records per page and the current page number. This method is
	 * generally used during delete operation. During delete, the pageNo might
	 * get changed. i.e. if only one record exists on a page, if we delete that
	 * record, it should come to the prior page.
	 *
	 * @param rowCount
	 *            total number of records present as per the given search
	 *            criteria
	 * @param recordsPerPage
	 *            number of records that should be present per page
	 * @param pageNo
	 *            current pageNo from which the user is performing the
	 *            operation.
	 * @return
	 */
	public static int getPageNo(final long rowCount, final Integer recordsPerPage, final Integer pageNo) {
		Integer localPageNo = pageNo;
		if (rowCount <= (pageNo - 1) * recordsPerPage) {
			if (rowCount % recordsPerPage > 0) {
				localPageNo = Double.valueOf(Math.ceil(rowCount / recordsPerPage)).intValue();
			} else {
				localPageNo = pageNo - 1;
			}
		}
		return localPageNo;
	}

	/**
	 *
	 * @param dateToBeTested
	 * @param startDate
	 * @param endDate
	 * @return true if the dateToBeTested falls between startDate and endDate
	 */
	public static boolean compareDates(Date dateToBeTested, final Date startDate, final Date endDate) {
		boolean resultBoolean = false;
		/*
		 * if(startDate.compareTo(dateToBeTested) <= 0 &&
		 * dateToBeTested.compareTo(endDate) <= 0)
		 */
		dateToBeTested = DateUtils.truncate(dateToBeTested, Calendar.DATE);
		if (startDate.compareTo(dateToBeTested) <= 0 && dateToBeTested.compareTo(endDate) <= 0) {
			resultBoolean = true;
		}
		return resultBoolean;
	}

	public final static String VERIFICATION_TEMPLATE = " Your verification no : ";
	public static final long DAY_WISE_ATTENDANCE = 1;
	public static final long DAY_SESSION_WISE_ATTENDANCE = 2;
	public static final long PERIOD_WISE_ATTENDANCE = 3;

	/**
	 *
	 * @param dateToBeTested
	 * @param startDate
	 * @param endDate
	 * @return true if the firstDate greater than second Date
	 * @author kailashchand
	 */
	public static boolean compareBetweenDates(final Date firstDate, final Date secondDate) {
		boolean resultBoolean = false;
		final Date secDate = DateUtils.truncate(secondDate, Calendar.DATE);
		if (secDate.compareTo(firstDate) <= 0) {
			resultBoolean = true;
		}
		return resultBoolean;
	}

	public static String getDomainFromRequest(final HttpServletRequest request) {
		String serverIP = request.getServerName();
		if (serverIP == null) {
			serverIP = "localhost";
		}
		final int serverPort = request.getServerPort();
		final String serverDomain = request.getScheme() + "://" + serverIP + ":" + serverPort
				+ request.getContextPath();
		return serverDomain;

	}

	/**
	 * @author kapil_a
	 * @return
	 */
	public static String getDomain() {

		final ServletRequestAttributes sra = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		final HttpServletRequest request = sra.getRequest();
		String serverIP = request.getServerName();
		if (serverIP == null) {
			serverIP = "localhost";
		}
		final int serverPort = request.getServerPort();
		final String serverDomain = request.getScheme() + "://" + serverIP + ":" + serverPort
				+ request.getContextPath();
		return serverDomain;
	}

	public static boolean isNumeric(final String str) {

		return str.matches("-?\\d+(\\.\\d+)?");
	}

	public static Date convertToDate(final String dateInStringFormat, String outPattern) throws ParseException {
		if (outPattern == null || outPattern.isEmpty()) {
			outPattern = "dd/mm/yyyy";
		}
		final SimpleDateFormat formatter = new SimpleDateFormat(outPattern);
		formatter.setTimeZone(TimeZone.getDefault());
		final Date date = formatter.parse(dateInStringFormat);
		return date;
	}

	public static boolean isNewObject(final Object entity) {
		try {
			final Object id = PropertyUtils.getSimpleProperty(entity, "id");
			if (id instanceof Long) {
				return ((Long) id).longValue() == 0;
			}
			if (id instanceof Integer) {
				return ((Integer) id).intValue() == 0;
			}
			if (id instanceof String) {
				return id == null;
			}
		} catch (final Exception e) {

		}
		return false;
	}

	public static void setDataToResponse(final HttpServletResponse response, final String data, final String type) {
		response.setStatus(HttpServletResponse.SC_OK);
		if (type != null) {
			response.setContentType(type);
		}
		try {
			response.getWriter().write(data);
			response.getWriter().flush();
			response.getWriter().close();
		} catch (final IOException e) {
			response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
			LogMessage.log(e.getMessage());
		}
	}

	public static void setErrorToResponse(final HttpServletResponse response) {
		try {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		} catch (final IOException e) {
			e.printStackTrace();
			LogMessage.log(e.getMessage());
		}
	}

	public static Map<String, String> getNumberFormats() {
		final HashMap<String, String> map = new HashMap<String, String>();
		map.put("###,###.###", "123,456.789");
		map.put("###.##", "123456.78");
		map.put("000000.000", "000123.780");
		return map;
	}

	public static List<Integer> getSequenceList(final int seqCnt) {
		final List<Integer> seqList = new ArrayList<Integer>();
		for (int i = 1; i <= seqCnt; i++) {
			seqList.add(i);
		}
		return seqList;
	}

}