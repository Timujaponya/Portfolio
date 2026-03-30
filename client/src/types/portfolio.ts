export interface Project {
  _id: string
  title: string
  description: string
  tags: string[]
  category: 'web' | 'game' | 'tools'
  categoryIcon?: string
  icon?: string
  link?: string
  githubUrl?: string
  imageUrl?: string
  isActive: boolean
}

export interface Service {
  _id: string
  title: string
  description: string
  icon: string
  price: {
    min: number
    max: number
    currency: string
  }
  features: Array<{
    text: string
    icon?: string
  }>
  isActive: boolean
}

export interface Profile {
  name: string
  title: string
  bio: string
  email: string
  phone: string
  location: string
  avatarUrl: string
  cvUrl: string
  socialLinks: {
    github: string
    linkedin: string
    twitter: string
    website: string
  }
  techStack: Array<{
    name: string
    icon?: string
  }>
}
