import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, FlatList, StyleSheet } from 'react-native';
import { BriefcaseIcon, BuildingStorefrontIcon, StarIcon, HeartSolidIcon, HeartIcon } from '../components/icons';
import { Job } from '../types';

type JobTab = 'upcoming' | 'completed' | 'applied' | 'saved';

interface MyJobsScreenProps {
    isLicenseVerified: boolean;
    myJobs: Job[];
    appliedJobs: Job[];
    savedJobs: Job[];
    appliedJobIds: Set<string>;
    onMarkAsCompleted: (jobId: string) => void;
    onApply: (jobId: string) => void;
    onUnsave: (jobId: string) => void;
    onViewJobDetails: (job: Job) => void;
}

const JobCard: React.FC<{
    job: Job;
    tab: JobTab;
    isLicenseVerified: boolean;
    hasApplied: boolean;
    onMarkAsCompleted?: (jobId: string) => void;
    onUnsave?: (jobId:string) => void;
    onApplyClick?: () => void;
    onViewDetails: () => void;
}> = ({ job, tab, isLicenseVerified, hasApplied, onMarkAsCompleted, onUnsave, onApplyClick, onViewDetails }) => (
    <View style={styles.jobCard}>
        <TouchableOpacity onPress={onViewDetails} style={styles.jobCardContent}>
            <View style={styles.jobHeader}>
                <View style={styles.jobIconContainer}>
                    <BuildingStorefrontIcon style={styles.jobIcon}/>
                </View>
                <View style={styles.jobInfo}>
                    <Text style={styles.jobRole}>{job.role}</Text>
                    <Text style={styles.jobDetails}>{job.pharmacy} • {job.location}</Text>
                    <Text style={styles.jobTime}>{new Date(job.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, {job.time}</Text>
                </View>
            </View>
        </TouchableOpacity>

        <View style={styles.jobActions}>
            {tab === 'upcoming' && onMarkAsCompleted && (
                <TouchableOpacity onPress={() => onMarkAsCompleted(job.id)} style={styles.completedButton} activeOpacity={0.8}>
                    <Text style={styles.completedButtonText}>Mark as Completed</Text>
                </TouchableOpacity>
            )}
            {tab === 'completed' && (
                <View style={styles.ratingContainer}>
                    {job.rating ? (
                        <>
                            <View style={styles.starsContainer}>
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        style={styles.starIcon}
                                        fill={i < job.rating! ? '#FBBF24' : '#D1D5DB'}
                                        color={i < job.rating! ? '#FBBF24' : '#D1D5DB'}
                                    />
                                ))}
                            </View>
                            <Text style={styles.ratingText}>You rated {job.rating} stars</Text>
                        </>
                    ) : (
                        <Text style={styles.pendingText}>Pending your review</Text>
                    )}
                </View>
            )}
            {tab === 'applied' && (
                <Text style={styles.appliedText}>Application Pending</Text>
            )}
            {tab === 'saved' && (
                <View style={styles.savedActions}>
                    <TouchableOpacity onPress={() => onUnsave?.(job.id)} style={styles.unsaveButton}>
                        <HeartSolidIcon style={styles.heartIcon} />
                        <Text style={styles.unsaveText}>Unsave</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onApplyClick}
                        disabled={!isLicenseVerified || hasApplied}
                        style={[
                            styles.applyButton,
                            (!isLicenseVerified || hasApplied) ? styles.applyButtonDisabled : styles.applyButtonEnabled
                        ]}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.applyButtonText}>{hasApplied ? 'Applied' : 'Apply Now'}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    </View>
);

