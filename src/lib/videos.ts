import { createClient } from '@/lib/supabase/server';

export type SortOrder = 'created_at-desc' | 'view_count-desc' | 'created_at-asc';

export async function getVideos(options: { q?: string; sort?: SortOrder } = {}) {
    const { q = '', sort = 'created_at-desc' } = options;
    const [sortCol, sortDir] = sort.split('-');

    const supabase = await createClient();

    let query = supabase
        .from('videos')
        .select('*')
        .order(sortCol as any, { ascending: sortDir === 'asc' });

    if (q) {
        query = query.or(`title.ilike.%${q}%,channel_name.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching videos:', error);
        return [];
    }

    return data || [];
}
