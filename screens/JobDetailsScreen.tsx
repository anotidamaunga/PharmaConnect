import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, StyleSheet } from 'react-native';
import {
    ChevronLeftIcon, BuildingStorefrontIcon, MapPinIcon, HeartIcon,
    HeartSolidIcon, CalendarIcon, ClockIcon, CurrencyDollarIcon, BuildingOfficeIcon
} from '../components/icons';
import { Job } from '../types';

interface JobDetailsScreenProps {
    job: Job;
    onNavigateBack: () => void;
    isLicenseVerified: boolean;
    hasApplied: boolean;
    isSaved: boolean;
    onApply: (jobId: string) => void;
    onSave: (jobId: string) => void;
    onUnsave: (jobId: string) => void;
}

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
        <View style={styles.detailIcon}>{icon}</View>
        <View>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
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

const JobDetailsScreen: React.FC<JobDetailsScreenProps> = ({ job, onNavigateBack, isLicenseVerified, hasApplied, isSaved, onApply, onSave, onUnsave }) => {
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <ChevronLeftIcon style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Details</Text>
                <TouchableOpacity onPress={() => (isSaved ? onUnsave(job.id) : onSave(job.id))} style={styles.saveButton}>
                    {isSaved ? <HeartSolidIcon style={styles.heartIconSaved} /> : <HeartIcon style={styles.heartIconUnsaved} />}
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.jobHeader}>
                        <View style={styles.jobIconContainer}>
                            <BuildingStorefrontIcon style={styles.jobIcon} />
                        </View>
                        <View>
                            <Text style={styles.jobRole}>{job.role}</Text>
                            <Text style={styles.pharmacyName}>{job.pharmacy}</Text>
                        </View>
                    </View>

                    <View style={styles.detailsCard}>
                        <DetailRow icon={<CurrencyDollarIcon style={styles.iconMedium}/>} label="Hourly Rate" value={job.rate} />
                        <DetailRow icon={<MapPinIcon style={styles.iconMedium}/>} label="Location" value={job.location} />
                        <DetailRow icon={<CalendarIcon style={styles.iconMedium}/>} label="Date" value={new Date(job.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
                        <DetailRow icon={<ClockIcon style={styles.iconMedium}/>} label="Time" value={`${job.time} (${job.shiftType})`} />
                        <DetailRow icon={<BuildingOfficeIcon style={styles.iconMedium}/>} label="Facility Type" value={job.facilityType} />
                    </View>

                    <View style={styles.descriptionCard}>
                        <Text style={styles.descriptionTitle}>Job Description</Text>
                        <Text style={styles.descriptionText}>{job.description}</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => setConfirmModalOpen(true)}
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

            <ConfirmationModal
                job={job}
                visible={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={() => {
                    onApply(job.id);
                    setConfirmModalOpen(false);
                }}
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
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    saveButton: {
        padding: 8,
        marginRight: -8,
    },
    heartIconSaved: {
        width: 28,
        height: 28,
        color: '#EF4444',
    },
    heartIconUnsaved: {
        width: 28,
        height: 28,
        color: '#9CA3AF',
    },
    content: {
        padding: 24,
        gap: 24,
    },
    jobHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    jobIconContainer: {
        padding: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    jobIcon: {
        width: 32,
        height: 32,
        color: '#374151',
    },
    jobRole: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    pharmacyName: {
        fontSize: 18,
        color: '#4B5563',
    },
    detailsCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    detailIcon: {
        color: '#6B7280',
        marginTop: 4,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
    },
    detailValue: {
        fontWeight: '600',
        color: '#111827',
        fontSize: 16,
    },
    iconMedium: {
        width: 24,
        height: 24,
        color: '#6B7280',
    },
    descriptionCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    descriptionText: {
        color: '#374151',
        lineHeight: 24,
        fontSize: 16,
    },
    footer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    applyButton: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
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
        fontSize: 18,
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

export default JobDetailsScreen;