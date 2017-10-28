package com.nexteducation.NextRewards;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.commons.util.InetUtils;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.eureka.EurekaInstanceConfigBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.netflix.appinfo.AmazonInfo;
import com.netflix.appinfo.AmazonInfo.MetaDataKey;

/**
 * The Class Application.
 */
@SpringBootApplication(scanBasePackages = { "com.nexteducation.NextRewards", "com.nexteducation.NextService.configure" })
@EnableJpaRepositories("com.nexteducation.NextRewards.module.repository")
@EnableEurekaClient
@EnableDiscoveryClient
public class Application extends SpringBootServletInitializer {

	@Autowired
	Environment env;

	/**
	 * The main method.
	 *
	 * @param args the arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	/** 
	 * @see org.springframework.boot.web.support.SpringBootServletInitializer#configure(org.springframework.boot.builder.SpringApplicationBuilder)
	 */
	@Override
	protected SpringApplicationBuilder configure(final SpringApplicationBuilder application) {
		Map<String, Object> props = new HashMap<>();
		props.put("spring.config.name", "NextRewards");
		application.properties(props);
		return application.sources(Application.class);
	}

	/**
	 * Eureka instance config.
	 *
	 * @param inetUtils the inet utils
	 * @return the eureka instance config bean
	 */
	@Bean
	@Profile("docker")
	public EurekaInstanceConfigBean eurekaInstanceConfig(InetUtils inetUtils) {
		System.out.println("in eurekaInstanceConfig");
		EurekaInstanceConfigBean config = new EurekaInstanceConfigBean(inetUtils);
		AmazonInfo info = AmazonInfo.Builder.newBuilder().autoBuild("eureka");
		config.setDataCenterInfo(info);
		info.getMetadata().put(MetaDataKey.localHostname.getName(), info.get(AmazonInfo.MetaDataKey.localIpv4));
		config.setHostname(info.get(AmazonInfo.MetaDataKey.localHostname));
		config.setIpAddress(info.get(AmazonInfo.MetaDataKey.localIpv4));
		System.out.println("in  eurekaInstanceConfig " + config.getHostname() + " " + config.getIpAddress());
		config.setNonSecurePort(80);
		return config;
	}
}
