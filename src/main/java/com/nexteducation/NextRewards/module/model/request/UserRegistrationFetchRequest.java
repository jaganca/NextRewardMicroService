package com.nexteducation.NextRewards.module.model.request;

import javax.validation.constraints.NotNull;

import com.nexteducation.NextRewards.module.model.enums.LoginType;

public class UserRegistrationFetchRequest {

	@NotNull
	private LoginType loginType;

	@NotNull
	private String userName;

	@NotNull
	private String password;

	public LoginType getLoginType() {
		return loginType;
	}

	public void setLoginType(LoginType loginType) {
		this.loginType = loginType;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
