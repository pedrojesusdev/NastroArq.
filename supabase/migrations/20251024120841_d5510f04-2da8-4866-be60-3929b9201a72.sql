-- Add featured field to projects table
ALTER TABLE public.projects 
ADD COLUMN featured boolean NOT NULL DEFAULT false;

-- Create table for multiple project images
CREATE TABLE public.project_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on project_images
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for project_images
CREATE POLICY "Anyone can view project images"
ON public.project_images
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert project images"
ON public.project_images
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update project images"
ON public.project_images
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete project images"
ON public.project_images
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better query performance
CREATE INDEX idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX idx_projects_featured ON public.projects(featured) WHERE featured = true;