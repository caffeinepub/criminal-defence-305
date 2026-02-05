import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetDocumentsBySubmission, useUploadDocument, useGetSubmission } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, FileText, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob, DocumentType } from '../backend';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function SubmissionDocumentsPage() {
  const { submissionId } = useParams({ strict: false }) as { submissionId: string };
  const navigate = useNavigate();
  const { data: submission, isLoading: submissionLoading } = useGetSubmission(submissionId);
  const { data: documents = [], isLoading: documentsLoading } = useGetDocumentsBySubmission(submissionId);
  const uploadDocument = useUploadDocument();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('evidence');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('File type not allowed. Please upload PDF, JPG, PNG, or DOC files.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      let docType: DocumentType;
      switch (documentType) {
        case 'evidence':
          docType = { __kind__: 'evidence', evidence: null };
          break;
        case 'affidavit':
          docType = { __kind__: 'affidavit', affidavit: null };
          break;
        case 'courtOrder':
          docType = { __kind__: 'courtOrder', courtOrder: null };
          break;
        default:
          docType = { __kind__: 'other', other: documentType };
      }

      await uploadDocument.mutateAsync({
        submissionId,
        documentType: docType,
        fileName: selectedFile.name,
        fileSize: BigInt(selectedFile.size),
        fileContent: blob,
      });

      toast.success('Document uploaded successfully');
      setSelectedFile(null);
      setUploadProgress(0);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload document');
      setUploadProgress(0);
    }
  };

  const getDocumentTypeLabel = (type: DocumentType): string => {
    if (type.__kind__ === 'evidence') return 'Evidence';
    if (type.__kind__ === 'affidavit') return 'Affidavit';
    if (type.__kind__ === 'courtOrder') return 'Court Order';
    return type.other;
  };

  if (submissionLoading) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Submission Not Found</CardTitle>
            <CardDescription>
              The requested submission could not be found or you don't have access to it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/payment-status' })}>
              Check Status
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/payment-status' })}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Status
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Case Documents</h1>
        <p className="text-lg text-muted-foreground">
          Submission ID: <code className="font-mono">{submissionId}</code>
        </p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> These documents are for informational purposes only and must be
          reviewed by a qualified attorney before filing with any court.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Maximum file size: 10MB. Allowed types: PDF, JPG, PNG, DOC, DOCX
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger id="document-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="evidence">Evidence</SelectItem>
                    <SelectItem value="affidavit">Affidavit</SelectItem>
                    <SelectItem value="courtOrder">Court Order</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Select File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  required
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Uploading: {uploadProgress}%</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedFile || uploadDocument.isPending}
              >
                {uploadDocument.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              {documents.length} {documents.length === 1 ? 'document' : 'documents'} uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documentsLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            {!documentsLoading && documents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <FileText className="mb-4 h-12 w-12 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            )}
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {getDocumentTypeLabel(doc.documentType)} •{' '}
                          {(Number(doc.fileSize) / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const url = doc.fileContent.getDirectURL();
                        window.open(url, '_blank');
                      }}
                    >
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
