package com.nexteducation.NextRewards.module.model.params;

import javax.validation.constraints.NotNull;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;

import com.nexteducation.NextRewards.util.NextRewardsUrls;

public class ChapterFetchParams {

	@QueryParam(NextRewardsUrls.SUBJECT_ID)
	private Long subjectId;

	@QueryParam(NextRewardsUrls.CLASS_ID)
	private Long classId;

	@QueryParam(NextRewardsUrls.CHAPTER_ID)
	private Long chapterId;

	@QueryParam(NextRewardsUrls.STUDENT_ID)
	private Long studentId;

	public Long getSubjectId() {
		return subjectId;
	}

	public void setSubjectId(Long subjectId) {
		this.subjectId = subjectId;
	}

	public Long getClassId() {
		return classId;
	}

	public void setClassId(Long classId) {
		this.classId = classId;
	}

	public Long getChapterId() {
		return chapterId;
	}

	public void setChapterId(Long chapterId) {
		this.chapterId = chapterId;
	}

	public Long getStudentId() {
		return studentId;
	}

	public void setStudentId(Long studentId) {
		this.studentId = studentId;
	}

}
