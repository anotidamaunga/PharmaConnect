import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { AuthScreen, UserRole } from '../types';
import { AppNavigationProp } from '../types';
import { ChevronLeftIcon, UserCircleIcon, BuildingStorefrontIcon } from '../components/icons';
import { useNavigation } from '@react-navigation/native';

const RoleCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress: () => void;
}> = ({ icon, title, description, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.roleCard} activeOpacity={0.8}>
        {icon}
        <View style={styles.roleCardContent}>
            <Text style={styles.roleCardTitle}>{title}</Text>
            <Text style={styles.roleCardDescription}>{description}</Text>
        </View>
    </TouchableOpacity>
);

const RoleSelectionScreen: React.FC = () => {
    const navigation = useNavigation<AppNavigationProp>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeftIcon style={styles.backIcon} color="#4B5563"/>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Join PharmaConnect</Text>
                    <Text style={styles.subtitle}>Choose your role to get started.</Text>

                    <View style={styles.roleCardsContainer}>
                        <RoleCard
                            icon={<UserCircleIcon width={40} height={40} color="#2563EB" />}
                            title="I'm a Locum Pharmacist"
                            description="Find flexible work opportunities."
                            onPress={() => navigation.navigate(AuthScreen.Signup, { role: UserRole.Pharmacist })}
                        />
                        <RoleCard
                            icon={<BuildingStorefrontIcon width={40} height={40} color="#2563EB" />}
                            title="I'm a Pharmacy"
                            description="Find qualified locums for your shifts."
                            onPress={() => navigation.navigate(AuthScreen.Signup, { role: UserRole.Pharmacy })}
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => navigation.navigate(AuthScreen.Login)}>
                        <Text style={styles.footerText}>
                            Already have an account?{' '}
                            <Text style={styles.loginText}>
                                Log In
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
        backgroundColor: '#F9FAFB',
    },
    content: {
        flex: 1,
        padding: 24,
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
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        color: '#4B5563',
        marginBottom: 32,
        fontSize: 16,
    },
    roleCardsContainer: {
        gap: 16,
        width: '100%',
        maxWidth: 384, // max-w-sm equivalent
    },
    roleCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    roleCardContent: {
        flex: 1,
    },
    roleCardTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#1F2937',
    },
    roleCardDescription: {
        fontSize: 14,
        color: '#4B5563',
    },
    footer: {
        alignItems: 'center',
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

export default RoleSelectionScreen;