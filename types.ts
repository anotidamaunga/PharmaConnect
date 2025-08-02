import type { NavigationProp } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from "react";

// ======================================================================
// ========= ENUMS ======================================================
// ======================================================================

export enum Tab {
    Home,
    Explore,
    Messages,
    MyJobs,
}

export enum AuthScreen {
    Welcome = 'Welcome',
    Login = 'Login',
    Signup = 'Signup',
    RoleSelection = 'RoleSelection',
    DocumentUpload = 'DocumentUpload',
    ContactInfo = 'ContactInfo',
    Verification = 'Verification',
    AddressInfo = 'AddressInfo',
}

export enum MainScreen {
    MainTabs = 'MainTabs',
    Profile = 'Profile',
    PostJob = 'PostJob',
    ViewApplicants = 'ViewApplicants',
    Chat = 'Chat',
    ApplicantProfile = 'ApplicantProfile',
    JobDetails = 'JobDetails',
}

export enum UserRole {
    Pharmacist = 'pharmacist',
    Pharmacy = 'pharmacy',
}

export enum FacilityType {
    Retail = 'Retail',
    Hospital = 'Hospital',
    Clinic = 'Clinic',
}

export enum ShiftType {
    Morning = 'Morning',
    Afternoon = 'Afternoon',
    Evening = 'Evening',
    Night = 'Night',
}

export enum VerificationMethod {
    Email,
    Phone,
}

// ======================================================================
// ========= DATA INTERFACES AND CORE TYPES =============================
// ======================================================================

export type DocumentKey = 'psz' | 'hpa' | 'cv' | 'pharmacyHpa' | 'pharmacyMcaz';

export interface DocumentItemConfig {
    key: DocumentKey;
    title: string;
    description: string;
}

export interface UploadedFile {
    uri: string;
    name: string;
    type?: string;
    size?: number;
}

export type UploadedDocuments = Record<DocumentKey, UploadedFile | null>;

export interface Applicant {
    id: string;
    name: string;
    rating: number;
    isPremium: boolean;
    shiftsCompleted: number;
    documents: UploadedDocuments;
}

export interface Job {
    id: string;
    pharmacy: string;
    location: string;
    rate: string;
    role: string;
    date: string; // YYYY-MM-DD
    time: string;
    facilityType: FacilityType;
    shiftType: ShiftType;
    description: string;
    status: JobStatus; // Changed from: status?: 'completed' | 'confirmed' | 'pending' | 'cancelled' | 'active' | 'closed';
    rating?: number; // Legacy field - pharmacist's rating of the job/pharmacy
    applicants?: Applicant[];
    savedApplicants?: Applicant[];
    confirmedApplicant?: Applicant;

    // Two-way rating system
    pharmacistRating?: number;        // Pharmacy's rating of the pharmacist (1-5)
    pharmacistFeedback?: string;      // Pharmacy's feedback about the pharmacist
    pharmacyRating?: number;          // Pharmacist's rating of the pharmacy (1-5)
    pharmacyFeedback?: string;        // Pharmacist's feedback about the pharmacy

    // Additional properties needed by API
    hasApplied?: boolean;
    isSaved?: boolean;
    location_address?: string;
    location_city?: string;
}

export interface Message {
    id: string;
    text: string;
    sender: UserRole;
    timestamp: string;
}

export interface Conversation {
    id: string; // Should correspond to a job ID
    pharmacyName: string;
    pharmacistName: string;
    jobRole: string;
    messages: Message[];
}

// ======================================================================
// ========= API INTERFACES ==============================================
// ======================================================================

export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
        isEmailVerified: boolean;
        isPhoneVerified: boolean;
        profile: any;
    };
}

export interface SignupData {
    email: string;
    password: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    pharmacyName?: string;
    phone: string;
}

export interface JobSearchParams {
    location?: string;
    minRate?: number;
    facilityTypes?: FacilityType[];
    shiftTypes?: ShiftType[];
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}

export interface JobSearchResponse {
    jobs: Job[];
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    pharmacyName?: string;
    phone: string;
    address?: string;
    isPremium?: boolean;
    licenseVerificationStatus?: 'pending' | 'verified' | 'rejected';
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
}

export interface DocumentUploadResponse {
    id: string;
    documentType: DocumentKey;
    fileName: string;
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    uploadedAt: string;
}

export interface DashboardStats {
    activeJobs: number;
    totalApplications: number;
    completedJobs: number;
    averageRating?: number;
    totalEarnings?: number;
}

// ======================================================================
// ========= NAVIGATION PARAMETER TYPES =================================
// ======================================================================

export interface DocumentUploadParams {
    title: string;
    subText: string;
    documentItems: DocumentItemConfig[];
    initialFiles?: UploadedDocuments;
    onComplete: (files: UploadedDocuments) => void;
    onNavigateBack?: () => void;
    mode: 'onboarding' | 'editing';
}

export interface SignupParams {
    role?: UserRole;
}

export interface VerificationParams {
    method: VerificationMethod;
    email: string;
    phone: string;
    title: string;
}

