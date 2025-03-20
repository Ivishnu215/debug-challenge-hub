
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle, Clock, Terminal, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CodeEditor from '@/components/CodeEditor';

// Mock challenge data
const mockChallengeData = {
  beginner: [
    {
      id: "syntax-error",
      title: "Syntax Error Slayer",
      description: "Fix the syntax errors in this JavaScript function.",
      difficulty: "beginner",
      points: 20,
      timeLimit: 5, // in minutes
      initialCode: `function calculateSum(a, b) {
  let result = a + b
  console.log("The sum is: " + result);
  return result
`,
      correctCode: `function calculateSum(a, b) {
  let result = a + b;
  console.log("The sum is: " + result);
  return result;
}`,
      hints: ["Check for missing semicolons", "Are there any missing brackets?"]
    },
    {
      id: "variable-typo",
      title: "Variable Typo Tracker",
      description: "Find and fix the typo in the variable name.",
      difficulty: "beginner",
      points: 25,
      timeLimit: 5,
      initialCode: `function greetUser(name) {
  const message = "Hello, " + name + "!";
  
  // Display welcome message
  console.log(mesage);
  
  return message;
}`,
      correctCode: `function greetUser(name) {
  const message = "Hello, " + name + "!";
  
  // Display welcome message
  console.log(message);
  
  return message;
}`,
      hints: ["Variable names must match exactly", "Check the console.log statement"]
    }
  ],
  intermediate: [
    {
      id: "logical-error",
      title: "Logical Loop Finder",
      description: "Fix the logical error in this loop that's causing incorrect output.",
      difficulty: "intermediate",
      points: 40,
      timeLimit: 10,
      initialCode: `function sumEvenNumbers(numbers) {
  let sum = 0;
  
  for (let i = 0; i <= numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
      sum += numbers[i];
    }
  }
  
  return sum;
}`,
      correctCode: `function sumEvenNumbers(numbers) {
  let sum = 0;
  
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
      sum += numbers[i];
    }
  }
  
  return sum;
}`,
      hints: ["Check the loop condition", "Array indices start at 0 and end at length-1"]
    }
  ],
  pro: [
    {
      id: "async-bug",
      title: "Async Function Fixer",
      description: "Fix the bug in this asynchronous JavaScript function.",
      difficulty: "pro",
      points: 60,
      timeLimit: 15,
      initialCode: `async function fetchUserData(userId) {
  try {
    const response = await fetch('https://api.example.com/users/' + userId);
    const data = response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}`,
      correctCode: `async function fetchUserData(userId) {
  try {
    const response = await fetch('https://api.example.com/users/' + userId);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}`,
      hints: ["The response.json() method returns a Promise", "You need to wait for the JSON parsing to complete"]
    }
  ]
};

const Challenge: React.FC = () => {
  const { levelId, challengeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [challenge, setChallenge] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // Load challenges for the selected level
    if (levelId && mockChallengeData[levelId as keyof typeof mockChallengeData]) {
      const levelChallenges = mockChallengeData[levelId as keyof typeof mockChallengeData];
      setChallenges(levelChallenges);
      
      // If challengeId is provided, find that specific challenge
      if (challengeId) {
        const foundChallenge = levelChallenges.find(c => c.id === challengeId);
        if (foundChallenge) {
          setChallenge(foundChallenge);
          setTimeLeft(foundChallenge.timeLimit * 60); // Convert to seconds
          setCurrentChallengeIndex(levelChallenges.findIndex(c => c.id === challengeId));
        } else {
          // Challenge not found, go to first challenge
          if (levelChallenges.length > 0) {
            navigate(`/challenges/${levelId}/${levelChallenges[0].id}`);
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        // No challengeId, go to first challenge
        if (levelChallenges.length > 0) {
          navigate(`/challenges/${levelId}/${levelChallenges[0].id}`);
        } else {
          navigate('/dashboard');
        }
      }
    } else {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  }, [levelId, challengeId, navigate]);

  // Timer effect
  useEffect(() => {
    if (!challenge || isCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [challenge, isCompleted]);

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = (code: string, isCorrect: boolean) => {
    if (isCorrect) {
      setIsCompleted(true);
      
      toast({
        title: "Challenge Completed!",
        description: `You earned ${challenge.points} points!`,
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Try again or check the hint for guidance.",
        variant: "destructive",
      });
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      navigate(`/challenges/${levelId}/${challenges[currentChallengeIndex + 1].id}`);
      window.location.reload(); // Simple way to reset challenge state
    } else {
      // Last challenge in level
      navigate('/dashboard');
    }
  };

  if (isLoading || !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Terminal className="h-8 w-8 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    pro: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container max-w-5xl">
          {/* Challenge header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Link 
                to="/dashboard" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{challenge.title}</h1>
                <Badge 
                  variant="outline" 
                  className={difficultyColors[challenge.difficulty as keyof typeof difficultyColors]}
                >
                  {challenge.difficulty}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">{challenge.description}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                <Award className="mr-1.5 h-4 w-4" />
                <span>{challenge.points} pts</span>
              </div>
              
              <div className={`flex items-center px-3 py-1.5 rounded-full ${
                timeLeft < 60 ? 'bg-red-100 text-red-800' : 'bg-secondary text-secondary-foreground'
              }`}>
                <Clock className="mr-1.5 h-4 w-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          {/* Challenge progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span>Challenge {currentChallengeIndex + 1} of {challenges.length}</span>
              <span>{Math.round(((currentChallengeIndex + 1) / challenges.length) * 100)}% complete</span>
            </div>
            <Progress value={((currentChallengeIndex + 1) / challenges.length) * 100} className="h-2" />
          </div>
          
          {/* Challenge completed state */}
          {isCompleted ? (
            <Card className="mb-8 bg-green-50 border-green-100">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Challenge Completed!</h2>
                  <p className="text-muted-foreground mb-6">
                    You've earned {challenge.points} points for completing this challenge.
                  </p>
                  <Button onClick={handleNextChallenge}>
                    {currentChallengeIndex < challenges.length - 1 ? "Next Challenge" : "Back to Dashboard"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <CodeEditor 
              initialCode={challenge.initialCode} 
              correctCode={challenge.correctCode}
              onSubmit={handleSubmit}
              className="mb-8"
            />
          )}
          
          {/* Instructions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Challenge Instructions</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>Find and fix the bugs in the code. When you think you've fixed all issues:</p>
              <ol>
                <li>Click <strong>Run</strong> to test your solution</li>
                <li>Click <strong>Submit</strong> to check if your solution is correct</li>
                <li>If needed, use the <strong>Hint</strong> button for guidance</li>
              </ol>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 m-0">Time Limit</p>
                  <p className="text-yellow-700 m-0">You have {challenge.timeLimit} minutes to complete this challenge.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Challenge;
