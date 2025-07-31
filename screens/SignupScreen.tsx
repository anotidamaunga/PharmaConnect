import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import { UserRole } from '../types';
import { ChevronLeftIcon } from '../components/icons';

interface SignupScreenProps {
    role: UserRole;
    onSignup: (role: UserRole, name: string, email: string) => void;
    onNavigateToLogin: () => void;
    onNavigateBack: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ role, onSignup, onNavigateToLogin, onNavigateBack }) => {
    const isPharmacy = role === UserRole.Pharmacy;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleCreateAccount = () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Incomplete Form', 'Please fill out all fields.');
            return;
        }
        onSignup(role, name, email);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        <TouchableOpacity
                            onPress={onNavigateBack}
                            style={styles.backButton}
                        >
                            <ChevronLeftIcon style={styles.backIcon} color="#4B5563" />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>

                        <View style={styles.mainContent}>
                            <Text style={styles.title}>
                                {isPharmacy ? 'Create Pharmacy Account' : 'Create Pharmacist Account'}
                            </Text>

                            <View style={styles.formContainer}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>
                                        {isPharmacy ? 'Pharmacy Name' : 'Full Name'}
                                    </Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={isPharmacy ? 'City Pharmacy' : 'e.g., Thabani'}
                                        value={name}
                                        onChangeText={setName}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Email Address</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="you@example.com"
                                        value={email}
                                        onChangeText={setEmail}
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
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>

                                <TouchableOpacity
                                    onPress={handleCreateAccount}
                                    style={styles.createAccountButton}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.createAccountButtonText}>Create Account</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity onPress={onNavigateToLogin}>
                                <Text style={styles.footerText}>
                                    Already have an account?{' '}
                                    <Text style={styles.loginText}>Log In</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
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
    createAccountButton: {
        width: '100%',
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    createAccountButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    footer: {
        alignItems: 'center',
        marginTop: 24,
    },
    footerText: {
        fontSize: 14,
        color: '#4B5563',
    },
    loginText: {
        fontWeight: 'bold',
        color: '#2563EB',
    },
});

export default SignupScreen;