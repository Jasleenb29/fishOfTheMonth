
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';
import TransitionWrapper from '@/components/TransitionWrapper';
import Button from '@/components/Button';
import Card from '@/components/Card';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <TransitionWrapper duration={600}>
          <div className="flex flex-col items-center text-center mb-12">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <Award className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Fish of the Month</h1>
            <p className="text-muted-foreground text-lg max-w-sm">
              Recognize and celebrate your colleagues who go above and beyond.
            </p>
          </div>
        </TransitionWrapper>
        
        <TransitionWrapper delay={200} duration={600}>
          <Card className="mb-6" glassmorphism>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Host a Recognition Session</h3>
                <p className="text-muted-foreground text-sm">
                  Start a new "Fish of the Month" recognition and share with your team.
                </p>
              </div>
              
              <Button 
                onClick={() => navigate('/host')}
                className="w-full"
                size="lg"
              >
                Create New Session
              </Button>
            </div>
          </Card>
        </TransitionWrapper>
        
        <TransitionWrapper delay={400} duration={600}>
          <Card className="bg-muted/50" elevation="low">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">How It Works</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 shrink-0 mt-0.5">1</span>
                  <span>Host creates a new "Fish of the Month" session</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 shrink-0 mt-0.5">2</span>
                  <span>Share the generated link with your team</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 shrink-0 mt-0.5">3</span>
                  <span>Team members submit their nominations</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 shrink-0 mt-0.5">4</span>
                  <span>Celebrate the winner with the most nominations!</span>
                </li>
              </ul>
            </div>
          </Card>
        </TransitionWrapper>
      </div>
    </div>
  );
};

export default Index;
