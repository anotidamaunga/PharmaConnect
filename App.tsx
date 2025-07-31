import React, { useState, useMemo, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StatusBar } from "expo-status-bar";

import { AuthScreen, UserRole, MainScreen, Job, Applicant, Conversation, Message, FacilityType, ShiftType, VerificationMethod, UploadedDocuments, UploadedFile, DocumentItemConfig, Tab, DocumentKey, AppStackParamList, AppNavigationProp } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
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

// Mock data and helpers
const getISODate = (daysOffset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
};

const mockFile = (name: string): UploadedFile => ({ uri: 'mock://path/to/' + name, name });

const PHARMACIST_DOCS: DocumentItemConfig[] = [
    { key: 'psz', title: "PSZ Certificate", description: "Pharmaceutical Society of Zimbabwe" },
    { key: 'hpa', title: "HPA Certificate", description: "Health Professions Authority" },
    { key: 'cv', title: "Curriculum Vitae (CV)", description: "Your professional resume" },
];

const PHARMACY_DOCS: DocumentItemConfig[] = [
    { key: 'pharmacyHpa', title: "HPA Certificate", description: "Health Professions Authority" },
    { key: 'pharmacyMcaz', title: "MCAZ Premises Certificate", description: "Medicines Control Authority of Zimbabwe" },
];

const initialUploadedDocs: UploadedDocuments = {
    psz: null, hpa: null, cv: null, pharmacyHpa: null, pharmacyMcaz: null
};

// Mock user data storage - in a real app, this would be stored in a database
const mockUserData: { [key: string]: { documents: UploadedDocuments; isLicenseVerified: boolean; isContactVerified: boolean; isPremium: boolean } } = {
    'thabani@email.com': {
        documents: {
            psz: mockFile('thabani_psz.pdf'),
            hpa: mockFile('thabani_hpa.pdf'),
            cv: mockFile('thabani_cv.pdf'),
            pharmacyHpa: null,
            pharmacyMcaz: null
        },
        isLicenseVerified: true, // Existing user - already verified
        isContactVerified: true,
        isPremium: true
    },
    'manager@citypharm.com': {
        documents: {
            psz: null,
            hpa: null,
            cv: null,
            pharmacyHpa: mockFile('citypharm_hpa.pdf'),
            pharmacyMcaz: mockFile('citypharm_mcaz.pdf')
        },
        isLicenseVerified: false,
        isContactVerified: true,
        isPremium: false
    },
    'newuser@email.com': {
        documents: initialUploadedDocs, // No documents uploaded yet
        isLicenseVerified: false, // New user - needs approval after document upload
        isContactVerified: true,
        isPremium: false
    },
    // New users or users without documents will not be in this mock data
};

