import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry as required
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback smart pedagogical response generator for offline / no-key mode
function generateFallbackResponse(userMessage: string, context?: string): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('perkalian') || msg.includes('kali') || msg.includes('a^m * a^n') || msg.includes('basis sama')) {
    return 'Halo Hero! Pada perkalian bilangan berpangkat dengan basis yang sama, gunakan sifat: **aᵐ × aⁿ = aᵐ⁺ⁿ**. Artinya, basisnya tetap sama dan pangkatnya dijumlahkan! Contoh: 2³ × 2⁴ = 2³⁺⁴ = 2⁷ = 128. Ada soal perkalian yang sedang kamu hadapi?';
  }
  
  if (msg.includes('pembagian') || msg.includes('bagi') || msg.includes('a^m / a^n') || msg.includes(':')) {
    return 'Salam pejuang! Pada pembagian bilangan berpangkat dengan basis yang sama, gunakan sifat: **aᵐ : aⁿ = aᵐ⁻ⁿ** (dengan a ≠ 0). Pangkat pembilang dikurangi pangkat penyebut! Contoh: 5⁶ : 5² = 5⁶⁻² = 5⁴ = 625.';
  }
  
  if (msg.includes('pangkat dipangkatkan') || msg.includes('(a^m)^n') || msg.includes('dobel') || msg.includes('ganda')) {
    return 'Luar biasa, Hero! Jika bilangan berpangkat dipangkatkan lagi, pangkatnya dikalikan: **(aᵐ)ⁿ = aᵐˣⁿ**. Contoh: (3²)⁴ = 3²ˣ⁴ = 3⁸.';
  }
  
  if (msg.includes('negatif') || msg.includes('minus') || msg.includes('a^-n')) {
    return 'Perhatikan sifat penting ini, Hero: **a⁻ⁿ = 1 / aⁿ** (dengan a ≠ 0). Pangkat negatif menunjukkan kebalikan (pecahan)! Contoh: 2⁻³ = 1/(2³) = 1/8. Jadi tanda minus di pangkat bukan berarti hasilnya bernilai negatif ya!';
  }
  
  if (msg.includes('nol') || msg.includes('0') || msg.includes('a^0')) {
    return 'Misteri pangkat nol terpecahkan! Untuk setiap bilangan real a ≠ 0, berlaku: **a⁰ = 1**. Mengapa? Karena aⁿ : aⁿ = aⁿ⁻ⁿ = a⁰, dan bilangan apa pun dibagi dirinya sendiri menghasilkan 1!';
  }
  
  if (msg.includes('bos') || msg.includes('dark exponent') || msg.includes('strategi') || msg.includes('kalah')) {
    return 'Strategi menghadapi Boss Dark Exponent: Perhatikan sifat eksponen per tahap! Gunakan skill pertahanan saat HP berkurang, simpan item Concentration Potion, dan teliti dalam menghitung tanda minus serta urutan operasi campuran (tanda kurung didahulukan). Kamu pasti bisa menang!';
  }

  return `Semangat belajar, Hero SMKN 4 Soppeng! Saya AI Coach Sahabat Hero siap membimbingmu menaklukkan 6 Zona Bilangan Berpangkat:
1. Perkalian: aᵐ × aⁿ = aᵐ⁺ⁿ
2. Pembagian: aᵐ : aⁿ = aᵐ⁻ⁿ
3. Pangkat dari Pangkat: (aᵐ)ⁿ = aᵐˣⁿ
4. Pangkat Negatif: a⁻ⁿ = 1/aⁿ
5. Pangkat Nol: a⁰ = 1
6. Campuran: gabungan sifat-sifat di atas!

Ketik pertanyaan spesifik atau klik tombol petunjuk jika kamu butuh bantuan menyelesaikan quest!`;
}

// API Route: AI Coach Sahabat Hero
app.post('/api/coach', async (req, res) => {
  try {
    const { message, history, context, isAssessment } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    // Safety guard during formal assessment
    if (isAssessment) {
      return res.json({
        reply: 'Hero, selama Asesmen Resmi berlangsung, AI Coach hanya dapat memberikan motivasi dan petunjuk umum konsep, bukan kunci jawaban langsung! Terapkan sifat-sifat bilangan berpangkat yang telah kamu latih di arena!',
      });
    }

    if (aiClient && process.env.GEMINI_API_KEY) {
      try {
        const systemInstruction = `Anda adalah "AI COACH – SAHABAT HERO", pelatih dan mentor matematika yang ramah, memotivasi, dan bijaksana dalam game edukasi MOBA "EDU LEGENDS: POWER SURVIVAL".
Pencipta game: Suwandi, S.Pd. dari SMKN 4 Soppeng untuk siswa kelas X SMK (Fase E).
Materi: Sifat-Sifat Bilangan Berpangkat (Perkalian basis sama, Pembagian basis sama, Pangkat dipangkatkan, Pangkat negatif, Pangkat nol, Operasi campuran).

Aturan Bimbingan:
1. Bersikaplah seperti pelatih MOBA legendaris yang mendidik murid sebagai Hero matematika.
2. Jelaskan konsep langkah demi langkah (scaffolding). Bimbing murid memahami "mengapa", bukan sekadar memberi angka akhir.
3. Selalu gunakan notasi matematika yang rapi dan mudah dibaca dalam bahasa Indonesia komunikatif.
4. Jangan pernah membocorkan jawaban langsung jika murid sedang dalam ujian/asesmen resmi.
5. Kaitkan sesekali dengan kejuruan SMK (teknik komputer/jaringan biner 2^n, mesin, elektronika, daya listrik) dan berikan pujian jika murid berusaha dengan gigih.
6. Jawab secara ringkas, jelas, terarah (maksimal 3-4 paragraf) agar nyaman dibaca di panel chat game.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${context ? `[Konteks Permainan: ${context}]\n` : ''}Pertanyaan Murid: ${message}`,
          config: {
            systemInstruction,
          },
        });

        const reply = response.text || generateFallbackResponse(message, context);
        return res.json({ reply });
      } catch (err) {
        console.warn('Gemini API call failed, falling back to smart heuristic:', err);
        const fallback = generateFallbackResponse(message, context);
        return res.json({ reply: fallback });
      }
    } else {
      // Offline / Local fallback mode
      const reply = generateFallbackResponse(message, context);
      return res.json({ reply, mode: 'local_coach' });
    }
  } catch (error: any) {
    console.error('Error in /api/coach:', error);
    return res.status(500).json({ error: 'Gagal memproses pesan coach' });
  }
});

// Setup Vite Dev Server or Production Static Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`EDU LEGENDS Server running at http://localhost:${PORT}`);
  });
}

startServer();
