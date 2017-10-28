package com.nexteducation.NextRewards.config;

import org.glassfish.jersey.servlet.ServletContainer;
import org.glassfish.jersey.servlet.ServletProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.nexteducation.NextRewards.util.LogMessage;
import com.nexteducation.NextService.config.NELogFilter;
import com.nexteducation.NextService.hibernate.listener.DataAccessListener;
import com.nexteducation.nextevent.service.core.ThriftEventProducerService;
import com.nexteducation.nextevent.service.impl.ThriftEventProducerServiceImpl;

/**
 * The Class MvcConfig.
 */
@Configuration
@EnableWebMvc
public class MvcConfig extends WebMvcConfigurerAdapter {

	// @Autowired
	// private SessionTracker sessionTracker;
	//
	// @Override
	// public void addInterceptors(InterceptorRegistry registry) {
	// registry.addInterceptor(sessionTracker).addPathPatterns("/**");
	// }

	/**
	 * Message source.
	 *
	 * @return the reloadable resource bundle message source
	 */
	@Bean
	public ReloadableResourceBundleMessageSource messageSource() {
		LogMessage.info("MvcConfig.messageSource()");
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setBasename("classpath:config.properties");
		messageSource.setCacheSeconds(10); // reload messages every 10 seconds
		return messageSource;
	}

	/** 
	 * @see org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter#addResourceHandlers(org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry)
	 */
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
	}

	/**
	 * Jersey servlet.
	 *
	 * @return the servlet registration bean
	 */
	@Bean
	public ServletRegistrationBean jerseyServlet() {
		ServletRegistrationBean registration = new ServletRegistrationBean(new ServletContainer(), "/NextRewards/*");
		// Rest resources will be available in the path /NextCalendar/*
		registration.addInitParameter(ServletProperties.JAXRS_APPLICATION_CLASS, JerseyConfig.class.getName());
		registration.setLoadOnStartup(1);
		registration.setName("jersey-servlet");
		return registration;
	}
	
	/**
	 * Filter.
	 *
	 * @return the NE log filter
	 */
	@Bean
	NELogFilter filter() {
	    return new NELogFilter();
	}

	
	/**
	 * Thrift event producer service.
	 *
	 * @return the thrift event producer service
	 */
	@Bean
	public ThriftEventProducerService thriftEventProducerService() {
		return new ThriftEventProducerServiceImpl();
	}
	
	@Bean
	@ConditionalOnProperty(name="hibernate.event.listener.data-access.enable", havingValue="true")
	public DataAccessListener dataAccessListener(){
		return new DataAccessListener();
	}
}