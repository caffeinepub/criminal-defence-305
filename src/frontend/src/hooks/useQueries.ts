import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  CaseSubmission, 
  NewCaseData, 
  PaymentReference, 
  ReferenceType, 
  UserProfile,
  ShoppingItem,
  StripeConfiguration,
  ReferenceLibraryEntry,
  CaseDocument,
  DocumentType,
  DraftMotion,
  ExternalBlob
} from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateCase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCaseData: NewCaseData): Promise<string> => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCase(newCaseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
    },
  });
}

export function useGetMySubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<CaseSubmission[]>({
    queryKey: ['mySubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSubmission(submissionId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<CaseSubmission | null>({
    queryKey: ['submission', submissionId],
    queryFn: async () => {
      if (!actor || !submissionId) return null;
      return actor.getSubmission(submissionId);
    },
    enabled: !!actor && !isFetching && !!submissionId,
  });
}

export function useSubmitPaymentReference() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submissionId,
      referenceType,
      referenceValue,
    }: {
      submissionId: string;
      referenceType: ReferenceType;
      referenceValue: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitPaymentReference(submissionId, referenceType, referenceValue);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submission', variables.submissionId] });
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
    },
  });
}

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error('Actor not available');
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<CaseSubmission[]>({
    queryKey: ['allSubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

// Reference Library Hooks
export function useSearchReferenceEntries(searchText: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ReferenceLibraryEntry[]>({
    queryKey: ['referenceEntries', searchText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchReferenceEntries(searchText);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReferenceEntry(entryId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ReferenceLibraryEntry | null>({
    queryKey: ['referenceEntry', entryId],
    queryFn: async () => {
      if (!actor || !entryId) return null;
      return actor.getReferenceEntry(entryId);
    },
    enabled: !!actor && !isFetching && !!entryId,
  });
}

export function useAddReferenceEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, author }: { title: string; content: string; author: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReferenceEntry(title, content, author);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referenceEntries'] });
    },
  });
}

// Document Management Hooks
export function useGetDocumentsBySubmission(submissionId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<CaseDocument[]>({
    queryKey: ['documents', submissionId],
    queryFn: async () => {
      if (!actor || !submissionId) return [];
      return actor.getDocumentsBySubmission(submissionId);
    },
    enabled: !!actor && !isFetching && !!submissionId,
  });
}

export function useUploadDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submissionId,
      documentType,
      fileName,
      fileSize,
      fileContent,
    }: {
      submissionId: string;
      documentType: DocumentType;
      fileName: string;
      fileSize: bigint;
      fileContent: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadDocument(submissionId, documentType, fileName, fileSize, fileContent);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.submissionId] });
    },
  });
}

// Draft Motion Hooks
export function useGetDraftMotionsBySubmission(submissionId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<DraftMotion[]>({
    queryKey: ['draftMotions', submissionId],
    queryFn: async () => {
      if (!actor || !submissionId) return [];
      return actor.getDraftMotionsBySubmission(submissionId);
    },
    enabled: !!actor && !isFetching && !!submissionId,
  });
}

export function useCreateDraftMotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submissionId,
      motionType,
      content,
    }: {
      submissionId: string;
      motionType: string;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDraftMotion(submissionId, motionType, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['draftMotions', variables.submissionId] });
    },
  });
}
