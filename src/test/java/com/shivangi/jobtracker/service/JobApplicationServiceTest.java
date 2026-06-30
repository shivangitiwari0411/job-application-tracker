package com.shivangi.jobtracker.service;

import com.shivangi.jobtracker.dto.JobApplicationDTO;
import com.shivangi.jobtracker.entity.JobApplication;
import com.shivangi.jobtracker.repository.JobApplicationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository repository;

    @InjectMocks
    private JobApplicationService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void testSaveJob() {

        JobApplicationDTO dto = new JobApplicationDTO();
        dto.setCompanyName("Google");
        dto.setRole("Software Engineer");
        dto.setStatus("Applied");

        JobApplication savedJob = new JobApplication();
        savedJob.setId(1L);
        savedJob.setCompanyName("Google");
        savedJob.setRole("Software Engineer");
        savedJob.setStatus("Applied");

        when(repository.save(org.mockito.ArgumentMatchers.any(JobApplication.class)))
                .thenReturn(savedJob);

        JobApplicationDTO result = service.saveJob(dto);

        assertEquals("Google", result.getCompanyName());
        assertEquals("Software Engineer", result.getRole());
        assertEquals("Applied", result.getStatus());
    }
}
