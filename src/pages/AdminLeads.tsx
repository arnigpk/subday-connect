import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { LeadRecord } from '@/lib/types';
import { Search, Download, X, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const STATUSES = ['new', 'in_progress', 'done', 'spam'] as const;
const STATUS_LABELS: Record<string, string> = {
  new: 'Новая', in_progress: 'В работе', done: 'Завершена', spam: 'Спам'
};
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700', in_progress: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700', spam: 'bg-red-100 text-red-700'
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-bold">Заявки партнёров</h2>
        <button onClick={exportCsv} className="btn-outline text-xs py-1.5 px-3 gap-1">
          <Download size={13} /> CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..." className="input-field pl-9 text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field text-sm w-auto">
          <option value="">Все статусы</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="animate-spin mx-auto" /></div>
      ) : (
        <div className="bg-background rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-muted-foreground">Дата</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Имя</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Город</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Телефон</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Заведение</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Статус</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-border/50 hover:bg-accent/30 cursor-pointer transition-colors" onClick={() => { setSelectedLead(lead); setNoteText(lead.note || ''); }}>
                  <td className="p-3 text-muted-foreground">{new Date(lead.created_at).toLocaleDateString('ru')}</td>
                  <td className="p-3 font-medium">{lead.name}</td>
                  <td className="p-3 hidden md:table-cell">{lead.city}</td>
                  <td className="p-3 hidden md:table-cell">{lead.phone}</td>
                  <td className="p-3 hidden lg:table-cell">{lead.venue}</td>
                  <td className="p-3">
                    <select
                      value={lead.status}
                      onChange={(e) => { e.stopPropagation(); updateMutation.mutate({ id: lead.id, updates: { status: e.target.value } }); }}
                      className={`text-xs font-medium px-2 py-1 rounded-lg border-0 ${STATUS_COLORS[lead.status] || ''}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Заявок нет</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead detail modal */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Заявка</h3>
              <button onClick={() => setSelectedLead(null)} className="p-1 hover:bg-accent rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-3 text-sm mb-6">
              <div><span className="text-muted-foreground">Дата:</span> <span className="font-medium">{new Date(selectedLead.created_at).toLocaleString('ru')}</span></div>
              <div><span className="text-muted-foreground">Имя:</span> <span className="font-medium">{selectedLead.name}</span></div>
              <div><span className="text-muted-foreground">Город:</span> <span className="font-medium">{selectedLead.city}</span></div>
              <div><span className="text-muted-foreground">Телефон:</span> <span className="font-medium">{selectedLead.phone}</span></div>
              <div><span className="text-muted-foreground">Заведение:</span> <span className="font-medium">{selectedLead.venue}</span></div>
              {selectedLead.comment && <div><span className="text-muted-foreground">Комментарий:</span> <span className="font-medium">{selectedLead.comment}</span></div>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                <MessageSquare size={12} /> Заметка
              </div>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="input-field text-sm resize-none" rows={3} placeholder="Внутренняя заметка..." />
              <button onClick={saveNote} className="btn-dark text-xs py-1.5 px-3 w-full justify-center">Сохранить заметку</button>
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
