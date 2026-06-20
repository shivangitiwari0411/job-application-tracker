package com.shivangi.jobtracker.repository;

import com.shivangi.jobtracker.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByCompanyName(String companyName);

    List<JobApplication> findByStatus(String status);

}