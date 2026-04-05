/**
 * Resume Analyzer Page
 *
 * Allows authenticated users to upload a resume (PDF / DOCX / TXT) or
 * paste text, optionally provide a target job description, and receive
 * an AI-powered ATS compatibility analysis with detailed scoring.
 *
 * Results are displayed in four tabs:
 *   Scores – overall & per-category scores
 *   ATS Check – checklist of ATS best practices
 *   Tips – actionable improvement suggestions
 *   Keywords – found vs. missing keywords
 */

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Sparkles,
  Loader2,
  Upload,
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Crown,
  ArrowLeft,
  File,
  X,
  XCircle,
  Shield,
  Zap,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface ATSChecklist {
  has_contact_info: boolean;
  has_clear_sections: boolean;
  no_tables_graphics: boolean;
  standard_fonts: boolean;
  proper_date_format: boolean;
  no_headers_footers: boolean;
  action_verbs: boolean;
  quantified_achievements: boolean;
}

interface AnalysisResult {
  ats_score: number;
  keyword_match_score: number;
  format_score: number;
  content_score: number;
  readability_score: number;
  impact_score: number;
  overall_feedback: string;
  suggestions: string[];
  keyword_analysis: {
    found: string[];
    missing: string[];
  };
  ats_checklist: ATSChecklist;
  strengths: string[];
  critical_issues: string[];
}

