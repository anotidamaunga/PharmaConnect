import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, TextInput, Alert, StyleSheet } from 'react-native';
import { ChevronLeftIcon } from '../components/icons';
import { VerificationMethod } from '../types';

interface VerificationScreenProps {
    onVerify: () => void;
    onNavigateBack: () => void;
    title: string;
    method: VerificationMethod;
    email: string;
    phone: string;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ onVerify, onNavigateBack, title, method, email, phone }) => {
    const [otp, setOtp] = useState('');

    const handleVerify = () => {
        if (otp.length === 4 && /^\d+$/.test(otp)) {
            onVerify();
        } else {
            Alert.alert('Invalid Code', 'Please enter a valid 4-digit code.');
        }
    };

    const message = method === VerificationMethod.Email
        ? (
            <Text style={styles.messageText}>
                Enter the 4-digit code we sent to your email <Text style={styles.boldText}>{email}</Text>
            </Text>
        )
        : (
            <Text style={styles.messageText}>
                Enter the 4-digit code we sent to your phone <Text style={styles.boldText}>{phone}</Text>
            </Text>
        );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
                <View style={styles.content}>
                    <View>
                        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                            <ChevronLeftIcon style={styles.backIcon} color="#4B5563" />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.mainContent}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={styles.messageContainer}>
                            {message}
                        </View>
                        <TextInput
                            maxLength={4}
                            value={otp}
                            onChangeText={setOtp}
                            style={styles.otpInput}
                            placeholder="----"
                            keyboardType="number-pad"
                            placeholderTextColor="#9CA3AF"
                        />
                        <TouchableOpacity>
                            <Text style={styles.resendText}>
                                Didn't receive a code?{' '}
                                <Text style={styles.resendLink}>
                                    Resend
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity
                            onPress={handleVerify}
                            style={[
                                styles.verifyButton,
                                otp.length !== 4 ? styles.verifyButtonDisabled : styles.verifyButtonEnabled
                            ]}
                            disabled={otp.length !== 4}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.verifyButtonText}>Verify & Finish</Text>
                        </TouchableOpacity>
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
    content: {
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
    mainContent: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
    },
    messageContainer: {
        marginTop: 8,
        paddingHorizontal: 16,
    },
    messageText: {
        color: '#4B5563',
        textAlign: 'center',
        fontSize: 16,
    },
    boldText: {
        fontWeight: 'bold',
    },
    otpInput: {
        width: 192, // w-48 equivalent
        textAlign: 'center',
        fontSize: 32,
        letterSpacing: 16, // tracking-[1em] equivalent
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        marginVertical: 32,
        color: '#1F2937',
    },
    resendText: {
        fontSize: 14,
        color: '#6B7280',
    },
    resendLink: {
        fontWeight: 'bold',
        color: '#2563EB',
    },
    verifyButton: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    verifyButtonEnabled: {
        backgroundColor: '#2563EB',
    },
    verifyButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default VerificationScreen;