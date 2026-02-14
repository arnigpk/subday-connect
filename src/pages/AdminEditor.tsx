import { useState, useCallback } from 'react';
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
import { GripVertical, Plus, Trash2, Save, Globe, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Hero', steps: 'Шаги', users: 'Пользователям', partners: 'Партнёрам',
  trust: 'Доверие', faq: 'FAQ', cta: 'CTA', footer: 'Footer'
};

const ALL_TYPES: SectionType[] = ['hero', 'steps', 'users', 'partners', 'trust', 'faq', 'cta', 'footer'];

function SortableItem({ section, active, onClick, onDelete }: {
  section: Section; active: boolean; onClick: () => void; onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group ${active ? 'bg-foreground text-background' : 'hover:bg-accent'}`} onClick={onClick}>
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing shrink-0 opacity-40 hover:opacity-100">
        <GripVertical size={14} />
      </button>
      <span className="text-sm font-medium flex-1">{SECTION_LABELS[section.type] || section.type}</span>
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive">
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function EditorContent() {
  const { lang } = useLanguage();
  const { data: loadedContent } = useContent('draft');
  const queryClient = useQueryClient();

  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const currentContent = content || loadedContent || getDefaultContent(lang);
  const sections = [...currentContent.sections].sort((a, b) => a.order - b.order);
  const activeSection = sections.find((s) => s.id === activeId);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const updateContent = useCallback((updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => updater(prev || loadedContent || getDefaultContent(lang)));
  }, [loadedContent, lang]);

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

  const addSection = (type: SectionType) => {
    const id = `${type}_${Date.now()}`;
    const maxOrder = Math.max(0, ...currentContent.sections.map((s) => s.order));
    const defaultData = getDefaultContent(lang).sections.find((s) => s.type === type)?.data;
    if (!defaultData) return;
    updateContent((prev) => ({
      ...prev,
      sections: [...prev.sections, { id, type, order: maxOrder + 1, data: defaultData }],
    }));
    setActiveId(id);
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
    // Validate required fields
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
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Ошибка публикации');
    }
    setPublishing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-7rem)]">
      {/* Left: Section list */}
      <div className="w-full lg:w-64 shrink-0 bg-background rounded-xl border border-border p-3 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Секции</h3>
          <div className="relative group">
            <button className="p-1 hover:bg-accent rounded transition-colors">
              <Plus size={16} />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg py-1 w-40 hidden group-hover:block z-10">
              {ALL_TYPES.map((type) => (
                <button key={type} onClick={() => addSection(type)} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors">
                  {SECTION_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {sections.map((section) => (
                <SortableItem
                  key={section.id}
                  section={section}
                  active={activeId === section.id}
                  onClick={() => setActiveId(section.id)}
                  onDelete={() => deleteSection(section.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Right: Editor panel */}
      <div className="flex-1 bg-background rounded-xl border border-border flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="text-sm font-semibold">
            {activeSection ? SECTION_LABELS[activeSection.type] : 'Выберите секцию'}
          </h3>
          <div className="flex items-center gap-2">
            <a href={`/?preview=1&lang=${lang}`} target="_blank" className="btn-outline text-xs py-1.5 px-3 gap-1">
              <Eye size={13} /> Preview
            </a>
            <button onClick={saveDraft} disabled={saving} className="btn-outline text-xs py-1.5 px-3 gap-1">
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Черновик
            </button>
            <button onClick={publish} disabled={publishing} className="btn-gold text-xs py-1.5 px-3 gap-1">
              {publishing ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />} Опубликовать
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeSection ? (
            <SectionEditorPanel section={activeSection} onChange={handleSectionDataChange} />
          ) : (
            <p className="text-sm text-muted-foreground text-center mt-20">Выберите секцию для редактирования</p>
          )}
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
