# Job Application Tracker

A Spring Boot REST API application for managing job applications.

## Features

- Add a new job application
- View all job applications
- View a job application by ID
- Update a job application
- Delete a job application
- Swagger API Documentation

## Technologies Used

- Java 23
- Spring Boot 3.5.14
- Spring Data JPA
- MySQL
- Maven
- Swagger OpenAPI
- Git & GitHub

## API Endpoints

### Get All Jobs

GET /jobs

### Get Job By ID

GET /jobs/{id}

### Create Job

POST /jobs

### Update Job

PUT /jobs/{id}

### Delete Job

DELETE /jobs/{id}

## Database

MySQL Database:

```sql
CREATE DATABASE jobtracker;
```

## Run the Project

1. Clone the repository

```bash
git clone https://github.com/shivangitiwari0411/job-application-tracker.git
```

2. Configure MySQL credentials in:

```properties
src/main/resources/application.properties
```

3. Run the application

```bash
./mvnw spring-boot:run
```

4. Open Swagger UI

```text
http://localhost:8080/swagger-ui/index.html
```

## Author

Shivangi Tiwari
Computer Science Engineering Student
VIT Bhopal