const mockInitialJobs: Job[] = [
    // Jobs posted by other pharmacies (for pharmacist users to apply to)
    { id: 'job1', pharmacy: 'Greenwood Pharmacy', location: 'Harare', rate: '$7/hr', role: 'Locum Pharmacist', date: getISODate(0), time: '2pm - 6pm', facilityType: FacilityType.Retail, shiftType: ShiftType.Afternoon, status: 'Active', applicants: [{id: 'p1', name: 'Thabani', rating: 4.8, isPremium: true, shiftsCompleted: 25, documents: { psz: mockFile('psz.pdf'), hpa: mockFile('hpa.pdf'), cv: null, pharmacyHpa: null, pharmacyMcaz: null }}], description: 'Seeking a diligent locum pharmacist for an afternoon shift. Responsibilities include dispensing medication, advising patients, and managing inventory.', savedApplicants: [] },
    { id: 'job2', pharmacy: 'Riverside Pharmacy', location: 'Harare', rate: '$7/hr', role: 'Locum Pharmacist', date: getISODate(1), time: '9am - 5pm', facilityType: FacilityType.Clinic, shiftType: ShiftType.Morning, status: 'Active', applicants: [], description: 'Join our clinic team for a day shift. We need a reliable pharmacist to assist with patient consultations and prescription management.', savedApplicants: [] },
    { id: 'job3', pharmacy: 'ABC Pharmacy', location: 'Bulawayo', rate: '$8/hr', role: 'Locum Pharmacist', date: getISODate(5), time: '8am - 8pm', facilityType: FacilityType.Retail, shiftType: ShiftType.Morning, status: 'Active', applicants: [], description: 'Full-day coverage needed for our busy retail location. Must be experienced with high volume and have excellent customer service skills.', savedApplicants: [] },

    // Jobs posted by City Pharmacy (for pharmacy users to manage)
    { id: 'city-job-1', pharmacy: 'City Pharmacy', location: '123 Main St, Harare', rate: '$8/hr', role: 'Locum Pharmacist', date: getISODate(2), time: '9am - 5pm', facilityType: FacilityType.Retail, shiftType: ShiftType.Morning, status: 'Active', applicants: [
            {id: 'applicant-1', name: 'Sarah Johnson', rating: 4.5, isPremium: false, shiftsCompleted: 18, documents: { psz: mockFile('sarah_psz.pdf'), hpa: mockFile('sarah_hpa.pdf'), cv: mockFile('sarah_cv.pdf'), pharmacyHpa: null, pharmacyMcaz: null }},
            {id: 'applicant-2', name: 'Michael Chen', rating: 4.9, isPremium: true, shiftsCompleted: 32, documents: { psz: mockFile('michael_psz.pdf'), hpa: mockFile('michael_hpa.pdf'), cv: mockFile('michael_cv.pdf'), pharmacyHpa: null, pharmacyMcaz: null }}
        ], description: 'We need a reliable pharmacist for our busy retail location. Experience with customer service and inventory management preferred.', savedApplicants: [] },

    { id: 'city-job-2', pharmacy: 'City Pharmacy', location: '123 Main St, Harare', rate: '$9/hr', role: 'Weekend Pharmacist', date: getISODate(7), time: '10am - 6pm', facilityType: FacilityType.Retail, shiftType: ShiftType.Morning, status: 'Confirmed', applicants: [], confirmedApplicant: {id: 'applicant-3', name: 'David Wilson', rating: 4.7, isPremium: true, shiftsCompleted: 28, documents: { psz: mockFile('david_psz.pdf'), hpa: mockFile('david_hpa.pdf'), cv: mockFile('david_cv.pdf'), pharmacyHpa: null, pharmacyMcaz: null }}, description: 'Weekend shift coverage needed. Must be available for both Saturday and Sunday.', savedApplicants: [] },

    { id: 'city-job-3', pharmacy: 'City Pharmacy', location: '123 Main St, Harare', rate: '$8.5/hr', role: 'Evening Pharmacist', date: getISODate(-3), time: '2pm - 10pm', facilityType: FacilityType.Retail, shiftType: ShiftType.Evening, status: 'Completed', applicants: [], confirmedApplicant: {id: 'applicant-4', name: 'Lisa Thompson', rating: 4.6, isPremium: false, shiftsCompleted: 22, documents: { psz: mockFile('lisa_psz.pdf'), hpa: mockFile('lisa_hpa.pdf'), cv: mockFile('lisa_cv.pdf'), pharmacyHpa: null, pharmacyMcaz: null }}, description: 'Evening shift to cover our extended hours. Experience with night operations preferred.', savedApplicants: [], pharmacistRating: 5, pharmacistFeedback: 'Excellent work! Very professional and handled the evening rush perfectly.' },

    { id: 'city-job-4', pharmacy: 'City Pharmacy', location: '123 Main St, Harare', rate: '$7.5/hr', role: 'Relief Pharmacist', date: getISODate(14), time: '8am - 4pm', facilityType: FacilityType.Retail, shiftType: ShiftType.Morning, status: 'Active', applicants: [
            {id: 'applicant-5', name: 'Robert Brown', rating: 4.2, isPremium: false, shiftsCompleted: 15, documents: { psz: mockFile('robert_psz.pdf'), hpa: mockFile('robert_hpa.pdf'), cv: null, pharmacyHpa: null, pharmacyMcaz: null }}
        ], description: 'Temporary relief needed for our regular pharmacist who will be away. Must be comfortable working independently.', savedApplicants: [
            {id: 'applicant-6', name: 'Emma Davis', rating: 4.8, isPremium: true, shiftsCompleted: 45, documents: { psz: mockFile('emma_psz.pdf'), hpa: mockFile('emma_hpa.pdf'), cv: mockFile('emma_cv.pdf'), pharmacyHpa: null, pharmacyMcaz: null }}
        ] },
];

