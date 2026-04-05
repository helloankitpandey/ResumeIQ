-- Add missing DELETE policy on profiles table
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Add missing UPDATE policy on resume_analyses table
CREATE POLICY "Users can update their own analyses"
ON public.resume_analyses
FOR UPDATE
USING (auth.uid() = user_id);