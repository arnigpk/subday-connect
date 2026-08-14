import { useState, useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useContent } from '@/hooks/useContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Section, SectionType, SiteContent } from '@/lib/types';
import { getDefaultContent } from '@/lib/defaultContent';
import { SectionEditorPanel } from '@/components/admin/SectionEditorPanel';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical, Plus, Trash2, Save, Globe, Eye, EyeOff, Loader2,
  Monitor, Smartphone, Search, FileText, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const SECTION_LABELS: Record<SectionType, string> = {
  hero: '🏠 Hero', steps: '📋 Шаги', users: '👤 Пользователям', partners: '🤝 Партнёрам',
  trust: '⭐ Доверие', faq: '❓ FAQ', cta: '🚀 CTA', footer: '📧 Footer'
};

const ALL_TYPES: SectionType[] = ['hero', 'steps', 'users', 'partners', 'trust', 'faq', 'cta', 'footer'];

// --- Sortable Item ---
function SortableItem({ section, active, onClick, onDelete, onToggleVisible }: {
  section: Section; active: boolean; onClick: () => void; onDelete: () => void; onToggleVisible: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isVisible = section.visible !== false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all group ${
        active
          ? 'bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold))] ring-1 ring-[hsl(var(--gold)/0.3)]'
          : isVisible
            ? 'hover:bg-[hsl(220,10%,14%)] text-[hsl(220,10%,70%)]'
            : 'hover:bg-[hsl(220,10%,14%)] text-[hsl(220,10%,35%)]'
      }`}
      onClick={onClick}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing shrink-0 opacity-30 hover:opacity-70 transition-opacity">
        <GripVertical size={12} />
      </button>
      <span className={`text-[13px] font-medium flex-1 truncate ${!isVisible ? 'line-through opacity-50' : ''}`}>
        {SECTION_LABELS[section.type] || section.type}
      </span>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleVisible(); }}
          className="p-1 rounded hover:bg-[hsl(220,10%,20%)] transition-colors"
          title={isVisible ? 'Скрыть' : 'Показать'}
        >
          {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// --- SEO Editor ---
function SeoEditor({ content, onChange }: { content: SiteContent; onChange: (meta: SiteContent['meta']) => void }) {
  const meta = content.meta;
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,45%)]">Title (SEO)</label>
        <input
          value={meta.title}
          onChange={(e) => onChange({ ...meta, title: e.target.value })}
          className="admin-input"
          placeholder="Title для поисковых систем"
        />
        <p className="text-[10px] text-[hsl(220,10%,35%)]">{meta.title.length}/60 символов</p>
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,45%)]">Description</label>
        <textarea
          value={meta.description}
          onChange={(e) => onChange({ ...meta, description: e.target.value })}
          className="admin-input resize-none"
          rows={3}
          placeholder="Описание для поисковых систем"
        />
        <p className="text-[10px] text-[hsl(220,10%,35%)]">{meta.description.length}/160 символов</p>
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,45%)]">OG Image URL</label>
        <input
          value={meta.og_image}
          onChange={(e) => onChange({ ...meta, og_image: e.target.value })}
          className="admin-input"
          placeholder="https://..."
        />
      </div>
      {/* Preview card */}
      <div className="mt-4 p-4 rounded-xl bg-[hsl(220,10%,11%)] border border-[hsl(220,10%,18%)]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,40%)] mb-3">Превью в Google</p>
        <div className="space-y-1">
          <p className="text-[14px] text-blue-400 truncate">{meta.title || 'Заголовок страницы'}</p>
          <p className="text-[11px] text-green-400/80">subday.app</p>
          <p className="text-[12px] text-[hsl(220,10%,55%)] line-clamp-2">{meta.description || 'Описание страницы...'}</p>
        </div>
      </div>
    </div>
  );
}

// --- Main Editor ---
function EditorContent() {
  const { lang } = useLanguage();
  const { data: loadedContent } = useContent('draft');
  const queryClient = useQueryClient();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    setContent(null);
    setActiveId(null);
  }, [lang]);

  const currentContent = content || loadedContent || getDefaultContent(lang);
  const sections = [...currentContent.sections].sort((a, b) => a.order - b.order);
  const activeSection = sections.find((s) => s.id === activeId);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const updateContent = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => updater(prev || loadedContent || getDefaultContent(lang)));
  }, [loadedContent, lang]);

  const refreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    updateContent((prev) => {
      const sorted = [...prev.sections].sort((a, b) => a.order - b.order);
      const oldIndex = sorted.findIndex((s) => s.id === active.id);
      const newIndex = sorted.findIndex((s) => s.id === over.id);
      const moved = arrayMove(sorted, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }));
      return { ...prev, sections: moved };
    });
  };

  const handleSectionDataChange = (data: Section['data']) => {
    if (!activeId) return;
    updateContent((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === activeId ? { ...s, data } : s)),
    }));
  };

  const toggleVisible = (id: string) => {
    updateContent((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, visible: s.visible === false ? true : false } : s
      ),
    }));
  };

  const addSection = (type: SectionType) => {
    const id = `${type}_${Date.now()}`;
    const maxOrder = Math.max(0, ...currentContent.sections.map((s) => s.order));
    const defaultData = getDefaultContent(lang).sections.find((s) => s.type === type)?.data;
    if (!defaultData) return;
    updateContent((prev) => ({
      ...prev,
      sections: [...prev.sections, { id, type, order: maxOrder + 1, visible: true, data: defaultData }],
    }));
    setActiveId(id);
    setShowAddMenu(false);
  };

  const deleteSection = (id: string) => {
    if (activeId === id) setActiveId(null);
    updateContent((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      const column = `draft_${lang}`;
      const { error } = await supabase
        .from('site_pages')
        .upsert({ id: 'home', [column]: currentContent as unknown as Record<string, unknown> } as Record<string, unknown>);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      toast.success('Черновик сохранён');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения');
    }
    setSaving(false);
  };

  const publish = async () => {
    const hero = currentContent.sections.find((s) => s.type === 'hero');
    if (!hero || !(hero.data as unknown as Record<string, string>).title) {
      toast.error('Заполните заголовок Hero для публикации');
      return;
    }
    setPublishing(true);
    try {
      const draftCol = `draft_${lang}`;
      const pubCol = `published_${lang}`;
      const { error } = await supabase
        .from('site_pages')
        .upsert({
          id: 'home',
          [draftCol]: currentContent as unknown as Record<string, unknown>,
          [pubCol]: currentContent as unknown as Record<string, unknown>,
        } as Record<string, unknown>);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      toast.success('Опубликовано!');
      setTimeout(refreshPreview, 500);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Ошибка публикации');
    }
    setPublishing(false);
  };

  const visibleCount = sections.filter(s => s.visible !== false).length;
  const hiddenCount = sections.length - visibleCount;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* LEFT: Section list */}
      <div className="w-64 shrink-0 border-r border-[hsl(220,10%,16%)] bg-[hsl(220,13%,9%)] flex flex-col">
        {/* Toolbar */}
        <div className="p-3 border-b border-[hsl(220,10%,16%)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,45%)]">Секции</h3>
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="p-1.5 rounded-lg hover:bg-[hsl(220,10%,14%)] text-[hsl(220,10%,55%)] hover:text-[hsl(var(--gold))] transition-all"
              >
                <Plus size={15} />
              </button>
              {showAddMenu && (
                <div className="absolute right-0 top-full mt-1 bg-[hsl(220,13%,12%)] border border-[hsl(220,10%,20%)] rounded-xl shadow-2xl py-1.5 w-44 z-20">
                  {ALL_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => addSection(type)}
                      className="block w-full text-left px-3 py-2 text-[13px] text-[hsl(220,10%,65%)] hover:text-white hover:bg-[hsl(220,10%,16%)] transition-colors"
                    >
                      {SECTION_LABELS[type]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-[10px] text-[hsl(220,10%,35%)]">
            {visibleCount} активных{hiddenCount > 0 ? `, ${hiddenCount} скрытых` : ''}
          </p>
        </div>

        {/* Section list */}
        <div className="flex-1 overflow-y-auto p-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-0.5">
                {sections.map((section) => (
                  <SortableItem
                    key={section.id}
                    section={section}
                    active={activeId === section.id}
                    onClick={() => { setActiveId(section.id); setActiveTab('content'); }}
                    onDelete={() => deleteSection(section.id)}
                    onToggleVisible={() => toggleVisible(section.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Save/Publish */}
        <div className="p-3 border-t border-[hsl(220,10%,16%)] space-y-2">
          <button
            onClick={saveDraft}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium bg-[hsl(220,10%,14%)] border border-[hsl(220,10%,20%)] text-[hsl(220,10%,70%)] hover:text-white hover:border-[hsl(220,10%,30%)] transition-all"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Сохранить черновик
          </button>
          <button
            onClick={publish}
            disabled={publishing}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold-dark))] transition-all"
          >
            {publishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
            Опубликовать
          </button>
        </div>
      </div>

      {/* CENTER: Editor panel */}
      <div className="w-[400px] shrink-0 border-r border-[hsl(220,10%,16%)] bg-[hsl(220,13%,10%)] flex flex-col">
        {/* Tabs */}
        <div className="flex items-center border-b border-[hsl(220,10%,16%)]">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[12px] font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'content'
                ? 'text-[hsl(var(--gold))] border-[hsl(var(--gold))]'
                : 'text-[hsl(220,10%,45%)] border-transparent hover:text-[hsl(220,10%,65%)]'
            }`}
          >
            <FileText size={14} /> Контент
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[12px] font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'seo'
                ? 'text-[hsl(var(--gold))] border-[hsl(var(--gold))]'
                : 'text-[hsl(220,10%,45%)] border-transparent hover:text-[hsl(220,10%,65%)]'
            }`}
          >
            <Search size={14} /> SEO
          </button>
        </div>

        {/* Editor content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'seo' ? (
            <SeoEditor
              content={currentContent}
              onChange={(meta) => updateContent((prev) => ({ ...prev, meta }))}
            />
          ) : activeSection ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-[hsl(var(--gold))]" />
                <h3 className="text-[14px] font-semibold text-white">
                  {SECTION_LABELS[activeSection.type]}
                </h3>
                {activeSection.visible === false && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-medium">скрыта</span>
                )}
              </div>
              <SectionEditorPanel section={activeSection} onChange={handleSectionDataChange} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-2xl bg-[hsl(220,10%,14%)] flex items-center justify-center mb-3">
                <FileText size={20} className="text-[hsl(220,10%,30%)]" />
              </div>
              <p className="text-[13px] text-[hsl(220,10%,40%)]">Выберите секцию<br />для редактирования</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Preview */}
      <div className="flex-1 bg-[hsl(220,13%,7%)] flex flex-col">
        {/* Preview toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[hsl(220,10%,16%)]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-2 rounded-lg transition-all ${
                previewDevice === 'desktop'
                  ? 'bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold))]'
                  : 'text-[hsl(220,10%,40%)] hover:text-[hsl(220,10%,65%)]'
              }`}
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-2 rounded-lg transition-all ${
                previewDevice === 'mobile'
                  ? 'bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold))]'
                  : 'text-[hsl(220,10%,40%)] hover:text-[hsl(220,10%,65%)]'
              }`}
            >
              <Smartphone size={16} />
            </button>
          </div>
          <span className="text-[11px] text-[hsl(220,10%,35%)]">Live Preview</span>
          <button
            onClick={refreshPreview}
            className="text-[12px] text-[hsl(220,10%,50%)] hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-[hsl(220,10%,14%)]"
          >
            ↻ Обновить
          </button>
        </div>

        {/* Preview iframe */}
        <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
          <div
            className={`bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
              previewDevice === 'mobile' ? 'w-[375px]' : 'w-full max-w-[1200px]'
            }`}
            style={{ height: previewDevice === 'mobile' ? '667px' : 'calc(100vh - 8rem)' }}
          >
            <iframe
              ref={iframeRef}
              src={`/?preview=1&lang=${lang}`}
              className="w-full h-full border-0"
              title="Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminEditor() {
  return (
    <AdminGuard>
      <AdminLayout>
        <EditorContent />
      </AdminLayout>
    </AdminGuard>
  );
}
