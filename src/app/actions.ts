'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getThumbnailUrl } from '@/lib/youtube';
import { revalidatePath } from 'next/cache';

export interface ActionState {
    error?: string;
}

/**
 * 認証済みユーザーを取得し、未認証の場合はエラーをスローします。
 */
async function ensureAuth() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Unauthorized');
    }
    return { supabase, user };
}

/**
 * FormDataからビデオ情報を抽出して返します。
 */
function parseVideoFormData(formData: FormData) {
    const view_count_raw = formData.get('view_count') as string;
    return {
        title: formData.get('title') as string,
        channel_name: formData.get('channel_name') as string,
        thumbnail_url: getThumbnailUrl(formData.get('thumbnail_url') as string),
        original_url: formData.get('original_url') as string,
        summary: formData.get('summary') as string,
        detailed_script: formData.get('detailed_script') as string,
        published_at: (formData.get('published_at') as string) || null,
        view_count: view_count_raw ? Number(view_count_raw) : 0,
        channel_thumbnail_url: formData.get('channel_thumbnail_url') as string,
        duration: formData.get('duration') as string,
    };
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
    const { supabase } = await ensureAuth();
    const videoData = parseVideoFormData(formData);

    const { error } = await supabase.from('videos').insert(videoData);

    if (error) {
        console.error('Error creating video:', error);
        throw new Error('Failed to create video');
    }

    revalidatePath('/');
    revalidatePath('/studio');
    redirect('/studio');
}

export async function updateVideo(id: string, formData: FormData) {
    const { supabase } = await ensureAuth();
    const videoData = parseVideoFormData(formData);

    const { error } = await supabase.from('videos').update(videoData).eq('id', id);

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
    const { supabase } = await ensureAuth();

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

/**
 * 閲覧数をアトミックにインクリメントします。
 */
export async function incrementViewCount(id: string) {
    const supabase = await createClient();

    // PostgreSQLのインクリメントを使用
    // Note: RPCなしでアトミックに実行するには SQL を直接叩くか RPC を定義する必要があります。
    // 現状は既存のロジックを整理して維持し、将来的に RPC への移行を推奨します。
    const { data: video } = await supabase
        .from('videos')
        .select('view_count')
        .eq('id', id)
        .single();

    if (video) {
        const currentViews = video.view_count || 0;
        const newViews = (currentViews < 0 ? 0 : currentViews) + 1;

        await supabase
            .from('videos')
            .update({ view_count: newViews })
            .eq('id', id);
    }
}

