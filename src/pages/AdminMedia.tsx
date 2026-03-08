import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

function MediaContent() {
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['media-files'],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('media').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw error;
      return data || [];
    }
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const name = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(name, file);
    if (error) toast.error(error.message);
    else {
      toast.success('Файл загружен');
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
    }
    setUploading(false);
    e.target.value = '';
  };

  const getUrl = (name: string) => {
    const { data } = supabase.storage.from('media').getPublicUrl(name);
    return data.publicUrl;
  };

  const copyUrl = (name: string) => {
    navigator.clipboard.writeText(getUrl(name));
    toast.success('URL скопирован');
  };

  const deleteFile = async (name: string) => {
    const { error } = await supabase.storage.from('media').remove([name]);
    if (error) toast.error(error.message);
    else {
      toast.success('Удалено');
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
    }
  };

  const imageFiles = files.filter((f) => !f.name.startsWith('.'));

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Медиа</h2>
          <p className="text-[12px] text-[hsl(220,10%,45%)]">{imageFiles.length} файлов</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold-dark))] transition-all cursor-pointer">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          Загрузить
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {isLoading ? (
        <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-[hsl(220,10%,30%)]" /></div>
      ) : imageFiles.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-[hsl(220,10%,14%)] flex items-center justify-center mx-auto mb-3">
            <ImageIcon size={28} className="text-[hsl(220,10%,25%)]" />
          </div>
          <p className="text-[13px] text-[hsl(220,10%,40%)]">Нет файлов</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {imageFiles.map((file) => (
            <div key={file.name} className="group relative bg-[hsl(220,10%,11%)] rounded-xl border border-[hsl(220,10%,18%)] overflow-hidden hover:border-[hsl(220,10%,25%)] transition-all">
              <div className="aspect-square bg-[hsl(220,10%,8%)] flex items-center justify-center">
                <img src={getUrl(file.name)} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-2">
                <p className="text-[11px] truncate text-[hsl(220,10%,45%)]">{file.name}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => copyUrl(file.name)} className="p-1.5 bg-[hsl(220,13%,12%)]/90 backdrop-blur rounded-lg hover:bg-[hsl(220,13%,18%)] transition-colors text-[hsl(220,10%,65%)]" title="Копировать URL">
                  <Copy size={12} />
                </button>
                <button onClick={() => deleteFile(file.name)} className="p-1.5 bg-[hsl(220,13%,12%)]/90 backdrop-blur rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors text-[hsl(220,10%,65%)]" title="Удалить">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminMedia() {
  return (
    <AdminGuard>
      <AdminLayout>
        <MediaContent />
      </AdminLayout>
    </AdminGuard>
  );
}
