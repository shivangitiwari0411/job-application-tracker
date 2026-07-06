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
import java.time.LocalDate;
import com.shivangi.jobtracker.entity.User;
import com.shivangi.jobtracker.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class JobApplicationService {
    private static final Logger logger =
            LoggerFactory.getLogger(JobApplicationService.class);

    private final JobApplicationRepository repository;
    private final UserRepository userRepository;

    public JobApplicationService(
            JobApplicationRepository repository,
            UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    public JobApplicationDTO saveJob(JobApplicationDTO dto) {

        logger.info("Saving job for company: {}", dto.getCompanyName());

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        JobApplication job = convertToEntity(dto);

        job.setUser(user);

        JobApplication savedJob = repository.save(job);

        return convertToDTO(savedJob);
    }

    public List<JobApplication> getAllJobs() {

        logger.info("Fetching jobs for current user");

        User user = getCurrentUser();

        return repository.findByUser(user);
    }
    public JobApplicationDTO getJobById(Long id) {
        JobApplication job = repository.findById(id)
                .orElseThrow(() -> new JobNotFoundException(id));

        return convertToDTO(job);
    }
    public void deleteJob(Long id) {

        logger.info("Deleting job with ID {}", id);

        User user = getCurrentUser();

        JobApplication job = repository.findById(id)
                .orElseThrow(() -> new JobNotFoundException(id));

        if (!job.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        repository.delete(job);
    }
    public JobApplication updateJob(Long id, JobApplication updatedJob) {

        User user = getCurrentUser();

        JobApplication existingJob = repository.findById(id)
                .orElse(null);

        if (existingJob == null) {
            return null;
        }

        if (!existingJob.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        existingJob.setCompanyName(updatedJob.getCompanyName());
        existingJob.setRole(updatedJob.getRole());
        existingJob.setStatus(updatedJob.getStatus());
        existingJob.setDateApplied(updatedJob.getDateApplied());

        return repository.save(existingJob);
    }
    public List<JobApplication> getJobsByCompany(String companyName) {
        return repository.findByCompanyName(companyName);
    }

    public List<JobApplication> getJobsByStatus(String status) {
        return repository.findByStatus(status);
    }
    public Page<JobApplication> getJobsPaginated(int page, int size) {

        User user = getCurrentUser();

        return repository.findByUser(
                user,
                PageRequest.of(page, size)
        );
    }
    public List<JobApplication> getJobsSorted(String field) {

        User user = getCurrentUser();

        return repository.findByUser(user)
                .stream()
                .sorted((a, b) -> {

                    switch (field) {

                        case "companyName":
                            return a.getCompanyName().compareToIgnoreCase(b.getCompanyName());

                        case "role":
                            return a.getRole().compareToIgnoreCase(b.getRole());

                        case "status":
                            return a.getStatus().compareToIgnoreCase(b.getStatus());

                        default:
                            return 0;
                    }

                })
                .toList();
    }
    private JobApplicationDTO convertToDTO(JobApplication job) {

        JobApplicationDTO dto = new JobApplicationDTO();

        dto.setId(job.getId());
        dto.setCompanyName(job.getCompanyName());
        dto.setRole(job.getRole());
        dto.setStatus(job.getStatus());
        dto.setDateApplied(job.getDateApplied());

        return dto;
    }
    private JobApplication convertToEntity(JobApplicationDTO dto) {

        JobApplication job = new JobApplication();

        job.setId(dto.getId());
        job.setCompanyName(dto.getCompanyName());
        job.setRole(dto.getRole());
        job.setStatus(dto.getStatus());
        if (dto.getDateApplied() == null) {
            job.setDateApplied(LocalDate.now());
        } else {
            job.setDateApplied(dto.getDateApplied());
        }

        return job;
    }
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}
