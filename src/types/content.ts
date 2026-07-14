export type AssetType =
  | 'real-project-photo'
  | 'company-photo'
  | 'stock-photo'
  | 'generated-image'
  | 'illustrative-image'
  | 'placeholder';

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  assetType: AssetType;
  authorizedForPublication: boolean;
  usageNotes?: string;
}

export interface ProjectEntry {
  title: string;
  slug: string;
  locationGeneral: string;
  interventionType: string;
  summary: string;
  servicesInvolved: string[];
  published: boolean;
  authorizedForPublication: boolean;
  images: ProjectImage[];
}

export interface ServiceEntry {
  title: string;
  slug: string;
  summary: string;
  description: string;
  benefits: string[];
  draftContent: true;
  requiresCompanyApproval: true;
  icon: 'build' | 'tools' | 'finish' | 'repair' | 'coordination' | 'supervision';
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  displayOrder: number;
  draftContent: true;
  requiresCompanyApproval: true;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface ContactDetailsData {
  phone: string;
  email: string;
  operationArea: string;
  formEndpoint: string;
}

export interface CompanyInfo {
  name: string;
  legalName: string;
  slogan: string;
  intro: string;
  experienceStatement: string;
  values: string[];
}
