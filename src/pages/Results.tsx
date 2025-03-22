import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Medal } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import TransitionWrapper from '@/components/TransitionWrapper';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { api } from '@/lib/api';
import type { Session, Nomination } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Results = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId) {
        setError("Session ID is missing");
        setLoading(false);
        return;
      }

      try {
        const [sessionData, nominationsData] = await Promise.all([
          api.getSession(sessionId),
          api.getResults(sessionId)
        ]);

        setSession(sessionData);
        setNominations(nominationsData);
      } catch (error) {
        setError("Session not found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md" glassmorphism>
          <div className="text-center space-y-4">
            <div className="bg-destructive/10 p-3 rounded-full mx-auto w-fit">
              <Medal className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Results Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Get count of nominations per person
  const nominationCounts: Record<string, number> = {};
  nominations.forEach((nomination) => {
    const name = nomination.nomineeName;
    nominationCounts[name] = (nominationCounts[name] || 0) + 1;
  });

  // Sort nominees by nomination count (descending)
  const sortedNominees = Object.entries(nominationCounts)
    .sort(([, countA], [, countB]) => countB - countA);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="w-full max-w-4xl">
        <TransitionWrapper>
          <Button 
            variant="ghost" 
            className="mb-6" 
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate('/host')}
          >
            Back to Host
          </Button>
        </TransitionWrapper>
        
        <TransitionWrapper delay={100}>
          <div className="text-center mb-8">
            <div className="bg-primary/10 p-3 rounded-full mx-auto w-fit mb-4">
              <Medal className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Results</h1>
            <p className="text-muted-foreground">
              Session hosted by {session?.hostName}
            </p>
          </div>
        </TransitionWrapper>
        
        <TransitionWrapper delay={200}>
          <Card glassmorphism className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Nomination Summary</h2>
            
            {sortedNominees.length === 0 ? (
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No nominations yet. Share the link with your team!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nominee Name</TableHead>
                      <TableHead>Number of Nominations</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedNominees.map(([name, count]) => (
                      <TableRow key={name}>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell>{count}</TableCell>
                        <TableCell>
                          {((count / nominations.length) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>

          <Card glassmorphism>
            <h2 className="text-xl font-semibold mb-4">All Nominations</h2>
            
            {nominations.length === 0 ? (
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No nominations yet. Share the link with your team!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nominee</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nominations.map((nomination, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{nomination.nomineeName}</TableCell>
                        <TableCell>{nomination.reason || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(nomination.timestamp).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TransitionWrapper>
      </div>
    </div>
  );
};

export default Results;
