import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";

module {
  // Types from old system.
  type OldUserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type OldCaseSubmission = {
    id : Text;
    user : Principal;
    details : Text;
    timestamp : Time.Time;
    paymentMethod : OldPaymentMethod;
    status : OldSubmissionStatus;
  };

  type OldPaymentReference = {
    submissionId : Text;
    referenceType : OldReferenceType;
    referenceValue : Text;
  };

  type OldSubmissionStatus = {
    #pendingPayment;
    #paid;
    #processing;
    #completed;
    #failed;
  };

  type OldPaymentMethod = {
    #card;
    #paypal;
    #cashapp;
    #inPersonCash;
  };

  type OldReferenceType = {
    #paypalTransactionId;
    #cashappUsername;
    #storePaymentCode;
  };

  type OldNewCaseData = {
    details : Text;
    paymentMethod : OldPaymentMethod;
  };

  // Old actor type without blob and draft fields.
  type OldActor = {
    submissions : Map.Map<Text, OldCaseSubmission>;
    paymentReferences : Map.Map<Text, OldPaymentReference>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  /// New reference library entry type.
  type NewReferenceLibraryEntry = {
    id : Text;
    title : Text;
    content : Text;
    author : Text;
    dateAdded : Time.Time;
    createdBy : Principal;
  };

  // New case document type with blob reference.
  type NewCaseDocument = {
    id : Text;
    submissionId : Text;
    user : Principal;
    documentType : NewDocumentType;
    fileName : Text;
    fileSize : Nat;
    fileContent : Storage.ExternalBlob;
    uploadTime : Time.Time;
  };

  type NewDocumentType = {
    #evidence;
    #affidavit;
    #courtOrder;
    #other : Text;
  };

  // New draft motion type.
  type NewDraftMotion = {
    id : Text;
    submissionId : Text;
    user : Principal;
    motionType : Text;
    content : Text;
    createdTime : Time.Time;
  };

  // New actor type with reference library, case documents, and draft motions.
  type NewActor = {
    submissions : Map.Map<Text, OldCaseSubmission>;
    paymentReferences : Map.Map<Text, OldPaymentReference>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    referenceLibrary : Map.Map<Text, NewReferenceLibraryEntry>;
    caseDocuments : Map.Map<Text, NewCaseDocument>;
    draftMotions : Map.Map<Text, NewDraftMotion>;
  };

  // Migration function from old state to new state.
  public func run(old : OldActor) : NewActor {
    { old with referenceLibrary = Map.empty(); caseDocuments = Map.empty(); draftMotions = Map.empty() };
  };
};
