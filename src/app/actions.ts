'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getThumbnailUrl } from '@/lib/youtube';
import { revalidatePath } from 'next/cache';

export interface ActionState {
    error?: string;
}

export async function login(prevState: ActionState | undefined, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    redirect('/studio');
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
}

export async function createVideo(formData: FormData) {
    const title = formData.get('title') as string;
    const channel_name = formData.get('channel_name') as string;
    const thumbnail_url = formData.get('thumbnail_url') as string;
    const original_url = formData.get('original_url') as string;
    const summary = formData.get('summary') as string;
    const detailed_script = formData.get('detailed_script') as string;
    const published_at = formData.get('published_at') as string;
    const view_count_raw = formData.get('view_count') as string;
    const view_count = view_count_raw ? Number(view_count_raw) : 0;
    const channel_thumbnail_url = formData.get('channel_thumbnail_url') as string;
    const duration = formData.get('duration') as string;

    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase.from('videos').insert({
        title,
        channel_name,
        thumbnail_url: getThumbnailUrl(thumbnail_url),
        original_url,
        summary,
        detailed_script,
        published_at: published_at || null,
        view_count,
        channel_thumbnail_url,
        duration,
    });

    if (error) {
        console.error('Error creating video:', error);
        throw new Error('Failed to create video');
    }

    revalidatePath('/');
    revalidatePath('/studio');
    redirect('/studio');
}

export async function updateVideo(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const channel_name = formData.get('channel_name') as string;
    const thumbnail_url = formData.get('thumbnail_url') as string;
    const original_url = formData.get('original_url') as string;
    const summary = formData.get('summary') as string;
    const detailed_script = formData.get('detailed_script') as string;
    const published_at = formData.get('published_at') as string;
    const view_count_raw = formData.get('view_count') as string;
    const view_count = view_count_raw ? Number(view_count_raw) : 0;
    const channel_thumbnail_url = formData.get('channel_thumbnail_url') as string;
    const duration = formData.get('duration') as string;

    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase.from('videos').update({
        title,
        channel_name,
        thumbnail_url: getThumbnailUrl(thumbnail_url),
        original_url,
        summary,
        detailed_script,
        published_at: published_at || null,
        view_count,
        channel_thumbnail_url,
        duration,
    }).eq('id', id);

    if (error) {
        console.error('Error updating video:', error);
        throw new Error('Failed to update video');
    }

    revalidatePath('/');
    revalidatePath(`/watch/${id}`);
    revalidatePath('/studio');
    redirect('/studio');
}

export async function deleteVideo(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id.trim());

    if (error) {
        console.error('Error deleting video:', error);
        throw new Error('Failed to delete video');
    }

    revalidatePath('/');
    revalidatePath('/studio');

    return { success: true };
}

export async function incrementViewCount(id: string) {
    const supabase = await createClient();

    // アトミックなインクリメントのためのRPCがない場合は、現在の値を取得して更新
    const { data: video } = await supabase
        .from('videos')
        .select('view_count')
        .eq('id', id)
        .single();

    if (video) {
        const currentViews = video.view_count || 0;
        // 既存の負の値があれば0からスタート、そうでなければ+1
        const newViews = (currentViews < 0 ? 0 : currentViews) + 1;

        await supabase
            .from('videos')
            .update({ view_count: newViews })
            .eq('id', id);
    }
}

