//package com.nexteducation.NextRewards.util;
//
//import java.util.concurrent.TimeUnit;
//import java.util.concurrent.locks.Lock;
//
//import org.redisson.Redisson;
//import org.redisson.api.RedissonClient;
//import org.redisson.config.Config;
//import org.redisson.config.SingleServerConfig;
//
//public abstract class DistributedLocker {
//
//	private String ipAddress=null;
//	private String port="6379";
//	private String password=null;
//	RedissonClient redisson=null;
//	
//	public DistributedLocker(String ipAddress, String port ) {
//		this.ipAddress=ipAddress;
//		this.port=port;
//		configuration();
//	}
//	
//	public DistributedLocker(String ipAddress, String port,String password ) {
//		this.ipAddress=ipAddress;
//		this.port=port;
//		this.password=password;
//		configuration();
//	}
//	
//	
//	private void configuration(){
//		Config config = new Config();
//		SingleServerConfig  serverConfig = config.useSingleServer().setAddress(ipAddress+":"+port);
//		if(password!=null){
//			serverConfig.setPassword(password);
//		}
//		redisson=Redisson.create(config);
//	}
//	
//	public void getLock(String key){
//		Lock lock = redisson.getLock(key);
//		try{
//			lock.tryLock(1000,TimeUnit.SECONDS);
//			 perform();
//			}
//		catch (Exception e)
//		{
//			e.printStackTrace();
//		}
//		finally{
//			lock.unlock();
//		}
//	}
//
//	protected abstract void perform();
//}
