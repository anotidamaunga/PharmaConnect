import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from 'react-native';
import { StarIcon } from './icons';

interface PharmacyRatingModalProps {
    visible: boolean;
    job: {
        id: string;
        role: string;
        confirmedApplicant?: {
            name: string;
        };
    };
    onClose: () => void;
    onSubmitRating: (jobId: string, rating: number, feedback?: string) => void;
}

const PharmacyRatingModal: React.FC<PharmacyRatingModalProps> = ({
                                                                     visible,
                                                                     job,
                                                                     onClose,
                                                                     onSubmitRating
                                                                 }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmitRating(job.id, rating, feedback.trim() || undefined);
            // Reset form
            setRating(0);
            setFeedback('');
            onClose();
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setRating(0);
        setFeedback('');
        onClose();
    };

    return (
        <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Rate Pharmacist</Text>
                    <Text style={styles.modalText}>
                        How was <Text style={styles.modalBoldText}>{job.confirmedApplicant?.name}</Text>'s
                        performance as a <Text style={styles.modalBoldText}>{job.role}</Text>?
                    </Text>

                    {/* Star Rating */}
                    <View style={styles.starContainer}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                style={styles.starButton}
                            >
                                <StarIcon
                                    width={32}
                                    height={32}
                                    fill={star <= rating ? '#FBBF24' : '#D1D5DB'}
                                    color={star <= rating ? '#FBBF24' : '#D1D5DB'}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Feedback Text Input */}
                    <TextInput
                        style={styles.feedbackInput}
                        placeholder="Share your feedback (optional)"
                        multiline
                        numberOfLines={3}
                        value={feedback}
                        onChangeText={setFeedback}
                        maxLength={500}
                    />

                    {/* Action Buttons */}
                    <View style={styles.modalButtonRow}>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={[styles.modalButton, styles.modalCancelButton]}
                        >
                            <Text style={styles.modalCancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={rating === 0}
                            style={[
                                styles.modalButton,
                                styles.modalConfirmButton,
                                rating === 0 && styles.modalButtonDisabled
                            ]}
                        >
                            <Text style={[
                                styles.modalConfirmButtonText,
                                rating === 0 && styles.modalButtonTextDisabled
                            ]}>
                                Submit Rating
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 8,
    },
    modalText: {
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    modalBoldText: {
        fontWeight: 'bold',
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 8,
    },
    starButton: {
        padding: 4,
    },
    feedbackInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        textAlignVertical: 'top',
        marginBottom: 20,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#F9FAFB',
    },
    modalButtonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalCancelButton: {
        backgroundColor: '#E5E7EB',
    },
    modalConfirmButton: {
        backgroundColor: '#2563EB',
    },
    modalButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    modalCancelButtonText: {
        color: '#1F2937',
        fontWeight: 'bold',
    },
    modalConfirmButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    modalButtonTextDisabled: {
        color: '#9CA3AF',
    },
});

export default PharmacyRatingModal;