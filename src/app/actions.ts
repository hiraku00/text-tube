'use server';

import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function createVideo(formData: FormData) {
    const title = formData.get('title') as string;
    const channel_name = formData.get('channel_name') as string;
    const thumbnail_url = formData.get('thumbnail_url') as string;
    const original_url = formData.get('original_url') as string;
    const summary = formData.get('summary') as string;
    const detailed_script = formData.get('detailed_script') as string;

    const { error } = await supabase.from('videos').insert({
        title,
        channel_name,
        thumbnail_url,
        original_url,
        summary,
        detailed_script,
    });

    if (error) {
        console.error('Error creating video:', error);
        throw new Error('Failed to create video');
    }

    redirect('/');
}
