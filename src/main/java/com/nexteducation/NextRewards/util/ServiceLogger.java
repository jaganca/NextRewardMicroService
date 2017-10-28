package com.nexteducation.NextRewards.util;

import org.apache.log4j.Logger;

public class ServiceLogger {

	private static Logger logger = Logger.getLogger(ServiceLogger.class);

	public static void debug(final String message) {
		ServiceLogger.logger.error(message);
	}

	public static void error(final String message) {
		ServiceLogger.logger.error(message);
	}

	public static void error(final String message, final Exception exception) {
		ServiceLogger.logger.error(message);
		exception.printStackTrace();
	}

	public static void trace(final String message) {
		ServiceLogger.logger.trace(message);
	}

	public static void log(final String message) {
		ServiceLogger.logger.log(null, message);
	}
}
