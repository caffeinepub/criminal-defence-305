import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type DocumentType = {
    __kind__: "affidavit";
    affidavit: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "evidence";
    evidence: null;
} | {
    __kind__: "courtOrder";
    courtOrder: null;
};
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface ReferenceLibraryEntry {
    id: string;
    title: string;
    content: string;
    createdBy: Principal;
    author: string;
    dateAdded: Time;
}
export interface PaymentReference {
    referenceType: ReferenceType;
    submissionId: string;
    referenceValue: string;
}
export interface CaseDocument {
    id: string;
    documentType: DocumentType;
    user: Principal;
    fileName: string;
    fileSize: bigint;
    fileContent: ExternalBlob;
    submissionId: string;
    uploadTime: Time;
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
export interface DraftMotion {
    id: string;
    content: string;
    motionType: string;
    user: Principal;
    createdTime: Time;
    submissionId: string;
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
    addReferenceEntry(title: string, content: string, author: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCase(newCaseData: NewCaseData): Promise<string>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createDraftMotion(submissionId: string, motionType: string, content: string): Promise<string>;
    getAllSubmissions(): Promise<Array<CaseSubmission>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDocument(documentId: string): Promise<CaseDocument | null>;
    getDocumentsBySubmission(submissionId: string): Promise<Array<CaseDocument>>;
    getDraftMotionsBySubmission(submissionId: string): Promise<Array<DraftMotion>>;
    getMySubmissions(): Promise<Array<CaseSubmission>>;
    getPaymentReference(submissionId: string): Promise<PaymentReference | null>;
    getReferenceEntry(entryId: string): Promise<ReferenceLibraryEntry | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSubmission(submissionId: string): Promise<CaseSubmission | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchReferenceEntries(searchText: string): Promise<Array<ReferenceLibraryEntry>>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitPaymentReference(submissionId: string, referenceType: ReferenceType, referenceValue: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateSubmissionStatusAdmin(submissionId: string, newStatus: SubmissionStatus): Promise<void>;
    uploadDocument(submissionId: string, documentType: DocumentType, fileName: string, fileSize: bigint, fileContent: ExternalBlob): Promise<string>;
}
