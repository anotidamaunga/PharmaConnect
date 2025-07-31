import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList, StyleSheet } from 'react-native';
import { ChevronLeftIcon, StarIcon, SparklesIcon, UserCircleIcon } from '../components/icons';
import { Job, Applicant } from '../types';

interface ViewApplicantsScreenProps {
    job: Job;
    onNavigateBack: () => void;
    onViewProfile: (applicant: Applicant) => void;
}

const ApplicantCard: React.FC<{ applicant: Applicant, onViewProfile: () => void }> = ({ applicant, onViewProfile }) => (
    <View style={styles.applicantCard}>
        <UserCircleIcon style={styles.profileIcon} />
        <View style={styles.applicantInfo}>
            <View style={styles.nameSection}>
                <Text style={styles.applicantName}>{applicant.name}</Text>
                {applicant.isPremium && (
                    <View style={styles.premiumBadge}>
                        <SparklesIcon style={styles.premiumIcon} color="#A16207"/>
                        <Text style={styles.premiumText}>Premium</Text>
                    </View>
                )}
            </View>
            <View style={styles.ratingSection}>
                <StarIcon style={styles.starIcon} fill="#FBBF24" color="#FBBF24" />
                <Text style={styles.ratingText}>{applicant.rating.toFixed(1)} Overall Rating</Text>
            </View>
        </View>
        <TouchableOpacity
            onPress={onViewProfile}
            style={styles.viewProfileButton}
            activeOpacity={0.8}
        >
            <Text style={styles.viewProfileButtonText}>View Profile</Text>
        </TouchableOpacity>
    </View>
);

const ViewApplicantsScreen: React.FC<ViewApplicantsScreenProps> = ({ job, onNavigateBack, onViewProfile }) => {

    const sortedApplicants = useMemo(() => {
        if (!job.applicants) return [];
        return [...job.applicants].sort((a, b) => {
            if (a.isPremium && !b.isPremium) return -1;
            if (!a.isPremium && b.isPremium) return 1;
            return b.rating - a.rating;
        });
    }, [job.applicants]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <ChevronLeftIcon style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Applicants</Text>
                    <Text style={styles.headerSubtitle}>{job.role}</Text>
                </View>
                <View style={styles.headerSpacer} />
            </View>
            <View style={styles.countSection}>
                <Text style={styles.countText}>
                    {sortedApplicants.length} Applicant(s) - Prioritized
                </Text>
            </View>
            <FlatList
                data={sortedApplicants}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ApplicantCard applicant={item} onViewProfile={() => onViewProfile(item)} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <UserCircleIcon style={styles.emptyIcon}/>
                        <Text style={styles.emptyTitle}>No Applicants Yet</Text>
                        <Text style={styles.emptySubtitle}>Check back later for new applicants.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 10,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    backIcon: {
        width: 24,
        height: 24,
        color: '#4B5563',
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    headerSpacer: {
        width: 24,
    },
    countSection: {
        padding: 16,
    },
    countText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
    },
    listContent: {
        paddingHorizontal: 16,
    },
    applicantCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    profileIcon: {
        width: 48,
        height: 48,
        color: '#9CA3AF',
        flexShrink: 0,
    },
    applicantInfo: {
        flex: 1,
    },
    nameSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    applicantName: {
        fontWeight: 'bold',
        color: '#111827',
        fontSize: 16,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    premiumIcon: {
        width: 12,
        height: 12,
    },
    premiumText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#92400E',
    },
    ratingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    starIcon: {
        width: 16,
        height: 16,
    },
    ratingText: {
        fontSize: 14,
        color: '#4B5563',
    },
    viewProfileButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    viewProfileButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 64,
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
    },
});

export default ViewApplicantsScreen;