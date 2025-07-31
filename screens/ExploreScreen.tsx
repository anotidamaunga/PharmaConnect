import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Modal, FlatList, Alert, StyleSheet } from 'react-native';
import { SearchIcon, BuildingStorefrontIcon, MapPinIcon, HeartIcon, HeartSolidIcon, AdjustmentsHorizontalIcon } from '../components/icons';
import { Job, FacilityType, ShiftType } from '../types';

const cities = ['All Cities', 'Harare', 'Bulawayo', 'Borrowdale'];

interface Filters {
    facilityTypes: FacilityType[];
    shiftTypes: ShiftType[];
    dateRange: 'all' | 'today' | 'thisWeek';
}

interface ExploreScreenProps {
    isLicenseVerified: boolean;
    jobs: Job[];
    appliedJobIds: Set<string>;
    savedJobIds: Set<string>;
    onSave: (jobId: string) => void;
    onUnsave: (jobId: string) => void;
    onViewJobDetails: (job: Job) => void;
    onApply: (jobId: string) => void;
}

const JobCard: React.FC<{
    job: Job;
    isSaved: boolean;
    hasApplied: boolean;
    isLicenseVerified: boolean;
    onSaveToggle: () => void;
    onViewDetails: () => void;
    onApplyClick: () => void;
}> = ({ job, isSaved, hasApplied, isLicenseVerified, onSaveToggle, onViewDetails, onApplyClick }) => (
    <View style={styles.jobCard}>
        <TouchableOpacity onPress={onViewDetails} style={styles.jobCardContent}>
            <View style={styles.jobHeader}>
                <View style={styles.jobIconContainer}>
                    <BuildingStorefrontIcon style={styles.jobIcon}/>
                </View>
                <View style={styles.jobInfo}>
                    <Text style={styles.jobRole}>{job.role}</Text>
                    <Text style={styles.pharmacyName}>{job.pharmacy}</Text>
                    <View style={styles.locationContainer}>
                        <MapPinIcon style={styles.locationIcon} color="#6B7280" />
                        <Text style={styles.locationText}>{job.location}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.jobDetails}>
                <Text style={styles.jobDetailText}>{job.rate}</Text>
                <Text style={styles.jobDetailText}>{new Date(job.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text>
                <Text style={styles.jobDetailText}>{job.time}</Text>
            </View>
        </TouchableOpacity>

        <View style={styles.jobActions}>
            <TouchableOpacity onPress={onSaveToggle} style={styles.saveButton}>
                {isSaved ? <HeartSolidIcon style={styles.heartIcon} /> : <HeartIcon style={styles.heartIcon} />}
                <Text style={[styles.saveText, isSaved ? styles.savedText : styles.unsavedText]}>
                    {isSaved ? 'Saved' : 'Save'}
                </Text>
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
    </View>
);

const FilterModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: Filters) => void;
    currentFilters: Filters;
}> = ({ isOpen, onClose, onApply, currentFilters }) => {
    const [localFilters, setLocalFilters] = useState<Filters>(currentFilters);

    const handleCheckboxChange = (group: 'facilityTypes' | 'shiftTypes', value: FacilityType | ShiftType) => {
        const currentGroup = localFilters[group] as string[];
        const newGroup = currentGroup.includes(value)
            ? currentGroup.filter(item => item !== value)
            : [...currentGroup, value];
        setLocalFilters({ ...localFilters, [group]: newGroup });
    };

    const handleReset = () => {
        const resetFilters = { facilityTypes: [], shiftTypes: [], dateRange: 'all' as const };
        setLocalFilters(resetFilters);
        onApply(resetFilters);
        onClose();
    }

    return (
        <Modal transparent={true} animationType="slide" visible={isOpen} onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filters</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>Facility Type</Text>
                        <View style={styles.filterOptions}>
                            {Object.values(FacilityType).map(type => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => handleCheckboxChange('facilityTypes', type)}
                                    style={[
                                        styles.filterChip,
                                        localFilters.facilityTypes.includes(type) ? styles.filterChipSelected : styles.filterChipUnselected
                                    ]}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        localFilters.facilityTypes.includes(type) ? styles.filterChipTextSelected : styles.filterChipTextUnselected
                                    ]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>Shift Time</Text>
                        <View style={styles.filterOptions}>
                            {Object.values(ShiftType).map(type => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => handleCheckboxChange('shiftTypes', type)}
                                    style={[
                                        styles.filterChip,
                                        localFilters.shiftTypes.includes(type) ? styles.filterChipSelected : styles.filterChipUnselected
                                    ]}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        localFilters.shiftTypes.includes(type) ? styles.filterChipTextSelected : styles.filterChipTextUnselected
                                    ]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.filterSection}>
                        <Text style={styles.filterSectionTitle}>Date</Text>
                        <View style={styles.filterOptions}>
                            <TouchableOpacity
                                onPress={() => setLocalFilters({...localFilters, dateRange: 'all'})}
                                style={[
                                    styles.filterChip,
                                    localFilters.dateRange === 'all' ? styles.filterChipSelected : styles.filterChipUnselected
                                ]}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    localFilters.dateRange === 'all' ? styles.filterChipTextSelected : styles.filterChipTextUnselected
                                ]}>
                                    All
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setLocalFilters({...localFilters, dateRange: 'today'})}
                                style={[
                                    styles.filterChip,
                                    localFilters.dateRange === 'today' ? styles.filterChipSelected : styles.filterChipUnselected
                                ]}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    localFilters.dateRange === 'today' ? styles.filterChipTextSelected : styles.filterChipTextUnselected
                                ]}>
                                    Today
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setLocalFilters({...localFilters, dateRange: 'thisWeek'})}
                                style={[
                                    styles.filterChip,
                                    localFilters.dateRange === 'thisWeek' ? styles.filterChipSelected : styles.filterChipUnselected
                                ]}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    localFilters.dateRange === 'thisWeek' ? styles.filterChipTextSelected : styles.filterChipTextUnselected
                                ]}>
                                    This Week
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.modalActions}>
                        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { onApply(localFilters); onClose(); }} style={styles.applyFiltersButton}>
                            <Text style={styles.applyFiltersButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const ConfirmationModal: React.FC<{ job: Job; visible: boolean; onClose: () => void; onConfirm: () => void; }> = ({ job, visible, onClose, onConfirm }) => (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
        <View style={styles.confirmationOverlay}>
            <View style={styles.confirmationModal}>
                <Text style={styles.confirmationTitle}>Confirm Application</Text>
                <Text style={styles.confirmationText}>
                    Are you sure you want to apply for the <Text style={styles.boldText}>{job.role}</Text> position at <Text style={styles.boldText}>{job.pharmacy}</Text>?
                </Text>
                <View style={styles.confirmationActions}>
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

const ExploreScreen: React.FC<ExploreScreenProps> = ({ isLicenseVerified, jobs, appliedJobIds, savedJobIds, onSave, onUnsave, onViewJobDetails, onApply }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('All Cities');
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>({ facilityTypes: [], shiftTypes: [], dateRange: 'all' });
    const [jobToConfirm, setJobToConfirm] = useState<Job | null>(null);

    const filteredJobs = useMemo(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
        const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6); endOfWeek.setHours(23, 59, 59, 999);

        return jobs.filter(job => {
            const matchesSearch = job.pharmacy.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity = selectedCity === 'All Cities' || job.location.includes(selectedCity);
            const matchesFacility = filters.facilityTypes.length === 0 || filters.facilityTypes.includes(job.facilityType);
            const matchesShift = filters.shiftTypes.length === 0 || filters.shiftTypes.includes(job.shiftType);

            let matchesDate = true;
            if (filters.dateRange !== 'all') {
                const jobDate = new Date(job.date); jobDate.setHours(0, 0, 0, 0);
                if (filters.dateRange === 'today') { matchesDate = jobDate.getTime() === today.getTime(); }
                else if (filters.dateRange === 'thisWeek') { matchesDate = jobDate >= startOfWeek && jobDate <= endOfWeek; }
            }
            return matchesSearch && matchesCity && matchesFacility && matchesShift && matchesDate;
        });
    }, [jobs, searchTerm, selectedCity, filters]);

    const activeFilterCount = (filters.facilityTypes.length > 0 ? 1 : 0) + (filters.shiftTypes.length > 0 ? 1 : 0) + (filters.dateRange !== 'all' ? 1 : 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore Jobs</Text>
                <View style={styles.searchContainer}>
                    <SearchIcon style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search by pharmacy name..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        style={styles.searchInput}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                <View style={styles.filtersRow}>
                    <TouchableOpacity
                        onPress={() => Alert.alert("City Filter", "A native picker would be used here.")}
                        style={styles.cityPicker}
                    >
                        <Text style={styles.cityPickerText}>{selectedCity}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFilterModalOpen(true)} style={styles.filterButton}>
                        <AdjustmentsHorizontalIcon style={styles.filterIcon}/>
                        <Text style={styles.filterButtonText}>Filters</Text>
                        {activeFilterCount > 0 && (
                            <View style={styles.filterBadge}>
                                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={filteredJobs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const isSaved = savedJobIds.has(item.id);
                    const hasApplied = appliedJobIds.has(item.id);
                    return <JobCard
                        job={item}
                        isSaved={isSaved}
                        hasApplied={hasApplied}
                        isLicenseVerified={isLicenseVerified}
                        onViewDetails={() => onViewJobDetails(item)}
                        onSaveToggle={() => isSaved ? onUnsave(item.id) : onSave(item.id)}
                        onApplyClick={() => setJobToConfirm(item)}
                    />
                }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <SearchIcon style={styles.emptyIcon}/>
                        <Text style={styles.emptyTitle}>No Jobs Found</Text>
                        <Text style={styles.emptySubtitle}>Try adjusting your search or filters.</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
            />
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                onApply={setFilters}
                currentFilters={filters}
            />
            {jobToConfirm && (
                <ConfirmationModal
                    job={jobToConfirm}
                    visible={!!jobToConfirm}
                    onClose={() => setJobToConfirm(null)}
                    onConfirm={() => { onApply(jobToConfirm!.id); setJobToConfirm(null); }}
                />
            )}
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
        gap: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: {
        height: 20,
        width: 20,
        color: '#9CA3AF',
    },
    searchInput: {
        flex: 1,
        padding: 8,
        fontSize: 16,
        color: '#1F2937',
    },
    filtersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cityPicker: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    cityPickerText: {
        fontSize: 16,
        color: '#1F2937',
    },
    filterButton: {
        position: 'relative',
        flexShrink: 0,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    filterIcon: {
        width: 20,
        height: 20,
        color: '#374151',
    },
    filterButtonText: {
        fontSize: 16,
        color: '#374151',
    },
    filterBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        height: 16,
        width: 16,
        borderRadius: 8,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
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
        fontSize: 18,
    },
    pharmacyName: {
        fontWeight: '600',
        color: '#374151',
        fontSize: 16,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    locationIcon: {
        width: 16,
        height: 16,
    },
    locationText: {
        color: '#6B7280',
        fontSize: 14,
    },
    jobDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingLeft: 4,
    },
    jobDetailText: {
        fontSize: 14,
        color: '#6B7280',
    },
    jobActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 12,
    },
    saveButton: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    heartIcon: {
        width: 20,
        height: 20,
    },
    saveText: {
        fontSize: 14,
        fontWeight: '500',
    },
    savedText: {
        color: '#EF4444',
    },
    unsavedText: {
        color: '#4B5563',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        width: '100%',
        padding: 24,
        gap: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    closeButton: {
        fontSize: 24,
        color: '#6B7280',
    },
    filterSection: {
        gap: 8,
    },
    filterSectionTitle: {
        fontWeight: '600',
        fontSize: 16,
        color: '#1F2937',
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    filterChipSelected: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    filterChipUnselected: {
        backgroundColor: '#FFFFFF',
        borderColor: '#D1D5DB',
    },
    filterChipText: {
        fontSize: 14,
    },
    filterChipTextSelected: {
        color: '#FFFFFF',
    },
    filterChipTextUnselected: {
        color: '#374151',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 16,
        paddingTop: 16,
    },
    resetButton: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    resetButtonText: {
        color: '#1F2937',
        fontWeight: 'bold',
        fontSize: 16,
    },
    applyFiltersButton: {
        flex: 1,
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyFiltersButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    confirmationOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    confirmationModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: '100%',
        maxWidth: 320,
        padding: 24,
        alignItems: 'center',
    },
    confirmationTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
    },
    confirmationText: {
        color: '#4B5563',
        textAlign: 'center',
        marginVertical: 16,
        fontSize: 16,
    },
    boldText: {
        fontWeight: 'bold',
    },
    confirmationActions: {
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

export default ExploreScreen;