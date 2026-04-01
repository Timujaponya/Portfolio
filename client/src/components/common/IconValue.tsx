import { useEffect, useState } from 'react'
import { Code2 } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { resolveMediaUrl } from '../../utils/mediaUrl'

type DevIconComponent = React.ComponentType<{ size?: number }>
type IconEntry = IconDefinition | DevIconComponent
type IconMap = Record<string, IconEntry>

const shouldIncludeSolidIcon = (key: string) =>
  key.startsWith('fa') && key !== 'fas' && key !== 'far' && key !== 'fal' && key !== 'fad' && key !== 'fab'

const shouldIncludeBrandIcon = (key: string) => key.startsWith('fa') && key !== 'fab'
const shouldIncludeDevIcon = (key: string) => key.startsWith('Di')

interface IconValueProps {
  value?: string
  size?: number
}

export function IconValue({ value, size = 16 }: IconValueProps) {
  const [iconMap, setIconMap] = useState<IconMap>({})

  useEffect(() => {
    let isMounted = true

    const loadIcons = async () => {
      try {
        const [solidModule, brandModule, devModule] = await Promise.all([
          import('@fortawesome/free-solid-svg-icons'),
          import('@fortawesome/free-brands-svg-icons'),
          import('react-icons/di'),
        ])

        const map: IconMap = {}

        Object.keys(solidModule).forEach((key) => {
          if (shouldIncludeSolidIcon(key)) {
            map[key] = solidModule[key as keyof typeof solidModule] as IconDefinition
          }
        })

        Object.keys(brandModule).forEach((key) => {
          if (shouldIncludeBrandIcon(key)) {
            map[key] = brandModule[key as keyof typeof brandModule] as IconDefinition
          }
        })

        Object.keys(devModule).forEach((key) => {
          if (shouldIncludeDevIcon(key)) {
            map[key] = devModule[key as keyof typeof devModule] as DevIconComponent
          }
        })

        if (isMounted) {
          setIconMap(map)
        }
      } catch {
        if (isMounted) {
          setIconMap({})
        }
      }
    }

    void loadIcons()

    return () => {
      isMounted = false
    }
  }, [])

  const iconName = String(value || '').trim()

  if (!iconName) {
    return <Code2 size={size} />
  }

  if (iconName.startsWith('custom:')) {
    const iconUrl = resolveMediaUrl(iconName.replace('custom:', ''))
    return <img src={iconUrl} alt="icon" style={{ width: size, height: size, objectFit: 'contain' }} />
  }

  if (/^(https?:\/\/|\/uploads\/|uploads\/)/i.test(iconName)) {
    const iconUrl = resolveMediaUrl(iconName)
    return <img src={iconUrl} alt="icon" style={{ width: size, height: size, objectFit: 'contain' }} />
  }

  const icon = iconMap[iconName]

  if (iconName.startsWith('Di') && icon) {
    const DevIcon = icon as DevIconComponent
    return <DevIcon size={size} />
  }

  if (icon) {
    return <FontAwesomeIcon icon={icon as IconDefinition} style={{ width: size, height: size }} />
  }

  return <Code2 size={size} />
}
