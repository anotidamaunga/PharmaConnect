import React from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import {
    ChevronLeftIcon, UserCircleIcon, StarIcon, BriefcaseIcon,
    EnvelopeIcon, PhoneIcon, ArrowRightOnRectangleIcon, CheckBadgeIcon,
    MapPinIcon, DocumentTextIcon, CheckCircleIcon, ExclamationCircleIcon, PencilIcon
} from '../components/icons';
import { Job, UserRole, UploadedDocuments, UploadedFile } from '../types';

interface ProfileScreenProps {
    userName: string;
    userEmail: string;
    userPhone: string;
    isContactVerified: boolean;
    onLogout: () => void;
    onNavigateBack: () => void;
    myJobs: Job[];
    userRole: UserRole;
    pharmacyAddress?: string;
    locumsHired?: number;
    activeJobsCount?: number;
    uploadedDocuments: UploadedDocuments;
    onEditDocuments: () => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <View style={styles.statCard}>
        <View style={styles.statIconContainer}>{icon}</View>
        <View>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    </View>
);

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string; isVerified?: boolean; }> = ({ icon, label, value, isVerified }) => (
    <View style={styles.infoRow}>
        <View style={styles.infoIconContainer}>{icon}</View>
        <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
        {isVerified && (
            <View style={styles.verifiedBadge}>
                <CheckBadgeIcon style={styles.verifiedIcon}/>
                <Text style={styles.verifiedText}>Verified</Text>
            </View>
        )}
    </View>
);

const PHARMACIST_DOCS = [ 'psz', 'hpa', 'cv' ] as const;
const PHARMACY_DOCS = [ 'pharmacyHpa', 'pharmacyMcaz'] as const;

const docLabels: Record<string, string> = {
    psz: "PSZ Certificate",
    hpa: "HPA Certificate",
    cv: "Curriculum Vitae (CV)",
    pharmacyHpa: "HPA Certificate",
    pharmacyMcaz: "MCAZ Premises Certificate"
}

const DocumentRow: React.FC<{ label: string; file: UploadedFile | null; }> = ({ label, file }) => (
    <View style={styles.documentRow}>
        <View style={styles.documentContent}>
            <DocumentTextIcon style={styles.documentIcon} />
            <View style={styles.documentInfo}>
                <Text style={styles.documentLabel} numberOfLines={1}>{label}</Text>
                <View style={styles.documentStatus}>
                    {file ? <CheckCircleIcon style={styles.statusIcon} /> : <ExclamationCircleIcon style={styles.statusIcon} />}
                    <Text
                        style={[
                            styles.documentStatusText,
                            file ? styles.documentStatusSuccess : styles.documentStatusWarning
                        ]}
                        numberOfLines={1}
                    >
                        {file ? file.name : "Missing"}
                    </Text>
                </View>
            </View>
        </View>
    </View>
);

