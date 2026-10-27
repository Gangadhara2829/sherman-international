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
  description?: string;
  address: string;
  phone: string;
  phoneSecondary: string;
  email: string;
  enquiryEmail: string;
  technicalSupportEmail?: string | null;
  workingHours: string;
  whatsapp: string;
  googleMapsUrl: string;
}

export interface StatItemData {
  id: string;
  target: number;
  suffix: string;
  label: string;
  description: string;
}

export interface NormalizedAboutStats {
  badge: string;
  heading: string;
  intro: string;
  items: StatItemData[];
}

export interface NormalizedWebsiteContent {
  hero: NormalizedHeroContent;
  about: NormalizedAboutContent;
  visionMission: NormalizedVisionMission;
  contact: NormalizedContactInfo;
  aboutStats?: NormalizedAboutStats;
}

// 1. DEFAULT AUTHENTIC CONTENT FROM ORIGINAL SHERMAN INDIA WEBSITE
export const DEFAULT_HERO_CONTENT: NormalizedHeroContent = {
  title: 'Engineering Solutions for Process & Industrial Applications',
  subtitle: 'Strategic Channel Partner & Engineering Solutions Provider',
  content:
    'Sherman International (P) Limited provides specialized technical representation, system integration, customization, and turnkey project execution across flow measurement, combustion control, dynamic balancing machines, and railway electrification.',
  image: '/images/original/home_1c3412a0fec94c2197c237bebf94896a.jpg',
};

export const DEFAULT_ABOUT_CONTENT: NormalizedAboutContent = {
  title: 'About Sherman',
  subtitle: 'Trusted Engineering Solutions Provider',
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
  description:
    'Sherman International (P) Limited is a strategic bridge between leading global manufacturers and the Indian industry, delivering cutting-edge flow measurement, combustion systems, dynamic balancing, and railway electrification solutions.',
  address: 'D-94, 9th Floor, Himalaya House, 23 K.G. Marg, New Delhi – 110001',
  phone: '+91 90151 22200',
  phoneSecondary: '+91 90151 22200',
  email: 'admin@sherman-india.com',
  enquiryEmail: 'admin@sherman-india.com',
  technicalSupportEmail: null,
  workingHours: 'Monday to Friday: 9:30 AM – 6:00 PM IST',
  whatsapp: '+919015122200',
  googleMapsUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2694119939527!2d77.2215682!3d28.6217148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd369a48be43%3A0x6b4beec892e85093!2sHimalaya%20House%2C%2023%2C%20Kasturba%20Gandhi%20Marg%2C%20Connaught%20Lane%2C%20Barakhamba%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
};

