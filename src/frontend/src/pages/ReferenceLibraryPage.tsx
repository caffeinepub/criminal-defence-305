import { useState } from 'react';
import { useSearchReferenceEntries } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ReferenceLibraryPage() {
  const [searchText, setSearchText] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const { data: entries = [], isLoading } = useSearchReferenceEntries(activeSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchText);
    setSelectedEntry(null);
  };

  const selectedEntryData = entries.find((e) => e.id === selectedEntry);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Legal Reference Library</h1>
        <p className="text-lg text-muted-foreground">
          Search through criminal law references, constitutional provisions, and procedural rules
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search References</CardTitle>
          <CardDescription>
            Enter keywords to search through legal references and case law
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by title or content..."
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Search Results</CardTitle>
            <CardDescription>
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {entries.length === 0 && activeSearch && !isLoading && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No entries found. Try a different search term.
                </div>
              )}
              {entries.length === 0 && !activeSearch && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Enter a search term to find legal references
                </div>
              )}
              {entries.map((entry, index) => (
                <div key={entry.id}>
                  <button
                    onClick={() => setSelectedEntry(entry.id)}
                    className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${
                      selectedEntry === entry.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                      <div className="flex-1 overflow-hidden">
                        <h3 className="font-semibold">{entry.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {entry.author} • {formatDate(entry.dateAdded)}
                        </p>
                      </div>
                    </div>
                  </button>
                  {index < entries.length - 1 && <Separator />}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Reference Details</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedEntryData && (
              <div className="flex h-[600px] items-center justify-center text-center text-muted-foreground">
                <div>
                  <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>Select an entry from the search results to view details</p>
                </div>
              </div>
            )}
            {selectedEntryData && (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold">{selectedEntryData.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Author: {selectedEntryData.author}</span>
                      <span>•</span>
                      <span>Added: {formatDate(selectedEntryData.dateAdded)}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap">{selectedEntryData.content}</div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
