import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { BriefcaseIcon, UserCircleIcon, ChevronRightIcon, DocumentTextIcon, ExclamationCircleIcon, StarIcon, CheckCircleIcon, ClockIcon } from '../components/icons';
import { Job } from '../types';

interface PharmacyHomeScreenProps {
    userName: string;
    postedJobs: Job[];
    onPostNewJob: () => void;
    onViewApplicants: (jobId: string) => void;
    onCompleteProfileClick?: () => void;
    isDocumentsComplete: boolean;
    onMarkJobAsCompleted: (jobId: string) => void;
    onRatePharmacist: (jobId: string, rating: number, feedback?: string) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <View style={styles.statCard}>
        <View style={styles.statIcon}>
            {icon}
        </View>
        <View>
            <Text style={styles.statTitle}>{title}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    </View>
);

const JobListItem: React.FC<{
    job: Job;
    onPress: () => void;
    onMarkAsCompleted?: (jobId: string) => void;
    onRatePharmacist?: (jobId: string, rating: number, feedback?: string) => void;
}> = ({ job, onPress, onMarkAsCompleted, onRatePharmacist }) => {
    const { role, applicants, status, confirmedApplicant } = job;
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Active':
                return { backgroundColor: '#DCFCE7', color: '#166534' };
            case 'Confirmed':
                return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
            case 'Completed':
                return { backgroundColor: '#F3E8FF', color: '#7C3AED' };
            default:
                return { backgroundColor: '#FEF3C7', color: '#92400E' };
        }
    };

    const statusStyle = getStatusStyle(status || 'Pending');

    const handleMarkCompleted = () => {
        if (onMarkAsCompleted) {
            onMarkAsCompleted(job.id);
            setShowRatingModal(true);
        }
    };

    const handleRateSubmit = () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please select a rating before submitting.');
            return;
        }
        if (onRatePharmacist) {
            onRatePharmacist(job.id, rating, feedback);
        }
        setShowRatingModal(false);
        setRating(0);
        setFeedback('');
    };

    const renderStars = (currentRating: number, onStarPress: (star: number) => void) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => onStarPress(star)}>
                        <StarIcon
                            style={[
                                styles.star,
                                { color: star <= currentRating ? '#F59E0B' : '#D1D5DB' }
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <>
            <TouchableOpacity onPress={onPress} style={styles.jobItem} activeOpacity={0.9}>
                <View style={styles.jobMainInfo}>
                    <Text style={styles.jobRole}>{role}</Text>
                    <Text style={styles.jobApplicants}>
                        {status === 'Confirmed' || status === 'Completed'
                            ? `Confirmed: ${confirmedApplicant?.name}`
                            : `${applicants?.length || 0} applicant(s)`
                        }
                    </Text>
                </View>
                <View style={styles.jobItemRight}>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{status}</Text>
                    </View>

                    {status === 'Confirmed' && (
                        <TouchableOpacity onPress={handleMarkCompleted} style={styles.completeButton}>
                            <CheckCircleIcon style={styles.completeButtonIcon} />
                        </TouchableOpacity>
                    )}

                    <ChevronRightIcon style={styles.chevronIcon} />
                </View>
            </TouchableOpacity>

            {/* Rating Modal */}
            <Modal
                visible={showRatingModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowRatingModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Rate {confirmedApplicant?.name}</Text>
                        <Text style={styles.modalSubtitle}>How was their performance?</Text>

                        {renderStars(rating, setRating)}

                        <TextInput
                            style={styles.feedbackInput}
                            placeholder="Add feedback (optional)"
                            value={feedback}
                            onChangeText={setFeedback}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => setShowRatingModal(false)}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleRateSubmit}
                                style={styles.submitButton}
                            >
                                <Text style={styles.submitButtonText}>Submit Rating</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const ProfileCompletionCard: React.FC<{ onCompleteProfile: () => void }> = ({ onCompleteProfile }) => (
    <View style={styles.profileCard}>
        <View style={styles.profileCardHeader}>
            <ExclamationCircleIcon style={styles.warningIcon} />
            <Text style={styles.profileCardTitle}>Complete Your Profile</Text>
        </View>
        <Text style={styles.profileCardText}>
            Upload your required documents to start receiving applications from qualified pharmacists.
        </Text>
        <TouchableOpacity
            onPress={onCompleteProfile}
            style={styles.completeProfileButton}
            activeOpacity={0.8}
        >
            <DocumentTextIcon style={styles.buttonIcon} />
            <Text style={styles.completeProfileButtonText}>Upload Documents</Text>
        </TouchableOpacity>
    </View>
);

const PharmacyHomeScreen: React.FC<PharmacyHomeScreenProps> = ({
                                                                   userName,
                                                                   postedJobs,
                                                                   onPostNewJob,
                                                                   onViewApplicants,
                                                                   onCompleteProfileClick,
                                                                   isDocumentsComplete,
                                                                   onMarkJobAsCompleted,
                                                                   onRatePharmacist
                                                               }) => {
    const activeJobsCount = postedJobs.filter(job => job.status === 'Active').length;
    const newApplicantsCount = postedJobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);
    const confirmedJobsCount = postedJobs.filter(job => job.status === 'Confirmed').length;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Welcome, {userName}!</Text>
                    <Text style={styles.welcomeSubtitle}>Here's your dashboard for today.</Text>
                </View>

                {/* Profile Completion Card - Show when profile is incomplete */}
                {!isDocumentsComplete && onCompleteProfileClick && (
                    <View style={styles.profileCompletionSection}>
                        <ProfileCompletionCard onCompleteProfile={onCompleteProfileClick} />
                    </View>
                )}

                <View style={styles.statsSection}>
                    <StatCard title="Active Jobs" value={String(activeJobsCount)} icon={<BriefcaseIcon style={styles.iconMedium}/>} />
                    <StatCard title="New Applicants" value={String(newApplicantsCount)} icon={<UserCircleIcon style={styles.iconMedium}/>} />
                    <StatCard title="Confirmed Jobs" value={String(confirmedJobsCount)} icon={<ClockIcon style={styles.iconMedium}/>} />
                </View>

                <View style={styles.postJobSection}>
                    <TouchableOpacity
                        onPress={isDocumentsComplete ? onPostNewJob : onCompleteProfileClick}
                        style={[
                            styles.postJobButton,
                            !isDocumentsComplete && styles.disabledButton
                        ]}
                        activeOpacity={isDocumentsComplete ? 0.8 : 0.6}
                    >
                        <Text style={[
                            styles.postJobButtonText,
                            !isDocumentsComplete && styles.disabledButtonText
                        ]}>
                            {isDocumentsComplete ? '+ Post a New Job' : 'Complete Profile to Post Jobs'}
                        </Text>
                    </TouchableOpacity>

                    {!isDocumentsComplete && (
                        <Text style={styles.postJobHelpText}>
                            Upload your required documents to start posting jobs
                        </Text>
                    )}
                </View>

                <View style={styles.jobListSection}>
                    <View style={styles.jobListCard}>
                        <Text style={styles.jobListTitle}>My Job Postings</Text>
                        {postedJobs.length > 0 ? (
                            <FlatList
                                data={postedJobs}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <JobListItem
                                        job={item}
                                        onPress={() => onViewApplicants(item.id)}
                                        onMarkAsCompleted={onMarkJobAsCompleted}
                                        onRatePharmacist={onRatePharmacist}
                                    />
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                scrollEnabled={false} // The outer ScrollView handles scrolling
                            />
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>
                                    {isDocumentsComplete
                                        ? "You haven't posted any jobs yet."
                                        : "Complete your profile to start posting jobs."
                                    }
                                </Text>
                                <Text style={styles.emptyStateSubtext}>
                                    {isDocumentsComplete
                                        ? "Click the button above to get started."
                                        : "Upload your documents first."
                                    }
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    welcomeSection: {
        padding: 16,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    welcomeSubtitle: {
        color: '#4B5563',
        fontSize: 16,
    },
    profileCompletionSection: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    profileCard: {
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#F59E0B',
        borderRadius: 8,
        padding: 16,
    },
    profileCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    warningIcon: {
        width: 20,
        height: 20,
        color: '#D97706',
        marginRight: 8,
    },
    profileCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#92400E',
    },
    profileCardText: {
        color: '#78350F',
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    completeProfileButton: {
        backgroundColor: '#F59E0B',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    buttonIcon: {
        width: 16,
        height: 16,
        color: '#FFFFFF',
        marginRight: 8,
    },
    completeProfileButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    statsSection: {
        padding: 16,
        flexDirection: 'row',
        gap: 16,
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    statIcon: {
        padding: 12,
        borderRadius: 20,
        backgroundColor: '#DBEAFE',
        color: '#2563EB',
    },
    statTitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    iconMedium: {
        width: 24,
        height: 24,
        color: '#2563EB',
    },
    postJobSection: {
        padding: 16,
    },
    postJobButton: {
        width: '100%',
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
    },
    postJobButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    disabledButtonText: {
        color: '#E5E7EB',
    },
    postJobHelpText: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 14,
        marginTop: 8,
        fontStyle: 'italic',
    },
    jobListSection: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    jobListCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    jobListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    jobItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        marginHorizontal: -8,
        width: '100%',
    },
    jobMainInfo: {
        flex: 1,
    },
    jobRole: {
        fontWeight: '600',
        color: '#1F2937',
        fontSize: 16,
    },
    jobApplicants: {
        fontSize: 14,
        color: '#6B7280',
    },
    jobItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    completeButton: {
        backgroundColor: '#10B981',
        borderRadius: 16,
        padding: 6,
    },
    completeButtonIcon: {
        width: 16,
        height: 16,
        color: '#FFFFFF',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    chevronIcon: {
        width: 20,
        height: 20,
        color: '#9CA3AF',
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 8,
    },
    star: {
        width: 32,
        height: 32,
    },
    feedbackInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#6B7280',
        fontWeight: '600',
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyStateText: {
        color: '#6B7280',
        fontSize: 16,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#6B7280',
    },

    ratingDisplay: {
        marginTop: 8,
    },
    ratingText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
    },
    starsDisplay: {
        flexDirection: 'row',
        gap: 2,
        marginBottom: 4,
    },
    feedbackText: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic',
        marginTop: 4,
    },
    rateButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    rateButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },

});

export default PharmacyHomeScreen;