const Analyzer = () => {
  const navigate = useNavigate();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const isPremium = profile.subscription_tier === "premium";
  const hasCredits = isPremium || profile.credits_remaining > 0;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
      toast.error("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);

    try {
      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Parse the file
      const { data, error } = await supabase.functions.invoke("parse-resume", {
        body: { filePath },
      });

      if (error) throw error;

      if (data?.text) {
        setResumeText(data.text);
        toast.success("Resume uploaded and parsed successfully!");
      } else {
        throw new Error("No text extracted from file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to parse resume. Please try pasting the text instead.");
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setResumeText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error("Please enter your resume text or upload a file");
      return;
    }

    if (!hasCredits) {
      toast.error("No credits remaining. Upgrade to Premium for unlimited analyses.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: {
          resumeText,
          jobDescription: jobDescription.trim() || null,
        },
      });

      if (error) throw error;

      setResult(data);
      await refreshProfile();
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center">
              <FileText className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-semibold">ResumeIQ</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-display font-bold">Resume Analyzer</h1>
            <Badge variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Upload your resume or paste text to get instant AI feedback with ATS scoring
          </p>
        </div>

        {/* Credits Info */}
        {!isPremium && (
          <Card className="mb-6 bg-muted/50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {profile.credits_remaining} analysis{profile.credits_remaining !== 1 ? "es" : ""} remaining
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to Premium for unlimited analyses
                    </p>
                  </div>
                </div>
                <Link to="/pricing">
                  <Button variant="outline" size="sm">
                    <Crown className="h-4 w-4 mr-2 text-yellow-500" />
                    Upgrade
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Your Resume
                </CardTitle>
                <CardDescription>
                  Upload a PDF/DOCX file or paste your resume text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    isUploading
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.md"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm font-medium">Parsing your resume...</p>
                      <p className="text-xs text-muted-foreground">This may take a moment</p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <File className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{uploadedFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearFile();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">Drop your resume here or click to upload</p>
                      <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (max 10MB)</p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or paste text</span>
                  </div>
                </div>

                <Textarea
                  placeholder="Paste your resume content here..."
                  className="min-h-[200px] resize-none"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Job Description
                  <Badge variant="outline" className="ml-2">Optional</Badge>
                </CardTitle>
                <CardDescription>
                  Add a job description for targeted optimization suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste the job description here for better keyword matching..."
                  className="min-h-[150px] resize-none"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              onClick={handleAnalyze}
              disabled={isAnalyzing || isUploading || !hasCredits || !resumeText.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : !hasCredits ? (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade for More Analyses
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          <div>
            {result ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="scores" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-auto">
                      <TabsTrigger value="scores" className="text-xs sm:text-sm py-2">Scores</TabsTrigger>
                      <TabsTrigger value="checklist" className="text-xs sm:text-sm py-2">ATS Check</TabsTrigger>
                      <TabsTrigger value="suggestions" className="text-xs sm:text-sm py-2">Tips</TabsTrigger>
                      <TabsTrigger value="keywords" className="text-xs sm:text-sm py-2">Keywords</TabsTrigger>
                    </TabsList>

                    <TabsContent value="scores" className="space-y-6 mt-6">
                      {/* Overall ATS Score */}
                      <div className="text-center p-6 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          Overall ATS Score
                        </p>
                        <p className={`text-5xl font-bold ${getScoreColor(result.ats_score)}`}>
                          {result.ats_score}
                        </p>
                        <p className={`text-sm font-medium mt-1 ${getScoreColor(result.ats_score)}`}>
                          {getScoreLabel(result.ats_score)}
                        </p>
                      </div>

                      {/* Critical Issues */}
                      {result.critical_issues && result.critical_issues.length > 0 && (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center gap-2 text-destructive">
                            <XCircle className="h-4 w-4" />
                            Critical Issues
                          </h4>
                          <ul className="space-y-1">
                            {result.critical_issues.map((issue, i) => (
                              <li key={i} className="text-sm text-destructive/90">• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Strengths */}
                      {result.strengths && result.strengths.length > 0 && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {result.strengths.map((strength, i) => (
                              <li key={i} className="text-sm text-green-700 dark:text-green-400">• {strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Individual Scores */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Keyword Match</span>
                            <span className={`text-sm font-medium ${getScoreColor(result.keyword_match_score)}`}>
                              {result.keyword_match_score}%
                            </span>
                          </div>
                          <Progress value={result.keyword_match_score} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Format & Structure</span>
                            <span className={`text-sm font-medium ${getScoreColor(result.format_score)}`}>
                              {result.format_score}%
                            </span>
                          </div>
                          <Progress value={result.format_score} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Content Quality</span>
                            <span className={`text-sm font-medium ${getScoreColor(result.content_score)}`}>
                              {result.content_score}%
                            </span>
                          </div>
                          <Progress value={result.content_score} className="h-2" />
                        </div>
                        {result.readability_score !== undefined && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium flex items-center gap-1">
                                <Eye className="h-3 w-3" /> Readability
                              </span>
                              <span className={`text-sm font-medium ${getScoreColor(result.readability_score)}`}>
                                {result.readability_score}%
                              </span>
                            </div>
                            <Progress value={result.readability_score} className="h-2" />
                          </div>
                        )}
                        {result.impact_score !== undefined && (
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium flex items-center gap-1">
                                <Zap className="h-3 w-3" /> Impact & Metrics
                              </span>
                              <span className={`text-sm font-medium ${getScoreColor(result.impact_score)}`}>
                                {result.impact_score}%
                              </span>
                            </div>
                            <Progress value={result.impact_score} className="h-2" />
                          </div>
                        )}
                      </div>

                      {/* Overall Feedback */}
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm">{result.overall_feedback}</p>
                      </div>
                    </TabsContent>

                    {/* ATS Checklist Tab */}
                    <TabsContent value="checklist" className="mt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield className="h-5 w-5 text-primary" />
                          <h4 className="font-medium">ATS Compatibility Checklist</h4>
                        </div>
                        {result.ats_checklist && (
                          <div className="space-y-2">
                            {[
                              { key: 'has_contact_info', label: 'Contact Information', desc: 'Name, email, and phone number present' },
                              { key: 'has_clear_sections', label: 'Clear Sections', desc: 'Experience, Education, Skills clearly labeled' },
                              { key: 'no_tables_graphics', label: 'ATS-Friendly Format', desc: 'No tables, images, or graphics' },
                              { key: 'standard_fonts', label: 'Standard Fonts', desc: 'Uses readable, standard fonts' },
                              { key: 'proper_date_format', label: 'Date Format', desc: 'Consistent, parseable date format' },
                              { key: 'no_headers_footers', label: 'No Header/Footer Issues', desc: 'Key info not in headers/footers' },
                              { key: 'action_verbs', label: 'Action Verbs', desc: 'Uses strong action verbs' },
                              { key: 'quantified_achievements', label: 'Quantified Achievements', desc: 'Measurable results with numbers' },
                            ].map((item) => {
                              const isChecked = result.ats_checklist[item.key as keyof ATSChecklist];
                              return (
                                <div 
                                  key={item.key} 
                                  className={`flex items-start gap-3 p-3 rounded-lg ${
                                    isChecked ? 'bg-green-500/10' : 'bg-destructive/10'
                                  }`}
                                >
                                  {isChecked ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                                  )}
                                  <div>
                                    <p className={`text-sm font-medium ${isChecked ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {!result.ats_checklist && (
                          <p className="text-sm text-muted-foreground">ATS checklist not available for this analysis.</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="suggestions" className="mt-6">
                      <ul className="space-y-3">
                        {result.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="keywords" className="mt-6 space-y-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Keywords Found
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.keyword_analysis.found.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                              {keyword}
                            </Badge>
                          ))}
                          {result.keyword_analysis.found.length === 0 && (
                            <p className="text-sm text-muted-foreground">No specific keywords detected</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          Suggested Keywords to Add
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.keyword_analysis.missing.map((keyword) => (
                            <Badge key={keyword} variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400">
                              {keyword}
                            </Badge>
                          ))}
                          {result.keyword_analysis.missing.length === 0 && (
                            <p className="text-sm text-muted-foreground">Great coverage!</p>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full min-h-[400px] flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Upload a resume file or paste text to get AI-powered feedback and ATS scoring
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analyzer;
