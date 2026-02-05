import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetDraftMotionsBySubmission, useGetSubmission } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, FileText, ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DraftMotionsPage() {
  const { submissionId } = useParams({ strict: false }) as { submissionId: string };
  const navigate = useNavigate();
  const { data: submission, isLoading: submissionLoading } = useGetSubmission(submissionId);
  const { data: draftMotions = [], isLoading: motionsLoading } = useGetDraftMotionsBySubmission(submissionId);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <h1 className="mb-2 text-4xl font-bold">Draft Motions</h1>
        <p className="text-lg text-muted-foreground">
          Submission ID: <code className="font-mono">{submissionId}</code>
        </p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Legal Disclaimer:</strong> These draft motions are for informational purposes only
          and must be reviewed by a qualified attorney before filing with any court. Do not file these
          documents without proper legal review.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Draft Motion</CardTitle>
          <CardDescription>
            Generate a draft motion based on your case details and legal references
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() =>
              navigate({ to: `/submissions/${submissionId}/draft-motions/new` })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Start Draft Motion Wizard
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Draft Motions</CardTitle>
          <CardDescription>
            {draftMotions.length} {draftMotions.length === 1 ? 'draft' : 'drafts'} saved
          </CardDescription>
        </CardHeader>
        <CardContent>
          {motionsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {!motionsLoading && draftMotions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <FileText className="mb-4 h-12 w-12 opacity-50" />
              <p>No draft motions yet. Create your first draft motion above.</p>
            </div>
          )}
          <div className="space-y-4">
            {draftMotions.map((motion) => (
              <Card key={motion.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{motion.motionType}</CardTitle>
                      <CardDescription>
                        Created {formatDate(motion.createdTime)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted/30 p-4">
                    <p className="line-clamp-4 whitespace-pre-wrap text-sm">
                      {motion.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
