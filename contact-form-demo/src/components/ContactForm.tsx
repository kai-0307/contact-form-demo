"use client";
import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: false });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "送信に失敗しました");
      }

      setStatus({ loading: false, error: "", success: true });
      setFormData({ name: "", email: "", message: "" }); // フォームをリセット
    } catch (error) {
      console.error("Error:", error);
      setStatus({
        loading: false,
        error: error instanceof Error ? error.message : "エラーが発生しました",
        success: false,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* お名前フィールド */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-3"
          >
            お名前
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full max-w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="山田 太郎"
          />
        </div>

        {/* メールアドレスフィールド */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-3"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full max-w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="your@email.com"
          />
        </div>

        {/* メッセージフィールド */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-300 mb-3"
          >
            メッセージ
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full max-w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
            placeholder="お問い合わせ内容をご記入ください"
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={status.loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          onClick={() =>
            console.log("送信ボタンクリック: loading =", status.loading)
          }
        >
          {status.loading ? "送信中..." : "送信"}
        </button>

        {/* ステータスメッセージ */}
        {status.error && (
          <div className="text-red-400 text-sm text-center mt-2">
            {status.error}
          </div>
        )}
        {status.success && (
          <div className="text-green-400 text-sm text-center mt-2">
            メッセージを送信しました
          </div>
        )}
      </form>
    </div>
  );
}
