import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform, TextInput, StyleSheet } from 'react-native';
import { PhoneIcon, EnvelopeIcon, ChevronLeftIcon } from '../components/icons';
import { VerificationMethod } from '../types';

interface ContactInfoScreenProps {
    onComplete: (phone: string, email: string, method: VerificationMethod) => void;
    email: string;
    onNavigateBack: () => void;
}

const ContactInfoScreen: React.FC<ContactInfoScreenProps> = ({ onComplete, email, onNavigateBack }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emailAddress, setEmailAddress] = useState(email);

    const handleSave = (method: VerificationMethod) => {
        if(!phoneNumber.trim() || !emailAddress.trim()){
            Alert.alert('Incomplete Form', 'Please fill out all fields.');
            return;
        }
        onComplete(phoneNumber, emailAddress, method);
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                <View style={styles.mainContainer}>
                    <View>
                        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                            <ChevronLeftIcon style={styles.backIcon} color="#4B5563" />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                        <View style={styles.headerSection}>
                            <Text style={styles.title}>Complete Your Profile</Text>
                            <Text style={styles.subtitle}>Add your contact information so pharmacies can reach you.</Text>
                        </View>
                    </View>

                    <View style={styles.formSection}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputContainer}>
                                <PhoneIcon style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="(+263) 77 123 4567"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <EnvelopeIcon style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="you@example.com"
                                    value={emailAddress}
                                    onChangeText={setEmailAddress}
                                    keyboardType="email-address"
                                    autoCapitalize='none'
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.verificationSection}>
                        <Text style={styles.verificationTitle}>Verify via:</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                onPress={() => handleSave(VerificationMethod.Email)}
                                style={styles.emailButton}
                                activeOpacity={0.8}
                            >
                                <EnvelopeIcon style={styles.buttonIcon} color="white" />
                                <Text style={styles.buttonText}>Send code to Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleSave(VerificationMethod.Phone)}
                                style={styles.phoneButton}
                                activeOpacity={0.8}
                            >
                                <PhoneIcon style={styles.buttonIcon} color="white" />
                                <Text style={styles.buttonText}>Send code to Phone</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
    mainContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
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
        color: '#4B5563',
        fontSize: 16,
    },
    headerSection: {
        alignItems: 'center',
        paddingTop: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
    },
    subtitle: {
        color: '#4B5563',
        marginTop: 8,
        textAlign: 'center',
        fontSize: 16,
    },
    formSection: {
        gap: 16,
    },
    inputGroup: {
        // No additional styling needed for the container
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    inputIcon: {
        height: 20,
        width: 20,
        color: '#9CA3AF',
        marginHorizontal: 12,
    },
    textInput: {
        flex: 1,
        paddingVertical: 12,
        paddingRight: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    verificationSection: {
        gap: 12,
    },
    verificationTitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    buttonGroup: {
        gap: 12,
    },
    emailButton: {
        width: '100%',
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    phoneButton: {
        width: '100%',
        backgroundColor: '#374151',
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonIcon: {
        width: 20,
        height: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default ContactInfoScreen;