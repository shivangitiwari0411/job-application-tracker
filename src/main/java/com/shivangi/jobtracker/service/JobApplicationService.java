package com.shivangi.jobtracker.service;

import com.shivangi.jobtracker.dto.JobApplicationDTO;
import com.shivangi.jobtracker.entity.JobApplication;
import com.shivangi.jobtracker.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;
import com.shivangi.jobtracker.exception.JobNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class JobApplicationService {
    private static final Logger logger =
            LoggerFactory.getLogger(JobApplicationService.class);

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public JobApplicationDTO saveJob(JobApplicationDTO dto) {
        logger.info("Saving job for company: {}", dto.getCompanyName());

        JobApplication job = convertToEntity(dto);

        JobApplication savedJob = repository.save(job);

        return convertToDTO(savedJob);
    }

    public List<JobApplication> getAllJobs() {
        logger.info("Fetching all jobs");
        return repository.findAll();
    }
    public JobApplicationDTO getJobById(Long id) {
        JobApplication job = repository.findById(id)
                .orElseThrow(() -> new JobNotFoundException(id));

        return convertToDTO(job);
    }
    public void deleteJob(Long id) {
        logger.info("Deleting job with ID {}", id);
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
    public Page<JobApplication> getJobsPaginated(int page, int size) {
        return repository.findAll(PageRequest.of(page, size));
    }
    public List<JobApplication> getJobsSorted(String field) {
        return repository.findAll(Sort.by(field));
    }
    private JobApplicationDTO convertToDTO(JobApplication job) {

        JobApplicationDTO dto = new JobApplicationDTO();

        dto.setId(job.getId());
        dto.setCompanyName(job.getCompanyName());
        dto.setRole(job.getRole());
        dto.setStatus(job.getStatus());

        return dto;
    }
    private JobApplication convertToEntity(JobApplicationDTO dto) {

        JobApplication job = new JobApplication();

        job.setId(dto.getId());
        job.setCompanyName(dto.getCompanyName());
        job.setRole(dto.getRole());
        job.setStatus(dto.getStatus());

        return job;
    }
}
