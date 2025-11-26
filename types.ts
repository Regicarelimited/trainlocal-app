export interface BlogConfig {
  topic: string;
  keyword: string;
  tone: string;
}

export interface BlogPostSection {
  heading: string;
  content: string; // HTML paragraph content
  imageDescription?: string; // For generating relevant placeholders
  imageBase64?: string; // For actual generated image
}

export interface GeneratedPostData {
  title: string;
  intro: string;
  heroImageDescription: string;
  heroImageBase64?: string; // For actual generated image
  sections: BlogPostSection[];
  conclusion: string;
  metaDescription: string;
}

export interface AuditItem {
  label: string;
  status: boolean;
  detail: string;
}

export type AppStep = 'input' | 'generating' | 'audit' | 'preview' | 'pushing' | 'done';

export type LayoutMode = 'standard' | 'modern';

// NEW: Layout Engine Types
export type BlockType = 'hero' | 'intro' | 'toc' | 'section' | 'cta_services' | 'cta_copilot' | 'cta_book' | 'cta_forecast' | 'conclusion' | 'image';

export interface ContentBlock {
  id: string;
  type: BlockType;
  title: string; // Display name in editor
  content?: string; // HTML content
  heading?: string; // For sections
  meta?: {
    src?: string;
    alt?: string;
    prompt?: string;
  };
  isVisible: boolean;
}