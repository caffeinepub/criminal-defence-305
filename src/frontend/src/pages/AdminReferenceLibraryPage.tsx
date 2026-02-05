import { useState } from 'react';
import { useSearchReferenceEntries, useAddReferenceEntry, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminReferenceLibraryPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: entries = [] } = useSearchReferenceEntries('');
  const addEntry = useAddReferenceEntry();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEntry.mutateAsync({ title, content, author });
      toast.success('Reference entry added successfully');
      setTitle('');
      setContent('');
      setAuthor('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add reference entry');
    }
  };

  if (adminLoading) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-16">
        <Card className="mx-auto max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access this page. Admin privileges required.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Manage Reference Library</h1>
        <p className="text-lg text-muted-foreground">
          Add and manage legal reference entries for the library
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Reference Entry</CardTitle>
            <CardDescription>
              Create a new legal reference entry for users to search and view
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Fourth Amendment - Search and Seizure"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author/Source *</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., U.S. Constitution, Federal Rules of Criminal Procedure"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the full text of the legal reference..."
                  rows={12}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={addEntry.isPending}>
                {addEntry.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Entry...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Reference Entry
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Entries</CardTitle>
            <CardDescription>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} in the library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {entries.length === 0 && (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                  <div>
                    <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>No entries yet. Add your first reference entry.</p>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card key={entry.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{entry.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {entry.author} • Added{' '}
                        {new Date(Number(entry.dateAdded) / 1000000).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {entry.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
