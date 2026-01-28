'use client';

import { useState } from 'react';
import { login } from '@/app/actions';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        try {
            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
            }
        } catch (e) {
            setError('エラーが発生しました。');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md p-8 bg-card-bg rounded-xl shadow-2xl border border-gray-800">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">管理者ログイン</h1>
                    <p className="text-gray-400">オーナー専用の管理画面へアクセスします</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            メールアドレス
                        </label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="admin@example.com"
                            className="w-full bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            パスワード
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-[#0F0F0F] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-tube-red transition-all"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
                            {error === 'Invalid login credentials' ? 'ログイン情報が正しくありません。' : error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${loading
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-tube-red hover:bg-red-600 shadow-lg shadow-red-900/20'
                            }`}
                    >
                        {loading ? 'ログイン中...' : 'ログイン'}
                    </button>
                </form>
            </div>
        </div>
    );
}
