package com.nexteducation.NextRewards.module.model.response;

public class CustomQuestionResponse {

	private String Badge;

	private int correct;

	private int wrong;

	public String getBadge() {
		return Badge;
	}

	public void setBadge(String badge) {
		Badge = badge;
	}

	public int getCorrect() {
		return correct;
	}

	public void setCorrect(int correct) {
		this.correct = correct;
	}

	public int getWrong() {
		return wrong;
	}

	public void setWrong(int wrong) {
		this.wrong = wrong;
	}

}
