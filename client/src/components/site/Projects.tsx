import { useMemo, useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import { motion } from 'motion/react'
import type { Project } from '../../types/portfolio'
import { resolveMediaUrl } from '../../utils/mediaUrl'
import { FeedbackCard } from '../common/FeedbackCard'

type FilterType = 'all' | 'web' | 'game' | 'tools'

interface ProjectsProps {
  projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return projects
    }
    return projects.filter((project) => project.category === activeFilter)
  }, [activeFilter, projects])

  return (
    <section id="projects" className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-black text-slate-900 sm:text-5xl">Featured Projects</h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-600">
            Ürün odaklı geliştirdiğim projelerden seçkiler.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {(['all', 'web', 'game', 'tools'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {filter === 'all' ? 'All' : filter.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {filteredProjects.length === 0 ? (
          <div className="mx-auto max-w-xl">
            <FeedbackCard
              tone="info"
              title="Bu filtrede proje yok"
              message="Farkli bir filtre secerek diger projeleri inceleyebilirsin."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={resolveMediaUrl(project.imageUrl) || '/images/background-pattern.png'}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end justify-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-5 opacity-0 transition-opacity group-hover:opacity-100">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-white p-2 text-slate-800 transition hover:bg-sky-600 hover:text-white"
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-white p-2 text-slate-800 transition hover:bg-sky-600 hover:text-white"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-slate-900">{project.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-slate-600">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <span key={`${project._id}-${tag}`} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
