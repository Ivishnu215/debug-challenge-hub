
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bug, Play, Lightbulb, Check, AlertTriangle } from 'lucide-react';

interface CodeEditorProps {
  initialCode: string;
  correctCode: string;
  language?: string;
  className?: string;
  onSubmit: (code: string, isCorrect: boolean) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  correctCode,
  language = "python",
  className,
  onSubmit,
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  const [showHint, setShowHint] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("editor");

  // Get line differences between user code and correct code
  const getDiffHint = () => {
    const userLines = code.split('\n');
    const correctLines = correctCode.split('\n');
    
    // Find lines that are different
    const diffLines: number[] = [];
    
    // Check for different lines
    const maxLength = Math.max(userLines.length, correctLines.length);
    for (let i = 0; i < maxLength; i++) {
      if (i >= userLines.length || i >= correctLines.length || userLines[i] !== correctLines[i]) {
        diffLines.push(i + 1); // +1 because line numbers start at 1
      }
    }
    
    return diffLines.length ? 
      `Check line${diffLines.length > 1 ? 's' : ''} ${diffLines.join(', ')}` : 
      "Your code is very close!";
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput(""); // Clear previous output
    
    // Simulate code execution and output
    setTimeout(() => {
      try {
        // In a real implementation, you would execute the code safely on a server
        // For this demo, we'll simulate output based on code structure
        
        // Check if code has syntax errors (very simplistic check for Python)
        if (code.includes('print(') && !code.includes(')')) {
          setOutput("SyntaxError: unexpected EOF while parsing");
        } else if (code.includes('printtt')) {
          setOutput("NameError: name 'printtt' is not defined");
        } else if (code.includes('def') && !code.includes(':')) {
          setOutput("SyntaxError: expected ':'");
        } else if (code.includes('  ') && code.includes('    ')) {
          setOutput("IndentationError: inconsistent use of tabs and spaces in indentation");
        } else {
          // Simulate successful output
          setOutput("Program executed successfully!\nOutput: " + (code.includes('print') ? "Expected output" : "No output"));
        }
      } catch (error) {
        setOutput(`Error: ${error}`);
      } finally {
        setIsRunning(false);
      }
    }, 800);
  };

  const handleSubmit = () => {
    // Check if user code matches the correct code (ignoring whitespace)
    const normalizedUserCode = code.replace(/\s+/g, '');
    const normalizedCorrectCode = correctCode.replace(/\s+/g, '');
    const isCorrect = normalizedUserCode === normalizedCorrectCode;
    
    // Call the onSubmit handler with the user's code and correctness status
    onSubmit(code, isCorrect);
    
    // Show some feedback
    if (isCorrect) {
      setOutput("Congratulations! Your solution is correct.");
    } else {
      setOutput("Your solution is not quite right. Try again or check the hint.");
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="editor">Code Editor</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="p-0">
          <Card className="rounded-t-none border-t-0">
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 py-1 px-4 bg-secondary text-xs text-muted-foreground">
                {language.toUpperCase()}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 p-4 pt-8 font-mono text-sm resize-none bg-opacity-50 focus:outline-none focus:ring-1 focus:ring-primary rounded-md border"
                spellCheck="false"
              />
              
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowHint(!showHint)}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {showHint ? "Hide Hint" : "Hint"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={runCode}
                  disabled={isRunning}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSubmit}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
            
            {showHint && (
              <div className="p-3 bg-yellow-50 border-t border-yellow-100 text-yellow-800 text-sm flex items-start gap-2 animate-fade-in">
                <Lightbulb className="h-5 w-5 flex-shrink-0 mt-0.5 text-yellow-500" />
                <div>
                  <p className="font-medium mb-1">Hint:</p>
                  <p>{getDiffHint()}</p>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="output" className="p-0">
          <Card className="rounded-t-none border-t-0">
            <div className="h-80 p-4 font-mono text-sm bg-black text-white overflow-auto">
              {isRunning ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="animate-pulse">Running code</span>
                  <span className="animate-pulse delay-100">.</span>
                  <span className="animate-pulse delay-200">.</span>
                  <span className="animate-pulse delay-300">.</span>
                </div>
              ) : output ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>Run your code to see output</span>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeEditor;
