import { apiClient } from './client';
import {Job, FacilityType, ShiftType, PharmacistRatings, PharmacyRatings} from '../../types';

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
    async getMyJobs(): Promise<Job[]> {
        return apiClient.get('/jobs/my-jobs');
    },

    async getPharmacyJobs(): Promise<Job[]> {
        return apiClient.get('/jobs/pharmacy-jobs');
    },

    async saveApplicant(jobId: string, applicantId: string): Promise<void> {
        await apiClient.post(`/jobs/${jobId}/applicants/${applicantId}/save`);
    },

    async declineApplicant(jobId: string, applicantId: string): Promise<void> {
        await apiClient.post(`/jobs/${jobId}/applicants/${applicantId}/decline`);
    },


    async rateJob(
        jobId: string,
        rating: number,
        feedback?: string
    ): Promise<void> {
        await apiClient.post(`/jobs/${jobId}/rate`, { rating, feedback });
    },

    async ratePharmacist(
        jobId: string,
        rating: number,
        feedback?: string
    ): Promise<void> {
        await apiClient.post(`/jobs/${jobId}/rate-pharmacist`, { rating, feedback });
    },

    async ratePharmacy(
        jobId: string,
        rating: number,
        feedback?: string
    ): Promise<void> {
        await apiClient.post(`/jobs/${jobId}/rate-pharmacy`, { rating, feedback });
    },

// Get ratings for pharmacists/pharmacies
    async getPharmacistRatings(pharmacistId: string): Promise<PharmacistRatings> {
        return apiClient.get(`/pharmacists/${pharmacistId}/ratings`);
    },

    async getPharmacyRatings(pharmacyId: string): Promise<PharmacyRatings> {
        return apiClient.get(`/pharmacies/${pharmacyId}/ratings`);
    },

};