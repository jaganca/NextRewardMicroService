package com.nexteducation.NextRewards.module.repository;

import java.io.Serializable;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nexteducation.NextRewards.module.model.bo.UserRegistration;
import com.nexteducation.NextRewards.module.model.enums.LoginType;

public interface UserRegistrationRepository extends JpaRepository<UserRegistration, Serializable> {

	public UserRegistration findByLoginTypeAndUserName(LoginType loginType, String name);

	public UserRegistration findByLoginTypeAndUserNameAndPassword(LoginType loginType, String name, String password);

}
