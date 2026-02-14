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
    if (error) {
      toast.error(error.message);
    } else {
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Медиа</h2>
        <label className="btn-gold text-xs py-1.5 px-3 gap-1 cursor-pointer">
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          Загрузить
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {isLoading ? (
        <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-muted-foreground" /></div>
      ) : imageFiles.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Нет файлов</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {imageFiles.map((file) => (
            <div key={file.name} className="group relative bg-background rounded-xl border border-border overflow-hidden">
              <div className="aspect-square bg-accent/30 flex items-center justify-center">
                <img src={getUrl(file.name)} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-2">
                <p className="text-xs truncate text-muted-foreground">{file.name}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => copyUrl(file.name)} className="p-1.5 bg-background/80 backdrop-blur rounded-lg hover:bg-background transition-colors" title="Копировать URL">
                  <Copy size={12} />
                </button>
                <button onClick={() => deleteFile(file.name)} className="p-1.5 bg-background/80 backdrop-blur rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors" title="Удалить">
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
