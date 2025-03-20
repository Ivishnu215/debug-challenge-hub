
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Code, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BugAnimation from '@/components/BugAnimation';
import LevelCard from '@/components/LevelCard';

const Index: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const levels = [
    {
      id: "beginner",
      title: "Beginner Challenges",
      description: "Start your debugging journey with simple syntax errors and basic issues.",
      difficulty: "beginner" as const,
      completedChallenges: 0,
      totalChallenges: 5,
    },
    {
      id: "intermediate",
      title: "Intermediate Challenges",
      description: "Tackle more complex bugs involving logic errors and runtime exceptions.",
      difficulty: "intermediate" as const,
      completedChallenges: 0,
      totalChallenges: 5,
    },
    {
      id: "pro",
      title: "Pro Challenges",
      description: "Master debugging with advanced challenges involving concurrency, async code, and edge cases.",
      difficulty: "pro" as const,
      completedChallenges: 0,
      totalChallenges: 5,
    }
  ];

  const features = [
    {
      icon: <Code className="h-5 w-5" />,
      title: "Real-world Bugs",
      description: "Practice with bugs that mimic real-world scenarios across various programming languages."
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "Earn Points & Badges",
      description: "Gain points for each bug you fix and unlock achievement badges as you progress."
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Track Your Progress",
      description: "Monitor your debugging skills improvement with detailed performance metrics."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BugAnimation />
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 animate-fade-in">Welcome to Bug Battle</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
              Sharpen Your Debugging Skills, One Bug at a Time
            </h1>
            <p className="text-lg text-muted-foreground mb-10 animate-fade-in">
              Enhance your coding abilities by solving increasingly challenging debug puzzles. 
              Track your progress, earn points, and become a debugging master.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How Bug Battle Works</h2>
            <p className="text-muted-foreground">
              Our platform offers a structured approach to improving your debugging skills 
              through practical challenges and instant feedback.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-background rounded-lg p-6 shadow-sm hover-lift"
              >
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Challenge Levels */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Challenge Levels</h2>
            <p className="text-muted-foreground">
              Choose from a variety of difficulty levels, each designed to test different 
              aspects of your debugging expertise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {levels.map((level) => (
              <LevelCard
                key={level.id}
                id={level.id}
                title={level.title}
                description={level.description}
                difficulty={level.difficulty}
                completedChallenges={level.completedChallenges}
                totalChallenges={level.totalChallenges}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Squash Some Bugs?</h2>
            <p className="mb-8 text-primary-foreground/80">
              Join thousands of developers improving their debugging skills with Bug Battle.
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials - can be added in a future iteration */}
      
      <Footer />
    </div>
  );
};

export default Index;
