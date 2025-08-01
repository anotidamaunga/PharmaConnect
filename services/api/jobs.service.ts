import { apiClient } from './client';
import { Job, FacilityType, ShiftType } from '../../types';

interface JobSearchParams {
    location?: string;
    minRate?: number;
    facilityTypes?: FacilityType[];
    shiftTypes?: ShiftType[];
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}

interface JobSearchResponse {
    jobs: Job[];
    page: number;
    limit: number;
    hasMore: boolean;
}

export const jobsService = {
    async searchJobs(params: JobSearchParams): Promise<JobSearchResponse> {
        return apiClient.get('/jobs/search', params);
    },

    async getJobDetails(jobId: string): Promise<Job> {
        return apiClient.get(`/jobs/${jobId}`);
    },

    async createJob(jobData: Partial<Job>): Promise<Job> {
        return apiClient.post('/jobs', jobData);
    },

    async updateJob(jobId: string, updates: Partial<Job>): Promise<Job> {
        return apiClient.put(`/jobs/${jobId}`, updates);
    },

    async applyToJob(
        jobId: string,
        data: { coverLetter?: string; expectedRate?: number }
    ): Promise<void> {
        await apiClient.post(`/jobs/${jobId}/apply`, data);
    },

    async saveJob(jobId: string): Promise<void> {
        await apiClient.post(`/jobs/${jobId}/save`);
    },

    async unsaveJob(jobId: string): Promise<void> {
        await apiClient.delete(`/jobs/${jobId}/save`);
    },

    async getApplicants(jobId: string): Promise<any[]> {
        return apiClient.get(`/jobs/${jobId}/applicants`);
    },

    async confirmApplicant(jobId: string, applicantId: string): Promise<void> {
        await apiClient.post(`/jobs/${jobId}/confirm`, { applicantId });
    },

    async completeJob(jobId: string): Promise<void> {
        await apiClient.post(`/jobs/${jobId}/complete`);
    },

    async rateJob(
        jobId: string,
        rating: number,
        feedback?: string
    ): Promise<void> {
        await apiClient.post(`/jobs/${jobId}/rate`, { rating, feedback });
    },
};