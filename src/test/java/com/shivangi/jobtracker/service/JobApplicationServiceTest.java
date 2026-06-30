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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

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
    @Test
    void testGetJobById() {

        JobApplication job = new JobApplication();
        job.setId(1L);
        job.setCompanyName("Google");
        job.setRole("Software Engineer");
        job.setStatus("Applied");

        when(repository.findById(1L))
                .thenReturn(java.util.Optional.of(job));

        JobApplicationDTO result = service.getJobById(1L);

        assertEquals(1L, result.getId());
        assertEquals("Google", result.getCompanyName());
        assertEquals("Software Engineer", result.getRole());
        assertEquals("Applied", result.getStatus());
    }
    @Test
    void testDeleteJob() {

        service.deleteJob(1L);

        verify(repository, times(1)).deleteById(1L);
    }
}
