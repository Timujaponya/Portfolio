export type AdminTab = 'profile' | 'projects' | 'services';

export interface Project {
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  category: 'web' | 'game' | 'tools';
  categoryIcon?: string;
  icon?: string;
  link?: string;
  githubUrl?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

export interface Service {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  price: {
    min: number;
    max: number;
    currency: string;
  };
  features: Array<{
    text: string;
    icon?: string;
  }>;
  order: number;
  isActive: boolean;
}

export interface Profile {
  _id?: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  cvUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    website: string;
    githubIcon?: string;
    linkedinIcon?: string;
    twitterIcon?: string;
    websiteIcon?: string;
  };
  techStack: Array<{
    name: string;
    icon?: string;
  }>;
}

export interface GithubRepository {
  id: number;
  name: string;
  html_url: string;
  description?: string;
  language?: string;
  stargazers_count: number;
  topics?: string[];
  homepage?: string;
  fork?: boolean;
  archived?: boolean;
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error';
}
