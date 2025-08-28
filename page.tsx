import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="text-center max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Postara</h1>
        <p className="text-xl text-gray-600 mb-2">
          Stuck thinking of a caption? Let AI do the work.
        </p>
        <p className="text-lg text-gray-500 mb-8">
          Upload your image, choose your style, and get 5 perfect captions ready for Instagram, TikTok, and more!
        </p>
        <Link
          href="/tool"
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Creating Now
        </Link>
      </div>
    </div>
  );
}