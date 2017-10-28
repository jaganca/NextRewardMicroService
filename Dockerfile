FROM 225420996409.dkr.ecr.ap-southeast-1.amazonaws.com/microservicebase:latest

ADD target/NextRewards.war /apache-tomcat-8.0.41/webapps/.
 