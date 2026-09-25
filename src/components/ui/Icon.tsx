import {
  BadgeCheck,
  Bath,
  BrickWall,
  CalendarRange,
  ClipboardList,
  CookingPot,
  Droplets,
  Eye,
  Fence,
  Hammer,
  Handshake,
  HardHat,
  Landmark,
  Layers,
  LayoutGrid,
  ListChecks,
  MessagesSquare,
  PaintRoller,
  PencilRuler,
  Ruler,
  ShieldCheck,
  Thermometer,
  Umbrella,
  UserCheck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { IconName } from '../../content/tipos'

const ICONS: Record<IconName, LucideIcon> = {
  BadgeCheck,
  Bath,
  BrickWall,
  CalendarRange,
  ClipboardList,
  CookingPot,
  Droplets,
  Eye,
  Fence,
  Hammer,
  Handshake,
  HardHat,
  Landmark,
  Layers,
  LayoutGrid,
  ListChecks,
  MessagesSquare,
  PaintRoller,
  PencilRuler,
  Ruler,
  ShieldCheck,
  Thermometer,
  Umbrella,
  UserCheck,
  Users,
  Wrench,
  Zap,
}

interface IconProps {
  name: IconName
  /** 20 ou 24 px (Parte 5.2). */
  size?: 20 | 24
  className?: string
}

/** Ícone de conteúdo (serviços, diferenciais). Decorativo: o texto ao lado dá o significado. */
export function Icon({ name, size = 24, className }: IconProps) {
  const Component = ICONS[name]
  return (
    <Component
      size={size}
      strokeWidth={1.5}
      aria-hidden="true"
      focusable="false"
      className={className}
    />
  )
}