export interface ViewApplicantsParams {
    jobId: string;
}

export interface ChatParams {
    conversationId: string;
}

export interface ApplicantProfileParams {
    applicant: Applicant;
    jobId: string;
}

export interface JobDetailsParams {
    jobId: string;
}

// ======================================================================
// ========= CONSOLIDATED NAVIGATION TYPES ==============================
// ======================================================================

export type AppStackParamList = {
    // Authentication Flow Screens
    [AuthScreen.Welcome]: undefined;
    [AuthScreen.Login]: undefined;
    [AuthScreen.Signup]: SignupParams | undefined;
    [AuthScreen.RoleSelection]: undefined;
    [AuthScreen.ContactInfo]: undefined;
    [AuthScreen.Verification]: VerificationParams;
    [AuthScreen.AddressInfo]: undefined;
    [AuthScreen.DocumentUpload]: DocumentUploadParams;

    // Main Application Flow Screens (Post-Login)
    [MainScreen.MainTabs]: undefined;
    [MainScreen.Profile]: undefined;
    [MainScreen.PostJob]: undefined;
    [MainScreen.ViewApplicants]: ViewApplicantsParams;
    [MainScreen.Chat]: ChatParams;
    [MainScreen.ApplicantProfile]: ApplicantProfileParams;
    [MainScreen.JobDetails]: JobDetailsParams;
};

export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;

export type AppScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;

// ======================================================================
// ========= SCREEN PROP INTERFACES =====================================
// ======================================================================

export interface LoginScreenProps {
    onLogin: (role: UserRole) => Promise<void>; // Make async
    onNavigateToSignUp: () => void;
    onNavigateBack: () => void;
}


export interface SignupScreenProps {
    onSignup: (role: UserRole, name: string, email: string, password: string) => Promise<void>;
    onNavigateBack: () => void;
    onNavigateToLogin: () => void;
    role?: UserRole;
}

export interface VerificationScreenProps {
    onVerify: () => Promise<void>; // Make async
    onNavigateBack: () => void;
    method: VerificationMethod;
    email: string;
    phone: string;
    title: string;
}

export interface DocumentUploadScreenProps {
    route: {
        params: DocumentUploadParams;
    };
    navigation: AppNavigationProp;
}

export interface ContactInfoScreenProps {
    onComplete: (phone: string, email: string, method: VerificationMethod) => Promise<void>; // Make async
    onNavigateBack: () => void;
    email: string;
}

export interface AddressInfoScreenProps {
    onComplete: (address: string) => Promise<void>; // Make async
    onNavigateBack: () => void;
}


export interface ViewApplicantsScreenProps {
    job: Job;
    onNavigateBack: () => void;
    onViewProfile: (applicant: Applicant) => void;
    onSaveApplicant?: (jobId: string, applicant: Applicant) => Promise<void>;
}

export interface ApplicantProfileScreenProps {
    applicant: Applicant;
    onNavigateBack: () => void;
    onConfirm: () => Promise<void>;
    onDecline: () => Promise<void>;
    onSave?: () => Promise<void>;
}

export interface PharmacyHomeScreenProps {
    userName: string;
    postedJobs: Job[];
    onPostNewJob: () => void;
    onViewApplicants: (jobId: string) => void;
    onCompleteProfileClick?: () => void;
    isDocumentsComplete: boolean;
    onMarkJobAsCompleted?: (jobId: string) => void;
    onRatePharmacist?: (jobId: string, rating: number, feedback?: string) => void;
}

export interface HomeScreenProps {
    userName: string;
    documentsUploadedCount: number;
    isLicenseVerified: boolean;
    jobToReviewId: string | null;
    appliedJobsCount: number;
    homeScreenJobs: Job[];
    appliedJobIds: Set<string>;
    onCompleteProfileClick: () => void;
    onVerifyLicense: () => void;
    onRateJob: (jobId: string, rating: number) => void;
    onRatePharmacy: (jobId: string, rating: number, feedback?: string) => void;
    onViewJobDetails: (job: Job) => void;
    onApply: (jobId: string) => void;
}

export interface ExploreScreenProps {
    isLicenseVerified: boolean;
    jobs: Job[];
    appliedJobIds: Set<string>;
    savedJobIds: Set<string>;
    onSave: (jobId: string) => void;
    onUnsave: (jobId: string) => void;
    onViewJobDetails: (job: Job) => void;
    onApply: (jobId: string) => void;
}

export interface MyJobsScreenProps {
    isLicenseVerified: boolean;
    myJobs: Job[];
    appliedJobs: Job[];
    savedJobs: Job[];
    appliedJobIds: Set<string>;
    onMarkAsCompleted: (jobId: string) => void;
    onRatePharmacy: (jobId: string, rating: number, feedback?: string) => void;
    onApply: (jobId: string) => void;
    onUnsave: (jobId: string) => void;
    onViewJobDetails: (job: Job) => void;
}

export interface MessagesScreenProps {
    conversations: Conversation[];
    onOpenChat: (conversationId: string) => void;
    currentUserRole: UserRole;
}

