'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Building,
  Eye,
  Target,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  BarChart2,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import AboutPageEditor from '@/components/admin/AboutPageEditor';
import {
  normalizeWebsiteContent,
  NormalizedWebsiteContent,
  DEFAULT_HERO_CONTENT,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_VISION_MISSION,
  DEFAULT_CONTACT_INFO,
  DEFAULT_ABOUT_STATS,
  StatItemData,
} from '@/lib/content';

interface SiteContentItem {
  id: string;
  key: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  metadata: string | null;
  image: string | null;
}

export default function ContentManagerClient({
  initialContents,
}: {
  initialContents: SiteContentItem[];
}) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'about_page' | 'hero' | 'about' | 'vision' | 'contact' | 'stats'
  >('about_page');
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Normalize initial contents with fallbacks
  const normalizedInitial = normalizeWebsiteContent(initialContents);

  // Form State: 1. Hero Section
  const [heroTitle, setHeroTitle] = useState(normalizedInitial.hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(normalizedInitial.hero.subtitle);
  const [heroContent, setHeroContent] = useState(normalizedInitial.hero.content);
  const [heroImage, setHeroImage] = useState(normalizedInitial.hero.image);

  // Form State: 2. About Overview
  const [aboutTitle, setAboutTitle] = useState(normalizedInitial.about.title);
  const [aboutSubtitle, setAboutSubtitle] = useState(normalizedInitial.about.subtitle);
  const [aboutContent, setAboutContent] = useState(normalizedInitial.about.content);
  const [aboutImage, setAboutImage] = useState(normalizedInitial.about.image);

  // Form State: 3. Vision & Mission
  const [visionTitle, setVisionTitle] = useState(normalizedInitial.visionMission.title);
  const [visionSubtitle, setVisionSubtitle] = useState(normalizedInitial.visionMission.subtitle);
  const [visionText, setVisionText] = useState(normalizedInitial.visionMission.vision);
  const [missionText, setMissionText] = useState(normalizedInitial.visionMission.mission);

  // Form State: 4. Contact Information
  const [companyName, setCompanyName] = useState(normalizedInitial.contact.company);
  const [companyDescription, setCompanyDescription] = useState(
    normalizedInitial.contact.description || DEFAULT_CONTACT_INFO.description || ''
  );
  const [contactTitle, setContactTitle] = useState(normalizedInitial.contact.title);
  const [contactAddress, setContactAddress] = useState(normalizedInitial.contact.address);
  const [contactPhone, setContactPhone] = useState(normalizedInitial.contact.phone);
  const [contactPhoneSec, setContactPhoneSec] = useState(normalizedInitial.contact.phoneSecondary);
  const [contactEmail, setContactEmail] = useState(normalizedInitial.contact.email);
  const [enquiryEmail, setEnquiryEmail] = useState(
    normalizedInitial.contact.enquiryEmail || normalizedInitial.contact.email
  );
  const [technicalSupportEmail, setTechnicalSupportEmail] = useState(
    normalizedInitial.contact.technicalSupportEmail || ''
  );
  const [contactHours, setContactHours] = useState(normalizedInitial.contact.workingHours);
  const [contactWhatsApp, setContactWhatsApp] = useState(normalizedInitial.contact.whatsapp);
  const [contactMapsUrl, setContactMapsUrl] = useState(normalizedInitial.contact.googleMapsUrl);

  // Form State: 5. About Us Animated Statistics
  const initialStats = normalizedInitial.aboutStats || DEFAULT_ABOUT_STATS;
  const [statsBadge, setStatsBadge] = useState(initialStats.badge);
  const [statsHeading, setStatsHeading] = useState(initialStats.heading);
  const [statsIntro, setStatsIntro] = useState(initialStats.intro);
  const [statCards, setStatCards] = useState<StatItemData[]>(initialStats.items);

  const showSuccess = (msg: string) => {
    setSavedSuccess(msg);
    setErrorMessage(null);
    setTimeout(() => setSavedSuccess(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSavedSuccess(null);
  };

  // 1. Save Hero Section
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey('hero_section');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'hero_section',
          section: 'hero',
          title: heroTitle.trim(),
          subtitle: heroSubtitle.trim(),
          content: heroContent.trim(),
          image: heroImage.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save Hero section');

      showSuccess('Homepage Hero section updated successfully!');
    } catch (err: any) {
      showError(err.message || 'Error saving hero section');
    } finally {
      setSavingKey(null);
    }
  };

  // 2. Save About Section
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey('about_company');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'about_company',
          section: 'about',
          title: aboutTitle.trim(),
          subtitle: aboutSubtitle.trim(),
          content: aboutContent.trim(),
          image: aboutImage.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save About section');

      showSuccess('About Sherman Overview updated successfully!');
    } catch (err: any) {
      showError(err.message || 'Error saving about section');
    } finally {
      setSavingKey(null);
    }
  };

  // 3. Save Vision & Mission
  const handleSaveVision = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey('vision_mission');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'vision_mission',
          section: 'about',
          title: visionTitle.trim(),
          subtitle: visionSubtitle.trim(),
          vision: visionText.trim(),
          mission: missionText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save Vision & Mission');

      showSuccess('Vision & Mission statements saved successfully!');
    } catch (err: any) {
      showError(err.message || 'Error saving vision & mission');
    } finally {
      setSavingKey(null);
    }
  };

  // 4. Save Contact Information
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey('contact_info');
    setErrorMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (enquiryEmail && !emailRegex.test(enquiryEmail.trim())) {
      showError('Please enter a valid Enquiry Email address.');
      setSavingKey(null);
      return;
    }
    if (technicalSupportEmail && technicalSupportEmail.trim() && !emailRegex.test(technicalSupportEmail.trim())) {
      showError('Please enter a valid Technical Support Email address or leave it empty.');
      setSavingKey(null);
      return;
    }

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'contact_info',
          section: 'contact',
          company: companyName.trim(),
          description: companyDescription.trim() || undefined,
          title: contactTitle.trim(),
          address: contactAddress.trim(),
          phone: contactPhone.trim(),
          phoneSecondary: contactPhoneSec.trim(),
          email: enquiryEmail.trim() || contactEmail.trim(),
          enquiryEmail: enquiryEmail.trim() || contactEmail.trim(),
          technicalSupportEmail: technicalSupportEmail.trim() || null,
          workingHours: contactHours.trim(),
          whatsapp: contactWhatsApp.trim(),
          googleMapsUrl: contactMapsUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save Contact Info');

      showSuccess('Corporate Contact & Office details updated successfully!');
    } catch (err: any) {
      showError(err.message || 'Error saving contact information');
    } finally {
      setSavingKey(null);
    }
  };

  // 5. Save About Us Statistics
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey('about_stats');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'about_stats',
          section: 'about',
          badge: statsBadge.trim(),
          heading: statsHeading.trim(),
          intro: statsIntro.trim(),
          items: statCards.map((it, idx) => ({
            id: it.id || `stat-${idx + 1}`,
            target: typeof it.target === 'number' ? it.target : parseInt(it.target as any, 10) || 0,
            suffix: it.suffix || '',
            label: it.label.trim(),
            description: it.description.trim(),
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save About Statistics');

      showSuccess('About Us statistics & metrics updated successfully!');
    } catch (err: any) {
      showError(err.message || 'Error saving about statistics');
    } finally {
      setSavingKey(null);
    }
  };

  const handleAddStatCard = () => {
    setStatCards([
      ...statCards,
      {
        id: `stat-${Date.now()}`,
        target: 100,
        suffix: '+',
        label: 'New Statistic',
        description: 'Description of key operational or industrial metric',
      },
    ]);
  };

  const handleUpdateStatCard = (index: number, field: keyof StatItemData, value: any) => {
    setStatCards(
      statCards.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const handleRemoveStatCard = (index: number) => {
    if (statCards.length <= 1) {
      showError('At least one statistic card is required.');
      return;
    }
    setStatCards(statCards.filter((_, i) => i !== index));
  };

  const handleMoveStatCard = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= statCards.length) return;
    const copy = [...statCards];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setStatCards(copy);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="text-xs font-bold text-sherman-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Corporate CMS</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Website Content Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Edit headlines, narrative statements, Vision &amp; Mission, and corporate office details across the website.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 font-semibold shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2 font-semibold shadow-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('about_page')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'about_page'
              ? 'bg-sherman-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>About Us Page Editor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-sherman-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Homepage Hero Section
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'about'
              ? 'bg-sherman-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          About Sherman Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vision')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'vision'
              ? 'bg-sherman-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Vision &amp; Mission
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-sherman-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Office &amp; Contact Info
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-sherman-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          About Us Statistics
        </button>
      </div>

      {/* DEDICATED ABOUT US PAGE EDITOR */}
      {activeTab === 'about_page' && (
        <AboutPageEditor
          initialContents={initialContents}
          onGlobalSuccess={showSuccess}
          onGlobalError={showError}
        />
      )}

      {/* TAB 1: HERO SECTION */}
      {activeTab === 'hero' && (
        <form
          onSubmit={handleSaveHero}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in"
        >
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Homepage Hero Section</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure the primary headline, strategic partner tagline, introductory summary, and visual background.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Headline
            </label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
              placeholder="e.g., Engineering Solutions for Process & Industrial Applications"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subtitle / Strategic Tagline
            </label>
            <input
              type="text"
              required
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
              placeholder="e.g., Strategic Channel Partner & Engineering Solutions Provider"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Introduction Paragraph / Description
            </label>
            <textarea
              rows={4}
              required
              value={heroContent}
              onChange={(e) => setHeroContent(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600 leading-relaxed"
              placeholder="Provide a comprehensive summary of Sherman's engineering competencies..."
            />
          </div>

          <div>
            <ImageUpload
              value={heroImage}
              onChange={(url) => setHeroImage(url)}
              folder="general"
              label="Hero Visual Asset"
              helperText="Upload a high-resolution industrial visual or enter an image path (JPG, PNG, WEBP)"
              required={false}
              aspectRatio="video"
            />
          </div>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-3 pb-1 border-t border-slate-100 flex items-center justify-between z-10">
            <span className="text-[11px] text-slate-400">Hero section saves directly to database</span>
            <button
              type="submit"
              disabled={savingKey === 'hero_section'}
              className="px-6 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingKey === 'hero_section' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Hero Content...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Hero Content</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: ABOUT SHERMAN OVERVIEW */}
      {activeTab === 'about' && (
        <form
          onSubmit={handleSaveAbout}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in"
        >
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">About Sherman Overview</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage the core company narrative displayed on the homepage About section and dedicated About Us page.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Section Title
            </label>
            <input
              type="text"
              required
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
              placeholder="e.g., About Sherman"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              required
              value={aboutSubtitle}
              onChange={(e) => setAboutSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
              placeholder="e.g., Trusted Engineering Solutions Provider in India"
            />
          </div>

          <RichTextEditor
            label="Full Narrative Text"
            helperText="Format your company background, headings, bold statements, bullet lists, alignments, and font sizes. Changes save directly to the database."
            value={aboutContent}
            onChange={(val) => setAboutContent(val)}
            minHeight="320px"
          />

          <div>
            <ImageUpload
              value={aboutImage}
              onChange={(url) => setAboutImage(url)}
              folder="general"
              label="About Section Visual / Facility Photo"
              helperText="Upload an image representing Sherman's technical operations or office (JPG, PNG, WEBP)"
              required={false}
              aspectRatio="video"
            />
          </div>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-3 pb-1 border-t border-slate-100 flex items-center justify-between z-10">
            <span className="text-[11px] text-slate-400">About section saves directly to database</span>
            <button
              type="submit"
              disabled={savingKey === 'about_company'}
              className="px-6 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingKey === 'about_company' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving About Content...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save About Content</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: VISION & MISSION */}
      {activeTab === 'vision' && (
        <form
          onSubmit={handleSaveVision}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in"
        >
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Vision &amp; Mission Statements</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update company principles, customer commitment, and long-term industrial aspirations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Section Heading
              </label>
              <input
                type="text"
                required
                value={visionTitle}
                onChange={(e) => setVisionTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="Vision and Mission"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subtitle (Optional)
              </label>
              <input
                type="text"
                value={visionSubtitle}
                onChange={(e) => setVisionSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="Our Guiding Principles & Commitments"
              />
            </div>
          </div>

          {/* Vision Statement */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Eye className="w-4 h-4 text-sherman-700" />
              <span>Our Vision</span>
            </div>
            <textarea
              rows={4}
              required
              value={visionText}
              onChange={(e) => setVisionText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sherman-600 leading-relaxed"
              placeholder="Enter corporate vision statement..."
            />
          </div>

          {/* Mission Statement */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Target className="w-4 h-4 text-sherman-700" />
              <span>Our Mission</span>
            </div>
            <textarea
              rows={4}
              required
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sherman-600 leading-relaxed"
              placeholder="Enter corporate mission statement..."
            />
          </div>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-3 pb-1 border-t border-slate-100 flex items-center justify-between z-10">
            <span className="text-[11px] text-slate-400">Vision &amp; Mission statements save directly to database</span>
            <button
              type="submit"
              disabled={savingKey === 'vision_mission'}
              className="px-6 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingKey === 'vision_mission' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Vision &amp; Mission...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Vision &amp; Mission</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: OFFICE & CONTACT INFO */}
      {activeTab === 'contact' && (
        <form
          onSubmit={handleSaveContact}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in"
        >
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Corporate Office &amp; Contact Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage registered company name, office address, contact numbers, email addresses, and map coordinates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sherman-700" />
                <span>Company Legal Name</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="Sherman International (P) Limited"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Section / Desk Heading
              </label>
              <input
                type="text"
                value={contactTitle}
                onChange={(e) => setContactTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="Corporate Headquarters & Registered Office"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <span>Company Description / Footer Summary</span>
            </label>
            <textarea
              rows={2}
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600 leading-relaxed"
              placeholder="Brief summary of company operations shown in website footer..."
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Synchronized automatically as the company introductory summary in the global website footer.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sherman-700" />
              <span>Registered Office Address</span>
            </label>
            <textarea
              rows={3}
              required
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600 leading-relaxed"
              placeholder="e.g., D-94, 9th Floor, Himalaya House, 23 K.G. Marg, New Delhi – 110001"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sherman-700" />
                <span>Primary Telephone / Landline</span>
              </label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="+91 90151 22200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sherman-700" />
                <span>Secondary Phone / Mobile</span>
              </label>
              <input
                type="text"
                value={contactPhoneSec}
                onChange={(e) => setContactPhoneSec(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="+91 90151 22200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sherman-700" />
                <span>Enquiry Email (Customer Notifications)</span>
              </label>
              <input
                type="email"
                required
                value={enquiryEmail}
                onChange={(e) => setEnquiryEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="admin@sherman-india.com"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Receives submissions from Contact Us, Product Enquiry &amp; Request a Quote forms.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>Technical Support Email (Optional)</span>
              </label>
              <input
                type="email"
                value={technicalSupportEmail}
                onChange={(e) => setTechnicalSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="Leave blank if unset"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Shown under Technical Support Desk on Contact page if specified; kept unset otherwise.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sherman-700" />
                <span>Working / Business Hours</span>
              </label>
              <input
                type="text"
                value={contactHours}
                onChange={(e) => setContactHours(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="Monday to Friday: 9:30 AM – 6:00 PM IST"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Contact Number</span>
              </label>
              <input
                type="text"
                value={contactWhatsApp}
                onChange={(e) => setContactWhatsApp(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="+919015122200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google Maps Embed URL
            </label>
            <input
              type="text"
              value={contactMapsUrl}
              onChange={(e) => setContactMapsUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600 text-slate-600 font-mono text-[11px]"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-3 pb-1 border-t border-slate-100 flex items-center justify-between z-10">
            <span className="text-[11px] text-slate-400">Contact information saves directly to database</span>
            <button
              type="submit"
              disabled={savingKey === 'contact_info'}
              className="px-6 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingKey === 'contact_info' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Contact Information...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Contact Information</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: ABOUT US ANIMATED STATISTICS */}
      {activeTab === 'stats' && (
        <form
          onSubmit={handleSaveStats}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in"
        >
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">About Us Statistics — "Some Cool Facts"</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure the numbers, metrics, labels, and introductory text displayed in the animated count-up section on the About page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStatCard}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-sherman-700" />
              <span>Add Metric Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Badge / Tagline
              </label>
              <input
                type="text"
                required
                value={statsBadge}
                onChange={(e) => setStatsBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="Some Cool Facts"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Section Headline
              </label>
              <input
                type="text"
                required
                value={statsHeading}
                onChange={(e) => setStatsHeading(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="Numbers Speak for Themselves"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Introductory Narrative
            </label>
            <textarea
              rows={2}
              required
              value={statsIntro}
              onChange={(e) => setStatsIntro(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600 leading-relaxed"
              placeholder="A quantifiable proven track record built on precision engineering..."
            />
          </div>

          {/* Cards List */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Metric Cards ({statCards.length})
            </h3>

            <div className="space-y-4">
              {statCards.map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <span className="text-xs font-bold text-sherman-800">
                      Card #{idx + 1}: {card.label || 'Untitled Metric'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveStatCard(idx, 'up')}
                        title="Move Up"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === statCards.length - 1}
                        onClick={() => handleMoveStatCard(idx, 'down')}
                        title="Move Down"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveStatCard(idx)}
                        title="Delete Card"
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-100 cursor-pointer ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Target Value (Number)
                      </label>
                      <input
                        type="number"
                        required
                        value={card.target}
                        onChange={(e) =>
                          handleUpdateStatCard(idx, 'target', parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sherman-600 font-mono"
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Suffix Symbol (Optional)
                      </label>
                      <input
                        type="text"
                        value={card.suffix}
                        onChange={(e) => handleUpdateStatCard(idx, 'suffix', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sherman-600"
                        placeholder="e.g. + or %"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Metric Label
                      </label>
                      <input
                        type="text"
                        required
                        value={card.label}
                        onChange={(e) => handleUpdateStatCard(idx, 'label', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sherman-600 font-bold"
                        placeholder="e.g. Products"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Supporting Description
                    </label>
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => handleUpdateStatCard(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sherman-600 leading-relaxed"
                      placeholder="Brief context explaining the metric..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-3 pb-1 border-t border-slate-100 flex items-center justify-between z-10">
            <span className="text-[11px] text-slate-400">Statistics save to database and update About page</span>
            <button
              type="submit"
              disabled={savingKey === 'about_stats'}
              className="px-6 py-2.5 rounded-xl bg-sherman-700 hover:bg-sherman-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingKey === 'about_stats' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving About Statistics...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save About Statistics</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
