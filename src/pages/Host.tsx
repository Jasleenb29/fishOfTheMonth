import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, ArrowLeft, BarChart } from 'lucide-react';
import TransitionWrapper from '@/components/TransitionWrapper';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { config } from '@/config';

const Host = () => {
  const [hostName, setHostName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hostName.trim()) {
      toast({
        title: "Host name required",
        description: "Please enter your name to create a session",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      const newSessionId = nanoid();
      const result = await api.createSession(hostName, newSessionId);
      if (result.success) {
        setSessionId(newSessionId);
      } else {
        throw new Error('Failed to create session');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleCopyLink = async () => {
    if (!sessionId) return;
    
    const link = `${config.baseUrl}/nominate/${sessionId}`;
    
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "Share it with your team members",
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        toast({
          title: "Link copied!",
          description: "Share it with your team members",
        });
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Please manually copy the link",
          variant: "destructive",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const handleViewResults = () => {
    if (!sessionId) return;
    navigate(`/results/${sessionId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <TransitionWrapper>
          <Button 
            variant="ghost" 
            className="mb-6" 
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate('/')}
          >
            Back
          </Button>
        </TransitionWrapper>
        
        <TransitionWrapper delay={100}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Host a Session</h1>
            <p className="text-muted-foreground">
              Create a new "Fish of the Month" recognition session
            </p>
          </div>
        </TransitionWrapper>
        
        {!sessionId ? (
          <TransitionWrapper delay={200}>
            <Card glassmorphism>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="hostName" className="block text-sm font-medium">
                    Your Name
                  </label>
                  <input
                    id="hostName"
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl px-4 py-2 border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    disabled={isCreating}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  isLoading={isCreating}
                >
                  Create Session
                </Button>
              </form>
            </Card>
          </TransitionWrapper>
        ) : (
          <TransitionWrapper className="animate-scale-in">
            <Card glassmorphism>
              <div className="space-y-6">
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Session created successfully!</p>
                  <p className="font-medium">Share this link with your team:</p>
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-secondary border">
                  <input
                    type="text"
                    readOnly
                    value={`${config.baseUrl}/nominate/${sessionId}`}
                    className="bg-transparent flex-grow focus:outline-none text-sm truncate"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyLink}
                    icon={isCopied ? <Check size={16} /> : <Copy size={16} />}
                    className={isCopied ? "text-green-500" : ""}
                  >
                    {isCopied ? "Copied" : "Copy"}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    onClick={handleViewResults} 
                    variant="primary"
                    className="w-full"
                    icon={<BarChart size={18} />}
                  >
                    View Results
                  </Button>
                  
                  <Button 
                    onClick={() => navigate(`/nominate/${sessionId}`)} 
                    variant="outline"
                    className="w-full"
                  >
                    Preview Nomination Page
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/')} 
                    variant="secondary"
                    className="w-full"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </Card>
          </TransitionWrapper>
        )}
      </div>
    </div>
  );
};

export default Host;
