package com.nexteducation.NextRewards.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.redisson.config.SingleServerConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * The Class RedisSessionConfig.
 */
@Configuration
public class RedisSessionConfig {


	/** The host. */
	@Value("${spring.redis.host}")
	String host="192.168.10.9";

	/** The port. */
	@Value("${spring.redis.port}")
	String port="6379";

//	String password=null;

	/**
 * Redisson.
 *
 * @return the redisson client
 */
@Bean
	public RedissonClient redisson() {
		Config config = new Config();
		SingleServerConfig serverConfig = config.useSingleServer().setAddress(host + ":" + port);
//		if (password != null) {
//			serverConfig.setPassword(password);
//		}
		return Redisson.create(config);

	}

}