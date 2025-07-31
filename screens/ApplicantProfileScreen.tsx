import React from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Alert, Linking, StyleSheet } from 'react-native';
import {
    ChevronLeftIcon, UserCircleIcon, StarIcon, BriefcaseIcon,
    SparklesIcon, DocumentTextIcon, EyeIcon, CheckCircleIcon, ExclamationCircleIcon
} from '../components/icons';
import { Applicant, DocumentItemConfig, UploadedFile } from '../types';

interface ApplicantProfileScreenProps {
    applicant: Applicant;
    onNavigateBack: () => void;
    onConfirm: () => void;
    onDecline: () => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <View style={styles.statCard}>
        <View>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    </View>
);
const PHARMACIST_DOCS: DocumentItemConfig[] = [
    { key: 'psz', title: "PSZ Certificate", description: "" },
    { key: 'hpa', title: "HPA Certificate", description: "" },
    { key: 'cv', title: "Curriculum Vitae (CV)", description: "" },
];

const DocumentRow: React.FC<{ label: string; file: UploadedFile | null; }> = ({ label, file }) => {

    const handleViewClick = async () => {
        if (file?.uri) {
            try {
                const supported = await Linking.canOpenURL(file.uri);
                if (supported) {
                    await Linking.openURL(file.uri);
                } else {
                    Alert.alert(`Don't know how to open this URL: ${file.uri}`);
                }
            } catch(e) {
                Alert.alert(`Error opening file`, `Could not open ${file.name}. This is a mock file path.`);
            }
        }
    };

    return (
        <View style={styles.documentRow}>
            <View style={styles.documentInfo}>
                <DocumentTextIcon style={styles.documentIcon} />
                <View>
                    <Text style={styles.documentLabel}>{label}</Text>
                    <View style={styles.documentStatus}>
                        {file ? <CheckCircleIcon style={styles.statusIcon} /> : <ExclamationCircleIcon style={styles.statusIcon} />}
                        <Text style={[styles.statusText, file ? styles.statusUploaded : styles.statusMissing]}>
                            {file ? "Uploaded" : "Missing"}
                        </Text>
                    </View>
                </View>
            </View>
            {file && (
                <TouchableOpacity onPress={handleViewClick} style={styles.viewButton}>
                    <EyeIcon style={styles.viewIcon} />
                    <Text style={styles.viewText}>View</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const ApplicantProfileScreen: React.FC<ApplicantProfileScreenProps> = ({ applicant, onNavigateBack, onConfirm, onDecline }) => {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <ChevronLeftIcon style={styles.backIcon} color="#4B5563" />
                    <Text style={styles.backText}>Back to Applicants</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.profileSection}>
                        <UserCircleIcon style={styles.profileIcon} />
                        <View style={styles.nameSection}>
                            <Text style={styles.applicantName}>{applicant.name}</Text>
                            {applicant.isPremium && (
                                <View style={styles.premiumBadge}>
                                    <SparklesIcon style={styles.premiumIcon} color="#A16207"/>
                                    <Text style={styles.premiumText}>Premium</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.jobTitle}>Locum Pharmacist Applicant</Text>
                    </View>

                    <View style={styles.statsSection}>
                        <StatCard icon={<BriefcaseIcon style={styles.iconMedium}/>} label="Shifts Completed" value={applicant.shiftsCompleted} />
                        <StatCard icon={<StarIcon style={styles.iconMedium} fill="#F59E0B" color="#F59E0B"/>} label="Overall Rating" value={applicant.rating.toFixed(1)} />
                    </View>

                    <View style={styles.documentsSection}>
                        <Text style={styles.sectionTitle}>Submitted Documents</Text>
                        <View style={styles.documentsContainer}>
                            {PHARMACIST_DOCS.map((docConfig, index) => (
                                <View key={docConfig.key}>
                                    <DocumentRow
                                        label={docConfig.title}
                                        file={applicant.documents[docConfig.key] || null}
                                    />
                                    {index < PHARMACIST_DOCS.length - 1 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.actionsSection}>
                        <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
                            <Text style={styles.confirmButtonText}>Confirm Applicant for Job</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onDecline} style={styles.declineButton}>
                            <Text style={styles.declineButtonText}>Decline Applicant</Text>
                        </TouchableOpacity>
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
    header: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginLeft: -8,
    },
    backIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    backText: {
        fontSize: 16,
        color: '#374151',
    },
    content: {
        padding: 24,
        gap: 24,
    },
    profileSection: {
        alignItems: 'center',
        gap: 8,
    },
    profileIcon: {
        width: 96,
        height: 96,
        color: '#9CA3AF',
    },
    nameSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    applicantName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
    },
    premiumIcon: {
        width: 16,
        height: 16,
    },
    premiumText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#92400E',
    },
    jobTitle: {
        color: '#4B5563',
        fontSize: 16,
    },
    statsSection: {
        flexDirection: 'row',
        gap: 16,
    },
    statCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },

    statLabel: {
        fontSize: 14,
        color: '#4B5563',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    documentsSection: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    documentsContainer: {
        // No additional styling needed for the container
    },
    documentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    documentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    documentIcon: {
        width: 24,
        height: 24,
        color: '#6B7280',
    },
    documentLabel: {
        fontWeight: '600',
        color: '#1F2937',
        fontSize: 16,
    },
    documentStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusIcon: {
        width: 16,
        height: 16,
    },
    statusText: {
        fontSize: 14,
    },
    statusUploaded: {
        color: '#059669',
    },
    statusMissing: {
        color: '#D97706',
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    viewIcon: {
        width: 20,
        height: 20,
        color: '#2563EB',
    },
    viewText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    actionsSection: {
        gap: 12,
        paddingTop: 8,
    },
    confirmButton: {
        width: '100%',
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    declineButton: {
        width: '100%',
        backgroundColor: '#E5E7EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    declineButtonText: {
        color: '#1F2937',
        fontWeight: 'bold',
        fontSize: 18,
    },
    iconMedium: {
        width: 24,
        height: 24,
    },
});

export default ApplicantProfileScreen;