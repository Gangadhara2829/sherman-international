/**
 * Centralized Content Normalization & Fallback Architecture
 * Safely parses legacy stringified JSON, structured objects, and provides
 * original Sherman International default content when DB records are empty.
 */

export interface NormalizedHeroContent {
  title: string;
  subtitle: string;
  content: string;
  image: string;
}

export interface NormalizedAboutContent {
  title: string;
  subtitle: string;
  content: string;
  image: string;
}

export interface NormalizedVisionMission {
  title: string;
  subtitle: string;
  vision: string;
  mission: string;
}

export interface NormalizedContactInfo {
  company: string;
  title: string;
  address: string;
  phone: string;
  phoneSecondary: string;
  email: string;
  workingHours: string;
  whatsapp: string;
  googleMapsUrl: string;
}

export interface NormalizedWebsiteContent {
  hero: NormalizedHeroContent;
  about: NormalizedAboutContent;
  visionMission: NormalizedVisionMission;
  contact: NormalizedContactInfo;
}

// 1. DEFAULT AUTHENTIC CONTENT FROM ORIGINAL SHERMAN INDIA WEBSITE
export const DEFAULT_HERO_CONTENT: NormalizedHeroContent = {
  title: 'Engineering Solutions for Process & Industrial Applications',
  subtitle: 'Strategic Channel Partner for Global Industrial Instrumentation & Equipment in India',
  content:
    'Sherman International (P) Limited provides specialized technical representation, system integration, customization, and turnkey project execution across flow measurement, combustion control, dynamic balancing machines, and railway electrification.',
  image: '/images/original/home_1c3412a0fec94c2197c237bebf94896a.jpg',
};

export const DEFAULT_ABOUT_CONTENT: NormalizedAboutContent = {
  title: 'About Sherman',
  subtitle: 'Trusted Engineering Solutions Provider in India',
  content: `Sherman International Pvt. Ltd. is a trusted and forward-looking engineering solutions provider, acting as a strategic bridge between leading global manufacturers and the Indian industry. We specialize in representation, distribution, system integration, customization, and turnkey project execution across a wide range of industrial applications.

Backed by a team of experienced and innovative technocrats, we work in close collaboration with our principals to deliver high-performance solutions that enhance operational efficiency, reduce costs, and ensure the highest standards of safety and reliability. Our expertise extends beyond product supply to include technical consulting, system optimization, auditing, and after-sales support—enabling our customers to achieve sustainable and long-term success.

With a proven track record, Sherman has built strong partnerships with some of India's most prominent industrial organizations. Our commitment to quality, precision, and customer satisfaction makes us a preferred partner for advanced engineering solutions.`,
  image: '/images/original/about-us_541751abb3a9405ea2202d760070adee.jpg',
};

export const DEFAULT_VISION_MISSION: NormalizedVisionMission = {
  title: 'Vision and Mission',
  subtitle: 'Our Guiding Principles & Commitments',
  vision:
    'To be the leading provider of cutting-edge products and solutions in the fields of flow measurement, process control, analytical instrumentation, combustion technology, automation, and project documentation expertise in India, by bringing together the best industrial experts and providing the highest level of customer service.',
  mission:
    "Our mission is to help our customers achieve their business objectives by offering the best possible and techno-commercially advantageous solutions. We do this by partnering with top companies in the industry, leveraging our team's expertise in project documentation, and providing exceptional pre-sales and after-sales support. We are committed to excellence in all that we do and strive to build long-term relationships with our customers based on trust, integrity, and mutual success.",
};

