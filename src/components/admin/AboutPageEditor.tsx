'use client';

import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Sparkles,
  AlertCircle,
  FileText,
  Wrench,
  Layers,
  Award,
  Eye,
  Target,
  BarChart2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Info,
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import {
  CompleteAboutPageData,
  DEFAULT_COMPLETE_ABOUT_PAGE,
  normalizeCompleteAboutPage,
  StatItemData,
} from '@/lib/content';

interface AboutPageEditorProps {
  initialContents: any[];
  onGlobalSuccess?: (msg: string) => void;
  onGlobalError?: (msg: string) => void;
}

export default function AboutPageEditor({
  initialContents,
  onGlobalSuccess,
  onGlobalError,
}: AboutPageEditorProps) {
  // Normalize initial data
  const initialData = normalizeCompleteAboutPage(initialContents);

  // Active section view filter (all or specific section)
  const [sectionFilter, setSectionFilter] = useState<string>('all');

  // Track currently saving section key
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Section status alerts
  const [sectionSuccess, setSectionSuccess] = useState<Record<string, string | null>>({});
  const [sectionError, setSectionError] = useState<Record<string, string | null>>({});

  // 1. HERO SECTION STATE
  const [heroTitle, setHeroTitle] = useState(initialData.hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(initialData.hero.subtitle);
  const [heroLead, setHeroLead] = useState(initialData.hero.lead);
  const [savedHero, setSavedHero] = useState({ ...initialData.hero });

  // 2. OVERVIEW (Trusted Engineering Solutions Provider)
  const [overviewHeading, setOverviewHeading] = useState(initialData.overview.heading);
  const [overviewContent, setOverviewContent] = useState(initialData.overview.content);
  const [savedOverview, setSavedOverview] = useState({ ...initialData.overview });

  // 3. EXPERTISE (Project & Engineering Expertise)
  const [expertiseHeading, setExpertiseHeading] = useState(initialData.expertise.heading);
  const [expertiseContent, setExpertiseContent] = useState(initialData.expertise.content);
  const [savedExpertise, setSavedExpertise] = useState({ ...initialData.expertise });

  // 4. APPROACH (Our Approach)
  const [approachHeading, setApproachHeading] = useState(initialData.approach.heading);
  const [approachContent, setApproachContent] = useState(initialData.approach.content);
  const [savedApproach, setSavedApproach] = useState({ ...initialData.approach });

  // 5. CLOSING (Concluding Brand Statement)
  const [closingStatement, setClosingStatement] = useState(initialData.closing.statement);
  const [savedClosing, setSavedClosing] = useState({ ...initialData.closing });

  // 6. STATISTICS
  const [statsBadge, setStatsBadge] = useState(initialData.stats.badge);
  const [statsHeading, setStatsHeading] = useState(initialData.stats.heading);
  const [statsIntro, setStatsIntro] = useState(initialData.stats.intro);
  const [statCards, setStatCards] = useState<StatItemData[]>([...initialData.stats.items]);
  const [savedStats, setSavedStats] = useState({
    badge: initialData.stats.badge,
    heading: initialData.stats.heading,
    intro: initialData.stats.intro,
    items: [...initialData.stats.items],
  });

  // 7. VISION & MISSION
  const [visionEyebrow, setVisionEyebrow] = useState(initialData.visionMission.visionEyebrow);
  const [visionTitle, setVisionTitle] = useState(initialData.visionMission.visionTitle);
  const [visionText, setVisionText] = useState(initialData.visionMission.vision);
  const [missionEyebrow, setMissionEyebrow] = useState(initialData.visionMission.missionEyebrow);
  const [missionTitle, setMissionTitle] = useState(initialData.visionMission.missionTitle);
  const [missionText, setMissionText] = useState(initialData.visionMission.mission);
  const [savedVisionMission, setSavedVisionMission] = useState({ ...initialData.visionMission });

  // Helper to show section messages
  const notifySuccess = (key: string, msg: string) => {
    setSectionSuccess((prev) => ({ ...prev, [key]: msg }));
    setSectionError((prev) => ({ ...prev, [key]: null }));
    if (onGlobalSuccess) onGlobalSuccess(msg);
    setTimeout(() => {
      setSectionSuccess((prev) => ({ ...prev, [key]: null }));
    }, 5000);
  };

  const notifyError = (key: string, msg: string) => {
    setSectionError((prev) => ({ ...prev, [key]: msg }));
    if (onGlobalError) onGlobalError(msg);
  };

  // Generic Save API caller
  const saveSection = async (key: string, payload: any, successMsg: string) => {
    setSavingKey(key);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          section: 'about',
          ...payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save section content');

      notifySuccess(key, successMsg);
      return true;
    } catch (err: any) {
      notifyError(key, err.message || 'Error occurred while saving content');
      return false;
    } finally {
      setSavingKey(null);
    }
  };

  // 1. SAVE HERO
  const handleSaveHero = async () => {
    const success = await saveSection(
      'about_hero',
      {
        title: heroTitle.trim(),
        subtitle: heroSubtitle.trim(),
        lead: heroLead.trim(),
        content: heroLead.trim(),
      },
      'Hero & Profile section updated successfully!'
    );
    if (success) {
      setSavedHero({ title: heroTitle, subtitle: heroSubtitle, lead: heroLead });
    }
  };

  // 2. SAVE OVERVIEW
  const handleSaveOverview = async () => {
    const success = await saveSection(
      'about_overview',
      {
        title: overviewHeading.trim(),
        content: overviewContent.trim(),
      },
      'Overview section updated successfully!'
    );
    if (success) {
      setSavedOverview({ heading: overviewHeading, content: overviewContent });
    }
  };

  // 3. SAVE EXPERTISE
  const handleSaveExpertise = async () => {
    const success = await saveSection(
      'about_expertise',
      {
        title: expertiseHeading.trim(),
        content: expertiseContent.trim(),
      },
      'Project & Engineering Expertise section updated successfully!'
    );
    if (success) {
      setSavedExpertise({ heading: expertiseHeading, content: expertiseContent });
    }
  };

  // 4. SAVE APPROACH
  const handleSaveApproach = async () => {
    const success = await saveSection(
      'about_approach',
      {
        title: approachHeading.trim(),
        content: approachContent.trim(),
      },
      'Our Approach section updated successfully!'
    );
    if (success) {
      setSavedApproach({ heading: approachHeading, content: approachContent });
    }
  };

  // 5. SAVE CLOSING
  const handleSaveClosing = async () => {
    const success = await saveSection(
      'about_closing',
      {
        title: closingStatement.trim(),
        content: closingStatement.trim(),
      },
      'Concluding Brand Statement updated successfully!'
    );
    if (success) {
      setSavedClosing({ statement: closingStatement });
    }
  };

  // 6. SAVE STATS
  const handleSaveStats = async () => {
    const success = await saveSection(
      'about_stats',
      {
        badge: statsBadge.trim(),
        heading: statsHeading.trim(),
        intro: statsIntro.trim(),
        items: statCards,
      },
      'Company Statistics updated successfully!'
    );
    if (success) {
      setSavedStats({
        badge: statsBadge,
        heading: statsHeading,
        intro: statsIntro,
        items: [...statCards],
      });
    }
  };

  // 7. SAVE VISION & MISSION
  const handleSaveVisionMission = async () => {
    const success = await saveSection(
      'vision_mission',
      {
        title: 'Vision and Mission',
        vision: visionText.trim(),
        mission: missionText.trim(),
        visionEyebrow: visionEyebrow.trim(),
        visionTitle: visionTitle.trim(),
        missionEyebrow: missionEyebrow.trim(),
        missionTitle: missionTitle.trim(),
      },
      'Vision & Mission updated successfully!'
    );
    if (success) {
      setSavedVisionMission({
        visionEyebrow,
        visionTitle,
        vision: visionText,
        missionEyebrow,
        missionTitle,
        mission: missionText,
      });
    }
  };

  // Stat item handlers
  const handleUpdateStat = (index: number, field: keyof StatItemData, value: any) => {
    const updated = [...statCards];
    updated[index] = { ...updated[index], [field]: value };
    setStatCards(updated);
  };

  const handleAddStat = () => {
    const newId = `stat-${Date.now()}`;
    setStatCards([
      ...statCards,
      {
        id: newId,
        target: 100,
        suffix: '+',
        label: 'New Statistic',
        description: 'Provide supporting detail for this key achievement',
      },
    ]);
  };

  const handleRemoveStat = (index: number) => {
    setStatCards(statCards.filter((_, i) => i !== index));
  };

  const handleMoveStat = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= statCards.length) return;
    const copy = [...statCards];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setStatCards(copy);
  };

  // Dirty detection for each section
  const isHeroDirty =
    heroTitle !== savedHero.title ||
    heroSubtitle !== savedHero.subtitle ||
    heroLead !== savedHero.lead;

  const isOverviewDirty =
    overviewHeading !== savedOverview.heading ||
    overviewContent !== savedOverview.content;

  const isExpertiseDirty =
    expertiseHeading !== savedExpertise.heading ||
    expertiseContent !== savedExpertise.content;

  const isApproachDirty =
    approachHeading !== savedApproach.heading ||
    approachContent !== savedApproach.content;

  const isClosingDirty = closingStatement !== savedClosing.statement;

  const isStatsDirty =
    statsBadge !== savedStats.badge ||
    statsHeading !== savedStats.heading ||
    statsIntro !== savedStats.intro ||
    JSON.stringify(statCards) !== JSON.stringify(savedStats.items);

  const isVisionMissionDirty =
    visionEyebrow !== savedVisionMission.visionEyebrow ||
    visionTitle !== savedVisionMission.visionTitle ||
    visionText !== savedVisionMission.vision ||
    missionEyebrow !== savedVisionMission.missionEyebrow ||
    missionTitle !== savedVisionMission.missionTitle ||
    missionText !== savedVisionMission.mission;

  // Filter sections
  const showSection = (sec: string) => sectionFilter === 'all' || sectionFilter === sec;

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-[#061d43] via-[#092557] to-[#0c3172] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Narrative CMS</span>
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              About Us Page Content Editor
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Every section, heading, narrative paragraph, statistic, and statement on the public About Us page is completely editable below. Changes save independently per section and update the live website immediately.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all backdrop-blur-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live About Page</span>
            </a>
          </div>
        </div>

        {/* Section Quick Jump Filter Pills */}
        <div className="flex items-center gap-1.5 mt-6 pt-5 border-t border-white/15 overflow-x-auto pb-1 text-xs font-semibold">
          <span className="text-slate-300 text-[11px] mr-1 hidden sm:inline">Jump to:</span>
          {[
            { id: 'all', label: 'All Sections' },
            { id: 'hero', label: '1. Hero & Header' },
            { id: 'overview', label: '2. Overview Narrative' },
            { id: 'expertise', label: '3. Project Expertise' },
            { id: 'approach', label: '4. Our Approach' },
            { id: 'closing', label: '5. Concluding Statement' },
            { id: 'stats', label: '6. Statistics' },
            { id: 'vision', label: '7. Vision & Mission' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setSectionFilter(pill.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                sectionFilter === pill.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: HERO & PROFILE HEADER */}
      {showSection('hero') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sherman-50 text-sherman-700 rounded-xl border border-sherman-200">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Section 1: Hero &amp; Profile Header
                  </h3>
                  {isHeroDirty && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Unsaved edits
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Full-width corporate hero banner with industrial background and primary page headline.
                </p>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setHeroTitle(savedHero.title);
                  setHeroSubtitle(savedHero.subtitle);
                  setHeroLead(savedHero.lead);
                }}
                disabled={!isHeroDirty}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Revert to last saved version"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeroTitle(DEFAULT_COMPLETE_ABOUT_PAGE.hero.title);
                  setHeroSubtitle(DEFAULT_COMPLETE_ABOUT_PAGE.hero.subtitle);
                  setHeroLead(DEFAULT_COMPLETE_ABOUT_PAGE.hero.lead);
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                title="Restore Default Authentic Text"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSaveHero}
                disabled={savingKey === 'about_hero'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sherman-700 hover:bg-sherman-800 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingKey === 'about_hero' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Hero Section</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {sectionSuccess['about_hero'] && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{sectionSuccess['about_hero']}</span>
            </div>
          )}

          {sectionError['about_hero'] && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{sectionError['about_hero']}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Primary Page Heading (H1)
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="About Sherman"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Subheading / Tagline
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Trusted Engineering Solutions Provider"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
              />
            </div>
          </div>

          <RichTextEditor
            label="Lead Paragraph (Hero Description)"
            value={heroLead}
            onChange={setHeroLead}
            placeholder="Lead narrative sentence displayed inside the dark hero banner..."
            helperText="Appears prominently directly underneath the hero title in the navy background banner."
            minHeight="140px"
          />
        </div>
      )}

      {/* SECTION 2: OVERVIEW NARRATIVE */}
      {showSection('overview') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Section 2: Overview Narrative
                  </h3>
                  {isOverviewDirty && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Unsaved edits
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Primary editorial block introducing Sherman's core capabilities, portfolio, and value delivery.
                </p>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setOverviewHeading(savedOverview.heading);
                  setOverviewContent(savedOverview.content);
                }}
                disabled={!isOverviewDirty}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Revert to last saved version"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setOverviewHeading(DEFAULT_COMPLETE_ABOUT_PAGE.overview.heading);
                  setOverviewContent(DEFAULT_COMPLETE_ABOUT_PAGE.overview.content);
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                title="Restore Default Authentic Text"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSaveOverview}
                disabled={savingKey === 'about_overview'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sherman-700 hover:bg-sherman-800 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingKey === 'about_overview' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Overview</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {sectionSuccess['about_overview'] && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{sectionSuccess['about_overview']}</span>
            </div>
          )}

          {sectionError['about_overview'] && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{sectionError['about_overview']}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Section Heading (H2)
            </label>
            <input
              type="text"
              value={overviewHeading}
              onChange={(e) => setOverviewHeading(e.target.value)}
              placeholder="Trusted Engineering Solutions Provider"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
            />
          </div>

          <RichTextEditor
            label="Overview Narrative Body Text"
            value={overviewContent}
            onChange={setOverviewContent}
            placeholder="Enter paragraphs describing Sherman's role, technology partners, and technical expertise..."
            helperText="Supports headings, paragraph formatting, bullet lists, bold text, alignment, font sizes, and hyperlinks."
            minHeight="260px"
          />
        </div>
      )}

      {/* SECTION 3: PROJECT & ENGINEERING EXPERTISE */}
      {showSection('expertise') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Section 3: Project &amp; Engineering Expertise
                  </h3>
                  {isExpertiseDirty && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Unsaved edits
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Covers EPC portal execution, engineering documentation, technical submittals, and contractor coordination.
                </p>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setExpertiseHeading(savedExpertise.heading);
                  setExpertiseContent(savedExpertise.content);
                }}
                disabled={!isExpertiseDirty}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Revert to last saved version"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpertiseHeading(DEFAULT_COMPLETE_ABOUT_PAGE.expertise.heading);
                  setExpertiseContent(DEFAULT_COMPLETE_ABOUT_PAGE.expertise.content);
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                title="Restore Default Authentic Text"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSaveExpertise}
                disabled={savingKey === 'about_expertise'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sherman-700 hover:bg-sherman-800 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingKey === 'about_expertise' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Expertise</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {sectionSuccess['about_expertise'] && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{sectionSuccess['about_expertise']}</span>
            </div>
          )}

          {sectionError['about_expertise'] && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{sectionError['about_expertise']}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Section Heading (H2)
            </label>
            <input
              type="text"
              value={expertiseHeading}
              onChange={(e) => setExpertiseHeading(e.target.value)}
              placeholder="Project & Engineering Expertise"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
            />
          </div>

          <RichTextEditor
            label="Expertise Body Text"
            value={expertiseContent}
            onChange={setExpertiseContent}
            placeholder="Describe project engineering, execution platforms, and EPC deliverables..."
            minHeight="200px"
          />
        </div>
      )}

      {/* SECTION 4: OUR APPROACH */}
      {showSection('approach') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Section 4: Our Approach
                  </h3>
                  {isApproachDirty && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Unsaved edits
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Explains Sherman's multidisciplinary philosophy, customer collaboration, and long-term value creation.
                </p>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setApproachHeading(savedApproach.heading);
                  setApproachContent(savedApproach.content);
                }}
                disabled={!isApproachDirty}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Revert to last saved version"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setApproachHeading(DEFAULT_COMPLETE_ABOUT_PAGE.approach.heading);
                  setApproachContent(DEFAULT_COMPLETE_ABOUT_PAGE.approach.content);
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                title="Restore Default Authentic Text"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSaveApproach}
                disabled={savingKey === 'about_approach'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sherman-700 hover:bg-sherman-800 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingKey === 'about_approach' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Approach</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {sectionSuccess['about_approach'] && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{sectionSuccess['about_approach']}</span>
            </div>
          )}

          {sectionError['about_approach'] && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{sectionError['about_approach']}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Section Heading (H2)
            </label>
            <input
              type="text"
              value={approachHeading}
              onChange={(e) => setApproachHeading(e.target.value)}
              placeholder="Our Approach"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
            />
          </div>

          <RichTextEditor
            label="Approach Narrative Body Text"
            value={approachContent}
            onChange={setApproachContent}
            placeholder="Explain multidisciplinary engineering, understanding processes, and long-term customer commitment..."
            minHeight="220px"
          />
        </div>
      )}

      {/* SECTION 5: CONCLUDING BRAND STATEMENT */}
      {showSection('closing') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Section 5: Concluding Brand Statement
                  </h3>
                  {isClosingDirty && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Unsaved edits
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Prominent signature banner concluding the main editorial card in bold corporate gradient.
                </p>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setClosingStatement(savedClosing.statement)}
                disabled={!isClosingDirty}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Revert to last saved version"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setClosingStatement(DEFAULT_COMPLETE_ABOUT_PAGE.closing.statement)}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                title="Restore Default Authentic Text"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSaveClosing}
                disabled={savingKey === 'about_closing'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sherman-700 hover:bg-sherman-800 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingKey === 'about_closing' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Statement</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {sectionSuccess['about_closing'] && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{sectionSuccess['about_closing']}</span>
            </div>
          )}

          {sectionError['about_closing'] && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{sectionError['about_closing']}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Signature Statement Text
            </label>
            <input
              type="text"
              value={closingStatement}
              onChange={(e) => setClosingStatement(e.target.value)}
              placeholder="Sherman — Technology. Expertise. Solutions."
              className="w-full px-3.5 py-3 text-sm sm:text-base font-bold border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
            />
          </div>

          {/* Visual Preview Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#061d43] via-[#092557] to-[#0c3172] text-white shadow-md border border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Banner Live Rendering Preview:
            </div>
            <div className="font-display text-xl sm:text-2xl font-black text-amber-400 tracking-wide">
              {closingStatement || 'Sherman — Technology. Expertise. Solutions.'}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: COMPANY STATISTICS */}
      {showSection('stats') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Section 6: Animated Statistics (Numbers Speak for Themselves)
                  </h3>
                  {isStatsDirty && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Unsaved edits
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Manage the numbers, suffixes, titles, and descriptions for all animated counter cards.
                </p>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setStatsBadge(savedStats.badge);
                  setStatsHeading(savedStats.heading);
                  setStatsIntro(savedStats.intro);
                  setStatCards([...savedStats.items]);
                }}
                disabled={!isStatsDirty}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Revert to last saved version"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatsBadge(DEFAULT_COMPLETE_ABOUT_PAGE.stats.badge);
                  setStatsHeading(DEFAULT_COMPLETE_ABOUT_PAGE.stats.heading);
                  setStatsIntro(DEFAULT_COMPLETE_ABOUT_PAGE.stats.intro);
                  setStatCards([...DEFAULT_COMPLETE_ABOUT_PAGE.stats.items]);
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                title="Restore Default Authentic Statistics"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSaveStats}
                disabled={savingKey === 'about_stats'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sherman-700 hover:bg-sherman-800 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingKey === 'about_stats' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Statistics</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {sectionSuccess['about_stats'] && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{sectionSuccess['about_stats']}</span>
            </div>
          )}

          {sectionError['about_stats'] && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{sectionError['about_stats']}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Eyebrow / Badge Label
              </label>
              <input
                type="text"
                value={statsBadge}
                onChange={(e) => setStatsBadge(e.target.value)}
                placeholder="Some Cool Facts"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Section Title (Heading)
              </label>
              <input
                type="text"
                value={statsHeading}
                onChange={(e) => setStatsHeading(e.target.value)}
                placeholder="Numbers Speak for Themselves"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-sherman-600 focus:ring-1 focus:ring-sherman-600 outline-none"
              />
            </div>
          </div>

          <RichTextEditor
            label="Section Introduction Text"
            value={statsIntro}
            onChange={setStatsIntro}
            placeholder="A quantifiable proven track record built on precision engineering..."
            minHeight="140px"
          />

          {/* Cards List */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Individual Statistics Cards ({statCards.length})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Numeric target values animate smoothly on scroll with count-up effects.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddStat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Counter Card</span>
              </button>
            </div>

            <div className="space-y-3">
              {statCards.map((stat, idx) => (
                <div
                  key={stat.id || idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Card #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveStat(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveStat(idx, 'down')}
                        disabled={idx === statCards.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveStat(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="Remove Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-3 space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        Target Number
                      </label>
                      <input
                        type="number"
                        value={stat.target}
                        onChange={(e) =>
                          handleUpdateStat(idx, 'target', parseInt(e.target.value, 10) || 0)
                        }
                        className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white outline-none focus:border-sherman-600"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        Suffix Symbol
                      </label>
                      <input
                        type="text"
                        value={stat.suffix || ''}
                        onChange={(e) => handleUpdateStat(idx, 'suffix', e.target.value)}
                        placeholder="+, %, etc."
                        className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white outline-none focus:border-sherman-600"
                      />
                    </div>

                    <div className="sm:col-span-7 space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        Title / Metric Label
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleUpdateStat(idx, 'label', e.target.value)}
                        placeholder="Completed Projects"
                        className="w-full px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white outline-none focus:border-sherman-600"
                      />
                    </div>

                    <div className="sm:col-span-12 space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        Description / Supporting Detail
                      </label>
                      <input
                        type="text"
                        value={stat.description}
                        onChange={(e) => handleUpdateStat(idx, 'description', e.target.value)}
                        placeholder="Successful multi-sector engineering installations & turnkey deliveries"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:border-sherman-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: VISION & MISSION */}
      {showSection('vision') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Section 7: Vision &amp; Mission
                  </h3>
                  {isVisionMissionDirty && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Unsaved edits
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Manage Guiding Principles, Core Commitments, and corporate statements rendered with industrial textures.
                </p>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setVisionEyebrow(savedVisionMission.visionEyebrow);
                  setVisionTitle(savedVisionMission.visionTitle);
                  setVisionText(savedVisionMission.vision);
                  setMissionEyebrow(savedVisionMission.missionEyebrow);
                  setMissionTitle(savedVisionMission.missionTitle);
                  setMissionText(savedVisionMission.mission);
                }}
                disabled={!isVisionMissionDirty}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Revert to last saved version"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setVisionEyebrow(DEFAULT_COMPLETE_ABOUT_PAGE.visionMission.visionEyebrow);
                  setVisionTitle(DEFAULT_COMPLETE_ABOUT_PAGE.visionMission.visionTitle);
                  setVisionText(DEFAULT_COMPLETE_ABOUT_PAGE.visionMission.vision);
                  setMissionEyebrow(DEFAULT_COMPLETE_ABOUT_PAGE.visionMission.missionEyebrow);
                  setMissionTitle(DEFAULT_COMPLETE_ABOUT_PAGE.visionMission.missionTitle);
                  setMissionText(DEFAULT_COMPLETE_ABOUT_PAGE.visionMission.mission);
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                title="Restore Default Authentic Vision & Mission"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSaveVisionMission}
                disabled={savingKey === 'vision_mission'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sherman-700 hover:bg-sherman-800 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingKey === 'vision_mission' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Vision &amp; Mission</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {sectionSuccess['vision_mission'] && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{sectionSuccess['vision_mission']}</span>
            </div>
          )}

          {sectionError['vision_mission'] && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{sectionError['vision_mission']}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision Column */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
                <Eye className="w-4 h-4" />
                <span>Our Vision Settings</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={visionEyebrow}
                    onChange={(e) => setVisionEyebrow(e.target.value)}
                    placeholder="Guiding Principle"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:border-sherman-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Heading Title
                  </label>
                  <input
                    type="text"
                    value={visionTitle}
                    onChange={(e) => setVisionTitle(e.target.value)}
                    placeholder="Our Vision"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:border-sherman-600"
                  />
                </div>
              </div>

              <RichTextEditor
                label="Vision Narrative Text"
                value={visionText}
                onChange={setVisionText}
                placeholder="Enter vision statement..."
                minHeight="160px"
              />
            </div>

            {/* Mission Column */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 text-sherman-700 font-bold text-xs uppercase tracking-wider border-b border-slate-200 pb-2">
                <Target className="w-4 h-4" />
                <span>Our Mission Settings</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={missionEyebrow}
                    onChange={(e) => setMissionEyebrow(e.target.value)}
                    placeholder="Core Commitment"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:border-sherman-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Heading Title
                  </label>
                  <input
                    type="text"
                    value={missionTitle}
                    onChange={(e) => setMissionTitle(e.target.value)}
                    placeholder="Our Mission"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:border-sherman-600"
                  />
                </div>
              </div>

              <RichTextEditor
                label="Mission Narrative Text"
                value={missionText}
                onChange={setMissionText}
                placeholder="Enter mission statement..."
                minHeight="160px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
