/**
 * YouTubeの動画URLから動画IDを抽出し、サムネイル画像のURLを返します。
 * @param url YouTubeの動画URLまたはサムネイルURL
 * @returns サムネイル画像のURL（抽出できない場合は元のURLを返す）
 */
export function getThumbnailUrl(url: string | null | undefined): string {
    if (!url) return '/placeholder.jpg';

    // すでに画像URLっぽい場合はそのまま返す
    if (
        url.includes('img.youtube.com') ||
        url.includes('i.ytimg.com') ||
        url.includes('yt3.googleusercontent.com') ||
        url.includes('yt3.ggpht.com') ||
        url.endsWith('.jpg') ||
        url.endsWith('.png') ||
        url.endsWith('.webp')
    ) {
        return url;
    }

    // もしYouTubeのチャンネルページやユーザーページなら、画像ではないのでプレースホルダーを返す
    if (url.includes('youtube.com/@') || url.includes('youtube.com/channel/') || url.includes('youtube.com/user/')) {
        return '/placeholder.jpg';
    }

    // YouTubeの動画IDを抽出するための正規表現
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        const videoId = match[2];
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    return url;
}
