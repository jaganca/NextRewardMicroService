package com.nexteducation.NextRewards.module.filter.core;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

/**
 * The Class FieldUtil.
 */
public class FieldUtil {

	/**
	 * Gets the field maps.
	 *
	 * @param clazz the clazz
	 * @return the field maps
	 */
	@SuppressWarnings("rawtypes")
	public static Map<String, Object> getFieldMaps(final Class clazz) {
		final Field[] fields = clazz.getDeclaredFields();
		final Map<String, Object> fieldMaps = new HashMap<String, Object>();
		for (int i = 0; i < fields.length; i++) {
			if (fields[i].isAnnotationPresent(FieldMap.class)) {
				final FieldMap fieldMap = fields[i].getAnnotation(FieldMap.class);
				final String userFieldName = fieldMap.fieldName();
				final String boFieldName = fields[i].getName();
				fieldMaps.put(clazz.getSimpleName() + "." + boFieldName, userFieldName);
			}
		}
		return fieldMaps;
	}

}