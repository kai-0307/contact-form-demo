import { ContactForm } from "../src/components/ContactForm";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md mx-auto p-6 bg-gray-800 shadow-xl rounded-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-4 text-white">
          お問い合わせフォーム
        </h1>

        <p className="text-gray-300 mb-6 text-center text-sm leading-relaxed">
          以下のフォームに必要事項を入力してください。
          <br />
          内容を確認後、担当者よりご連絡させていただきます。
        </p>

        <ContactForm />

        <footer className="mt-6 text-center text-xs text-gray-400">
          <p>© 2025 Contact Form Demo. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
