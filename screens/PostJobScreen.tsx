import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Modal, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { ChevronLeftIcon } from '../components/icons';
import { Job, FacilityType, ShiftType } from '../types';

interface PostJobScreenProps {
    onJobPosted: (jobData: Omit<Job, 'id' | 'pharmacy' | 'location' | 'status' | 'applicants'>) => void;
    onNavigateBack: () => void;
}

const PickerModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    options: string[];
    onSelect: (value: string) => void;
    title: string;
}> = ({ visible, onClose, options, onSelect, title }) => (
    <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{title}</Text>
                {options.map(option => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => { onSelect(option); onClose(); }}
                        style={styles.modalOption}
                    >
                        <Text style={styles.modalOptionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={onClose} style={styles.modalCancelButton}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    </Modal>
);

const PostJobScreen: React.FC<PostJobScreenProps> = ({ onJobPosted, onNavigateBack }) => {
    const [role, setRole] = useState('Locum Pharmacist');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [rate, setRate] = useState('');
    const [facilityType, setFacilityType] = useState<FacilityType>(FacilityType.Retail);
    const [shiftType, setShiftType] = useState<ShiftType>(ShiftType.Morning);
    const [description, setDescription] = useState('');
    const [pickerVisible, setPickerVisible] = useState<'facility' | 'shift' | null>(null);

    const handleSubmit = () => {
        if (!role || !date || !time || !rate || !description) {
            Alert.alert('Incomplete Form', 'Please fill out all fields.');
            return;
        }
        onJobPosted({
            role, date, time, rate: `$${rate}/hr`, facilityType, shiftType, description
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                        <ChevronLeftIcon style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Post a New Job</Text>
                    <View style={styles.headerSpacer}/>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Job Role</Text>
                            <TextInput
                                value={role}
                                onChangeText={setRole}
                                style={styles.textInput}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Facility Type</Text>
                            <TouchableOpacity onPress={() => setPickerVisible('facility')} style={styles.pickerButton}>
                                <Text style={styles.pickerButtonText}>{facilityType}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Date</Text>
                            <TextInput
                                placeholder="YYYY-MM-DD"
                                value={date}
                                onChangeText={setDate}
                                style={styles.textInput}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Shift Time</Text>
                            <TouchableOpacity onPress={() => setPickerVisible('shift')} style={styles.pickerButton}>
                                <Text style={styles.pickerButtonText}>{shiftType}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Exact Time (e.g., 9am - 5pm)</Text>
                            <TextInput
                                placeholder="9am - 5pm"
                                value={time}
                                onChangeText={setTime}
                                style={styles.textInput}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Hourly Rate ($)</Text>
                            <TextInput
                                placeholder="12"
                                value={rate}
                                onChangeText={setRate}
                                keyboardType="numeric"
                                style={styles.textInput}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Job Description</Text>
                            <TextInput
                                placeholder="Provide details about the job responsibilities, requirements, etc."
                                value={description}
                                onChangeText={setDescription}
                                multiline={true}
                                numberOfLines={4}
                                style={styles.textAreaInput}
                                textAlignVertical="top"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} activeOpacity={0.8}>
                        <Text style={styles.submitButtonText}>Post Job</Text>
                    </TouchableOpacity>
                </View>

                <PickerModal
                    visible={pickerVisible === 'facility'}
                    onClose={() => setPickerVisible(null)}
                    options={Object.values(FacilityType)}
                    onSelect={(val) => setFacilityType(val as FacilityType)}
                    title="Select Facility Type"
                />
                <PickerModal
                    visible={pickerVisible === 'shift'}
                    onClose={() => setPickerVisible(null)}
                    options={Object.values(ShiftType)}
                    onSelect={(val) => setShiftType(val as ShiftType)}
                    title="Select Shift Time"
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    keyboardView: {
        flex: 1,
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
        textAlign: 'center',
        flex: 1,
    },
    headerSpacer: {
        width: 24,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    formContainer: {
        gap: 16,
    },
    inputGroup: {
        // No additional styling needed
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    textInput: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        color: '#1F2937',
    },
    pickerButton: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    pickerButtonText: {
        fontSize: 16,
        color: '#1F2937',
    },
    textAreaInput: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        color: '#1F2937',
        height: 96,
    },
    footer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 8,
        marginBottom: 8,
        color: '#1F2937',
    },
    modalOption: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalOptionText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#2563EB',
    },
    modalCancelButton: {
        padding: 16,
        marginTop: 16,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
    },
    modalCancelText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
});

export default PostJobScreen;