
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LevelCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'pro';
  completedChallenges?: number;
  totalChallenges: number;
  className?: string;
}

const LevelCard: React.FC<LevelCardProps> = ({
  id,
  title,
  description,
  difficulty,
  completedChallenges = 0,
  totalChallenges,
  className,
}) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    pro: 'bg-red-100 text-red-800 border-red-200',
  };

  const difficultyLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    pro: 'Pro',
  };

  return (
    <Card className={cn("overflow-hidden hover-lift", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge 
            variant="outline" 
            className={cn("mb-2 font-normal", difficultyColors[difficulty])}
          >
            {difficultyLabels[difficulty]}
          </Badge>
          
          {completedChallenges === totalChallenges && totalChallenges > 0 && (
            <Trophy className="h-5 w-5 text-yellow-500" />
          )}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="w-full bg-secondary rounded-full h-2.5 mb-1">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${(completedChallenges / totalChallenges) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {completedChallenges} of {totalChallenges} challenges completed
        </p>
      </CardContent>
      <CardFooter>
        <Link 
          to={`/challenges/${id}`} 
          className="group w-full inline-flex items-center justify-between text-sm font-medium text-primary transition-colors"
        >
          <span>View Challenges</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LevelCard;