export const DEFAULT_ABOUT_STATS: NormalizedAboutStats = {
  badge: 'Some Cool Facts',
  heading: 'Numbers Speak for Themselves',
  intro:
    'A quantifiable proven track record built on precision engineering, long-term industrial partnerships, and relentless execution quality.',
  items: [
    {
      id: 'products',
      target: 150,
      suffix: '',
      label: 'Products',
      description: 'High-precision industrial instrumentation & engineered components',
    },
    {
      id: 'experience',
      target: 45,
      suffix: '',
      label: 'Years of Experience',
      description: 'Decades of deep technocrat domain knowledge & execution expertise',
    },
    {
      id: 'projects',
      target: 900,
      suffix: '+',
      label: 'Completed Projects',
      description: 'Successful multi-sector engineering installations & turnkey deliveries',
    },
  ],
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
  let description = DEFAULT_CONTACT_INFO.description;
  let address = DEFAULT_CONTACT_INFO.address;
  let phone = DEFAULT_CONTACT_INFO.phone;
  let phoneSecondary = DEFAULT_CONTACT_INFO.phoneSecondary;
  let email = DEFAULT_CONTACT_INFO.email;
  let enquiryEmail = DEFAULT_CONTACT_INFO.enquiryEmail;
  let technicalSupportEmail: string | null = DEFAULT_CONTACT_INFO.technicalSupportEmail ?? null;
  let workingHours = DEFAULT_CONTACT_INFO.workingHours;
  let whatsapp = DEFAULT_CONTACT_INFO.whatsapp;
  let googleMapsUrl = DEFAULT_CONTACT_INFO.googleMapsUrl;

  if (parsedContent && typeof parsedContent === 'object') {
    if (parsedContent.company) company = parsedContent.company;
    if (parsedContent.description) description = parsedContent.description;
    if (parsedContent.address) address = parsedContent.address;
    if (parsedContent.phone) phone = parsedContent.phone;
    if (parsedContent.phoneSecondary) phoneSecondary = parsedContent.phoneSecondary;
    if (parsedContent.email) email = parsedContent.email;
    if (parsedContent.enquiryEmail) enquiryEmail = parsedContent.enquiryEmail;
    if (parsedContent.technicalSupportEmail !== undefined) {
      technicalSupportEmail = parsedContent.technicalSupportEmail ? parsedContent.technicalSupportEmail.trim() : null;
    }
    if (parsedContent.workingHours) workingHours = parsedContent.workingHours;
    if (parsedContent.whatsapp) whatsapp = parsedContent.whatsapp;
    if (parsedContent.googleMapsUrl) googleMapsUrl = parsedContent.googleMapsUrl;
  } else if (typeof parsedContent === 'string' && parsedContent.trim()) {
    address = parsedContent.trim();
  }

  // Check metadata overrides
  if (parsedMeta.company) company = parsedMeta.company;
  if (parsedMeta.description) description = parsedMeta.description;
  if (parsedMeta.address) address = parsedMeta.address;
  if (parsedMeta.phone) phone = parsedMeta.phone;
  if (parsedMeta.phoneSecondary) phoneSecondary = parsedMeta.phoneSecondary;
  if (parsedMeta.email) email = parsedMeta.email;
  if (parsedMeta.enquiryEmail) enquiryEmail = parsedMeta.enquiryEmail;
  if (parsedMeta.technicalSupportEmail !== undefined) {
    technicalSupportEmail = parsedMeta.technicalSupportEmail ? parsedMeta.technicalSupportEmail.trim() : null;
  }
  if (parsedMeta.workingHours) workingHours = parsedMeta.workingHours;
  if (parsedMeta.whatsapp) whatsapp = parsedMeta.whatsapp;
  if (parsedMeta.googleMapsUrl) googleMapsUrl = parsedMeta.googleMapsUrl;

  // Ensure enquiryEmail defaults to email if not explicitly set
  if (!enquiryEmail || !enquiryEmail.trim()) {
    enquiryEmail = email || DEFAULT_CONTACT_INFO.enquiryEmail;
  }

  return {
    company,
    title: rawRecord.title?.trim() || DEFAULT_CONTACT_INFO.title,
    description,
    address,
    phone,
    phoneSecondary,
    email,
    enquiryEmail: enquiryEmail.trim(),
    technicalSupportEmail: technicalSupportEmail && technicalSupportEmail.trim() ? technicalSupportEmail.trim() : null,
    workingHours,
    whatsapp,
    googleMapsUrl,
  };
}

/**
 * Normalizes About Us Animated Statistics from SiteContent record.
 */
