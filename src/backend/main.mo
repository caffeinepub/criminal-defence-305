import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let submissions = Map.empty<Text, CaseSubmission>();
  let paymentReferences = Map.empty<Text, PaymentReference>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type CaseSubmission = {
    id : Text;
    user : Principal;
    details : Text;
    timestamp : Time.Time;
    paymentMethod : PaymentMethod;
    status : SubmissionStatus;
  };

  public type PaymentReference = {
    submissionId : Text;
    referenceType : ReferenceType;
    referenceValue : Text;
  };

  public type SubmissionStatus = {
    #pendingPayment;
    #paid;
    #processing;
    #completed;
    #failed;
  };

  public type PaymentMethod = {
    #card;
    #paypal;
    #cashapp;
    #inPersonCash;
  };

  public type ReferenceType = {
    #paypalTransactionId;
    #cashappUsername;
    #storePaymentCode;
  };

  public type NewCaseData = {
    details : Text;
    paymentMethod : PaymentMethod;
  };

  // Stripe payment configuration needs to be stored per requirements
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // User Profile Management (Required by instructions)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Stripe Integration
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update Stripe configuration");
    };
    stripeConfig := ?config;
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    switch (stripeConfig) {
      case (null) { false };
      case (?_) { true };
    };
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Helper to unwrap Stripe configuration with error handling
  func requireStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe keys must be configured before using this feature.") };
      case (?config) { config };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(requireStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(requireStripeConfig(), sessionId, transform);
  };

  // Case Intake/Submission - Requires authenticated user
  public shared ({ caller }) func createCase(newCaseData : NewCaseData) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create cases");
    };

    let submissionId = Time.now().toNat().toText();
    let newSubmission : CaseSubmission = {
      id = submissionId;
      user = caller;
      details = newCaseData.details;
      timestamp = Time.now();
      paymentMethod = newCaseData.paymentMethod;
      status = #pendingPayment;
    };
    submissions.add(submissionId, newSubmission);
    submissionId;
  };

  // Payment Management - Requires ownership verification
  public shared ({ caller }) func submitPaymentReference(submissionId : Text, referenceType : ReferenceType, referenceValue : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit payment references");
    };

    // Verify ownership of the submission
    switch (submissions.get(submissionId)) {
      case (null) { Runtime.trap("Submission not found") };
      case (?submission) {
        if (submission.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only submit payment for your own cases");
        };
        updateSubmissionStatus(submissionId, #paid);
        let paymentRef : PaymentReference = {
          submissionId;
          referenceType;
          referenceValue;
        };
        paymentReferences.add(submissionId, paymentRef);
      };
    };
  };

  // View user's own submissions
  public query ({ caller }) func getMySubmissions() : async [CaseSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view submissions");
    };
    filterSubmissionsByUser(caller);
  };

  // View specific submission - ownership check
  public query ({ caller }) func getSubmission(submissionId : Text) : async ?CaseSubmission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view submissions");
    };

    switch (submissions.get(submissionId)) {
      case (null) { null };
      case (?submission) {
        if (submission.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own submissions");
        };
        ?submission;
      };
    };
  };

  // Admin-only: View all submissions
  public query ({ caller }) func getAllSubmissions() : async [CaseSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all submissions");
    };
    submissions.toArray().map(func((_, sub)) { sub });
  };

  // Admin-only: Update submission status
  public shared ({ caller }) func updateSubmissionStatusAdmin(submissionId : Text, newStatus : SubmissionStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update submission status");
    };
    updateSubmissionStatus(submissionId, newStatus);
  };

  // Admin-only: View payment reference
  public query ({ caller }) func getPaymentReference(submissionId : Text) : async ?PaymentReference {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view payment references");
    };
    paymentReferences.get(submissionId);
  };

  // Internal helper function
  func updateSubmissionStatus(submissionId : Text, newStatus : SubmissionStatus) {
    switch (submissions.get(submissionId)) {
      case (null) { Runtime.trap("Submission not found") };
      case (?submission) {
        let updatedSubmission : CaseSubmission = {
          id = submission.id;
          user = submission.user;
          details = submission.details;
          timestamp = submission.timestamp;
          paymentMethod = submission.paymentMethod;
          status = newStatus;
        };
        submissions.add(submissionId, updatedSubmission);
      };
    };
  };

  // Helper function for filtering submissions
  func filterSubmissionsByUser(userId : Principal) : [CaseSubmission] {
    submissions.toArray().filter(func((_, sub)) { sub.user == userId }).map(func((_, sub)) { sub });
  };
};
