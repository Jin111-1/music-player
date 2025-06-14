import { Geist } from "next/font/google";
import { useRouter } from "next/router";
const geist = Geist({
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  return (
    <div className={`${geist.className} min-h-screen bg-gradient-to-b from-gray-900 to-black text-white`}>
      <div className="container mx-auto px-4 py-16">
        <main className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Music Player
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl">
            เพลิดเพลินไปกับเสียงเพลงที่คุณชื่นชอบ พร้อมฟีเจอร์สุดพิเศษที่รอคุณอยู่
          </p>
          <div className="flex gap-4">
            <button onClick={() => router.push("/player")} className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-medium transition-colors">
              เริ่มต้นใช้งาน
            </button>
            <button className="px-8 py-3 border border-purple-600 hover:bg-purple-600/10 rounded-full font-medium transition-colors">
              เรียนรู้เพิ่มเติม
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
