import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useCreateDraftMotion, useSearchReferenceEntries, useGetSubmission } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, ArrowRight, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DraftMotionWizardPage() {
  const { submissionId } = useParams({ strict: false }) as { submissionId: string };
  const navigate = useNavigate();
  const { data: submission, isLoading: submissionLoading } = useGetSubmission(submissionId);
  const createDraftMotion = useCreateDraftMotion();

  const [step, setStep] = useState(1);
  const [motionType, setMotionType] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [courtName, setCourtName] = useState('');
  const [defendantName, setDefendantName] = useState('');
  const [grounds, setGrounds] = useState('');
  const [facts, setFacts] = useState('');
  const [legalBasis, setLegalBasis] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const { data: referenceEntries = [] } = useSearchReferenceEntries(searchTerm);

  const generateDraftContent = () => {
    return `MOTION TO ${motionType.toUpperCase()}

IN THE ${courtName.toUpperCase()}

Case No.: ${caseNumber}

STATE OF [STATE]
vs.
${defendantName}

COMES NOW the Defendant, ${defendantName}, and respectfully moves this Court to ${motionType}, and in support thereof states:

GROUNDS FOR MOTION

${grounds}

STATEMENT OF FACTS

${facts}

LEGAL BASIS

${legalBasis}

CONCLUSION

For the foregoing reasons, the Defendant respectfully requests that this Court grant this Motion to ${motionType}.

Respectfully submitted,

_______________________
[Attorney Name]
[Attorney for Defendant]

CERTIFICATE OF SERVICE

I hereby certify that a true and correct copy of the foregoing Motion has been furnished to the State Attorney's Office on this ___ day of ________, 20__.

_______________________

---
LEGAL DISCLAIMER: This draft motion is for informational purposes only and must be reviewed, edited, and approved by a qualified attorney before filing with any court. This document does not constitute legal advice.`;
  };

  const handleSave = async () => {
    if (!motionType || !caseNumber || !courtName || !defendantName) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const content = generateDraftContent();
      await createDraftMotion.mutateAsync({
        submissionId,
        motionType,
        content,
      });
      toast.success('Draft motion saved successfully');
      navigate({ to: `/submissions/${submissionId}/draft-motions` });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save draft motion');
    }
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
        onClick={() => navigate({ to: `/submissions/${submissionId}/draft-motions` })}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Draft Motions
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Draft Motion Wizard</h1>
        <p className="text-lg text-muted-foreground">
          Create a draft motion for Submission ID: <code className="font-mono">{submissionId}</code>
        </p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Legal Disclaimer:</strong> This draft motion is for informational purposes only
          and must be reviewed by a qualified attorney before filing with any court.
        </AlertDescription>
      </Alert>

      <Tabs value={step.toString()} onValueChange={(v) => setStep(Number(v))}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="1">Basic Info</TabsTrigger>
          <TabsTrigger value="2">Motion Details</TabsTrigger>
          <TabsTrigger value="3">Preview & Save</TabsTrigger>
        </TabsList>

        <TabsContent value="1">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details for your motion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="motion-type">Motion Type *</Label>
                <Input
                  id="motion-type"
                  value={motionType}
                  onChange={(e) => setMotionType(e.target.value)}
                  placeholder="e.g., Dismiss, Suppress Evidence, Compel Discovery"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="case-number">Case Number *</Label>
                <Input
                  id="case-number"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  placeholder="e.g., 2024-CF-001234"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="court-name">Court Name *</Label>
                <Input
                  id="court-name"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  placeholder="e.g., Circuit Court of the Eleventh Judicial Circuit"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defendant-name">Defendant Name *</Label>
                <Input
                  id="defendant-name"
                  value={defendantName}
                  onChange={(e) => setDefendantName(e.target.value)}
                  placeholder="Full legal name"
                  required
                />
              </div>

              <Button onClick={() => setStep(2)} className="w-full">
                Next: Motion Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Motion Details</CardTitle>
                  <CardDescription>
                    Provide the grounds, facts, and legal basis for your motion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="grounds">Grounds for Motion</Label>
                    <Textarea
                      id="grounds"
                      value={grounds}
                      onChange={(e) => setGrounds(e.target.value)}
                      placeholder="Briefly state the grounds for this motion..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facts">Statement of Facts</Label>
                    <Textarea
                      id="facts"
                      value={facts}
                      onChange={(e) => setFacts(e.target.value)}
                      placeholder="Describe the relevant facts of the case..."
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="legal-basis">Legal Basis</Label>
                    <Textarea
                      id="legal-basis"
                      value={legalBasis}
                      onChange={(e) => setLegalBasis(e.target.value)}
                      placeholder="Cite relevant laws, constitutional provisions, or case law..."
                      rows={6}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1">
                      Preview
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Reference Library</CardTitle>
                <CardDescription>
                  Search for relevant legal references to support your motion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search legal references..."
                />
                <div className="max-h-[500px] space-y-2 overflow-y-auto">
                  {referenceEntries.map((entry) => (
                    <Card key={entry.id} className="cursor-pointer hover:bg-muted/50">
                      <CardContent className="p-3">
                        <p className="font-medium">{entry.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {entry.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                  {searchTerm && referenceEntries.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                      No references found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="3">
          <Card>
            <CardHeader>
              <CardTitle>Preview Draft Motion</CardTitle>
              <CardDescription>
                Review your draft motion before saving
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[600px] overflow-y-auto rounded-lg border bg-muted/30 p-6">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {generateDraftContent()}
                </pre>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Remember: This draft must be reviewed and approved by a qualified attorney before
                  filing with any court.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Edit
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1"
                  disabled={createDraftMotion.isPending}
                >
                  {createDraftMotion.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft Motion
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
