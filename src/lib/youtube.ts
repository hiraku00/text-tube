/**
 * YouTubeの動画URLから動画IDを抽出し、サムネイル画像のURLを返します。
 * @param url YouTubeの動画URLまたはサムネイルURL
 * @returns サムネイル画像のURL（抽出できない場合は元のURLを返す）
 */
export function getThumbnailUrl(url: string | null | undefined): string {
    if (!url) return '/placeholder.jpg';

    // すでに画像URLっぽい場合はそのまま返す（最低限のチェック）
    if (url.includes('img.youtube.com') || url.includes('i.ytimg.com') || url.endsWith('.jpg') || url.endsWith('.png')) {
        return url;
    }

    // YouTubeの動画IDを抽出するための正規表現
    // 支持形式:
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://youtube.com/embed/VIDEO_ID
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        const videoId = match[2];
        // 高画質なサムネイルを優先し、取得できない場合を考慮して標準画質も検討できるが、
        // 一般的には maxresdefault.jpg または hqdefault.jpg を使用する
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    return url;
}
