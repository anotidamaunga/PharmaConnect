import type { NavigationProp } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';

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
    status?: 'Completed' | 'Confirmed' | 'Pending' | 'Cancelled' | 'Active' | 'Closed';
    rating?: number;
    applicants?: Applicant[];
    savedApplicants?: Applicant[]; // New: Applicants saved for later consideration
    confirmedApplicant?: Applicant;
    pharmacistRating?: number; // New: Rating given to the pharmacist after job completion
    pharmacistFeedback?: string; // New: Feedback provided about the pharmacist's performance
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
// ========= NAVIGATION PARAMETER TYPES =================================
// ======================================================================

/**
 * Parameters for the DocumentUploadScreen
 */
export interface DocumentUploadParams {
    title: string;
    subText: string;
    documentItems: DocumentItemConfig[];
    initialFiles?: UploadedDocuments;
    onComplete: (files: UploadedDocuments) => void;
    onNavigateBack?: () => void;
    mode: 'onboarding' | 'editing';
}

/**
 * Parameters for the SignupScreen
 */
export interface SignupParams {
    role?: UserRole;
}

/**
 * Parameters for the VerificationScreen
 */
export interface VerificationParams {
    method: VerificationMethod;
    email: string;
    phone: string;
    title: string;
}

/**
 * Parameters for the ViewApplicantsScreen
 */
export interface ViewApplicantsParams {
    jobId: string;
}

/**
 * Parameters for the ChatScreen
 */
export interface ChatParams {
    conversationId: string;
}

/**
 * Parameters for the ApplicantProfileScreen
 */
export interface ApplicantProfileParams {
    applicant: Applicant;
    jobId: string;
}

/**
 * Parameters for the JobDetailsScreen
 */
export interface JobDetailsParams {
    jobId: string;
}

// ======================================================================
// ========= CONSOLIDATED NAVIGATION TYPES ==============================
// ======================================================================

/**
 * Complete navigation parameter list for the entire application.
 * This is the single source of truth for all screen parameters.
 */
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

/**
 * Main navigation prop for the entire application stack.
 * Use this with useNavigation hook for type-safe navigation.
 *
 * @example
 * ```typescript
 * const navigation = useNavigation<AppNavigationProp>();
 * navigation.navigate(AuthScreen.Login);
 * ```
 */
export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;

/**
 * Generic type for screen component props (route and navigation).
 * Use this to type your screen components for full type safety.
 *
 * @example
 * ```typescript
 * const MyScreen: React.FC<AppScreenProps<AuthScreen.Login>> = ({ route, navigation }) => {
 *   // route and navigation are fully typed
 *   return <View>...</View>;
 * };
 * ```
 */
export type AppScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;

// ======================================================================
// ========= SCREEN PROP INTERFACES =====================================
// ======================================================================

/**
 * Props for LoginScreen component
 */
export interface LoginScreenProps {
    onLogin: (role: UserRole) => void;
    onNavigateToSignUp: () => void;
    onNavigateBack: () => void;
}

/**
 * Props for SignupScreen component
 */
export interface SignupScreenProps {
    onSignup: (role: UserRole, name: string, email: string) => void;
    onNavigateBack: () => void;
    onNavigateToLogin: () => void;
    role?: UserRole;
}

/**
 * Props for VerificationScreen component
 */
export interface VerificationScreenProps {
    onVerify: () => void;
    onNavigateBack: () => void;
    method: VerificationMethod;
    email: string;
    phone: string;
    title: string;
}

/**
 * Props for DocumentUploadScreen component
 */
export interface DocumentUploadScreenProps {
    route: {
        params: DocumentUploadParams;
    };
    navigation: AppNavigationProp;
}

/**
 * Props for ContactInfoScreen component
 */
export interface ContactInfoScreenProps {
    onComplete: (phone: string, email: string, method: VerificationMethod) => void;
    onNavigateBack: () => void;
    email: string;
}

