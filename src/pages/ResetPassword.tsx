/**
 * Reset Password Page
 *
 * Reached via the password-reset email link. Validates that a session
 * exists (established by the URL hash token), then lets the user
 * choose a new password. Redirects to /dashboard on success.
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if user came from a password reset link
    if (!session) {
      // Give it a moment for the session to be established from the URL hash
      const timeout = setTimeout(() => {
        if (!session) {
          toast.error("Invalid or expired reset link. Please request a new one.");
          navigate("/auth");
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const { error } = await updatePassword(password);

    if (error) {
      toast.error(error.message);
    } else {
      setIsSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }

    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <FileText className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">ResumeIQ</span>
            </Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-2xl font-display">Password Updated!</CardTitle>
              <CardDescription>
                Your password has been successfully updated. Redirecting to dashboard...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center">
              <FileText className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-semibold">ResumeIQ</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">Set New Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