const mockPharmacistJobs: Job[] = [
    { id: 'myjob-1', pharmacy: 'Cospharm Group', location: 'Harare', rate: '$8/hr', role: 'Locum Pharmacist', date: getISODate(-1), time: '9am - 5pm', facilityType: FacilityType.Retail, shiftType: ShiftType.Morning, status: 'Completed', rating: 5, description: '', savedApplicants: [] },
    { id: 'myjob-to-complete', pharmacy: 'City Centre Meds', location: 'CBD', rate: '$7.5/hr', role: 'Locum Pharmacist', date: getISODate(1), time: '12pm - 8pm', facilityType: FacilityType.Clinic, shiftType: ShiftType.Afternoon, status: 'Confirmed', description: '', savedApplicants: [] },
    { id: 'myjob-to-review', pharmacy: 'Borrowdale Health', location: 'Borrowdale', rate: '$9.5/hr', role: 'Locum Pharmacist', date: getISODate(-7), time: '8am - 4pm', facilityType: FacilityType.Retail, shiftType: ShiftType.Morning, status: 'Completed', description: '', savedApplicants: [] },
];

const mockConversations: Conversation[] = [
    {
        id: 'myjob-to-complete',
        pharmacyName: 'City Centre Meds',
        pharmacistName: 'Thabani',
        jobRole: 'Locum Pharmacist',
        messages: [
            { id: 'msg1', text: "Hi Thabani, looking forward to having you tomorrow.", sender: UserRole.Pharmacy, timestamp: '10:30 AM' },
        ],
    },
];

// Navigation Param Lists
type MainTabsParamList = {
    Home: undefined;
    Explore?: undefined;
    Messages: undefined;
    MyJobs?: undefined;
};

const AuthStack = createNativeStackNavigator<AppStackParamList>();
const MainStack = createNativeStackNavigator<AppStackParamList>();
const TabNav = createBottomTabNavigator<MainTabsParamList>();

function AppContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [userPhone, setUserPhone] = useState<string>('');
    const [isPremium, setIsPremium] = useState(false);
    const [pharmacyAddress, setPharmacyAddress] = useState<string>('');
    const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocuments>(initialUploadedDocs);
    const [isLicenseVerified, setIsLicenseVerified] = useState(false);
    const [isContactVerified, setIsContactVerified] = useState(false);
    const [myJobs, setMyJobs] = useState<Job[]>([]);
    const [jobToReviewId, setJobToReviewId] = useState<string | null>(null);
    const [allJobs, setAllJobs] = useState<Job[]>(mockInitialJobs);
    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
    const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
    const [conversations, setConversations] = useState<Conversation[]>([]);

    // Handlers
    const handleLogin = (role: UserRole) => {
        setIsAuthenticated(true);
        setUserRole(role);

        const email = role === UserRole.Pharmacist ? 'thabani@email.com' : 'manager@citypharm.com';
        const name = role === UserRole.Pharmacist ? 'Thabani' : 'City Pharmacy';
        const phone = role === UserRole.Pharmacist ? '(+263) 77 123 4567' : '(+263) 4 555 666';

        setUserName(name);
        setUserEmail(email);
        setUserPhone(phone);

        // Check if user has existing data
        const existingUserData = mockUserData[email];

        if (existingUserData) {
            // User has existing data - load it
            setUploadedDocuments(existingUserData.documents);
            setIsLicenseVerified(existingUserData.isLicenseVerified);
            setIsContactVerified(existingUserData.isContactVerified);
            setIsPremium(existingUserData.isPremium);
        } else {
            // New user - start with empty documents
            setUploadedDocuments(initialUploadedDocs);
            setIsLicenseVerified(false);
            setIsContactVerified(true); // Assume contact was verified during signup
            setIsPremium(false);
        }

        if (role === UserRole.Pharmacist) {
            setMyJobs([]);
            setAppliedJobIds(new Set());
            setSavedJobIds(new Set());
            setJobToReviewId(null);
            setConversations([]);
        } else {
            setPharmacyAddress('123 Main St, Harare');
            setConversations([]);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null); setUserName(''); setUserEmail(''); setUserPhone(''); setIsPremium(false);
        setPharmacyAddress(''); setUploadedDocuments(initialUploadedDocs); setIsLicenseVerified(false);
        setIsContactVerified(false); setMyJobs([]); setJobToReviewId(null);
        setAppliedJobIds(new Set()); setSavedJobIds(new Set()); setConversations([]);
    };

    const handleDocumentsUploaded = (docs: UploadedDocuments) => {
        setUploadedDocuments(docs);

        // Update mock user data storage (in a real app, this would be an API call)
        if (userEmail && mockUserData[userEmail]) {
            mockUserData[userEmail].documents = docs;

            // License verification is NOT automatic for new users
            // Only existing users who have already been verified should have isLicenseVerified: true
            // New users must wait for manual approval after document submission
        }
    };

    const handleApplyToJob = useCallback((jobId: string) => {
        if (!isLicenseVerified || !userName || userRole !== UserRole.Pharmacist) return;
        const completedJobs = myJobs.filter(job => job.status === 'Completed');
        const ratedJobs = completedJobs.filter(job => job.rating !== undefined && job.rating > 0);
        const overallRating = ratedJobs.length > 0 ? parseFloat((ratedJobs.reduce((sum, job) => sum + (job.rating || 0), 0) / ratedJobs.length).toFixed(1)) : 0;

        const applicant: Applicant = {
            id: `user-${Date.now()}`, name: userName, rating: overallRating, isPremium,
            shiftsCompleted: completedJobs.length, documents: uploadedDocuments
        };

        setAllJobs(prevJobs => prevJobs.map(job =>
            job.id === jobId ? { ...job, applicants: [...(job.applicants || []), applicant] } : job
        ));
        setAppliedJobIds(prevIds => new Set(prevIds).add(jobId));
        setSavedJobIds(prevIds => { const newSet = new Set(prevIds); newSet.delete(jobId); return newSet; });
    }, [isLicenseVerified, userName, userRole, myJobs, isPremium, uploadedDocuments]);

    const handleJobPosted = (jobData: Omit<Job, 'id' | 'pharmacy' | 'location' | 'status' | 'applicants'>) => {
        if (userRole !== UserRole.Pharmacy || !userName || !pharmacyAddress) return;
        const newJob: Job = {
            id: `job-${Date.now()}`, pharmacy: userName, location: pharmacyAddress,
            status: 'Active', applicants: [], savedApplicants: [], ...jobData
        };
        setAllJobs(prev => [newJob, ...prev]);
    };

    const handleConfirmApplicant = (jobId: string, applicant: Applicant) => {
        setAllJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Confirmed', confirmedApplicant: applicant } : j));
        const newConversation: Conversation = {
            id: jobId, pharmacyName: userName, pharmacistName: applicant.name,
            jobRole: allJobs.find(j => j.id === jobId)!.role,
            messages: [{ id: `msg-init-${Date.now()}`, text: `Hi ${applicant.name}, your application has been confirmed. Looking forward to having you!`, sender: UserRole.Pharmacy, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
        };
        setConversations(prev => [...prev, newConversation]);
    };

    const handleDeclineApplicant = (jobId: string, applicantId: string) => {
        setAllJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicants: (j.applicants || []).filter(a => a.id !== applicantId)} : j));
    };

    // Handler for saving applicants
    const handleSaveApplicant = (jobId: string, applicant: Applicant) => {
        setAllJobs(prev => prev.map(job => {
            if (job.id === jobId) {
                const savedApplicants = job.savedApplicants || [];
                // Check if applicant is already saved
                if (!savedApplicants.find(saved => saved.id === applicant.id)) {
                    return {
                        ...job,
                        savedApplicants: [...savedApplicants, applicant],
                        // Remove from active applicants
                        applicants: (job.applicants || []).filter(a => a.id !== applicant.id)
                    };
                }
            }
            return job;
        }));
    };

    // Handler for marking job as completed
    const handleMarkJobAsCompleted = (jobId: string) => {
        setAllJobs(prev => prev.map(job =>
            job.id === jobId ? { ...job, status: 'Completed' } : job
        ));
    };

    // Enhanced handler for rating pharmacist - now supports feedback
    const handleRatePharmacist = (jobId: string, rating: number, feedback?: string) => {
        setAllJobs(prev => prev.map(job =>
            job.id === jobId ? {
                ...job,
                pharmacistRating: rating,
                pharmacistFeedback: feedback
            } : job
        ));
    };

    const handleSendMessage = (conversationId: string, text: string) => {
        if (!userRole) return;
        const newMessage: Message = { id: `msg-${Date.now()}`, text, sender: userRole, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })};
        setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, newMessage] } : c));
    };

    const handleSaveJob = (jobId: string) => setSavedJobIds(prev => new Set(prev).add(jobId));
    const handleUnsaveJob = (jobId: string) => setSavedJobIds(prev => { const newSet = new Set(prev); newSet.delete(jobId); return newSet; });
    const handleMarkAsCompleted = (jobId: string) => {
        setMyJobs(prev => prev.map(j => j.id === jobId ? {...j, status: 'Completed'} : j));
        setJobToReviewId(jobId);
    };
    const handleRateJob = (jobId: string, rating: number) => {
        setMyJobs(prev => prev.map(j => j.id === jobId ? {...j, rating} : j));
        if(jobToReviewId === jobId) setJobToReviewId(null);
    }

    const hasConversations = conversations.length > 0;
    const docsForUser = userRole === UserRole.Pharmacist ? PHARMACIST_DOCS : PHARMACY_DOCS;
    const docsCount = docsForUser.filter(doc => uploadedDocuments[doc.key]).length;
    const isDocumentsComplete = docsCount === docsForUser.length;

    const MainAppTabs = () => {
        // Ensure userRole is not null before rendering
        if (!userRole) {
            return null;
        }

        return (
            <TabNav.Navigator tabBar={props => <BottomNav {...props} hasConversations={hasConversations} userRole={userRole} />}>
                <TabNav.Screen name="Home" options={{header: () => <Header />}}>
                    {(props) => {
                        const handleCompleteProfile = () => {
                            props.navigation.navigate(AuthScreen.DocumentUpload, {
                                title: "Manage Documents",
                                subText: "Update your documents.",
                                documentItems: userRole === UserRole.Pharmacist ? PHARMACIST_DOCS : PHARMACY_DOCS,
                                initialFiles: uploadedDocuments,
                                onComplete: (docs: UploadedDocuments) => {
                                    handleDocumentsUploaded(docs);
                                    // After document upload, pharmacy users should be directed to post a job
                                    if (userRole === UserRole.Pharmacy) {
                                        props.navigation.navigate(MainScreen.PostJob);
                                    } else {
                                        props.navigation.goBack();
                                    }
                                },
                                mode: 'editing',
                                onNavigateBack: () => props.navigation.goBack()
                            });
                        };

                        if(userRole === UserRole.Pharmacist) {
                            return <HomeScreen {...props} userName={userName} documentsUploadedCount={docsCount} isLicenseVerified={isLicenseVerified} jobToReviewId={jobToReviewId} appliedJobsCount={appliedJobIds.size} homeScreenJobs={allJobs.filter(j => j.status === 'Active')} appliedJobIds={appliedJobIds} onCompleteProfileClick={handleCompleteProfile} onVerifyLicense={() => setIsLicenseVerified(true)} onRateJob={handleRateJob} onViewJobDetails={(job) => props.navigation.navigate(MainScreen.JobDetails, { jobId: job.id })} onApply={handleApplyToJob} />
                        }
                        return <PharmacyHomeScreen
                            {...props}
                            userName={userName}
                            postedJobs={allJobs.filter(job => job.pharmacy === userName)}
                            onPostNewJob={() => props.navigation.navigate(MainScreen.PostJob)}
                            onViewApplicants={(jobId) => props.navigation.navigate(MainScreen.ViewApplicants, {jobId})}
                            onCompleteProfileClick={handleCompleteProfile}
                            isDocumentsComplete={isDocumentsComplete}
                            onMarkJobAsCompleted={handleMarkJobAsCompleted}
                            onRatePharmacist={handleRatePharmacist}
                        />
                    }}
                </TabNav.Screen>
                {userRole === UserRole.Pharmacist && (
                    <TabNav.Screen name="Explore" options={{header: () => <Header />}}>
                        {props => <ExploreScreen {...props} isLicenseVerified={isLicenseVerified} jobs={allJobs.filter(j => j.status === 'Active')} appliedJobIds={appliedJobIds} savedJobIds={savedJobIds} onSave={handleSaveJob} onUnsave={handleUnsaveJob} onViewJobDetails={(job) => props.navigation.navigate(MainScreen.JobDetails, { jobId: job.id })} onApply={handleApplyToJob} />}
                    </TabNav.Screen>
                )}
                <TabNav.Screen name="Messages" options={{header: () => <Header />}}>
                    {props => (
                        <MessagesScreen
                            {...props}
                            conversations={conversations}
                            currentUserRole={userRole}
                            onOpenChat={(id) => props.navigation.navigate(MainScreen.Chat, { conversationId: id })}
                        />
                    )}
                </TabNav.Screen>
                {userRole === UserRole.Pharmacist && (
                    <TabNav.Screen name="MyJobs" options={{header: () => <Header />}}>
                        {props => <MyJobsScreen {...props} isLicenseVerified={isLicenseVerified} myJobs={myJobs} appliedJobs={allJobs.filter(j => appliedJobIds.has(j.id) && j.status === 'Active')} savedJobs={allJobs.filter(j => savedJobIds.has(j.id))} appliedJobIds={appliedJobIds} onMarkAsCompleted={handleMarkAsCompleted} onApply={handleApplyToJob} onUnsave={handleUnsaveJob} onViewJobDetails={(job) => props.navigation.navigate(MainScreen.JobDetails, { jobId: job.id })} />}
                    </TabNav.Screen>
                )}
            </TabNav.Navigator>
        );
    };

    const MainAppStack = () => (
        <MainStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <MainStack.Screen name={MainScreen.MainTabs} component={MainAppTabs} />
            <MainStack.Screen name={MainScreen.Profile}>
                {({ navigation }) => {
                    // Ensure userRole is not null before rendering
                    if (!userRole) {
                        return null;
                    }

                    return (
                        <ProfileScreen
                            onLogout={handleLogout}
                            onNavigateBack={navigation.goBack}
                            userName={userName}
                            userEmail={userEmail}
                            userPhone={userPhone}
                            isContactVerified={isContactVerified}
                            myJobs={myJobs}
                            userRole={userRole}
                            pharmacyAddress={pharmacyAddress}
                            locumsHired={allJobs.filter(j => j.pharmacy === userName && j.status === 'Completed').length}
                            activeJobsCount={allJobs.filter(j => j.pharmacy === userName && j.status === 'Active').length}
                            uploadedDocuments={uploadedDocuments}
                            onEditDocuments={() => navigation.navigate(AuthScreen.DocumentUpload, {
                                title: "Manage Documents",
                                subText: "Update your documents.",
                                documentItems: userRole === UserRole.Pharmacist ? PHARMACIST_DOCS : PHARMACY_DOCS,
                                initialFiles: uploadedDocuments,
                                onComplete: (docs: UploadedDocuments) => {
                                    handleDocumentsUploaded(docs);
                                    navigation.goBack();
                                },
                                mode: 'editing',
                                onNavigateBack: () => navigation.goBack()
                            })}
                        />
                    );
                }}
            </MainStack.Screen>
            <MainStack.Screen name={MainScreen.JobDetails}>
                {({ route, navigation }) => {
                    const job = allJobs.find(j => j.id === route.params.jobId);
                    if (!job) return null;
                    return <JobDetailsScreen job={job} onNavigateBack={navigation.goBack} isLicenseVerified={isLicenseVerified} hasApplied={appliedJobIds.has(job.id)} isSaved={savedJobIds.has(job.id)} onApply={handleApplyToJob} onSave={handleSaveJob} onUnsave={handleUnsaveJob}/>
                }}
            </MainStack.Screen>
            <AuthStack.Screen name={AuthScreen.DocumentUpload}>
                {({ navigation, route }) => {
                    if (!route.params) return null;
                    return <DocumentUploadScreen
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
                }}
            </AuthStack.Screen>
            <MainStack.Screen name={MainScreen.PostJob}>
                {({ navigation }) => <PostJobScreen onJobPosted={(data) => { handleJobPosted(data); navigation.goBack(); }} onNavigateBack={navigation.goBack} />}
            </MainStack.Screen>
            <MainStack.Screen name={MainScreen.ViewApplicants}>
                {({ route, navigation }) => {
                    const job = allJobs.find(j => j.id === route.params.jobId);
                    if (!job) return null;
                    console.log('ViewApplicants rendered for job:', job.id, 'with applicants:', job.applicants?.length);
                    return <ViewApplicantsScreen
                        job={job}
                        onNavigateBack={navigation.goBack}
                        onViewProfile={(applicant) => {
                            console.log('Navigating to ApplicantProfile for:', applicant.name);
                            navigation.navigate(MainScreen.ApplicantProfile, { applicant, jobId: job.id });
                        }}
                        onSaveApplicant={handleSaveApplicant}
                    />
                }}
            </MainStack.Screen>
            <MainStack.Screen name={MainScreen.ApplicantProfile}>
                {({ route, navigation }) => {
                    console.log('ApplicantProfile route params:', route.params);
                    return <ApplicantProfileScreen
                        applicant={route.params.applicant}
                        onNavigateBack={navigation.goBack}
                        onConfirm={() => {
                            handleConfirmApplicant(route.params.jobId, route.params.applicant);
                            navigation.navigate(MainScreen.Chat, { conversationId: route.params.jobId })
                        }}
                        onDecline={() => {
                            handleDeclineApplicant(route.params.jobId, route.params.applicant.id);
                            navigation.goBack();
                        }}
                        onSave={() => {
                            handleSaveApplicant(route.params.jobId, route.params.applicant);
                            navigation.goBack();
                        }}
                    />
                }}
            </MainStack.Screen>
            <MainStack.Screen name={MainScreen.Chat}>
                {({ route, navigation }) => {
                    // Ensure userRole is not null before rendering
                    if (!userRole) {
                        return null;
                    }

                    const conversation = conversations.find(c => c.id === route.params.conversationId);
                    if (!conversation) return null;
                    return <ChatScreen conversation={conversation} onSendMessage={(text) => handleSendMessage(route.params.conversationId, text)} onNavigateBack={navigation.goBack} currentUserRole={userRole} />
                }}
            </MainStack.Screen>
        </MainStack.Navigator>
    );

    const AuthFlowStack = () => (
        <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <AuthStack.Screen name={AuthScreen.Welcome} component={WelcomeScreen} />
            <AuthStack.Screen name={AuthScreen.Login} >
                {({ navigation }) => <LoginScreen
                    onLogin={handleLogin}
                    onNavigateToSignUp={() => navigation.navigate(AuthScreen.Signup)}
                    onNavigateBack={() => navigation.goBack()}
                />}
            </AuthStack.Screen>
            <AuthStack.Screen name={AuthScreen.RoleSelection} component={RoleSelectionScreen} />
            <AuthStack.Screen name={AuthScreen.Signup}>
                {({ navigation, route }) => {
                    const role = route.params?.role;
                    if (!role) {
                        // Handle the case where role is undefined
                        navigation.navigate(AuthScreen.RoleSelection);
                        return null;
                    }
                    return (
                        <SignupScreen
                            onSignup={(roleParam, name, email) => {
                                setUserRole(roleParam);
                                setUserName(name);
                                setUserEmail(email);

                                // Create new user entry in mock data if it doesn't exist
                                if (!mockUserData[email]) {
                                    mockUserData[email] = {
                                        documents: initialUploadedDocs,
                                        isLicenseVerified: false,
                                        isContactVerified: false,
                                        isPremium: false
                                    };
                                }

                                // Skip document upload during signup - go directly to contact info or verification
                                if(roleParam === UserRole.Pharmacy) {
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
                    return <DocumentUploadScreen
                        route={{
                            ...route,
                            params: {
                                ...route.params,
                                onNavigateBack: route.params.onNavigateBack || (() => navigation.goBack())
                            }
                        }}
                        navigation={navigation}
                    />
                }}
            </AuthStack.Screen>
            <AuthStack.Screen name={AuthScreen.ContactInfo}>
                {({ navigation }) => <ContactInfoScreen
                    onComplete={(phone, email, method) => {
                        setUserPhone(phone);
                        setUserEmail(email);
                        navigation.navigate(AuthScreen.Verification, {
                            method,
                            email,
                            phone,
                            title: method === VerificationMethod.Email ? 'Verify Your Email' : 'Verify Your Phone'
                        });
                    }}
                    email={userEmail}
                    onNavigateBack={navigation.goBack}
                />}
            </AuthStack.Screen>
            <AuthStack.Screen name={AuthScreen.Verification}>
                {({ navigation, route }) => <VerificationScreen
                    onVerify={() => {
                        setIsContactVerified(true);

                        // Update mock user data
                        if (userEmail && mockUserData[userEmail]) {
                            mockUserData[userEmail].isContactVerified = true;
                        }

                        if(userRole === UserRole.Pharmacist) {
                            setIsAuthenticated(true);
                        } else {
                            navigation.navigate(AuthScreen.AddressInfo);
                        }
                    }}
                    onNavigateBack={navigation.goBack}
                    method={route.params.method}
                    email={route.params.email}
                    phone={route.params.phone}
                    title={route.params.title}
                />}
            </AuthStack.Screen>
            <AuthStack.Screen name={AuthScreen.AddressInfo}>
                {({ navigation }) => <AddressInfoScreen
                    onComplete={(address) => {
                        setPharmacyAddress(address);
                        setIsAuthenticated(true);
                    }}
                    onNavigateBack={navigation.goBack}
                />}
            </AuthStack.Screen>
        </AuthStack.Navigator>
    );

    return (
        <NavigationContainer>
            {isAuthenticated ? <MainAppStack /> : <AuthFlowStack />}
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <>
            <StatusBar style="dark" />
            <AppContent />
        </>
    );
}