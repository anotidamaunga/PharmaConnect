// In DocumentUploadScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { DocumentArrowUpIcon, DocumentTextIcon, ChevronLeftIcon } from '../components/icons';
import {
    UploadedDocuments,
    DocumentItemConfig,
    DocumentKey,
    UploadedFile,
    AppScreenProps,
    AppNavigationProp,
    AuthScreen
} from '../types';
import { useNavigation } from '@react-navigation/native';

type DocumentUploadScreenProps = AppScreenProps<AuthScreen.DocumentUpload>;

const DocumentUploadItem: React.FC<{
    item: DocumentItemConfig;
    file: UploadedFile | null;
    onFileSelect: (key: DocumentKey, file: UploadedFile) => void;
    onFileRemove: (key: DocumentKey) => void;
}> = ({ item, file, onFileSelect, onFileRemove }) => {
    const handleFilePick = async () => {
        const mockFile = { uri: `mock://path/to/${item.key}.pdf`, name: `${item.key}_document.pdf` };
        onFileSelect(item.key, mockFile);
        Alert.alert("File Selected (Simulated)", `Selected ${mockFile.name}`);
    };

    return (
        <View style={styles.documentItem}>
            <View style={styles.documentContent}>
                <View style={styles.documentIconContainer}>
                    <DocumentTextIcon style={styles.documentIcon} />
                </View>
                <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>{item.title}</Text>
                    {file ? (
                        <Text style={styles.fileNameText} numberOfLines={1}>{file.name}</Text>
                    ) : (
                        <Text style={styles.documentDescription}>{item.description}</Text>
                    )}
                </View>
            </View>
            {file ? (
                <TouchableOpacity onPress={() => onFileRemove(item.key)} style={styles.actionButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={handleFilePick} style={styles.uploadButton}>
                    <DocumentArrowUpIcon style={styles.uploadIcon} />
                    <Text style={styles.uploadButtonText}>Upload</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const DocumentUploadScreen: React.FC<DocumentUploadScreenProps> = ({ route, navigation }) => {
    // Handle the case where route.params might be undefined
    if (!route.params) {
        // This should not happen in normal flow, but provides a fallback
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Error: Missing parameters</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { onComplete, initialFiles, documentItems, title, subText, mode, onNavigateBack } = route.params;

    const [files, setFiles] = useState<UploadedDocuments>(initialFiles || {} as UploadedDocuments);

    const handleFileSelect = (key: DocumentKey, file: UploadedFile) => {
        setFiles(prev => ({ ...prev, [key]: file }));
    };

    const handleFileRemove = (key: DocumentKey) => {
        setFiles(prev => ({ ...prev, [key]: null }));
    };

    const handleContinue = () => {
        onComplete(files);
    };

    const handleBack = () => {
        if (onNavigateBack) {
            onNavigateBack();
        } else {
            navigation.goBack();
        }
    };

    const buttonText = mode === 'onboarding' ? 'Continue' : 'Save Changes';
    const canGoBack = navigation.canGoBack();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {canGoBack && (
                    <View style={styles.backButtonContainer}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <ChevronLeftIcon style={styles.backIcon} color="#4B5563" />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.headerSection}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subText}</Text>
                </View>

                <View style={styles.documentsSection}>
                    {documentItems.map((item: DocumentItemConfig) => (
                        <DocumentUploadItem
                            key={item.key}
                            item={item}
                            file={files[item.key as DocumentKey] || null}
                            onFileSelect={handleFileSelect}
                            onFileRemove={handleFileRemove}
                        />
                    ))}
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={handleContinue}
                    style={styles.continueButton}
                    activeOpacity={0.8}
                >
                    <Text style={styles.continueButtonText}>{buttonText}</Text>
                </TouchableOpacity>
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
        padding: 24,
        flex: 1,
    },
    backButtonContainer: {
        position: 'absolute',
        top: 48,
        left: 24,
        zIndex: 10,
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
        paddingTop: 80,
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
    documentsSection: {
        marginTop: 32,
        gap: 16,
    },
    documentItem: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    documentContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
        overflow: 'hidden',
    },
    documentIconContainer: {
        padding: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    documentIcon: {
        width: 24,
        height: 24,
        color: '#4B5563',
    },
    documentInfo: {
        flex: 1,
    },
    documentTitle: {
        fontWeight: '600',
        color: '#1F2937',
        fontSize: 16,
    },
    fileNameText: {
        fontSize: 14,
        color: '#059669',
    },
    documentDescription: {
        fontSize: 14,
        color: '#6B7280',
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        flexShrink: 0,
    },
    removeButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#DC2626',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        flexShrink: 0,
    },
    uploadIcon: {
        width: 20,
        height: 20,
        color: '#2563EB',
    },
    uploadButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    footer: {
        padding: 24,
        marginTop: 'auto',
    },
    continueButton: {
        width: '100%',
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default DocumentUploadScreen;