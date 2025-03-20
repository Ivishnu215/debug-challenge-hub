
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Code, LineChart, Bug, Trophy, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LevelCard from '@/components/LevelCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Mock user data - in a real app this would come from an API or auth provider
const mockUserData = {
  name: "John Doe",
  email: "demo@example.com",
  points: 420,
  rank: "Code Detective",
  progress: {
    beginner: {
      completed: 3,
      total: 5,
    },
    intermediate: {
      completed: 1,
      total: 5,
    },
    pro: {
      completed: 0,
      total: 5,
    },
  },
  recentActivity: [
    { id: 1, action: "Completed challenge", name: "Syntax Error Slayer", points: 20, date: "2 hours ago" },
    { id: 2, action: "Earned badge", name: "Quick Fixer", points: 50, date: "Yesterday" },
    { id: 3, action: "Started challenge", name: "Logic Loop Finder", points: 0, date: "Yesterday" },
  ],
  badges: [
    { id: 1, name: "First Bug Squashed", description: "Fixed your first bug", icon: <Bug className="h-5 w-5" /> },
    { id: 2, name: "Quick Fixer", description: "Fixed a bug in under 2 minutes", icon: <Award className="h-5 w-5" /> },
    { id: 3, name: "Streak Master", description: "Completed challenges 3 days in a row", icon: <Trophy className="h-5 w-5" /> },
  ]
};

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState(mockUserData);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // Simulate loading user data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  // Calculate total progress percentage
  const calculateOverallProgress = () => {
    const totalChallenges = 
      userData.progress.beginner.total + 
      userData.progress.intermediate.total + 
      userData.progress.pro.total;
    
    const completedChallenges = 
      userData.progress.beginner.completed + 
      userData.progress.intermediate.completed + 
      userData.progress.pro.completed;
    
    return (completedChallenges / totalChallenges) * 100;
  };

  const levels = [
    {
      id: "beginner",
      title: "Beginner Challenges",
      description: "Master the basics of debugging with simple syntax and common errors.",
      difficulty: "beginner" as const,
      completedChallenges: userData.progress.beginner.completed,
      totalChallenges: userData.progress.beginner.total,
    },
    {
      id: "intermediate",
      title: "Intermediate Challenges",
      description: "Tackle more complex bugs involving logic errors and runtime exceptions.",
      difficulty: "intermediate" as const,
      completedChallenges: userData.progress.intermediate.completed,
      totalChallenges: userData.progress.intermediate.total,
    },
    {
      id: "pro",
      title: "Pro Challenges",
      description: "Push your skills to the limit with advanced, multi-faceted debugging challenges.",
      difficulty: "pro" as const,
      completedChallenges: userData.progress.pro.completed,
      totalChallenges: userData.progress.pro.total,
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Bug className="h-8 w-8 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container">
          {/* User welcome section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, {userData.name}</h1>
            <p className="text-muted-foreground">Let's continue your debugging journey</p>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">{userData.points}</div>
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Current Rank: {userData.rank}</p>
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{Math.round(calculateOverallProgress())}%</div>
                <Progress value={calculateOverallProgress()} className="h-2" />
              </CardContent>
            </Card>
            
            <Card className="hover-lift">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Badges Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">{userData.badges.length}</div>
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Latest: {userData.badges[0].name}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Challenge levels */}
          <h2 className="text-2xl font-bold mb-4">Challenge Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
          
          {/* Tabs for activity and badges */}
          <Tabs defaultValue="activity" className="mt-8">
            <TabsList className="mb-4">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Your Activity</CardTitle>
                  <CardDescription>Track your recent progress and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {userData.recentActivity.map((activity) => (
                      <li key={activity.id} className="flex items-start justify-between pb-4 border-b last:border-0">
                        <div>
                          <p className="font-medium">{activity.action}: {activity.name}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                        {activity.points > 0 && (
                          <div className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                            +{activity.points} points
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="badges">
              <Card>
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                  <CardDescription>Achievements you've unlocked so far</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {userData.badges.map((badge) => (
                      <div key={badge.id} className="flex items-start p-4 border rounded-lg hover-lift">
                        <div className="mr-4 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{badge.name}</h4>
                          <p className="text-sm text-muted-foreground">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
