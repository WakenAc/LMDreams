import type { NavigationItem } from '@/types/content';

export const primaryNavigation: NavigationItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Empresa', href: '/empresa/' },
  { label: 'Serviços', href: '/servicos/' },
  { label: 'Projetos', href: '/projetos/' },
  { label: 'Contactos', href: '/contactos/' }
];

export const footerNavigation: NavigationItem[] = [
  ...primaryNavigation,
  { label: 'Privacidade', href: '/privacidade/' }
];

export const primaryAction = { label: 'Pedir orçamento', href: '/contactos/#pedido-orcamento' };
