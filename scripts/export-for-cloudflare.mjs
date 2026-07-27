#!/usr/bin/env node

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URLとNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEYが必要です。");
const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/videos?select=*&order=created_at.asc`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
if (!response.ok) throw new Error(`Supabase export failed: ${response.status} ${await response.text()}`);
const videos = await response.json();
process.stdout.write(JSON.stringify({ exportedAt: new Date().toISOString(), videos }, null, 2));
