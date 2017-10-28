package com.nexteducation.NextRewards.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import com.nexteducation.NextService.exception.NextServiceException;

public class Util {

	static public boolean isEmptyId(final Long Id) {
		boolean isValid = true;
		if (Id != 0 && Id > 0) {
			isValid = false;
		}
		return isValid;
	}

	static public boolean isEmptyString(final String str) {
		boolean isValid = true;
		if (str != null && str.length() > 0) {
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
	static public boolean isNullOrEmptyList(final List<?> list) {
		boolean isValid = true;
		if (list != null && !list.isEmpty()) {
			isValid = false;
		}
		return isValid;
	}

	public static ModelAndView handleModelError(ModelAndView modelAndView, final Exception exception) {
		modelAndView = new ModelAndView(new MappingJackson2JsonView());
		modelAndView.addObject("hasError", true);
		ServiceLogger.error("Something went wrong ", exception);
		if (exception instanceof NextServiceException) {
			modelAndView.addObject("message", exception.getMessage());
		} else {
			modelAndView.addObject("message", "Something went wrong ");
		}
		return modelAndView;
	}

	public static String getMd5Hash(final String string) throws NextServiceException {
		try {
			final MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(string.getBytes());
			final byte[] bytes = md.digest();
			final StringBuilder sb = new StringBuilder();
			for (final byte b : bytes) {
				sb.append(Integer.toString((b & 0xff) + 0x100, 16).substring(1));
			}
			return sb.toString();
		} catch (final NoSuchAlgorithmException exception) {
			ServiceLogger.error("Error occured while hasing", exception);
			throw new NextServiceException("NextSevice","md5HashError",500,"Error occured while hasing","Error occured while hasing");
		}
	}
}
