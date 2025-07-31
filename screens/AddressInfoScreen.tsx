import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { ChevronLeftIcon, MapPinIcon } from '../components/icons';

interface AddressInfoScreenProps {
    onComplete: (address: string) => void;
    onNavigateBack: () => void;
}

const AddressInfoScreen: React.FC<AddressInfoScreenProps> = ({ onComplete, onNavigateBack }) => {
    const [address, setAddress] = useState('');

    const handleSave = () => {
        if(address.trim()){
            onComplete(address);
        } else {
            Alert.alert('Address Required', 'Please enter your pharmacy address.');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.mainContainer}>
                        <View>
                            <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                                <ChevronLeftIcon style={styles.backIcon} color="#4B5563" />
                                <Text style={styles.backText}>Back</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.contentContainer}>
                            <View style={styles.headerContainer}>
                                <Text style={styles.title}>Add Your Physical Address</Text>
                                <Text style={styles.subtitle}>This will be used as the location for your job postings.</Text>
                            </View>
                            <View>
                                <Text style={styles.label}>Pharmacy Address</Text>
                                <View style={styles.inputContainer}>
                                    <MapPinIcon style={styles.mapIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="e.g., 123 Main Street, Harare, Zimbabwe"
                                        value={address}
                                        onChangeText={setAddress}
                                        multiline
                                        textAlignVertical="top"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>
                        </View>

                        <View>
                            <TouchableOpacity
                                onPress={handleSave}
                                style={styles.saveButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.saveButtonText}>Save & Finish</Text>
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
        backgroundColor: '#F9FAFB',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
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
    contentContainer: {
        gap: 16,
    },
    headerContainer: {
        alignItems: 'center',
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
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        padding: 12,
        alignItems: 'flex-start',
    },
    mapIcon: {
        height: 20,
        width: 20,
        color: '#9CA3AF',
        marginRight: 12,
        marginTop: 4,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        height: 96,
        color: '#1F2937',
    },
    saveButton: {
        width: '100%',
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default AddressInfoScreen;