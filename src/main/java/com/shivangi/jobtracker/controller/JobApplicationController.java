package com.shivangi.jobtracker.controller;

import com.shivangi.jobtracker.entity.JobApplication;
import com.shivangi.jobtracker.service.JobApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    @PostMapping
    public JobApplication addJob(@RequestBody JobApplication job) {
        return service.saveJob(job);
    }

    @GetMapping
    public List<JobApplication> getAllJobs() {
        return service.getAllJobs();
    }
    @GetMapping("/{id}")
    public JobApplication getJobById(@PathVariable Long id) {
        return service.getJobById(id);
    }
    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id) {
        service.deleteJob(id);
        return "Job deleted successfully";
    }

}
