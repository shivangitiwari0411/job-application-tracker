package com.shivangi.jobtracker.controller;

import com.shivangi.jobtracker.dto.JobApplicationDTO;
import com.shivangi.jobtracker.entity.JobApplication;
import com.shivangi.jobtracker.service.JobApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;

@RestController


@RequestMapping("/jobs")
public class JobApplicationController {
    
    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }



    @GetMapping
    public List<JobApplication> getAllJobs() {
        return service.getAllJobs();
    }
    @GetMapping("/{id}")
    public JobApplicationDTO getJobById(@PathVariable Long id) {
        return service.getJobById(id);
    }
    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id) {
        service.deleteJob(id);
        return "Job deleted successfully";
    }
    @PutMapping("/{id}")
    public JobApplication updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobApplication updatedJob) {

        return service.updateJob(id, updatedJob);
    }
    @GetMapping("/company/{companyName}")
    public List<JobApplication> getJobsByCompany(
            @PathVariable String companyName) {

        return service.getJobsByCompany(companyName);
    }
    @GetMapping("/status/{status}")
    public List<JobApplication> getJobsByStatus(
            @PathVariable String status) {

        return service.getJobsByStatus(status);
    }

    @PostMapping
    public JobApplicationDTO saveJob(@Valid @RequestBody JobApplicationDTO dto) {
        return service.saveJob(dto);
    }
    @GetMapping("/paged")
    public Page<JobApplication> getJobsPaginated(
            @RequestParam int page,
            @RequestParam int size) {

        return service.getJobsPaginated(page, size);
    }
    @GetMapping("/sorted")
    public List<JobApplication> getJobsSorted(
            @RequestParam String field) {

        return service.getJobsSorted(field);
    }

}
