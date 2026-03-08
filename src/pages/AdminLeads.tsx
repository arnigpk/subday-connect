import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { LeadRecord } from '@/lib/types';
import { Search, Download, X, Loader2, MessageSquare, Calendar, MapPin, Phone, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const STATUSES = ['new', 'in_progress', 'done', 'spam'] as const;
const STATUS_LABELS: Record<string, string> = {
  new: 'Новая', in_progress: 'В работе', done: 'Завершена', spam: 'Спам'
};
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  in_progress: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  done: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  spam: 'bg-red-500/15 text-red-400 border-red-500/20'
};

function LeadsContent() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [noteText, setNoteText] = useState('');
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as LeadRecord[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LeadRecord> }) => {
      const { error } = await supabase.from('partner_leads').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Обновлено');
    }
  });

  const filtered = leads.filter((l) => {
    if (statusFilter && l.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return l.name.toLowerCase().includes(s) || l.city.toLowerCase().includes(s) ||
        l.phone.includes(s) || l.venue.toLowerCase().includes(s);
    }
    return true;
  });

  const exportCsv = () => {
    const headers = 'Дата,Имя,Город,Телефон,Заведение,Статус,Комментарий,Заметка\n';
    const rows = filtered.map((l) =>
      [l.created_at, l.name, l.city, l.phone, l.venue, l.status, l.comment, l.note]
        .map((v) => `"${(v || '').replace(/"/g, '""')}"`)
        .join(',')
    ).join('\n');
    const blob = new Blob(['\ufeff' + headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const saveNote = () => {
    if (!selectedLead) return;
    updateMutation.mutate({ id: selectedLead.id, updates: { note: noteText } });
    setSelectedLead({ ...selectedLead, note: noteText });
  };

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Заявки партнёров</h2>
          <p className="text-[12px] text-[hsl(220,10%,45%)]">{leads.length} заявок всего</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium bg-[hsl(220,10%,14%)] border border-[hsl(220,10%,20%)] text-[hsl(220,10%,65%)] hover:text-white hover:border-[hsl(220,10%,30%)] transition-all">
          <Download size={14} /> Экспорт CSV
        </button>
      </div>

      {/* Status counters */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
            className={`p-3 rounded-xl border text-center transition-all ${
              statusFilter === s
                ? STATUS_COLORS[s]
                : 'bg-[hsl(220,10%,11%)] border-[hsl(220,10%,18%)] text-[hsl(220,10%,55%)] hover:border-[hsl(220,10%,25%)]'
            }`}
          >
            <div className="text-lg font-bold">{statusCounts[s]}</div>
            <div className="text-[10px] font-medium uppercase tracking-wider">{STATUS_LABELS[s]}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,35%)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени, городу, телефону..."
          className="admin-input pl-10"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-[hsl(220,10%,30%)]" /></div>
      ) : (
        <div className="bg-[hsl(220,10%,11%)] rounded-xl border border-[hsl(220,10%,18%)] overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[hsl(220,10%,16%)]">
                <th className="text-left p-3 font-semibold text-[hsl(220,10%,45%)] text-[11px] uppercase tracking-wider">Дата</th>
                <th className="text-left p-3 font-semibold text-[hsl(220,10%,45%)] text-[11px] uppercase tracking-wider">Имя</th>
                <th className="text-left p-3 font-semibold text-[hsl(220,10%,45%)] text-[11px] uppercase tracking-wider hidden md:table-cell">Город</th>
                <th className="text-left p-3 font-semibold text-[hsl(220,10%,45%)] text-[11px] uppercase tracking-wider hidden md:table-cell">Телефон</th>
                <th className="text-left p-3 font-semibold text-[hsl(220,10%,45%)] text-[11px] uppercase tracking-wider hidden lg:table-cell">Заведение</th>
                <th className="text-left p-3 font-semibold text-[hsl(220,10%,45%)] text-[11px] uppercase tracking-wider">Статус</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-[hsl(220,10%,14%)] hover:bg-[hsl(220,10%,13%)] cursor-pointer transition-colors" onClick={() => { setSelectedLead(lead); setNoteText(lead.note || ''); }}>
                  <td className="p-3 text-[hsl(220,10%,45%)]">{new Date(lead.created_at).toLocaleDateString('ru')}</td>
                  <td className="p-3 font-medium text-white">{lead.name}</td>
                  <td className="p-3 hidden md:table-cell text-[hsl(220,10%,60%)]">{lead.city}</td>
                  <td className="p-3 hidden md:table-cell text-[hsl(220,10%,60%)]">{lead.phone}</td>
                  <td className="p-3 hidden lg:table-cell text-[hsl(220,10%,60%)]">{lead.venue}</td>
                  <td className="p-3">
                    <select
                      value={lead.status}
                      onChange={(e) => { e.stopPropagation(); updateMutation.mutate({ id: lead.id, updates: { status: e.target.value } }); }}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${STATUS_COLORS[lead.status] || ''} bg-transparent cursor-pointer`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center text-[hsl(220,10%,35%)]">Заявок нет</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead detail modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLead(null)}>
          <div className="bg-[hsl(220,13%,12%)] border border-[hsl(220,10%,20%)] rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Детали заявки</h3>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg hover:bg-[hsl(220,10%,18%)] text-[hsl(220,10%,50%)] transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-[13px] mb-6">
              <div className="flex items-center gap-2"><Calendar size={14} className="text-[hsl(220,10%,40%)]" /><span className="text-[hsl(220,10%,50%)]">Дата:</span> <span className="font-medium text-white">{new Date(selectedLead.created_at).toLocaleString('ru')}</span></div>
              <div className="flex items-center gap-2"><Building2 size={14} className="text-[hsl(220,10%,40%)]" /><span className="text-[hsl(220,10%,50%)]">Имя:</span> <span className="font-medium text-white">{selectedLead.name}</span></div>
              <div className="flex items-center gap-2"><MapPin size={14} className="text-[hsl(220,10%,40%)]" /><span className="text-[hsl(220,10%,50%)]">Город:</span> <span className="font-medium text-white">{selectedLead.city}</span></div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-[hsl(220,10%,40%)]" /><span className="text-[hsl(220,10%,50%)]">Телефон:</span> <span className="font-medium text-white">{selectedLead.phone}</span></div>
              <div className="flex items-center gap-2"><Building2 size={14} className="text-[hsl(220,10%,40%)]" /><span className="text-[hsl(220,10%,50%)]">Заведение:</span> <span className="font-medium text-white">{selectedLead.venue}</span></div>
              {selectedLead.comment && <div className="pt-2 border-t border-[hsl(220,10%,18%)]"><span className="text-[hsl(220,10%,50%)]">Комментарий:</span> <span className="text-white">{selectedLead.comment}</span></div>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-[hsl(220,10%,45%)] uppercase tracking-wider">
                <MessageSquare size={12} /> Заметка
              </div>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="admin-input resize-none" rows={3} placeholder="Внутренняя заметка..." />
              <button onClick={saveNote} className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold-dark))] transition-all">
                Сохранить заметку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLeads() {
  return (
    <AdminGuard>
      <AdminLayout>
        <LeadsContent />
      </AdminLayout>
    </AdminGuard>
  );
}
