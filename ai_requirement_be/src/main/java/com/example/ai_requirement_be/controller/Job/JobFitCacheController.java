package com.example.ai_requirement_be.controller.Job;

import com.example.ai_requirement_be.entity.Job.JobFitCache;
import com.example.ai_requirement_be.repository.IJobFitCacheRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/job-fit-cache")
public class JobFitCacheController {

    private final IJobFitCacheRepository jobFitCacheRepository;

    public JobFitCacheController(IJobFitCacheRepository jobFitCacheRepository) {
        this.jobFitCacheRepository = jobFitCacheRepository;
    }

    @GetMapping
    public ResponseEntity<?> getJobFitCache(@RequestParam Long resumeId, @RequestParam Long jobId) {
        Optional<JobFitCache> cache = jobFitCacheRepository.findByResumeIdAndJobId(resumeId, jobId);
        if (cache.isPresent()) {
            return ResponseEntity.ok(cache.get().getMatchResult());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> saveJobFitCache(@RequestBody SaveJobFitCacheRequest request) {
        Optional<JobFitCache> existing = jobFitCacheRepository.findByResumeIdAndJobId(request.getResumeId(), request.getJobId());
        JobFitCache cache;
        if (existing.isPresent()) {
            cache = existing.get();
        } else {
            cache = new JobFitCache();
            cache.setResumeId(request.getResumeId());
            cache.setJobId(request.getJobId());
        }
        cache.setMatchResult(request.getMatchResult());
        jobFitCacheRepository.save(cache);
        
        return ResponseEntity.ok("Đã lưu kết quả matching thành công");
    }

    public static class SaveJobFitCacheRequest {
        private Long resumeId;
        private Long jobId;
        private Map<String, Object> matchResult;

        public Long getResumeId() { return resumeId; }
        public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
        public Long getJobId() { return jobId; }
        public void setJobId(Long jobId) { this.jobId = jobId; }
        public Map<String, Object> getMatchResult() { return matchResult; }
        public void setMatchResult(Map<String, Object> matchResult) { this.matchResult = matchResult; }
    }
}
