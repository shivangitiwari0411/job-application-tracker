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
    public JobApplication getJobById(Long id) {
        return repository.findById(id).orElse(null);
    }
    public void deleteJob(Long id) {
        repository.deleteById(id);
    }
    public JobApplication updateJob(Long id, JobApplication updatedJob) {
        JobApplication existingJob = repository.findById(id).orElse(null);

        if (existingJob != null) {
            existingJob.setCompanyName(updatedJob.getCompanyName());
            existingJob.setRole(updatedJob.getRole());
            existingJob.setStatus(updatedJob.getStatus());

            return repository.save(existingJob);
        }

        return null;
    }
    public List<JobApplication> getJobsByCompany(String companyName) {
        return repository.findByCompanyName(companyName);
    }

    public List<JobApplication> getJobsByStatus(String status) {
        return repository.findByStatus(status);
    }
}
