import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface PaymentReference {
    referenceType: ReferenceType;
    submissionId: string;
    referenceValue: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface CaseSubmission {
    id: string;
    status: SubmissionStatus;
    paymentMethod: PaymentMethod;
    user: Principal;
    timestamp: Time;
    details: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface NewCaseData {
    paymentMethod: PaymentMethod;
    details: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum PaymentMethod {
    card = "card",
    cashapp = "cashapp",
    inPersonCash = "inPersonCash",
    paypal = "paypal"
}
export enum ReferenceType {
    paypalTransactionId = "paypalTransactionId",
    cashappUsername = "cashappUsername",
    storePaymentCode = "storePaymentCode"
}
export enum SubmissionStatus {
    paid = "paid",
    completed = "completed",
    pendingPayment = "pendingPayment",
    processing = "processing",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCase(newCaseData: NewCaseData): Promise<string>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    getAllSubmissions(): Promise<Array<CaseSubmission>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMySubmissions(): Promise<Array<CaseSubmission>>;
    getPaymentReference(submissionId: string): Promise<PaymentReference | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSubmission(submissionId: string): Promise<CaseSubmission | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitPaymentReference(submissionId: string, referenceType: ReferenceType, referenceValue: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateSubmissionStatusAdmin(submissionId: string, newStatus: SubmissionStatus): Promise<void>;
}
