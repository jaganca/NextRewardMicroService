package com.nexteducation.NextRewards.module.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import com.nexteducation.NextRewards.module.model.AppUsageData;
import com.nexteducation.NextRewards.module.model.bo.Student;
import com.nexteducation.NextRewards.module.model.bo.StudentPoints;
import com.nexteducation.NextRewards.module.repository.StudentPointsRepository;
import com.nexteducation.NextRewards.module.repository.StudentRepository;
import com.nexteducation.NextRewards.module.repository.SubjectRepository;
import com.nexteducation.NextRewards.util.NextRewardsUrls;

import io.swagger.annotations.ApiOperation;

public class RewardCalculator {

	@Autowired
	StudentRepository studentRepository;
	
	@Autowired
	StudentPointsRepository studentPointRepository;

	
	@GET
	@Path(NextRewardsUrls.REWARDS)
	@ApiOperation(value = "Save Rewards", notes = "Save Rewards")
	public void saveMarks(List<AppUsageData> usageList) throws IOException {

		
		// sorting dates
		usageList.sort((p1, p2) -> Long.valueOf(p1.getMilliseconds()).compareTo(Long.valueOf(p2.getMilliseconds())));

		long daySeconds = usageList.get(0).getMilliseconds();

		int educationalApps = 0;
		int distractionApps = 0;

		String category = "EDUCATION";
		String accessToken = "&access_token=6af80ec518c4d10306aa16f9fb858e31d31b73bb";
		String apiUrl = "https://data.42matters.com/api/v2.0/android/apps/lookup.json?p=";
		Long studentId = usageList.get(0).getStudentId();
		Long classId = usageList.get(0).getClassId();

		// save all the records to table - fetch them and calculate marks
		for (int i = 0; i < usageList.size(); i++) {
			String url = apiUrl + usageList.get(i).getName() + accessToken;
			if (!usageList.get(i).getName().contains("nexteducation")) {
				JSONObject jsonObject = new JSONObject();
				StringBuilder stringBuilder = new StringBuilder();
				try {
					HttpGet httpGet = new HttpGet(url);
					HttpClient client = new DefaultHttpClient();
					HttpResponse response = client.execute(httpGet);
					HttpEntity entity = response.getEntity();
					InputStream stream = entity.getContent();
					int b;
					while ((b = stream.read()) != -1) {
						stringBuilder.append((char) b);
					}
					jsonObject = new JSONObject(stringBuilder.toString());

					if (!jsonObject.getJSONObject("cat_key").toString().equals(category)) {
						distractionApps += usageList.get(i).getMinutes();
					}
				} catch (JSONException e) {
					e.printStackTrace();
				} catch (ClientProtocolException e) {
				} catch (IOException e) {
				}
			} else {
				educationalApps += usageList.get(i).getMinutes();
			}
			long rewards = this.rewards(educationalApps,distractionApps);
		    long positiveRewards = 0;
		    long negativeRewards = 0;
			if(rewards>=0){
				positiveRewards = rewards;
			}else{
				negativeRewards = rewards; 
			}

			//save it to table
			//create a list to save it to table
		   StudentPoints s = new StudentPoints();
           s.setStudent(studentRepository.findById(studentId));
           s.setPospoints(Long.valueOf(positiveRewards));
           s.setNegpoints(Long.valueOf(negativeRewards));
		   s.setPoints(studentRepository.findById(studentId).getPoints()+Long.valueOf(rewards));
		   
		   //save in student point repo
		   studentPointRepository.save(s);
		   
		   Student student = studentRepository.findById(studentId);
		   student.setPoints(studentRepository.findById(studentId).getPoints()+Long.valueOf(rewards));
		   
		   studentRepository.save(student);
		}
	}
	
	private long rewards(int education, int distraction){
		long marks = 10;
		float percent = 0.25f;
		while(percent<=1 && distraction > (percent*education)){
			percent = percent+0.25f;
			marks = marks-5;
		}
		return marks;
	}
}