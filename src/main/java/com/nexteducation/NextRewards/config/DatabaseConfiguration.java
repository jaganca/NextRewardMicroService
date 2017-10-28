package com.nexteducation.NextRewards.config;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.hibernate.SessionFactory;
import org.hibernate.jpa.HibernateEntityManagerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.nexteducation.NextRewards.hibernate.datasourceRouting.DbType;
import com.nexteducation.NextRewards.hibernate.datasourceRouting.RoutingDataSource;

/**
 * The Class DatabaseConfiguration.
 *
 * @author krishnakanthv
 */
@Configuration
@EnableAutoConfiguration(exclude = { DataSourceAutoConfiguration.class })
@EnableTransactionManagement
@Component
public class DatabaseConfiguration {

	/** The env. */
	@Autowired
	private Environment env;

	/**
	 * Session factory.
	 *
	 * @param hemf the hemf
	 * @return the session factory
	 */
	@Bean
	public SessionFactory sessionFactory(HibernateEntityManagerFactory hemf) {
		return hemf.getSessionFactory();
	}

	/**
	 * Data source master.
	 *
	 * @return the data source
	 */
	public DataSource dataSourceMaster() {
		org.apache.tomcat.jdbc.pool.DataSource masterDS = new org.apache.tomcat.jdbc.pool.DataSource();
		masterDS.setDriverClassName(env.getProperty("spring.datasource.driver-class-name"));
		masterDS.setUrl(env.getProperty("spring.datasourceMaster.url"));
		masterDS.setUsername(env.getProperty("spring.datasourceMaster.username"));
		masterDS.setPassword(env.getProperty("spring.datasourceMaster.password"));
		masterDS.setDefaultAutoCommit(true);
		masterDS.setTestWhileIdle(true);
		masterDS.setValidationQuery(env.getProperty("spring.datasource.validationQuery"));
		return new TransactionAwareDataSourceProxy(masterDS);
	}

	/**
	 * Data source replica.
	 *
	 * @return the data source
	 */
	public DataSource dataSourceReplica() {
		org.apache.tomcat.jdbc.pool.DataSource replicaDS = new org.apache.tomcat.jdbc.pool.DataSource();
		replicaDS.setDriverClassName(env.getProperty("spring.datasource.driver-class-name"));
		replicaDS.setUrl(env.getProperty("spring.datasourceReplica.url"));
		replicaDS.setUsername(env.getProperty("spring.datasourceReplica.username"));
		replicaDS.setPassword(env.getProperty("spring.datasourceReplica.password"));
		replicaDS.setDefaultAutoCommit(true);
		replicaDS.setTestWhileIdle(true);
		replicaDS.setValidationQuery(env.getProperty("spring.datasource.validationQuery"));
		return new TransactionAwareDataSourceProxy(replicaDS);
	}

	/**
	 * Data source.
	 *
	 * @return the routing data source
	 */
	@Bean
	public RoutingDataSource dataSource() {
		RoutingDataSource resolver = new RoutingDataSource();

		Map<Object, Object> dataSources = new HashMap<Object, Object>();
		dataSources.put(DbType.MASTER, dataSourceMaster());
		dataSources.put(DbType.REPLICA, dataSourceReplica());

		resolver.setTargetDataSources(dataSources);
		resolver.setDefaultTargetDataSource(dataSourceMaster());
		resolver.afterPropertiesSet();

		return resolver;
	}

	/**
	 * Transaction manager.
	 *
	 * @return the jpa transaction manager
	 */
	@Bean
	public JpaTransactionManager transactionManager() {
		JpaTransactionManager transactionManager = new JpaTransactionManager();
		transactionManager.setDataSource(dataSource());
		return transactionManager;
	}

}