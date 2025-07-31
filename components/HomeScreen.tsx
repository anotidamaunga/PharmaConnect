import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { Job } from '../types';
import { ChevronRightIcon, CheckCircleIcon, StarIcon, BuildingStorefrontIcon, ExclamationCircleIcon, MegaphoneIcon, ClockIcon, CheckBadgeIcon } from './icons';

interface HomeScreenProps {
    userName: string;
    documentsUploadedCount: number;
    isLicenseVerified: boolean;
    jobToReviewId: string | null;
    appliedJobsCount: number;
    homeScreenJobs: Job[];
    appliedJobIds: Set<string>;
    onCompleteProfileClick: () => void;
    onVerifyLicense: () => void;
    onRateJob: (jobId: string, rating: number) => void;
    onViewJobDetails: (job: Job) => void;
    onApply: (jobId: string) => void;
}

const ProfileCompletionCard: React.FC<{ count: number, onClick: () => void }> = ({ count, onClick }) => {
    const percentage = count === 1 ? 33 : count === 2 ? 66 : 0;
    const messages = { 0: "Upload your documents to start applying.", 1: "Great start! Upload 2 more documents.", 2: "Almost there! Upload the last document." };
    const currentMessage = messages[count as keyof typeof messages] || "Profile complete!";

    return (
        <View style={styles.profileCard}>
            <Text style={styles.profileCardTitle}>Your profile is {percentage}% complete</Text>
            <Text style={styles.profileCardSubtitle}>{currentMessage}</Text>
            <TouchableOpacity onPress={onClick} style={styles.profileCardButton}>
                <Text style={styles.profileCardButtonText}>Complete Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const UrgentJobCard: React.FC<{ job: Job; isApplyDisabled: boolean; hasApplied: boolean; onViewDetails: () => void; onApplyClick: () => void; }> = ({ job, isApplyDisabled, hasApplied, onViewDetails, onApplyClick }) => (
    <View style={styles.urgentJobCard}>
        <TouchableOpacity onPress={onViewDetails} style={styles.urgentJobTouchable}>
            <View style={styles.urgentJobHeader}>
                <View style={styles.urgentJobIconContainer}>
                    <MegaphoneIcon style={styles.urgentJobIcon} color="#2563EB" width={24} height={24}/>
                </View>
                <View style={styles.urgentJobContent}>
                    <Text style={styles.urgentJobLabel}>New urgent opening:</Text>
                    <Text style={styles.urgentJobTitle}>{job.pharmacy} {job.time} • {job.rate}</Text>
                </View>
                <ChevronRightIcon color="#9CA3AF" width={20} height={20}/>
            </View>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={onApplyClick}
            disabled={isApplyDisabled || hasApplied}
            style={[
                styles.urgentJobApplyButton,
                (isApplyDisabled || hasApplied) ? styles.urgentJobApplyButtonDisabled : styles.urgentJobApplyButtonEnabled
            ]}
        >
            <Text style={styles.urgentJobApplyButtonText}>{hasApplied ? 'Applied' : 'Apply Now'}</Text>
        </TouchableOpacity>
    </View>
);

const ConfirmationModal: React.FC<{ job: Job; visible: boolean; onClose: () => void; onConfirm: () => void; }> = ({ job, visible, onClose, onConfirm }) => (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Confirm Application</Text>
                <Text style={styles.modalText}>
                    Are you sure you want to apply for the <Text style={styles.modalBoldText}>{job.role}</Text> position at <Text style={styles.modalBoldText}>{job.pharmacy}</Text>?
                </Text>
                <View style={styles.modalButtonRow}>
                    <TouchableOpacity onPress={onClose} style={[styles.modalButton, styles.modalCancelButton]}>
                        <Text style={styles.modalCancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onConfirm} style={[styles.modalButton, styles.modalConfirmButton]}>
                        <Text style={styles.modalConfirmButtonText}>Confirm Application</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

const ReviewCard: React.FC<{ onRate: (rating: number) => void }> = ({ onRate }) => {
    const [rating, setRating] = useState(0);
    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewCardHeader}>
                <View style={styles.reviewCardIconContainer}>
                    <CheckCircleIcon color="#059669" width={24} height={24}/>
                </View>
                <Text style={styles.reviewCardText}>You recently completed a shift. Rate your experience.</Text>
            </View>
            <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starButton}>
                        <StarIcon
                            width={32}
                            height={32}
                            fill={star <= rating ? '#FBBF24' : '#D1D5DB'}
                            color={star <= rating ? '#FBBF24' : '#D1D5DB'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                onPress={() => onRate(rating)}
                disabled={rating === 0}
                style={[
                    styles.reviewButton,
                    rating === 0 ? styles.reviewButtonDisabled : styles.reviewButtonEnabled
                ]}
            >
                <Text style={styles.reviewButtonText}>Leave a Review</Text>
            </TouchableOpacity>
        </View>
    );
};

const InfoCard: React.FC<{ icon: React.ReactElement, text: string, buttonText?: string, onButtonPress?: () => void }> = ({ icon, text, buttonText, onButtonPress }) => (
    <View style={styles.infoCard}>
        <View style={styles.infoCardContent}>
            {icon}
            <Text style={styles.infoCardText}>{text}</Text>
        </View>
        {buttonText && onButtonPress && (
            <TouchableOpacity onPress={onButtonPress}>
                <Text style={styles.infoCardButton}>{buttonText}</Text>
            </TouchableOpacity>
        )}
    </View>
);

const JobRecommendationCard: React.FC<{ job: Job; onViewDetails: () => void; }> = ({ job, onViewDetails }) => (
    <TouchableOpacity onPress={onViewDetails} style={styles.jobRecommendationCard}>
        <View style={styles.jobRecommendationIconContainer}>
            <BuildingStorefrontIcon color="#4B5563" width={24} height={24}/>
        </View>
        <View style={styles.jobRecommendationContent}>
            <Text style={styles.jobRecommendationTitle}>{job.role}</Text>
            <Text style={styles.jobRecommendationSubtitle}>{job.pharmacy} • {job.location}</Text>
        </View>
        <Text style={styles.jobRecommendationRate}>{job.rate}</Text>
    </TouchableOpacity>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ userName, documentsUploadedCount, isLicenseVerified, jobToReviewId, appliedJobsCount, homeScreenJobs, appliedJobIds, onCompleteProfileClick, onVerifyLicense, onRateJob, onViewJobDetails, onApply }) => {
    const isProfileComplete = documentsUploadedCount === 3;
    const [jobToConfirm, setJobToConfirm] = useState<Job | null>(null);

    const urgentJob = homeScreenJobs.find(j => j.id === 'job1');
    const recommendedJobs = homeScreenJobs.filter(j => j.id === 'job2' || j.id === 'job3');

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerSection}>
                {!isProfileComplete && (
                    <InfoCard
                        icon={<ExclamationCircleIcon color="#92400E" width={20} height={20} />}
                        text="Add your practicing certificate to complete your profile and boost trust."
                    />
                )}
                <Text style={styles.greeting}>Hi, {userName}!</Text>
            </View>

            <View style={styles.contentSection}>
                {!isProfileComplete && <ProfileCompletionCard count={documentsUploadedCount} onClick={onCompleteProfileClick} />}
                {isProfileComplete && !isLicenseVerified && (
                    <InfoCard
                        icon={<ClockIcon color="#92400E" width={20} height={20}/>}
                        text="Your license is under review. Expected approval in 2-3 days."
                        buttonText="Simulate Verify"
                        onButtonPress={onVerifyLicense}
                    />
                )}
                {isLicenseVerified && appliedJobsCount === 0 && (
                    <InfoCard
                        icon={<CheckBadgeIcon color="#065F46" width={20} height={20}/>}
                        text="Your license is verified! You can now apply for jobs."
                    />
                )}
                {jobToReviewId && <ReviewCard onRate={(rating) => onRateJob(jobToReviewId, rating)} />}
                {urgentJob && (
                    <UrgentJobCard
                        job={urgentJob}
                        isApplyDisabled={!isLicenseVerified}
                        hasApplied={appliedJobIds.has(urgentJob.id)}
                        onViewDetails={() => onViewJobDetails(urgentJob)}
                        onApplyClick={() => setJobToConfirm(urgentJob)}
                    />
                )}

                {recommendedJobs.length > 0 && (
                    <View style={styles.recommendationsSection}>
                        <Text style={styles.recommendationsTitle}>Job Recommendations</Text>
                        <View style={styles.recommendationsList}>
                            {recommendedJobs.map(job => (
                                <JobRecommendationCard key={job.id} job={job} onViewDetails={() => onViewJobDetails(job)} />
                            ))}
                        </View>
                    </View>
                )}
            </View>

            {jobToConfirm && (
                <ConfirmationModal
                    visible={!!jobToConfirm}
                    job={jobToConfirm}
                    onClose={() => setJobToConfirm(null)}
                    onConfirm={() => {
                        onApply(jobToConfirm.id);
                        setJobToConfirm(null);
                    }}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9FAFB',
    },
    headerSection: {
        padding: 16,
        gap: 16,
    },
    greeting: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    contentSection: {
        gap: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    profileCard: {
        backgroundColor: '#2563EB',
        borderRadius: 8,
        padding: 16,
    },
    profileCardTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#FFFFFF',
    },
    profileCardSubtitle: {
        fontSize: 14,
        color: '#DBEAFE',
        marginTop: 4,
    },
    profileCardButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginTop: 16,
        width: '100%',
        alignItems: 'center',
        paddingVertical: 12,
    },
    profileCardButtonText: {
        color: '#2563EB',
        fontWeight: 'bold',
    },
    urgentJobCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    urgentJobTouchable: {
        width: '100%',
    },
    urgentJobHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    urgentJobIconContainer: {
        padding: 8,
        backgroundColor: '#DBEAFE',
        borderRadius: 50,
    },
    urgentJobIcon: {
        width: 24,
        height: 24,
        color: '#2563EB',
    },
    urgentJobContent: {
        marginLeft: 12,
        flex: 1,
    },
    urgentJobLabel: {
        color: '#6B7280',
        fontSize: 14,
    },
    urgentJobTitle: {
        color: '#111827',
        fontWeight: 'bold',
    },
    urgentJobApplyButton: {
        marginTop: 16,
        width: '100%',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    urgentJobApplyButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    urgentJobApplyButtonEnabled: {
        backgroundColor: '#2563EB',
    },
    urgentJobApplyButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: '100%',
        maxWidth: 384,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
    },
    modalText: {
        color: '#4B5563',
        textAlign: 'center',
        marginVertical: 16,
    },
    modalBoldText: {
        fontWeight: 'bold',
    },
    modalButtonRow: {
        flexDirection: 'row',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalCancelButton: {
        backgroundColor: '#E5E7EB',
        marginRight: 8,
    },
    modalConfirmButton: {
        backgroundColor: '#2563EB',
        marginLeft: 8,
    },
    modalCancelButtonText: {
        color: '#1F2937',
        fontWeight: 'bold',
    },
    modalConfirmButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    reviewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    reviewCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewCardIconContainer: {
        padding: 8,
        backgroundColor: '#D1FAE5',
        borderRadius: 50,
    },
    reviewCardText: {
        marginLeft: 12,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 16,
        gap: 8,
    },
    starButton: {
        padding: 4,
    },
    reviewButton: {
        width: '100%',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    reviewButtonEnabled: {
        backgroundColor: '#2563EB',
    },
    reviewButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    infoCard: {
        backgroundColor: '#FEF3C7',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    infoCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoCardText: {
        color: '#92400E',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
        flex: 1,
    },
    infoCardButton: {
        color: '#78350F',
        fontWeight: 'bold',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    jobRecommendationCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    jobRecommendationIconContainer: {
        padding: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    jobRecommendationContent: {
        flex: 1,
        marginLeft: 16,
    },
    jobRecommendationTitle: {
        fontWeight: 'bold',
        color: '#1F2937',
    },
    jobRecommendationSubtitle: {
        fontSize: 14,
        color: '#4B5563',
    },
    jobRecommendationRate: {
        fontWeight: 'bold',
        color: '#1F2937',
    },
    recommendationsSection: {
        marginTop: 8,
    },
    recommendationsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    recommendationsList: {
        gap: 12,
    },
});

export default HomeScreen;