export const DEFAULT_CONTACT_INFO: NormalizedContactInfo = {
  company: 'Sherman International (P) Limited',
  title: 'Corporate Headquarters & Registered Office',
  address: 'E-105, (10th Floor) Himalaya House, 23, Kasturba Gandhi Marg, New Delhi 110001, India',
  phone: '011 23320623',
  phoneSecondary: '+91 98100 24890',
  email: 'admin@sherman-india.com',
  workingHours: 'Monday to Friday: 9:30 AM – 6:00 PM IST',
  whatsapp: '+919810024890',
  googleMapsUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2694119939527!2d77.2215682!3d28.6217148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd369a48be43%3A0x6b4beec892e85093!2sHimalaya%20House%2C%2023%2C%20Kasturba%20Gandhi%20Marg%2C%20Connaught%20Lane%2C%20Barakhamba%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
};

/**
 * Safely parses any database field that might contain stringified JSON,
 * an object, plain string, null or undefined.
 */
export function parseContentValue(value: any): any {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

/**
 * Normalizes Hero Section content from SiteContent record.
 */
export function normalizeHeroContent(rawRecord?: any): NormalizedHeroContent {
  if (!rawRecord) return { ...DEFAULT_HERO_CONTENT };

  const parsedContent = parseContentValue(rawRecord.content);
  const parsedMeta = parseContentValue(rawRecord.metadata) || {};

  let contentText = DEFAULT_HERO_CONTENT.content;
  if (typeof parsedContent === 'string' && parsedContent.trim()) {
    contentText = parsedContent.trim();
  } else if (parsedContent && typeof parsedContent === 'object' && parsedContent.content) {
    contentText = parsedContent.content;
  }

  return {
    title: rawRecord.title?.trim() || DEFAULT_HERO_CONTENT.title,
    subtitle: rawRecord.subtitle?.trim() || DEFAULT_HERO_CONTENT.subtitle,
    content: contentText,
    image: rawRecord.image?.trim() || parsedMeta.image || DEFAULT_HERO_CONTENT.image,
  };
}

/**
 * Normalizes About Section content from SiteContent record.
 */
export function normalizeAboutContent(rawRecord?: any): NormalizedAboutContent {
  if (!rawRecord) return { ...DEFAULT_ABOUT_CONTENT };

  const parsedContent = parseContentValue(rawRecord.content);
  const parsedMeta = parseContentValue(rawRecord.metadata) || {};

  let contentText = DEFAULT_ABOUT_CONTENT.content;
  if (typeof parsedContent === 'string' && parsedContent.trim()) {
    contentText = parsedContent.trim();
  } else if (parsedContent && typeof parsedContent === 'object' && parsedContent.content) {
    contentText = parsedContent.content;
  }

  return {
    title: rawRecord.title?.trim() || DEFAULT_ABOUT_CONTENT.title,
    subtitle: rawRecord.subtitle?.trim() || DEFAULT_ABOUT_CONTENT.subtitle,
    content: contentText,
    image: rawRecord.image?.trim() || parsedMeta.image || DEFAULT_ABOUT_CONTENT.image,
  };
}

/**
 * Normalizes Vision & Mission from SiteContent record.
 * Correctly extracts individual vision and mission fields even if stored as JSON string.
 */
export function normalizeVisionMission(rawRecord?: any): NormalizedVisionMission {
  if (!rawRecord) return { ...DEFAULT_VISION_MISSION };

  const parsedContent = parseContentValue(rawRecord.content);
  const parsedMeta = parseContentValue(rawRecord.metadata) || {};

  let vision = DEFAULT_VISION_MISSION.vision;
  let mission = DEFAULT_VISION_MISSION.mission;

  if (parsedContent && typeof parsedContent === 'object') {
    if (parsedContent.vision && typeof parsedContent.vision === 'string') {
      vision = parsedContent.vision.trim();
    }
    if (parsedContent.mission && typeof parsedContent.mission === 'string') {
      mission = parsedContent.mission.trim();
    }
  } else if (typeof parsedContent === 'string' && parsedContent.trim()) {
    // If raw string without JSON structure
    vision = parsedContent.trim();
  }

  // Also check metadata if present
  if (parsedMeta.vision) vision = parsedMeta.vision;
  if (parsedMeta.mission) mission = parsedMeta.mission;

  return {
    title: rawRecord.title?.trim() || DEFAULT_VISION_MISSION.title,
    subtitle: rawRecord.subtitle?.trim() || DEFAULT_VISION_MISSION.subtitle,
    vision,
    mission,
  };
}

/**
 * Normalizes Office & Contact Information from SiteContent record.
 * Correctly extracts company, address, phone, email, etc., avoiding raw JSON strings.
 */
export function normalizeContactInfo(rawRecord?: any): NormalizedContactInfo {
  if (!rawRecord) return { ...DEFAULT_CONTACT_INFO };

  const parsedContent = parseContentValue(rawRecord.content);
  const parsedMeta = parseContentValue(rawRecord.metadata) || {};

  let company = DEFAULT_CONTACT_INFO.company;
  let address = DEFAULT_CONTACT_INFO.address;
  let phone = DEFAULT_CONTACT_INFO.phone;
  let phoneSecondary = DEFAULT_CONTACT_INFO.phoneSecondary;
  let email = DEFAULT_CONTACT_INFO.email;
  let workingHours = DEFAULT_CONTACT_INFO.workingHours;
  let whatsapp = DEFAULT_CONTACT_INFO.whatsapp;
  let googleMapsUrl = DEFAULT_CONTACT_INFO.googleMapsUrl;

  if (parsedContent && typeof parsedContent === 'object') {
    if (parsedContent.company) company = parsedContent.company;
    if (parsedContent.address) address = parsedContent.address;
    if (parsedContent.phone) phone = parsedContent.phone;
    if (parsedContent.phoneSecondary) phoneSecondary = parsedContent.phoneSecondary;
    if (parsedContent.email) email = parsedContent.email;
    if (parsedContent.workingHours) workingHours = parsedContent.workingHours;
    if (parsedContent.whatsapp) whatsapp = parsedContent.whatsapp;
    if (parsedContent.googleMapsUrl) googleMapsUrl = parsedContent.googleMapsUrl;
  } else if (typeof parsedContent === 'string' && parsedContent.trim()) {
    address = parsedContent.trim();
  }

  // Check metadata overrides
  if (parsedMeta.company) company = parsedMeta.company;
  if (parsedMeta.address) address = parsedMeta.address;
  if (parsedMeta.phone) phone = parsedMeta.phone;
  if (parsedMeta.phoneSecondary) phoneSecondary = parsedMeta.phoneSecondary;
  if (parsedMeta.email) email = parsedMeta.email;
  if (parsedMeta.workingHours) workingHours = parsedMeta.workingHours;
  if (parsedMeta.whatsapp) whatsapp = parsedMeta.whatsapp;
  if (parsedMeta.googleMapsUrl) googleMapsUrl = parsedMeta.googleMapsUrl;

  return {
    company,
    title: rawRecord.title?.trim() || DEFAULT_CONTACT_INFO.title,
    address,
    phone,
    phoneSecondary,
    email,
    workingHours,
    whatsapp,
    googleMapsUrl,
  };
}

/**
 * Normalizes all website content array from DB query or API response.
 */
export function normalizeWebsiteContent(rawContents: any[]): NormalizedWebsiteContent {
  const contents = Array.isArray(rawContents) ? rawContents : [];

  const heroRecord = contents.find((c) => c.key === 'hero_section');
  const aboutRecord =
    contents.find((c) => c.key === 'about_company') ||
    contents.find((c) => c.key === 'about_overview') ||
    contents.find((c) => c.section === 'about' && c.key !== 'vision_mission' && c.key !== 'company_history');
  const visionRecord = contents.find((c) => c.key === 'vision_mission');
  const contactRecord = contents.find((c) => c.key === 'contact_info');

  return {
    hero: normalizeHeroContent(heroRecord),
    about: normalizeAboutContent(aboutRecord),
    visionMission: normalizeVisionMission(visionRecord),
    contact: normalizeContactInfo(contactRecord),
  };
}
