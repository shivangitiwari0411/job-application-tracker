package com.shivangi.jobtracker.service;

import com.shivangi.jobtracker.entity.JobApplication;
import com.shivangi.jobtracker.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public JobApplication saveJob(JobApplication job) {
        return repository.save(job);
    }

    public List<JobApplication> getAllJobs() {
        return repository.findAll();
    }
}