export function normalizeAboutStats(rawRecord?: any): NormalizedAboutStats {
  if (!rawRecord) return { ...DEFAULT_ABOUT_STATS };

  const parsedContent = parseContentValue(rawRecord.content);
  const parsedMeta = parseContentValue(rawRecord.metadata) || {};

  const badge = parsedMeta.badge || rawRecord.subtitle?.trim() || DEFAULT_ABOUT_STATS.badge;
  const heading = parsedMeta.heading || rawRecord.title?.trim() || DEFAULT_ABOUT_STATS.heading;
  const intro =
    typeof parsedContent === 'string' && parsedContent.trim()
      ? parsedContent.trim()
      : typeof parsedMeta.intro === 'string'
      ? parsedMeta.intro
      : DEFAULT_ABOUT_STATS.intro;

  let items: StatItemData[] = DEFAULT_ABOUT_STATS.items;
  if (Array.isArray(parsedMeta.items) && parsedMeta.items.length > 0) {
    items = parsedMeta.items.map((it: any, idx: number) => ({
      id: it.id || `stat-${idx + 1}`,
      target: typeof it.target === 'number' ? it.target : parseInt(it.target, 10) || 0,
      suffix: typeof it.suffix === 'string' ? it.suffix : '',
      label: it.label?.trim() || `Stat ${idx + 1}`,
      description: it.description?.trim() || '',
    }));
  }

  return {
    badge,
    heading,
    intro,
    items,
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
  const statsRecord = contents.find((c) => c.key === 'about_stats');

  return {
    hero: normalizeHeroContent(heroRecord),
    about: normalizeAboutContent(aboutRecord),
    visionMission: normalizeVisionMission(visionRecord),
    contact: normalizeContactInfo(contactRecord),
    aboutStats: normalizeAboutStats(statsRecord),
  };
}

export interface CompleteAboutSectionItem {
  heading: string;
  subheading?: string;
  content: string;
}

export interface CompleteAboutPageData {
  hero: {
    title: string;
    subtitle: string;
    lead: string;
  };
  overview: CompleteAboutSectionItem;
  expertise: CompleteAboutSectionItem;
  approach: CompleteAboutSectionItem;
  closing: {
    statement: string;
  };
  stats: NormalizedAboutStats;
  visionMission: {
    visionEyebrow: string;
    visionTitle: string;
    vision: string;
    missionEyebrow: string;
    missionTitle: string;
    mission: string;
  };
}

export const DEFAULT_COMPLETE_ABOUT_PAGE: CompleteAboutPageData = {
  hero: {
    title: 'About Sherman',
    subtitle: 'Trusted Engineering Solutions Provider',
    lead:
      'Industrial technology and solutions company working with leading global technology providers to bring advanced products, engineering expertise, and application-driven solutions to customers across the industrial sector.',
  },
  overview: {
    heading: 'Trusted Engineering Solutions Provider',
    content: `<p>Sherman is an industrial technology and solutions company, working with leading global technology providers to bring advanced products, engineering expertise, and application-driven solutions to customers across the industrial sector.</p><p>Our portfolio spans flow measurement, process control, analytical instrumentation, combustion technology, automation, and other critical industrial applications. Through our strong relationships with internationally recognized technology companies, we provide access to proven technologies and high-quality products, backed by the technical expertise required to apply them effectively.</p><p>At Sherman, we believe that delivering the right solution goes beyond supplying equipment. Our team brings together professionals with strong technical and industry experience, enabling us to understand our customers’ applications, processes, and project requirements. We provide technical and pre-sales support to help identify solutions that are technically appropriate, operationally reliable, and commercially sound.</p><p>Our involvement continues beyond the point of supply. Through comprehensive after-sales support and service, we work closely with our customers to ensure reliable operation, long-term performance, and maximum value from their investments.</p>`,
  },
  expertise: {
    heading: 'Project & Engineering Expertise',
    content: `<p>Sherman also brings significant expertise in project execution and engineering support, particularly in collaboration with EPC contractors and industrial project organizations.</p><p>Our experienced teams have supported projects through various EPC portals and execution platforms, managing and coordinating the required technical drawings, documentation, submissions, and project deliverables. This experience allows us to effectively bridge technology, engineering requirements, and project execution.</p>`,
  },
  approach: {
    heading: 'Our Approach',
    content: `<p>Sherman brings together expertise from multiple industrial disciplines to develop technically robust, application-focused, and commercially viable solutions.</p><p>We take the time to understand the complete requirement—whether it is a process challenge, a specific application, a project specification, or a broader system requirement—and then bring together the appropriate technologies, products, and expertise to address it.</p><p>Our strength lies in combining global technology, local expertise, engineering understanding, and project experience to create meaningful value for our customers.</p><p>With established relationships across the global industrial technology ecosystem and a strong focus on technical excellence, project execution, and customer support, Sherman is committed to being a dependable technology and solutions company for the industries we serve.</p>`,
  },
  closing: {
    statement: 'Sherman — Technology. Expertise. Solutions.',
  },
  stats: DEFAULT_ABOUT_STATS,
  visionMission: {
    visionEyebrow: 'Guiding Principle',
    visionTitle: 'Our Vision',
    vision: DEFAULT_VISION_MISSION.vision,
    missionEyebrow: 'Core Commitment',
    missionTitle: 'Our Mission',
    mission: DEFAULT_VISION_MISSION.mission,
  },
};

/**
 * Normalizes all About Us page sections from DB records.
 * Falls back gracefully to authentic defaults without ever showing empty fields.
 */
export function normalizeCompleteAboutPage(rawContents: any[]): CompleteAboutPageData {
  const contents = Array.isArray(rawContents) ? rawContents : [];

  const heroRecord =
    contents.find((c) => c.key === 'about_hero') ||
    contents.find((c) => c.key === 'about_company') ||
    contents.find((c) => c.key === 'about_overview');

  const overviewRecord = contents.find((c) => c.key === 'about_overview');
  const expertiseRecord = contents.find((c) => c.key === 'about_expertise');
  const approachRecord = contents.find((c) => c.key === 'about_approach');
  const closingRecord = contents.find((c) => c.key === 'about_closing');
  const statsRecord = contents.find((c) => c.key === 'about_stats');
  const visionRecord = contents.find((c) => c.key === 'vision_mission');

  // Hero Section
  const parsedHeroMeta = parseContentValue(heroRecord?.metadata) || {};
  const heroTitle = heroRecord?.title?.trim() || DEFAULT_COMPLETE_ABOUT_PAGE.hero.title;
  const heroSubtitle = heroRecord?.subtitle?.trim() || DEFAULT_COMPLETE_ABOUT_PAGE.hero.subtitle;
  const heroLead =
    parsedHeroMeta.lead ||
    (typeof heroRecord?.content === 'string' && heroRecord.content.length < 500 && !heroRecord.content.includes('<p>')
      ? heroRecord.content.trim()
      : DEFAULT_COMPLETE_ABOUT_PAGE.hero.lead);

  // Overview Section
  const overviewHeading =
    overviewRecord?.title?.trim() || DEFAULT_COMPLETE_ABOUT_PAGE.overview.heading;
  const overviewContent =
    overviewRecord?.content?.trim() || DEFAULT_COMPLETE_ABOUT_PAGE.overview.content;

  // Expertise Section
  const expertiseHeading =
    expertiseRecord?.title?.trim() || DEFAULT_COMPLETE_ABOUT_PAGE.expertise.heading;
  const expertiseContent =
    expertiseRecord?.content?.trim() || DEFAULT_COMPLETE_ABOUT_PAGE.expertise.content;

  // Approach Section
  const approachHeading =
    approachRecord?.title?.trim() || DEFAULT_COMPLETE_ABOUT_PAGE.approach.heading;
  const approachContent =
    approachRecord?.content?.trim() || DEFAULT_COMPLETE_ABOUT_PAGE.approach.content;

  // Closing Brand Statement
  const closingStatement =
    closingRecord?.title?.trim() ||
    closingRecord?.content?.trim() ||
    DEFAULT_COMPLETE_ABOUT_PAGE.closing.statement;

  // Statistics
  const stats = normalizeAboutStats(statsRecord);

  // Vision & Mission
  const baseVm = normalizeVisionMission(visionRecord);
  const parsedVmMeta = parseContentValue(visionRecord?.metadata) || {};

  return {
    hero: {
      title: heroTitle,
      subtitle: heroSubtitle,
      lead: heroLead,
    },
    overview: {
      heading: overviewHeading,
      content: overviewContent,
    },
    expertise: {
      heading: expertiseHeading,
      content: expertiseContent,
    },
    approach: {
      heading: approachHeading,
      content: approachContent,
    },
    closing: {
      statement: closingStatement,
    },
    stats,
    visionMission: {
      visionEyebrow: parsedVmMeta.visionEyebrow || 'Guiding Principle',
      visionTitle: parsedVmMeta.visionTitle || 'Our Vision',
      vision: baseVm.vision,
      missionEyebrow: parsedVmMeta.missionEyebrow || 'Core Commitment',
      missionTitle: parsedVmMeta.missionTitle || 'Our Mission',
      mission: baseVm.mission,
    },
  };
}

