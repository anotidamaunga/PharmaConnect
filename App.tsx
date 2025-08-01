import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, Alert, StyleSheet, AppState, AppStateStatus, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import API services
import {
    authService,
    jobsService,
    documentsService,
    messagesService,
    userService,
    APIError
} from './services/api';

// Import types
import {
    AuthScreen,
    UserRole,
    MainScreen,
    Job,
    JobStatus,
    Applicant,
    Conversation,
    Message,
    FacilityType,
    ShiftType,
    VerificationMethod,
    UploadedDocuments,
    UploadedFile,
    DocumentItemConfig,
    DocumentKey,
    AppStackParamList,
    AppNavigationProp
} from './types';

// Import components
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Import screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import PharmacyHomeScreen from './screens/PharmacyHomeScreen';
import DocumentUploadScreen from './screens/DocumentUploadScreen';
import ContactInfoScreen from './screens/ContactInfoScreen';
import ProfileScreen from './screens/ProfileScreen';
import VerificationScreen from './screens/VerificationScreen';
import ExploreScreen from './screens/ExploreScreen';
import MyJobsScreen from './screens/MyJobsScreen';
import PostJobScreen from './screens/PostJobScreen';
import AddressInfoScreen from './screens/AddressInfoScreen';
import ViewApplicantsScreen from './screens/ViewApplicantsScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import ApplicantProfileScreen from './screens/ApplicantProfileScreen';
import JobDetailsScreen from './screens/JobDetailsScreen';

// Constants
const PHARMACIST_DOCS: DocumentItemConfig[] = [
    { key: 'psz', title: "PSZ Certificate", description: "Pharmaceutical Society of Zimbabwe" },
    { key: 'hpa', title: "HPA Certificate", description: "Health Professions Authority" },
    { key: 'cv', title: "Curriculum Vitae (CV)", description: "Your professional resume" },
];

const PHARMACY_DOCS: DocumentItemConfig[] = [
    { key: 'pharmacyHpa', title: "HPA Certificate", description: "Health Professions Authority" },
    { key: 'pharmacyMcaz', title: "MCAZ Premises Certificate", description: "Medicines Control Authority of Zimbabwe" },
];

// Navigation types
type MainTabsParamList = {
    Home: undefined;
    Explore?: undefined;
    Messages: undefined;
    MyJobs?: undefined;
};

const AuthStack = createNativeStackNavigator<AppStackParamList>();
const MainStack = createNativeStackNavigator<AppStackParamList>();
const TabNav = createBottomTabNavigator<MainTabsParamList>();

// State management
interface AppState {
    // Authentication
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitializing: boolean;

    // User data
    userId: string;
    userRole: UserRole | null;
    userName: string;
    userEmail: string;
    userPhone: string;
    isPremium: boolean;
    pharmacyAddress: string;

    // Verification status
    isLicenseVerified: boolean;
    isContactVerified: boolean;
    uploadedDocuments: UploadedDocuments;

    // Job data
    myJobs: Job[];
    allJobs: Job[];
    appliedJobIds: Set<string>;
    savedJobIds: Set<string>;
    conversations: Conversation[];
    jobToReviewId: string | null;

    // Error handling
    error: string | null;
    isOffline: boolean;
}

type AppAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_INITIALIZING'; payload: boolean }
    | { type: 'SET_AUTHENTICATED'; payload: boolean }
    | { type: 'SET_USER_DATA'; payload: Partial<AppState> }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_OFFLINE'; payload: boolean }
    | { type: 'UPDATE_JOBS'; payload: { myJobs?: Job[]; allJobs?: Job[] } }
    | { type: 'UPDATE_JOB_INTERACTIONS'; payload: { appliedJobIds?: Set<string>; savedJobIds?: Set<string> } }
    | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
    | { type: 'RESET_STATE' };

const initialState: AppState = {
    isAuthenticated: false,
    isLoading: true,
    isInitializing: true,
    userId: '',
    userRole: null,
    userName: '',
    userEmail: '',
    userPhone: '',
    isPremium: false,
    pharmacyAddress: '',
    isLicenseVerified: false,
    isContactVerified: false,
    uploadedDocuments: {} as UploadedDocuments,
    myJobs: [],
    allJobs: [],
    appliedJobIds: new Set(),
    savedJobIds: new Set(),
    conversations: [],
    jobToReviewId: null,
    error: null,
    isOffline: false,
};

// Type-safe helper functions
const updateJobStatus = (jobs: Job[], jobId: string, newStatus: JobStatus): Job[] => {
    return jobs.map(job =>
        job.id === jobId ? { ...job, status: newStatus } : job
    );
};

const updateJobRating = (
    jobs: Job[],
    jobId: string,
    ratingField: keyof Pick<Job, 'pharmacistRating' | 'pharmacyRating'>,
    rating: number,
    feedbackField: keyof Pick<Job, 'pharmacistFeedback' | 'pharmacyFeedback'>,
    feedback?: string
): Job[] => {
    return jobs.map(job =>
        job.id === jobId
            ? {
                ...job,
                [ratingField]: rating,
                [feedbackField]: feedback
            }
            : job
    );
};

function appStateReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_INITIALIZING':
            return { ...state, isInitializing: action.payload };
        case 'SET_AUTHENTICATED':
            return { ...state, isAuthenticated: action.payload };
        case 'SET_USER_DATA':
            return { ...state, ...action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_OFFLINE':
            return { ...state, isOffline: action.payload };
        case 'UPDATE_JOBS':
            return {
                ...state,
                myJobs: action.payload.myJobs ?? state.myJobs,
                allJobs: action.payload.allJobs ?? state.allJobs
            };
        case 'UPDATE_JOB_INTERACTIONS':
            return {
                ...state,
                appliedJobIds: action.payload.appliedJobIds ?? state.appliedJobIds,
                savedJobIds: action.payload.savedJobIds ?? state.savedJobIds
            };
        case 'SET_CONVERSATIONS':
            return { ...state, conversations: action.payload };
        case 'RESET_STATE':
            return { ...initialState, isInitializing: false, isLoading: false };
        default:
            return state;
    }
}

function AppContent() {
    const [state, dispatch] = useReducer(appStateReducer, initialState);

    // Initialize app
    useEffect(() => {
        initializeApp();

        // Handle app state changes
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && state.isAuthenticated) {
                refreshUserData();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, []);

    const initializeApp = async () => {
        try {
            dispatch({ type: 'SET_INITIALIZING', payload: true });

            const user = await authService.getCurrentUser();
            if (user) {
                await setupUserSession(user);
            }
        } catch (error) {
            console.error('App initialization error:', error);
            handleError(error, 'Failed to initialize app');
        } finally {
            dispatch({ type: 'SET_INITIALIZING', payload: false });
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const setupUserSession = async (user: any) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            // Set basic user data
            dispatch({
                type: 'SET_USER_DATA',
                payload: {
                    userId: user.id,
                    userRole: user.role,
                    userEmail: user.email,
                    isContactVerified: user.isEmailVerified && user.isPhoneVerified,
                }
            });

            // Load full profile
            const profile = await userService.getProfile();

            if (user.role === UserRole.Pharmacist) {
                dispatch({
                    type: 'SET_USER_DATA',
                    payload: {
                        userName: `${profile.firstName} ${profile.lastName}`,
                        userPhone: profile.phone,
                        isPremium: profile.isPremium,
                        isLicenseVerified: profile.licenseVerificationStatus === 'verified',
                    }
                });

                await loadPharmacistData();
            } else {
                dispatch({
                    type: 'SET_USER_DATA',
                    payload: {
                        userName: profile.pharmacyName,
                        userPhone: profile.phone,
                        pharmacyAddress: profile.address,
                    }
                });

                await loadPharmacyData();
            }

            // Load documents
            await loadUserDocuments();

            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        } catch (error) {
            console.error('Failed to setup user session:', error);
            await handleLogout();
            handleError(error, 'Failed to load user data');
        }
    };

    const loadUserDocuments = async () => {
        try {
            const docs = await documentsService.getDocuments();
            const documentsMap: UploadedDocuments = {} as UploadedDocuments;

            docs.forEach(doc => {
                if (doc.status === 'approved') {
                    documentsMap[doc.documentType as DocumentKey] = {
                        uri: doc.fileUrl,
                        name: doc.fileName
                    };
                }
            });

            dispatch({
                type: 'SET_USER_DATA',
                payload: { uploadedDocuments: documentsMap }
            });
        } catch (error) {
            console.error('Failed to load documents:', error);
            handleError(error, 'Failed to load documents');
        }
    };

    const loadPharmacistData = async () => {
        try {
            // Load available jobs
            const jobsResponse = await jobsService.searchJobs({ page: 1, limit: 20 });

            // Mark applied and saved jobs
            const appliedIds = new Set<string>();
            const savedIds = new Set<string>();

            jobsResponse.jobs.forEach(job => {
                if (job.hasApplied) appliedIds.add(job.id);
                if (job.isSaved) savedIds.add(job.id);
            });

            // Load my confirmed jobs
            const myJobsResponse = await jobsService.getMyJobs();

            // Check if any job needs review
            const needsReview = myJobsResponse.find(job =>
                job.status === 'completed' && !job.pharmacyRating
            );

            dispatch({
                type: 'UPDATE_JOBS',
                payload: { allJobs: jobsResponse.jobs, myJobs: myJobsResponse }
            });

            dispatch({
                type: 'UPDATE_JOB_INTERACTIONS',
                payload: { appliedJobIds: appliedIds, savedJobIds: savedIds }
            });

            dispatch({
                type: 'SET_USER_DATA',
                payload: { jobToReviewId: needsReview?.id || null }
            });

            // Load conversations
            await loadConversations();
        } catch (error) {
            console.error('Failed to load pharmacist data:', error);
            handleError(error, 'Failed to load job data');
        }
    };

    const loadPharmacyData = async () => {
        try {
            // Load posted jobs
            const postedJobs = await jobsService.getPharmacyJobs();
            dispatch({ type: 'UPDATE_JOBS', payload: { allJobs: postedJobs } });

            // Load conversations
            await loadConversations();

            // Load dashboard stats
            await userService.getDashboardStats();
        } catch (error) {
            console.error('Failed to load pharmacy data:', error);
            handleError(error, 'Failed to load pharmacy data');
        }
    };

    const loadConversations = async () => {
        try {
            const convos = await messagesService.getConversations();
            dispatch({ type: 'SET_CONVERSATIONS', payload: convos });
        } catch (error) {
            console.error('Failed to load conversations:', error);
            handleError(error, 'Failed to load messages');
        }
    };

    const refreshUserData = async () => {
        if (!state.isAuthenticated) return;

        try {
            if (state.userRole === UserRole.Pharmacist) {
                await loadPharmacistData();
            } else {
                await loadPharmacyData();
            }
        } catch (error) {
            console.error('Failed to refresh data:', error);
        }
    };

    // Error handling
    const handleError = (error: any, fallbackMessage: string) => {
        let errorMessage = fallbackMessage;

        if (error instanceof APIError) {
            errorMessage = error.message;

            // Handle specific error codes
            if (error.statusCode === 401) {
                handleLogout();
                return;
            }

            if (error.statusCode === 0) {
                dispatch({ type: 'SET_OFFLINE', payload: true });
                errorMessage = 'You appear to be offline. Please check your connection.';
            }
        }

        dispatch({ type: 'SET_ERROR', payload: errorMessage });

        // Auto-clear error after 5 seconds
        setTimeout(() => {
            dispatch({ type: 'SET_ERROR', payload: null });
        }, 5000);
    };

    // Authentication handlers
    const handleLogin = async (role: UserRole) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            // Demo credentials
            const credentials = {
                email: role === UserRole.Pharmacist ? 'demo.pharmacist@example.com' : 'demo.pharmacy@example.com',
                password: 'Demo123!'
            };

            const response = await authService.login(credentials.email, credentials.password);
            await setupUserSession(response.user);

        } catch (error) {
            handleError(error, 'Login failed. Please try again.');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleLoginWithCredentials = async (email: string, password: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            const response = await authService.login(email, password);
            await setupUserSession(response.user);
        } catch (error) {
            handleError(error, 'Login failed. Please check your credentials.');
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleSignup = async (role: UserRole, name: string, email: string, password: string) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            const signupData = {
                email,
                password,
                role,
                phone: '',
                ...(role === UserRole.Pharmacist
                        ? {
                            firstName: name.split(' ')[0] || name,
                            lastName: name.split(' ')[1] || ''
                        }
                        : { pharmacyName: name }
                ),
            };

            const response = await authService.signup(signupData);

            // Set temporary data for onboarding flow
            dispatch({
                type: 'SET_USER_DATA',
                payload: {
                    userId: response.userId,
                    userRole: role,
                    userName: name,
                    userEmail: email,
                }
            });

        } catch (error) {
            handleError(error, 'Signup failed. Please try again.');
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            dispatch({ type: 'RESET_STATE' });
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API call fails
            dispatch({ type: 'RESET_STATE' });
        }
    };

    // Document handlers
    const handleDocumentsUploaded = async (docs: UploadedDocuments) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            // Upload each document
            const uploadPromises = Object.entries(docs).map(async ([docType, file]) => {
                if (file && !state.uploadedDocuments[docType as DocumentKey]) {
                    await documentsService.uploadDocument(docType as DocumentKey, file);
                }
            });

            await Promise.all(uploadPromises);

            // Reload documents
            await loadUserDocuments();

            Alert.alert('Success', 'Documents uploaded successfully. They will be reviewed within 2-3 business days.');

            // If this completes onboarding, set authenticated
            if (!state.isAuthenticated && state.isContactVerified) {
                dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            }

        } catch (error) {
            handleError(error, 'Failed to upload documents. Please try again.');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    // Job handlers
    const handleApplyToJob = useCallback(async (jobId: string) => {
        if (!state.isLicenseVerified || state.userRole !== UserRole.Pharmacist) {
            Alert.alert('Cannot Apply', 'Your license must be verified to apply for jobs.');
            return;
        }

        try {
            await jobsService.applyToJob(jobId, {});

            // Update local state
            const newAppliedIds = new Set(state.appliedJobIds).add(jobId);
            const newSavedIds = new Set(state.savedJobIds);
            newSavedIds.delete(jobId);

            dispatch({
                type: 'UPDATE_JOB_INTERACTIONS',
                payload: { appliedJobIds: newAppliedIds, savedJobIds: newSavedIds }
            });

            Alert.alert('Success', 'Application submitted successfully!');

        } catch (error) {
            if (error instanceof APIError && error.statusCode === 400) {
                Alert.alert('Already Applied', 'You have already applied to this job.');
            } else {
                handleError(error, 'Failed to submit application. Please try again.');
            }
        }
    }, [state.isLicenseVerified, state.userRole, state.appliedJobIds, state.savedJobIds]);

    const handleSaveJob = useCallback(async (jobId: string) => {
        try {
            await jobsService.saveJob(jobId);
            const newSavedIds = new Set(state.savedJobIds).add(jobId);
            dispatch({
                type: 'UPDATE_JOB_INTERACTIONS',
                payload: { savedJobIds: newSavedIds }
            });
        } catch (error) {
            handleError(error, 'Failed to save job');
        }
    }, [state.savedJobIds]);

    const handleUnsaveJob = useCallback(async (jobId: string) => {
        try {
            await jobsService.unsaveJob(jobId);
            const newSavedIds = new Set(state.savedJobIds);
            newSavedIds.delete(jobId);
            dispatch({
                type: 'UPDATE_JOB_INTERACTIONS',
                payload: { savedJobIds: newSavedIds }
            });
        } catch (error) {
            handleError(error, 'Failed to unsave job');
        }
    }, [state.savedJobIds]);

    // Additional handlers for job management, messages, etc.
    const handleJobPosted = async (jobData: Omit<Job, 'id' | 'pharmacy' | 'location' | 'status' | 'applicants'>) => {
        if (state.userRole !== UserRole.Pharmacy) return;

        try {
            const newJob = await jobsService.createJob({
                ...jobData,
                status: 'active' as JobStatus,
                location_address: state.pharmacyAddress,
                location_city: state.pharmacyAddress.split(',')[1]?.trim() || 'Harare'
            });

            await loadPharmacyData();
            Alert.alert('Success', 'Job posted successfully!');
        } catch (error) {
            handleError(error, 'Failed to post job. Please try again.');
        }
    };

    const handleSendMessage = async (conversationId: string, text: string) => {
        if (!state.userRole) return;

        try {
            const newMessage = await messagesService.sendMessage(conversationId, text);

            // Update local conversations
            dispatch({
                type: 'SET_CONVERSATIONS',
                payload: state.conversations.map(c =>
                    c.id === conversationId
                        ? { ...c, messages: [...c.messages, newMessage] }
                        : c
                )
            });
        } catch (error) {
            handleError(error, 'Failed to send message');
        }
    };

    // Contact and verification handlers
    const handleContactInfoComplete = async (phone: string, email: string, method: VerificationMethod) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            await userService.updateContactInfo({ phone, email });
            dispatch({
                type: 'SET_USER_DATA',
                payload: { userPhone: phone, userEmail: email }
            });

            await authService.resendOTP(method === VerificationMethod.Email ? 'email' : 'phone');

            Alert.alert('Success', `Verification code sent to your ${method === VerificationMethod.Email ? 'email' : 'phone'}`);
        } catch (error) {
            handleError(error, 'Failed to update contact info');
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleVerifyOTP = async (code: string, method: VerificationMethod) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            await authService.verifyOTP(
                code,
                method === VerificationMethod.Email ? 'email' : 'phone'
            );

            dispatch({
                type: 'SET_USER_DATA',
                payload: { isContactVerified: true }
            });

            if (state.userId && state.uploadedDocuments) {
                dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            }

            Alert.alert('Success', 'Verification successful!');
        } catch (error) {
            handleError(error, 'Invalid verification code. Please try again.');
            throw error;
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleAddressComplete = async (address: string) => {
        try {
            await userService.updateAddress(address);
            dispatch({
                type: 'SET_USER_DATA',
                payload: { pharmacyAddress: address }
            });

            if (state.isContactVerified) {
                dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            }
        } catch (error) {
            handleError(error, 'Failed to update address');
            throw error;
        }
    };

    // Component props
    const hasConversations = state.conversations.length > 0;
    const docsForUser = state.userRole === UserRole.Pharmacist ? PHARMACIST_DOCS : PHARMACY_DOCS;
    const docsCount = docsForUser.filter(doc => state.uploadedDocuments[doc.key]).length;
    const isDocumentsComplete = docsCount === docsForUser.length;

    // Show loading screen during initialization
    if (state.isInitializing) {
        return <LoadingScreen message="Initializing PharmaConnect..." />;
    }

    // Main app tabs
    const MainAppTabs = () => {
        if (!state.userRole) return null;

        return (
            <TabNav.Navigator
                tabBar={props =>
                    <BottomNav
                        {...props}
                        hasConversations={hasConversations}
                        userRole={state.userRole}
                    />
                }
            >
                <TabNav.Screen name="Home" options={{ header: () => <Header /> }}>
                    {(props) => {
                        const handleCompleteProfile = () => {
                            props.navigation.navigate(AuthScreen.DocumentUpload, {
                                title: "Manage Documents",
                                subText: "Update your documents.",
                                documentItems: docsForUser,
                                initialFiles: state.uploadedDocuments,
                                onComplete: handleDocumentsUploaded,
                                mode: 'editing',
                                onNavigateBack: () => props.navigation.goBack()
                            });
                        };

                        if (state.userRole === UserRole.Pharmacist) {
                            return (
                                <HomeScreen
                                    {...props}
                                    userName={state.userName}
                                    documentsUploadedCount={docsCount}
                                    isLicenseVerified={state.isLicenseVerified}
                                    jobToReviewId={state.jobToReviewId}
                                    appliedJobsCount={state.appliedJobIds.size}
                                    homeScreenJobs={state.allJobs.filter(j => j.status === 'active')}
                                    appliedJobIds={state.appliedJobIds}
                                    onCompleteProfileClick={handleCompleteProfile}
                                    onVerifyLicense={() => dispatch({
                                        type: 'SET_USER_DATA',
                                        payload: { isLicenseVerified: true }
                                    })}
                                    onRateJob={(jobId, rating) => {
                                        // Handle rating logic
                                        const updatedJobs = state.myJobs.map(j =>
                                            j.id === jobId ? { ...j, rating } : j
                                        );
                                        dispatch({
                                            type: 'UPDATE_JOBS',
                                            payload: { myJobs: updatedJobs }
                                        });
                                        if (state.jobToReviewId === jobId) {
                                            dispatch({
                                                type: 'SET_USER_DATA',
                                                payload: { jobToReviewId: null }
                                            });
                                        }
                                    }}
                                    onRatePharmacy={async (jobId, rating, feedback) => {
                                        try {
                                            await jobsService.ratePharmacy(jobId, rating, feedback);

                                            // Update local state using helper function
                                            const updatedJobs = updateJobRating(
                                                state.myJobs,
                                                jobId,
                                                'pharmacyRating',
                                                rating,
                                                'pharmacyFeedback',
                                                feedback
                                            );
                                            dispatch({
                                                type: 'UPDATE_JOBS',
                                                payload: { myJobs: updatedJobs }
                                            });

                                            if (state.jobToReviewId === jobId) {
                                                dispatch({
                                                    type: 'SET_USER_DATA',
                                                    payload: { jobToReviewId: null }
                                                });
                                            }

                                            Alert.alert('Success', 'Thank you for your feedback!');
                                        } catch (error) {
                                            handleError(error, 'Failed to submit rating');
                                        }
                                    }}
                                    onViewJobDetails={(job) => props.navigation.navigate(MainScreen.JobDetails, { jobId: job.id })}
                                    onApply={handleApplyToJob}
                                />
                            );
                        }

                        return (
                            <PharmacyHomeScreen
                                {...props}
                                userName={state.userName}
                                postedJobs={state.allJobs}
                                onPostNewJob={() => props.navigation.navigate(MainScreen.PostJob)}
                                onViewApplicants={(jobId) => props.navigation.navigate(MainScreen.ViewApplicants, { jobId })}
                                onCompleteProfileClick={handleCompleteProfile}
                                isDocumentsComplete={isDocumentsComplete}
                                onMarkJobAsCompleted={async (jobId) => {
                                    const updatedJobs = updateJobStatus(state.allJobs, jobId, 'completed');
                                    dispatch({
                                        type: 'UPDATE_JOBS',
                                        payload: { allJobs: updatedJobs }
                                    });
                                }}
                                onRatePharmacist={async (jobId, rating, feedback) => {
                                    const updatedJobs = updateJobRating(
                                        state.allJobs,
                                        jobId,
                                        'pharmacistRating',
                                        rating,
                                        'pharmacistFeedback',
                                        feedback
                                    );
                                    dispatch({
                                        type: 'UPDATE_JOBS',
                                        payload: { allJobs: updatedJobs }
                                    });
                                }}
                            />
                        );
                    }}
                </TabNav.Screen>

                {state.userRole === UserRole.Pharmacist && (
                    <TabNav.Screen name="Explore" options={{ header: () => <Header /> }}>
                        {props => (
                            <ExploreScreen
                                {...props}
                                isLicenseVerified={state.isLicenseVerified}
                                jobs={state.allJobs.filter(j => j.status === 'active')}
                                appliedJobIds={state.appliedJobIds}
                                savedJobIds={state.savedJobIds}
                                onSave={handleSaveJob}
                                onUnsave={handleUnsaveJob}
                                onViewJobDetails={(job) => props.navigation.navigate(MainScreen.JobDetails, { jobId: job.id })}
                                onApply={handleApplyToJob}
                            />
                        )}
                    </TabNav.Screen>
                )}

                <TabNav.Screen name="Messages" options={{ header: () => <Header /> }}>
                    {props => (
                        <MessagesScreen
                            {...props}
                            conversations={state.conversations}
                            currentUserRole={state.userRole}
                            onOpenChat={(id) => props.navigation.navigate(MainScreen.Chat, { conversationId: id })}
                        />
                    )}
                </TabNav.Screen>

                {state.userRole === UserRole.Pharmacist && (
                    <TabNav.Screen name="MyJobs" options={{ header: () => <Header /> }}>
                        {props => (
                            <MyJobsScreen
                                {...props}
                                isLicenseVerified={state.isLicenseVerified}
                                myJobs={state.myJobs}
                                appliedJobs={state.allJobs.filter(j => state.appliedJobIds.has(j.id) && j.status === 'active')}
                                savedJobs={state.allJobs.filter(j => state.savedJobIds.has(j.id))}
                                appliedJobIds={state.appliedJobIds}
                                onMarkAsCompleted={(jobId) => {
                                    const updatedJobs = updateJobStatus(state.myJobs, jobId, 'completed');
                                    dispatch({
                                        type: 'UPDATE_JOBS',
                                        payload: { myJobs: updatedJobs }
                                    });
                                    dispatch({
                                        type: 'SET_USER_DATA',
                                        payload: { jobToReviewId: jobId }
                                    });
                                }}
                                onRatePharmacy={async (jobId, rating, feedback) => {
                                    try {
                                        await jobsService.ratePharmacy(jobId, rating, feedback);

                                        // Update local state using helper function
                                        const updatedJobs = updateJobRating(
                                            state.myJobs,
                                            jobId,
                                            'pharmacyRating',
                                            rating,
                                            'pharmacyFeedback',
                                            feedback
                                        );
                                        dispatch({
                                            type: 'UPDATE_JOBS',
                                            payload: { myJobs: updatedJobs }
                                        });

                                        Alert.alert('Success', 'Thank you for your feedback!');
                                    } catch (error) {
                                        handleError(error, 'Failed to submit rating');
                                    }
                                }}
                                onApply={handleApplyToJob}
                                onUnsave={handleUnsaveJob}
                                onViewJobDetails={(job) => props.navigation.navigate(MainScreen.JobDetails, { jobId: job.id })}
                            />
                        )}
                    </TabNav.Screen>
                )}
            </TabNav.Navigator>
        );
    };

    // Main app stack
    const MainAppStack = () => (
        <MainStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <MainStack.Screen name={MainScreen.MainTabs} component={MainAppTabs} />
            <MainStack.Screen name={MainScreen.Profile}>
                {({ navigation }) => {
                    if (!state.userRole) return null;

                    return (
                        <ProfileScreen
                            onLogout={handleLogout}
                            onNavigateBack={navigation.goBack}
                            userName={state.userName}
                            userEmail={state.userEmail}
                            userPhone={state.userPhone}
                            isContactVerified={state.isContactVerified}
                            myJobs={state.myJobs}
                            userRole={state.userRole}
                            pharmacyAddress={state.pharmacyAddress}
                            locumsHired={state.allJobs.filter(j => j.pharmacy === state.userName && j.status === 'completed').length}
                            activeJobsCount={state.allJobs.filter(j => j.pharmacy === state.userName && j.status === 'active').length}
                            uploadedDocuments={state.uploadedDocuments}
                            onEditDocuments={() => navigation.navigate(AuthScreen.DocumentUpload, {
                                title: "Manage Documents",
                                subText: "Update your documents.",
                                documentItems: docsForUser,
                                initialFiles: state.uploadedDocuments,
                                onComplete: handleDocumentsUploaded,
                                mode: 'editing',
                                onNavigateBack: () => navigation.goBack()
                            })}
                        />
                    );
                }}
            </MainStack.Screen>

            <MainStack.Screen name={MainScreen.JobDetails}>
                {({ route, navigation }) => {
                    const job = state.allJobs.find(j => j.id === route.params.jobId);
                    if (!job) return null;
                    return (
                        <JobDetailsScreen
                            job={job}
                            onNavigateBack={navigation.goBack}
                            isLicenseVerified={state.isLicenseVerified}
                            hasApplied={state.appliedJobIds.has(job.id)}
                            isSaved={state.savedJobIds.has(job.id)}
                            onApply={handleApplyToJob}
                            onSave={handleSaveJob}
                            onUnsave={handleUnsaveJob}
                        />
                    );
                }}
            </MainStack.Screen>

            <MainStack.Screen name={AuthScreen.DocumentUpload}>
                {({ navigation, route }) => {
                    if (!route.params) return null;
                    return (
                        <DocumentUploadScreen
                            route={{
                                ...route,
                                params: {
                                    ...route.params,
                                    onComplete: route.params.onComplete,
                                    onNavigateBack: route.params.onNavigateBack || (() => navigation.goBack())
                                }
                            }}
                            navigation={navigation}
                        />
                    );
                }}
            </MainStack.Screen>

            <MainStack.Screen name={MainScreen.PostJob}>
                {({ navigation }) => (
                    <PostJobScreen
                        onJobPosted={(data) => {
                            handleJobPosted(data);
                            navigation.goBack();
                        }}
                        onNavigateBack={navigation.goBack}
                    />
                )}
            </MainStack.Screen>

            <MainStack.Screen name={MainScreen.ViewApplicants}>
                {({ route, navigation }) => {
                    const job = state.allJobs.find(j => j.id === route.params.jobId);
                    if (!job) return null;

                    return (
                        <ViewApplicantsScreen
                            job={job}
                            onNavigateBack={navigation.goBack}
                            onViewProfile={(applicant) => {
                                navigation.navigate(MainScreen.ApplicantProfile, {
                                    applicant,
                                    jobId: job.id
                                });
                            }}
                            onSaveApplicant={async (jobId, applicant) => {
                                try {
                                    await jobsService.saveApplicant(jobId, applicant.id);

                                    // Update local state
                                    const updatedJobs = state.allJobs.map(job => {
                                        if (job.id === jobId) {
                                            const savedApplicants = job.savedApplicants || [];
                                            if (!savedApplicants.find(saved => saved.id === applicant.id)) {
                                                return {
                                                    ...job,
                                                    savedApplicants: [...savedApplicants, applicant],
                                                    applicants: job.applicants?.filter(a => a.id !== applicant.id)
                                                };
                                            }
                                        }
                                        return job;
                                    });

                                    dispatch({
                                        type: 'UPDATE_JOBS',
                                        payload: { allJobs: updatedJobs }
                                    });

                                    Alert.alert('Success', 'Applicant saved for later');
                                } catch (error) {
                                    handleError(error, 'Failed to save applicant');
                                }
                            }}
                        />
                    );
                }}
            </MainStack.Screen>

            <MainStack.Screen name={MainScreen.ApplicantProfile}>
                {({ route, navigation }) => (
                    <ApplicantProfileScreen
                        applicant={route.params.applicant}
                        onNavigateBack={navigation.goBack}
                        onConfirm={async () => {
                            try {
                                await jobsService.confirmApplicant(route.params.jobId, route.params.applicant.id);

                                // Update local state using helper function
                                const updatedJobs = state.allJobs.map(job =>
                                    job.id === route.params.jobId
                                        ? {
                                            ...job,
                                            status: 'confirmed' as JobStatus,
                                            confirmedApplicant: route.params.applicant
                                        }
                                        : job
                                );

                                dispatch({
                                    type: 'UPDATE_JOBS',
                                    payload: { allJobs: updatedJobs }
                                });

                                // Create conversation
                                const newConvo: Conversation = {
                                    id: route.params.jobId,
                                    pharmacyName: state.userName,
                                    pharmacistName: route.params.applicant.name,
                                    jobRole: state.allJobs.find(j => j.id === route.params.jobId)?.role || '',
                                    messages: []
                                };

                                dispatch({
                                    type: 'SET_CONVERSATIONS',
                                    payload: [...state.conversations, newConvo]
                                });

                                Alert.alert('Success', `${route.params.applicant.name} has been confirmed for this job.`);
                                navigation.navigate(MainScreen.Chat, { conversationId: route.params.jobId });
                            } catch (error) {
                                handleError(error, 'Failed to confirm applicant');
                            }
                        }}
                        onDecline={async () => {
                            try {
                                await jobsService.declineApplicant(route.params.jobId, route.params.applicant.id);

                                // Update local state
                                const updatedJobs = state.allJobs.map(job =>
                                    job.id === route.params.jobId
                                        ? {
                                            ...job,
                                            applicants: job.applicants?.filter(a => a.id !== route.params.applicant.id)
                                        }
                                        : job
                                );

                                dispatch({
                                    type: 'UPDATE_JOBS',
                                    payload: { allJobs: updatedJobs }
                                });

                                Alert.alert('Success', 'Applicant declined');
                                navigation.goBack();
                            } catch (error) {
                                handleError(error, 'Failed to decline applicant');
                            }
                        }}
                        onSave={async () => {
                            try {
                                await jobsService.saveApplicant(route.params.jobId, route.params.applicant.id);

                                // Update local state (same logic as in ViewApplicants)
                                const updatedJobs = state.allJobs.map(job => {
                                    if (job.id === route.params.jobId) {
                                        const savedApplicants = job.savedApplicants || [];
                                        if (!savedApplicants.find(saved => saved.id === route.params.applicant.id)) {
                                            return {
                                                ...job,
                                                savedApplicants: [...savedApplicants, route.params.applicant],
                                                applicants: job.applicants?.filter(a => a.id !== route.params.applicant.id)
                                            };
                                        }
                                    }
                                    return job;
                                });

                                dispatch({
                                    type: 'UPDATE_JOBS',
                                    payload: { allJobs: updatedJobs }
                                });

                                Alert.alert('Success', 'Applicant saved for later');
                                navigation.goBack();
                            } catch (error) {
                                handleError(error, 'Failed to save applicant');
                            }
                        }}
                    />
                )}
            </MainStack.Screen>

            <MainStack.Screen name={MainScreen.Chat}>
                {({ route, navigation }) => {
                    if (!state.userRole) return null;

                    const conversation = state.conversations.find(c => c.id === route.params.conversationId);
                    if (!conversation) return null;

                    return (
                        <ChatScreen
                            conversation={conversation}
                            onSendMessage={(text) => handleSendMessage(route.params.conversationId, text)}
                            onNavigateBack={navigation.goBack}
                            currentUserRole={state.userRole}
                        />
                    );
                }}
            </MainStack.Screen>
        </MainStack.Navigator>
    );

    // Authentication flow stack
    const AuthFlowStack = () => (
        <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <AuthStack.Screen name={AuthScreen.Welcome} component={WelcomeScreen} />

            <AuthStack.Screen name={AuthScreen.Login}>
                {({ navigation }) => (
                    <LoginScreen
                        onLogin={handleLogin}
                        onNavigateToSignUp={() => navigation.navigate(AuthScreen.Signup)}
                        onNavigateBack={() => navigation.goBack()}
                    />
                )}
            </AuthStack.Screen>

            <AuthStack.Screen name={AuthScreen.RoleSelection} component={RoleSelectionScreen} />

            <AuthStack.Screen name={AuthScreen.Signup}>
                {({ navigation, route }) => {
                    const role = route.params?.role;
                    if (!role) {
                        navigation.navigate(AuthScreen.RoleSelection);
                        return null;
                    }
                    return (
                        <SignupScreen
                            onSignup={async (roleParam, name, email, password) => {
                                await handleSignup(roleParam, name, email, password);

                                // Navigate to appropriate next step
                                if (roleParam === UserRole.Pharmacy) {
                                    navigation.navigate(AuthScreen.Verification, {
                                        method: VerificationMethod.Email,
                                        email,
                                        phone: '',
                                        title: 'Verify Your Email'
                                    });
                                } else {
                                    navigation.navigate(AuthScreen.ContactInfo);
                                }
                            }}
                            onNavigateBack={() => navigation.goBack()}
                            onNavigateToLogin={() => navigation.navigate(AuthScreen.Login)}
                            role={role}
                        />
                    );
                }}
            </AuthStack.Screen>

            <AuthStack.Screen name={AuthScreen.DocumentUpload}>
                {({ navigation, route }) => {
                    if (!route.params) return null;
                    return (
                        <DocumentUploadScreen
                            route={{
                                ...route,
                                params: {
                                    ...route.params,
                                    onNavigateBack: route.params.onNavigateBack || (() => navigation.goBack())
                                }
                            }}
                            navigation={navigation}
                        />
                    );
                }}
            </AuthStack.Screen>

            <AuthStack.Screen name={AuthScreen.ContactInfo}>
                {({ navigation }) => (
                    <ContactInfoScreen
                        onComplete={async (phone, email, method) => {
                            await handleContactInfoComplete(phone, email, method);
                            navigation.navigate(AuthScreen.Verification, {
                                method,
                                email,
                                phone,
                                title: method === VerificationMethod.Email ? 'Verify Your Email' : 'Verify Your Phone'
                            });
                        }}
                        email={state.userEmail}
                        onNavigateBack={navigation.goBack}
                    />
                )}
            </AuthStack.Screen>

            <AuthStack.Screen name={AuthScreen.Verification}>
                {({ navigation, route }) => (
                    <VerificationScreen
                        onVerify={async () => {
                            await handleVerifyOTP('1234', route.params.method); // Mock OTP for demo

                            if (state.userRole === UserRole.Pharmacist) {
                                dispatch({ type: 'SET_AUTHENTICATED', payload: true });
                            } else {
                                navigation.navigate(AuthScreen.AddressInfo);
                            }
                        }}
                        onNavigateBack={navigation.goBack}
                        method={route.params.method}
                        email={route.params.email}
                        phone={route.params.phone}
                        title={route.params.title}
                    />
                )}
            </AuthStack.Screen>

            <AuthStack.Screen name={AuthScreen.AddressInfo}>
                {({ navigation }) => (
                    <AddressInfoScreen
                        onComplete={async (address) => {
                            await handleAddressComplete(address);
                            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
                        }}
                        onNavigateBack={navigation.goBack}
                    />
                )}
            </AuthStack.Screen>
        </AuthStack.Navigator>
    );

    // Error display
    if (state.error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{state.error}</Text>
                {state.isOffline && (
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            dispatch({ type: 'SET_ERROR', payload: null });
                            dispatch({ type: 'SET_OFFLINE', payload: false });
                            refreshUserData();
                        }}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return (
        <NavigationContainer>
            {state.isAuthenticated ? <MainAppStack /> : <AuthFlowStack />}
            {state.isLoading && <LoadingScreen message="Loading..." />}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F9FAFB',
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default function App() {
    return (
        <ErrorBoundary>
            <SafeAreaProvider>
                <StatusBar style="dark" />
                <AppContent />
            </SafeAreaProvider>
        </ErrorBoundary>
    );
}