export interface ChatScreenProps {
    conversation: Conversation;
    onSendMessage: (text: string) => void;
    onNavigateBack: () => void;
    currentUserRole: UserRole;
}

export interface JobDetailsScreenProps {
    job: Job;
    onNavigateBack: () => void;
    isLicenseVerified: boolean;
    hasApplied: boolean;
    isSaved: boolean;
    onApply: (jobId: string) => void;
    onSave: (jobId: string) => void;
    onUnsave: (jobId: string) => void;
}

export interface PostJobScreenProps {
    onJobPosted: (jobData: Omit<Job, 'id' | 'pharmacy' | 'location' | 'status' | 'applicants'>) => void;
    onNavigateBack: () => void;
}

export interface ProfileScreenProps {
    userName: string;
    userEmail: string;
    userPhone: string;
    isContactVerified: boolean;
    onLogout: () => void;
    onNavigateBack: () => void;
    myJobs: Job[];
    userRole: UserRole;
    pharmacyAddress?: string;
    locumsHired?: number;
    activeJobsCount?: number;
    uploadedDocuments: UploadedDocuments;
    onEditDocuments: () => void;
}

// ======================================================================
// ========= COMPONENT PROP TYPES =======================================
// ======================================================================

export interface NavigationProps {
    navigation: AppNavigationProp;
}

export interface JobInteractionProps {
    onApply?: (jobId: string) => void;
    onSave?: (jobId: string) => void;
    onUnsave?: (jobId: string) => void;
    onViewDetails?: (job: Job) => void;
}

export interface UserInfoProps {
    userName: string;
    userEmail?: string;
    userPhone?: string;
    userRole: UserRole;
}

export interface DocumentManagementProps {
    uploadedDocuments: UploadedDocuments;
    onEditDocuments?: () => void;
    isLicenseVerified?: boolean;
}

export interface ApplicantManagementProps {
    applicants: Applicant[];
    savedApplicants?: Applicant[];
    onViewApplicant?: (applicant: Applicant) => void;
    onSaveApplicant?: (applicant: Applicant) => void;
    onConfirmApplicant?: (applicant: Applicant) => void;
    onDeclineApplicant?: (applicant: Applicant) => void;
}

export interface JobRatingProps {
    onRateJob?: (jobId: string, rating: number, feedback?: string) => void;
    onRatePharmacy?: (jobId: string, rating: number, feedback?: string) => void;
    onRatePharmacist?: (jobId: string, rating: number, feedback?: string) => void;
    onMarkAsCompleted?: (jobId: string) => void;
}

// ======================================================================
// ========= STATE MANAGEMENT TYPES =====================================
// ======================================================================

export interface AppState {
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

export type AppAction =
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

// ======================================================================
// ========= UTILITY TYPES ===========================================
// ======================================================================

export type ScreenParams<T extends keyof AppStackParamList> = AppStackParamList[T];

export type NavigateTo<T extends keyof AppStackParamList> = AppStackParamList[T] extends undefined
    ? [screen: T] | [screen: T, params?: undefined]
    : [screen: T, params: AppStackParamList[T]];

export type RequiresParams<T extends keyof AppStackParamList> = AppStackParamList[T] extends undefined
    ? false
    : true;

export interface UserData {
    documents: UploadedDocuments;
    isLicenseVerified: boolean;
    isContactVerified: boolean;
    isPremium: boolean;
}

export type JobStatus = 'completed' | 'confirmed' | 'pending' | 'cancelled' | 'active' | 'closed';



export interface RatingData {
    jobId: string;
    rating: number;
    feedback?: string;
    raterRole: UserRole;
    ratedEntity: 'pharmacist' | 'pharmacy';
}

export interface PharmacistRatings {
    averageRating: number;
    totalRatings: number;
    ratings: RatingData[];
}

export interface PharmacyRatings {
    averageRating: number;
    totalRatings: number;
    ratings: RatingData[];
}

export interface RatingModalProps {
    visible: boolean;
    job: Job;
    ratingType: 'pharmacy' | 'pharmacist';
    onClose: () => void;
    onSubmitRating: (jobId: string, rating: number, feedback?: string) => void;
}

export type Rating = 1 | 2 | 3 | 4 | 5;

// ======================================================================
// ========= ERROR HANDLING TYPES ===================================
// ======================================================================

export interface ErrorInfo {
    componentStack: string;
}

export interface LoadingScreenProps {
    message?: string;
    transparent?: boolean;
}

export interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

// ======================================================================
// ========= FORM VALIDATION TYPES ==================================
// ======================================================================

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export interface FormField {
    value: string;
    error?: string;
    isValid: boolean;
    isTouched: boolean;
}

export interface FormState {
    [key: string]: FormField;
}

export interface OnboardingProgress {
    currentStep: number;
    totalSteps: number;
    completedSteps: string[];
    isComplete: boolean;
}

// ======================================================================
// ========= EXPORT CONVENIENCE TYPES ===================================
// ======================================================================

// Re-export commonly used navigation types for convenience
export type { NavigationProp, NativeStackScreenProps, NativeStackNavigationProp };