/**
 * Props for AddressInfoScreen component
 */
export interface AddressInfoScreenProps {
    onComplete: (address: string) => void;
    onNavigateBack: () => void;
}

// ======================================================================
// ========= NEW COMPONENT PROP INTERFACES ==============================
// ======================================================================

/**
 * Props for ViewApplicantsScreen component
 */
export interface ViewApplicantsScreenProps {
    job: Job;
    onNavigateBack: () => void;
    onViewProfile: (applicant: Applicant) => void;
    onSaveApplicant?: (jobId: string, applicant: Applicant) => void;
}

/**
 * Props for ApplicantProfileScreen component
 */
export interface ApplicantProfileScreenProps {
    applicant: Applicant;
    onNavigateBack: () => void;
    onConfirm: () => void;
    onDecline: () => void;
    onSave?: () => void;
}

/**
 * Props for PharmacyHomeScreen component
 */
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

// ======================================================================
// ========= COMPONENT PROP TYPES =======================================
// ======================================================================

/**
 * Props for components that need navigation but aren't screens themselves
 */
export interface NavigationProps {
    navigation: AppNavigationProp;
}

/**
 * Props for components that handle job interactions
 */
export interface JobInteractionProps {
    onApply?: (jobId: string) => void;
    onSave?: (jobId: string) => void;
    onUnsave?: (jobId: string) => void;
    onViewDetails?: (job: Job) => void;
}

/**
 * Props for components that display user information
 */
export interface UserInfoProps {
    userName: string;
    userEmail?: string;
    userPhone?: string;
    userRole: UserRole;
}

/**
 * Props for components that handle document management
 */
export interface DocumentManagementProps {
    uploadedDocuments: UploadedDocuments;
    onEditDocuments?: () => void;
    isLicenseVerified?: boolean;
}

/**
 * Props for components that handle applicant management
 */
export interface ApplicantManagementProps {
    applicants: Applicant[];
    savedApplicants?: Applicant[];
    onViewApplicant?: (applicant: Applicant) => void;
    onSaveApplicant?: (applicant: Applicant) => void;
    onConfirmApplicant?: (applicant: Applicant) => void;
    onDeclineApplicant?: (applicant: Applicant) => void;
}

/**
 * Props for components that handle job rating and feedback
 */
export interface JobRatingProps {
    onRateJob?: (jobId: string, rating: number, feedback?: string) => void;
    onMarkAsCompleted?: (jobId: string) => void;
}

// ======================================================================
// ========= UTILITY TYPES ===========================================
// ======================================================================

/**
 * Extract the parameters for a specific screen
 */
export type ScreenParams<T extends keyof AppStackParamList> = AppStackParamList[T];

/**
 * Helper type to ensure navigation calls are type-safe
 */
export type NavigateTo<T extends keyof AppStackParamList> = AppStackParamList[T] extends undefined
    ? [screen: T] | [screen: T, params?: undefined]
    : [screen: T, params: AppStackParamList[T]];

/**
 * Type guard to check if a screen requires parameters
 */
export type RequiresParams<T extends keyof AppStackParamList> = AppStackParamList[T] extends undefined
    ? false
    : true;

/**
 * User data interface for persistence (matches mockUserData structure)
 */
export interface UserData {
    documents: UploadedDocuments;
    isLicenseVerified: boolean;
    isContactVerified: boolean;
    isPremium: boolean;
}

/**
 * Job status types for better type safety
 */
export type JobStatus = 'Completed' | 'Confirmed' | 'Pending' | 'Cancelled' | 'Active' | 'Closed';

/**
 * Rating scale (1-5 stars)
 */
export type Rating = 1 | 2 | 3 | 4 | 5;

// ======================================================================
// ========= EXPORT CONVENIENCE TYPES ===================================
// ======================================================================

// Re-export commonly used navigation types for convenience
export type { NavigationProp, NativeStackScreenProps, NativeStackNavigationProp };