const ConfirmationModal: React.FC<{ job: Job; visible: boolean; onClose: () => void; onConfirm: () => void; }> = ({ job, visible, onClose, onConfirm }) => (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Confirm Application</Text>
                <Text style={styles.modalText}>
                    Are you sure you want to apply for the <Text style={styles.boldText}>{job.role}</Text> position at <Text style={styles.boldText}>{job.pharmacy}</Text>?
                </Text>
                <View style={styles.modalActions}>
                    <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Confirm Application</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

const MyJobsScreen: React.FC<MyJobsScreenProps> = ({ isLicenseVerified, myJobs, appliedJobs, savedJobs, appliedJobIds, onMarkAsCompleted, onApply, onUnsave, onViewJobDetails }) => {
    const [activeTab, setActiveTab] = useState<JobTab>('upcoming');
    const [jobToConfirm, setJobToConfirm] = useState<Job | null>(null);

    const upcomingJobs = myJobs.filter(job => job.status === 'Confirmed');
    const completedJobs = myJobs.filter(job => job.status === 'Completed');

    const TABS: { id: JobTab; label: string; count: number }[] = [
        { id: 'upcoming', label: 'Upcoming', count: upcomingJobs.length },
        { id: 'completed', label: 'Completed', count: completedJobs.length },
        { id: 'applied', label: 'Applied', count: appliedJobs.length },
        { id: 'saved', label: 'Saved', count: savedJobs.length }
    ];

    let jobsToDisplay: Job[] = [];
    switch(activeTab) {
        case 'upcoming': jobsToDisplay = upcomingJobs; break;
        case 'completed': jobsToDisplay = completedJobs; break;
        case 'applied': jobsToDisplay = appliedJobs; break;
        case 'saved': jobsToDisplay = savedJobs; break;
    }

    if (myJobs.length === 0 && appliedJobs.length === 0 && savedJobs.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Jobs</Text>
                </View>
                <View style={styles.emptyState}>
                    <BriefcaseIcon style={styles.emptyIcon}/>
                    <Text style={styles.emptyTitle}>Nothing to show here yet</Text>
                    <Text style={styles.emptySubtitle}>Your upcoming, applied, and saved jobs will appear here.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Jobs</Text>
                <View style={styles.tabsContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.tabsRow}>
                            {TABS.map(tab => (
                                <TouchableOpacity
                                    key={tab.id}
                                    onPress={() => setActiveTab(tab.id)}
                                    style={[
                                        styles.tab,
                                        activeTab === tab.id ? styles.tabActive : styles.tabInactive
                                    ]}
                                >
                                    <View style={styles.tabContent}>
                                        <Text style={[
                                            styles.tabLabel,
                                            activeTab === tab.id ? styles.tabLabelActive : styles.tabLabelInactive
                                        ]}>
                                            {tab.label}
                                        </Text>
                                        <View style={[
                                            styles.tabBadge,
                                            activeTab === tab.id ? styles.tabBadgeActive : styles.tabBadgeInactive
                                        ]}>
                                            <Text style={[
                                                styles.tabBadgeText,
                                                activeTab === tab.id ? styles.tabBadgeTextActive : styles.tabBadgeTextInactive
                                            ]}>
                                                {tab.count}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>

            <FlatList
                data={jobsToDisplay}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <JobCard
                        key={`${activeTab}-${item.id}`}
                        job={item}
                        tab={activeTab}
                        isLicenseVerified={isLicenseVerified}
                        hasApplied={appliedJobIds.has(item.id)}
                        onMarkAsCompleted={onMarkAsCompleted}
                        onUnsave={onUnsave}
                        onApplyClick={() => setJobToConfirm(item)}
                        onViewDetails={() => onViewJobDetails(item)}
                    />
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyListText}>No jobs in this category.</Text>
                )}
                contentContainerStyle={styles.listContent}
            />
            {jobToConfirm && (
                <ConfirmationModal
                    job={jobToConfirm}
                    onClose={() => setJobToConfirm(null)}
                    onConfirm={() => {
                        onApply(jobToConfirm!.id);
                        setJobToConfirm(null);
                    }}
                    visible={!!jobToConfirm}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    tabsContainer: {
        marginTop: 16,
    },
    tabsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    tab: {
        paddingBottom: 12,
        paddingHorizontal: 4,
        borderBottomWidth: 2,
    },
    tabActive: {
        borderBottomColor: '#3B82F6',
    },
    tabInactive: {
        borderBottomColor: 'transparent',
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    tabLabel: {
        fontWeight: '500',
        fontSize: 14,
    },
    tabLabelActive: {
        color: '#2563EB',
    },
    tabLabelInactive: {
        color: '#6B7280',
    },
    tabBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    tabBadgeActive: {
        backgroundColor: '#DBEAFE',
    },
    tabBadgeInactive: {
        backgroundColor: '#F3F4F6',
    },
    tabBadgeText: {
        fontSize: 12,
    },
    tabBadgeTextActive: {
        color: '#2563EB',
    },
    tabBadgeTextInactive: {
        color: '#4B5563',
    },
    listContent: {
        padding: 16,
    },
    jobCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        width: '100%',
        marginBottom: 16,
    },
    jobCardContent: {
        width: '100%',
        gap: 8,
    },
    jobHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    jobIconContainer: {
        padding: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    jobIcon: {
        width: 24,
        height: 24,
        color: '#374151',
    },
    jobInfo: {
        flex: 1,
    },
    jobRole: {
        fontWeight: 'bold',
        color: '#111827',
        fontSize: 16,
    },
    jobDetails: {
        fontSize: 14,
        color: '#4B5563',
    },
    jobTime: {
        fontSize: 14,
        color: '#6B7280',
    },
    jobActions: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 12,
    },
    completedButton: {
        width: '100%',
        backgroundColor: '#10B981',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    completedButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    starIcon: {
        width: 20,
        height: 20,
    },
    ratingText: {
        fontSize: 14,
        color: '#4B5563',
        marginLeft: 8,
    },
    pendingText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#6B7280',
        width: '100%',
    },
    appliedText: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600',
        color: '#D97706',
    },
    savedActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    unsaveButton: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    heartIcon: {
        width: 20,
        height: 20,
        color: '#EF4444',
    },
    unsaveText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#EF4444',
    },
    applyButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    applyButtonEnabled: {
        backgroundColor: '#2563EB',
    },
    applyButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    emptyIcon: {
        width: 64,
        height: 64,
        color: '#D1D5DB',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    emptySubtitle: {
        color: '#6B7280',
        marginTop: 4,
        fontSize: 16,
        textAlign: 'center',
    },
    emptyListText: {
        textAlign: 'center',
        color: '#6B7280',
        paddingTop: 64,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: '100%',
        maxWidth: 320,
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
        fontSize: 16,
    },
    boldText: {
        fontWeight: 'bold',
    },
    modalActions: {
        flexDirection: 'row',
        width: '100%',
        gap: 8,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#1F2937',
        fontWeight: 'bold',
        fontSize: 16,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default MyJobsScreen;