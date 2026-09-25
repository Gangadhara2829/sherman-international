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
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  normalizeWebsiteContent,
  NormalizedWebsiteContent,
  DEFAULT_HERO_CONTENT,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_VISION_MISSION,
  DEFAULT_CONTACT_INFO,
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
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'vision' | 'contact'>('hero');
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
  const [contactTitle, setContactTitle] = useState(normalizedInitial.contact.title);
  const [contactAddress, setContactAddress] = useState(normalizedInitial.contact.address);
  const [contactPhone, setContactPhone] = useState(normalizedInitial.contact.phone);
  const [contactPhoneSec, setContactPhoneSec] = useState(normalizedInitial.contact.phoneSecondary);
  const [contactEmail, setContactEmail] = useState(normalizedInitial.contact.email);
  const [contactHours, setContactHours] = useState(normalizedInitial.contact.workingHours);
  const [contactWhatsApp, setContactWhatsApp] = useState(normalizedInitial.contact.whatsapp);
  const [contactMapsUrl, setContactMapsUrl] = useState(normalizedInitial.contact.googleMapsUrl);

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

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'contact_info',
          section: 'contact',
          company: companyName.trim(),
          title: contactTitle.trim(),
          address: contactAddress.trim(),
          phone: contactPhone.trim(),
          phoneSecondary: contactPhoneSec.trim(),
          email: contactEmail.trim(),
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
      </div>

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
              placeholder="e.g., Strategic Channel Partner for Global Industrial Instrumentation & Equipment in India"
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

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Narrative Text (Paragraphs separated by blank lines)
            </label>
            <textarea
              rows={8}
              required
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600 leading-relaxed font-sans"
              placeholder="Detailed company background and capabilities..."
            />
          </div>

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

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
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

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
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
              <MapPin className="w-3.5 h-3.5 text-sherman-700" />
              <span>Registered Office Address</span>
            </label>
            <textarea
              rows={3}
              required
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600 leading-relaxed"
              placeholder="e.g., E-105, (10th Floor) Himalaya House, 23, Kasturba Gandhi Marg, New Delhi 110001, India"
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
                placeholder="011 23320623 or +91 11 4350 1200"
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
                placeholder="+91 98100 24890"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sherman-700" />
                <span>Email Correspondence</span>
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sherman-600"
                placeholder="admin@sherman-india.com"
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
                placeholder="+919810024890"
              />
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
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
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
    </div>
  );
}
