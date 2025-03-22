import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Award, Heart } from 'lucide-react';
import TransitionWrapper from '@/components/TransitionWrapper';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Nominate = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nomineeName, setNomineeName] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setError("Session ID is missing");
        setLoading(false);
        return;
      }

      try {
        const sessionData = await api.getSession(sessionId);
        if (!sessionData.isActive) {
          setError("This session is no longer accepting nominations");
        } else {
          setSession(sessionData);
        }
      } catch (error) {
        setError("Session not found");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionId) return;

    if (!nomineeName.trim()) {
      toast({
        title: "Nominee name required",
        description: "Please enter the name of the person you're nominating",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await api.submitNomination(
        sessionId,
        "Anonymous", // Using "Anonymous" instead of asking for nominator name
        nomineeName,
        reason
      );
      
      if (result.success) {
        setHasSubmitted(true);
        toast({
          title: "Nomination submitted!",
          description: "Thank you for your contribution",
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your nomination",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading session...</p>
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
              <Award className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Session Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <TransitionWrapper delay={100}>
          <div className="text-center mb-8">
            <div className="bg-primary/10 p-3 rounded-full mx-auto w-fit mb-4">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Fish of the Month</h1>
            <p className="text-muted-foreground">
              Hosted by {session?.hostName}
            </p>
          </div>
        </TransitionWrapper>
        
        <TransitionWrapper delay={200}>
          {hasSubmitted ? (
            <Card glassmorphism className="animate-scale-in">
              <div className="text-center space-y-6">
                <div className="bg-green-50 p-3 rounded-full mx-auto w-fit">
                  <Heart className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                  <p className="text-muted-foreground">
                    Your nomination has been successfully submitted.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card glassmorphism>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="nomineeName" className="block text-sm font-medium">
                    Who are you nominating?
                  </label>
                  <input
                    id="nomineeName"
                    type="text"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    placeholder="Enter their name"
                    className="w-full rounded-xl px-4 py-2 border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="reason" className="block text-sm font-medium">
                    Why are you nominating them? (Optional)
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tell us why they deserve recognition"
                    rows={4}
                    className="w-full rounded-xl px-4 py-2 border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  isLoading={isSubmitting}
                >
                  Submit Nomination
                </Button>
              </form>
            </Card>
          )}
        </TransitionWrapper>
      </div>
    </div>
  );
};

export default Nominate;