const ProfileScreen: React.FC<ProfileScreenProps> = ({
                                                         userName, userEmail, userPhone, isContactVerified, onLogout, onNavigateBack,
                                                         myJobs, userRole, pharmacyAddress, locumsHired, activeJobsCount,
                                                         uploadedDocuments, onEditDocuments
                                                     }) => {
    const isPharmacist = userRole === UserRole.Pharmacist;
    const completedJobs = myJobs.filter(job => job.status === 'Completed');
    const shiftsCompleted = completedJobs.length;
    const ratedJobs = completedJobs.filter(job => job.rating !== undefined && job.rating > 0);
    const overallRating = ratedJobs.length > 0
        ? (ratedJobs.reduce((sum, job) => sum + (job.rating || 0), 0) / ratedJobs.length).toFixed(1)
        : 'N/A';

    const docItemsToShow = isPharmacist ? PHARMACIST_DOCS : PHARMACY_DOCS;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <ChevronLeftIcon style={styles.backIcon} color="#4B5563" />
                    <Text style={styles.backText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.profileSection}>
                        <UserCircleIcon style={styles.profileIcon}/>
                        <Text style={styles.userName}>{userName}</Text>
                        <Text style={styles.userType}>{isPharmacist ? 'Locum Pharmacist' : 'Pharmacy'}</Text>
                    </View>
                    <View style={styles.statsSection}>
                        {isPharmacist ? (
                            <>
                                <StatCard icon={<BriefcaseIcon style={styles.iconMedium}/>} label="Shifts Completed" value={shiftsCompleted} />
                                <StatCard icon={<StarIcon style={styles.iconMedium} color="#F59E0B"/>} label="Overall Rating" value={overallRating} />
                            </>
                        ) : (
                            <>
                                <StatCard icon={<BriefcaseIcon style={styles.iconMedium}/>} label="Active Jobs" value={activeJobsCount ?? 0} />
                                <StatCard icon={<UserCircleIcon style={styles.iconMedium}/>} label="Locums Hired" value={locumsHired ?? 0} />
                            </>
                        )}
                    </View>
                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Contact Information</Text>
                            <TouchableOpacity>
                                <Text style={styles.editButton}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sectionContent}>
                            <InfoRow icon={<EnvelopeIcon style={styles.iconMedium}/>} label="Email Address" value={userEmail} isVerified={isContactVerified || !isPharmacist}/>
                            <View style={styles.divider} />
                            <InfoRow icon={<PhoneIcon style={styles.iconMedium}/>} label="Phone Number" value={userPhone} isVerified={isContactVerified || !isPharmacist}/>
                            {!isPharmacist && pharmacyAddress && (
                                <>
                                    <View style={styles.divider} />
                                    <InfoRow icon={<MapPinIcon style={styles.iconMedium}/>} label="Physical Address" value={pharmacyAddress} />
                                </>
                            )}
                        </View>
                    </View>
                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>My Documents</Text>
                            <TouchableOpacity onPress={onEditDocuments} style={styles.editButtonWithIcon}>
                                <PencilIcon style={styles.editIcon} />
                                <Text style={styles.editButton}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sectionContent}>
                            {docItemsToShow.map((docKey, index) => (
                                <View key={docKey}>
                                    <DocumentRow
                                        label={docLabels[docKey]}
                                        file={uploadedDocuments[docKey]}
                                    />
                                    {index < docItemsToShow.length - 1 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.logoutSection}>
                        <TouchableOpacity onPress={onLogout} style={styles.logoutButton} activeOpacity={0.8}>
                            <ArrowRightOnRectangleIcon style={styles.logoutIcon} color="white" />
                            <Text style={styles.logoutButtonText}>Logout</Text>
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
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    userType: {
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
    statIconContainer: {
        // Container for stat icons - no color styling here
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
    iconMedium: {
        width: 24,
        height: 24,
        color: '#2563EB',
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    editButton: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    editButtonWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    editIcon: {
        width: 16,
        height: 16,
        color: '#2563EB',
    },
    sectionContent: {
        // No additional styling needed
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 12,
    },
    infoIconContainer: {
        // Container for info icons - no color styling here
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    infoValue: {
        fontWeight: '600',
        color: '#1F2937',
        fontSize: 16,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    verifiedIcon: {
        width: 20,
        height: 20,
        color: '#059669',
    },
    verifiedText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#059669',
    },
    documentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    documentContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
        overflow: 'hidden',
    },
    documentIcon: {
        width: 24,
        height: 24,
        color: '#6B7280',
        flexShrink: 0,
    },
    documentInfo: {
        overflow: 'hidden',
        flex: 1,
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
    documentStatusText: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    documentStatusSuccess: {
        color: '#059669',
    },
    documentStatusWarning: {
        color: '#D97706',
    },
    logoutSection: {
        paddingTop: 8,
    },
    logoutButton: {
        width: '100%',
        backgroundColor: '#EF4444',
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    logoutIcon: {
        width: 20,
        height: 20,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default ProfileScreen;