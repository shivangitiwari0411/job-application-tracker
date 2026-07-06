package com.shivangi.jobtracker.repository;

import com.shivangi.jobtracker.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.shivangi.jobtracker.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByCompanyName(String companyName);

    List<JobApplication> findByStatus(String status);
    List<JobApplication> findByUser(User user);

    Page<JobApplication> findByUser(User user, Pageable pageable);

}