import { companyInfo, contactDetails } from '@/data/company';
import { absoluteUrl } from '@/utils/validation';

export const getOrganizationSchema = () => {
  const hasConfirmedContacts =
    !contactDetails.phone.includes('[TELEFONE') && !contactDetails.email.includes('[EMAIL');

  if (!hasConfirmedContacts) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyInfo.legalName,
    url: absoluteUrl('/'),
    email: contactDetails.email,
    telephone: contactDetails.phone
  };
};

export const getLocalBusinessSchema = () => {
  const hasConfirmedContacts =
    !contactDetails.phone.includes('[TELEFONE') && !contactDetails.email.includes('[EMAIL');
  const hasConfirmedArea = !contactDetails.operationArea.includes('[ÁREA');

  if (!hasConfirmedContacts || !hasConfirmedArea) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: companyInfo.legalName,
    url: absoluteUrl('/'),
    telephone: contactDetails.phone,
    email: contactDetails.email,
    areaServed: contactDetails.operationArea
  };
};
