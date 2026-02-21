const headings = [
    "1. 導入：収録スタイルと近況",
    "2. 「バイブコーディング」とアプリの激増",
    "3. コーディングの役割変化と AI モデル開発",
    "6. AI の進化圧・「従順な AI」とパーソナライズ",
    "16. 人間の脳・機械・AI の得意／不得意とメタファー"
];

function slugify(text) {
    return text.toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
}

headings.forEach(h => {
    console.log(`Original: ${h}`);
    console.log(`Slugged:  ${slugify(h)}`);
});
