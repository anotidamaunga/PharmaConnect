import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { UserRole } from '../types';
import { ChevronLeftIcon } from '../components/icons';

interface LoginScreenProps {
    onLogin: (role: UserRole) => void;
    onNavigateToSignUp: () => void;
    onNavigateBack: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToSignUp, onNavigateBack }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                        <ChevronLeftIcon style={styles.backIcon} color="#4B5563" />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Log In</Text>
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="you@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="••••••••"
                                secureTextEntry
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => onLogin(UserRole.Pharmacist)}
                                style={styles.pharmacistButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttonText}>Log In as Pharmacist</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onLogin(UserRole.Pharmacy)}
                                style={styles.pharmacyButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttonText}>Log In as Pharmacy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={onNavigateToSignUp}>
                        <Text style={styles.footerText}>
                            Don't have an account?{' '}
                            <Text style={styles.signUpText}>
                                Sign Up
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    header: {
        flexShrink: 0,
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
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 24,
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
        fontSize: 16,
        color: '#1F2937',
        backgroundColor: '#FFFFFF',
    },
    buttonContainer: {
        paddingTop: 16,
        gap: 12,
    },
    pharmacistButton: {
        width: '100%',
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    pharmacyButton: {
        width: '100%',
        backgroundColor: '#0D9488',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    footer: {
        flexShrink: 0,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#4B5563',
    },
    signUpText: {
        fontWeight: 'bold',
        color: '#2563EB',
    },
});

export default LoginScreen;