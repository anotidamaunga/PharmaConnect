import * as React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Image } from 'react-native';
import { AuthScreen, AppNavigationProp } from '../types';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation<AppNavigationProp>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.mainContent}>
                    <View style={styles.logoContainer}>
                        {/* Replace this Image source with your logo file */}
                        <Image
                            source={require('../assets/favicon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>PharmaConnect</Text>
                    <Text style={styles.subtitle}>Connecting Pharmacists with Opportunities.</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate(AuthScreen.Login)}
                        style={styles.loginButton}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate(AuthScreen.RoleSelection)}
                        style={styles.signupButton}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.signupButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        flex: 1,
        padding: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 120,  // Adjust size as needed
        height: 120, // Adjust size as needed
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#4B5563',
        marginTop: 8,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
    },
    loginButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    signupButton: {
        width: '100%',
        backgroundColor: '#E5E7EB',
        paddingVertical: 12,
        borderRadius: 8,
    },
    signupButtonText: {
        color: '#1F2937',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default WelcomeScreen;