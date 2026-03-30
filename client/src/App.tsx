import { useEffect, useState } from 'react'
import { Navigation } from './components/site/Navigation'
import { Hero } from './components/site/Hero'
import { About } from './components/site/About'
import { Skills } from './components/site/Skills'
import { Projects } from './components/site/Projects'
import { Contact } from './components/site/Contact'
import { Footer } from './components/site/Footer'
import type { Profile, Project, Service } from './types/portfolio'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetchProjects()
    fetchServices()
    fetchProfile()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`)
      const data = await response.json()
      const projectsData = data.projects || data.result?.dbProjects || []
      setProjects(projectsData)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/services/active`)
      const data = await response.json()
      setServices(data.services || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/profile`)
      const data = await response.json()
      setProfile(data.profile || null)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    }
  }

  return (
    <div className="size-full">
      <Navigation />
      <Hero profile={profile} />
      <About profile={profile} projectCount={projects.length} serviceCount={services.length} />
      <Skills profile={profile} services={services} />
      <Projects projects={projects} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </div>
  )
}
