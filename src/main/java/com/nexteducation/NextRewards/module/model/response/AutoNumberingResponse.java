package com.nexteducation.NextRewards.module.model.response;

import com.nexteducation.NextRewards.module.model.enums.Status;
import com.nexteducation.NextRewards.module.model.enums.Type;

public class AutoNumberingResponse {
	
	private String id;
	
	private Long branchId;

	private long subType;

	private Type type;

	private String fixedValue;

	private long variableStart;
	
	private String lastRunVariable;

	private Status status;

	private String createdBy;
    
    private String itemGroup;

	private Long academicSessionId;

	public long getSubType() {
		return subType;
	}

	public void setSubType(long subType) {
		this.subType = subType;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getFixedValue() {
		return fixedValue;
	}

	public void setFixedValue(String fixedValue) {
		this.fixedValue = fixedValue;
	}

	public long getVariableStart() {
		return variableStart;
	}

	public void setVariableStart(long variableStart) {
		this.variableStart = variableStart;
	}

	public String getLastRunVariable() {
		return lastRunVariable;
	}

	public void setLastRunVariable(String lastRunVariable) {
		this.lastRunVariable = lastRunVariable;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getItemGroup() {
		return itemGroup;
	}

	public void setItemGroup(String itemGroup) {
		this.itemGroup = itemGroup;
	}


	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public  Long getBranchId() {
		return branchId;
	}

	public void setBranchId(Long branchId) {
		this.branchId = branchId;
	}

	public Long getAcademicSessionId() {
		return academicSessionId;
	}

	public void setAcademicSessionId(Long academicSessionId) {
		this.academicSessionId = academicSessionId;
	}
}
