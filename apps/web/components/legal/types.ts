export interface LegalSection {
  title: string;
  content: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface LegalPageProps {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
  contactInfo: ContactInfo;
  locale: string;
}
