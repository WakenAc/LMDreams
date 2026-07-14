import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  hasPublishableProjectAssets,
  isContactFormConfigured,
  isPublishedProject,
  withBasePath
} from '@/utils/validation';
import type { ProjectEntry } from '@/types/content';

describe('validation utilities', () => {
  it('accepts only https endpoints for contact forms', () => {
    expect(isContactFormConfigured('https://formspree.io/f/test123')).toBe(true);
    expect(isContactFormConfigured('http://example.com/form')).toBe(false);
    expect(isContactFormConfigured('')).toBe(false);
  });

  it('requires authorized real photos to publish a project', () => {
    const project: ProjectEntry = {
      title: 'Projeto',
      slug: 'projeto',
      summary: 'Resumo válido do projeto.',
      locationGeneral: 'Lisboa',
      interventionType: 'Reabilitação',
      servicesInvolved: ['Construção e remodelação'],
      published: true,
      authorizedForPublication: true,
      images: [
        {
          src: '/one.jpg',
          alt: 'Foto real 1',
          width: 1200,
          height: 800,
          assetType: 'real-project-photo',
          authorizedForPublication: true
        }
      ]
    };

    expect(hasPublishableProjectAssets(project)).toBe(true);
    expect(isPublishedProject(project)).toBe(true);
    expect(isPublishedProject({ ...project, images: [] })).toBe(false);
    expect(
      isPublishedProject({
        ...project,
        images: [{ ...project.images[0], assetType: 'illustrative-image' }]
      })
    ).toBe(false);
  });

  it('normalizes internal URLs for the current base path', () => {
    expect(withBasePath('/contactos/')).toContain('/contactos/');
    expect(absoluteUrl('/servicos/')).toContain('/servicos/');
  });
});
