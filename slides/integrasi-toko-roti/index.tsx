import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  Step,
  Steps,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

// Design system: palet "flour-terracotta" + Fraunces/Figtree (lihat docs/plan-slide-toko-roti.md §7b)
export const design: DesignSystem = {
  palette: { bg: '#f6f1e7', text: '#2b241e', accent: '#a3472b' },
  fonts: {
    display: '"Fraunces", Georgia, "Times New Roman", serif',
    body: '"Figtree", system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 140, body: 36 },
  radius: 4,
};

const SURFACE = '#ebe3d4';
const MUTED = '#6a5f54';
const LINE = '#d6cab6';
const ACCENT_INK = '#ffffff';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400..600,0..100&family=Figtree:wght@400;600&display=swap';
const FONT_LINK_ID = 'osd-webfont-integrasi-toko-roti';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// ---------------------------------------------------------------- primitives

const display: CSSProperties = {
  fontFamily: 'var(--osd-font-display)',
  fontWeight: 600,
  fontVariationSettings: "'SOFT' 30",
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
  margin: 0,
};

const Footer = ({ section, onAccent = false }: { section: string; onAccent?: boolean }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 48,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 24,
        color: onAccent ? 'rgba(255,255,255,0.82)' : MUTED,
      }}
    >
      <span>Toko Roti Nivla · Integrasi Data</span>
      <span>{section}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Frame = ({ section, children }: { section: string; children: ReactNode }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      boxSizing: 'border-box',
      padding: '112px 120px 0',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    {children}
    <Footer section={section} />
  </div>
);

const Title = ({ children }: { children: ReactNode }) => (
  <h2 style={{ ...display, fontSize: 72, marginBottom: 56 }}>{children}</h2>
);

const SectionPage = ({ part, title, sub }: { part: string; title: string; sub: string }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      boxSizing: 'border-box',
      padding: '0 120px',
      background: 'var(--osd-accent)',
      color: ACCENT_INK,
      fontFamily: 'var(--osd-font-body)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '0.04em' }}>{part}</div>
    <h2 style={{ ...display, fontSize: 120, margin: '28px 0 36px' }}>{title}</h2>
    <p style={{ fontSize: 36, lineHeight: 1.5, margin: 0, maxWidth: 1240 }}>{sub}</p>
    <Footer section={title} onAccent />
  </div>
);

// Tabel: baris grid dengan garis horizontal tipis, header ber-latar surface.
const Row = ({ cols, header = false, children }: { cols: string; header?: boolean; children: ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: cols,
      alignItems: 'center',
      columnGap: 24,
      padding: header ? '14px 20px' : '18px 20px',
      background: header ? SURFACE : 'transparent',
      borderBottom: `1px solid ${LINE}`,
      fontSize: header ? 24 : 28,
      fontWeight: header ? 600 : 400,
      color: header ? MUTED : 'var(--osd-text)',
      lineHeight: 1.35,
    }}
  >
    {children}
  </div>
);

const Mono = ({ children }: { children: ReactNode }) => (
  <span style={{ fontFamily: MONO, fontSize: 26, lineHeight: 1.5 }}>{children}</span>
);

type Level = 'Must' | 'Should' | 'Could' | "Won't";
const LEVEL_STYLE: Record<Level, CSSProperties> = {
  Must: { background: 'var(--osd-accent)', color: ACCENT_INK, border: '2px solid var(--osd-accent)' },
  Should: { color: 'var(--osd-text)', border: '2px solid var(--osd-text)' },
  Could: { color: MUTED, border: `2px solid ${MUTED}` },
  "Won't": { color: MUTED, border: `2px dashed ${MUTED}`, textDecoration: 'line-through' },
};
const Moscow = ({ level }: { level: Level }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '3px 14px',
      fontSize: 24,
      fontWeight: 600,
      borderRadius: 'var(--osd-radius)',
      ...LEVEL_STYLE[level],
    }}
  >
    {level}
  </span>
);

// ---------------------------------------------------------------- 01 cover

const Cover: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'var(--osd-bg)',
      color: 'var(--osd-text)',
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    <div style={{ position: 'absolute', left: 120, top: 112, fontSize: 28, color: MUTED }}>
      Enterprise Data Integration · Tugas Individu Sesi 2
    </div>
    <div style={{ position: 'absolute', left: 120, top: 330, width: 1120 }}>
      <h1 style={{ ...display, fontSize: 'var(--osd-size-hero)', lineHeight: 1.04 }}>
        Integrasi Data
        <br />
        Toko Roti Nivla
      </h1>
      <p style={{ fontSize: 'var(--osd-size-body)', lineHeight: 1.5, margin: '40px 0 0', maxWidth: 980 }}>
        Satu basis data harian untuk menentukan berapa roti yang dibuat besok pagi.
      </p>
    </div>
    <div style={{ position: 'absolute', left: 120, bottom: 112, fontSize: 28 }}>Titanio Yudista · 24120500031</div>
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 560,
        boxSizing: 'border-box',
        padding: '0 64px 112px',
        background: 'var(--osd-accent)',
        color: ACCENT_INK,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div style={{ ...display, fontSize: 168, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>04.00</div>
      <div style={{ fontSize: 28, lineHeight: 1.4, marginTop: 20 }}>
        Jam dapur mulai produksi. Rencana produksi harus siap sebelum jam ini.
      </div>
    </div>
  </div>
);
Cover.transition = {
  duration: 280,
  exit: { duration: 280, easing: EASE_IN, keyframes: [{ opacity: 1 }, { opacity: 1 }] },
  enter: {
    duration: 280,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// ---------------------------------------------------------------- 02 agenda

const AgendaRow = ({ n, label }: { n: string; label: string }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
      alignItems: 'baseline',
      padding: '30px 0',
      borderTop: `1px solid ${LINE}`,
    }}
  >
    <span style={{ ...display, fontSize: 56, color: 'var(--osd-accent)' }}>{n}</span>
    <span style={{ ...display, fontWeight: 400, fontSize: 52 }}>{label}</span>
  </div>
);

const Agenda: Page = () => (
  <Frame section="Pembuka">
    <Title>Agenda</Title>
    <AgendaRow n="01" label="Organisasi dan tujuan integrasi" />
    <AgendaRow n="02" label="Inventaris sistem" />
    <AgendaRow n="03" label="Kebutuhan dan prioritas MoSCoW" />
    <AgendaRow n="04" label="Peta aliran data dan pemetaan" />
  </Frame>
);

// ---------------------------------------------------------------- 03-06 organisasi

const Part1: Page = () => (
  <SectionPage
    part="Bagian 01"
    title="Organisasi"
    sub="Toko Roti Nivla adalah usaha fiktif yang dibuat untuk tugas ini, dengan masalah yang umum di toko roti kecil."
  />
);

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div style={{ padding: '18px 0', borderTop: `1px solid ${LINE}` }}>
    <div style={{ fontSize: 24, color: MUTED, lineHeight: 1.3 }}>{label}</div>
    <div style={{ fontSize: 34, lineHeight: 1.4, marginTop: 4 }}>{value}</div>
  </div>
);

const Profil: Page = () => (
  <Frame section="Organisasi">
    <Title>Profil Toko Roti Nivla</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 120 }}>
      <p style={{ ...display, fontWeight: 400, fontSize: 48, lineHeight: 1.3, margin: 0 }}>
        Satu dapur produksi memasok dua outlet. Roti dibuat setiap subuh dan dijual pada hari yang sama.
      </p>
      <div>
        <Fact label="Produksi" value="1 dapur pusat, mulai pukul 04.00" />
        <Fact label="Penjualan" value="Outlet A dan Outlet B, buka 07.00–21.00" />
        <Fact label="Kanal pesanan" value="Kasir, GoFood, GrabFood, pre-order WhatsApp" />
        <Fact label="Produk" value="Roti manis, roti tawar, pastry, kue pesanan" />
      </div>
    </div>
  </Frame>
);

const Loaf = () => (
  <div style={{ width: 72, height: 40, borderRadius: '22px 22px 6px 6px', background: 'var(--osd-accent)' }} />
);

const Shelf = ({ children }: { children?: ReactNode }) => (
  <div
    style={{
      height: 44,
      display: 'flex',
      alignItems: 'flex-end',
      gap: 16,
      borderBottom: '5px solid var(--osd-text)',
      paddingLeft: 8,
    }}
  >
    {children}
  </div>
);

const Rack = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      background: SURFACE,
      borderRadius: 'var(--osd-radius)',
      padding: '28px 32px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
    }}
  >
    {children}
  </div>
);

const Case = ({ head, body, children }: { head: string; body: string; children: ReactNode }) => (
  <div>
    <Rack>{children}</Rack>
    <h3 style={{ ...display, fontSize: 56, margin: '36px 0 12px' }}>{head}</h3>
    <p style={{ fontSize: 32, lineHeight: 1.5, margin: 0, maxWidth: 720 }}>{body}</p>
  </div>
);

const Masalah: Page = () => (
  <Frame section="Organisasi">
    <Title>Produksi masih berdasarkan perkiraan</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 64 }}>
      <Case head="Terlalu banyak" body="Roti sisa masih ada di rak saat outlet tutup pukul 21.00.">
        <Shelf>
          <Loaf />
          <Loaf />
          <Loaf />
          <Loaf />
          <Loaf />
          <Loaf />
          <Loaf />
          <Loaf />
        </Shelf>
        <Shelf>
          <Loaf />
          <Loaf />
          <Loaf />
          <Loaf />
          <Loaf />
          <Loaf />
          <Loaf />
        </Shelf>
      </Case>
      <Case head="Terlalu sedikit" body="Produk yang laris habis sebelum siang, pembeli pulang tanpa membeli.">
        <Shelf>
          <Loaf />
        </Shelf>
        <Shelf />
      </Case>
    </div>
    <p
      style={{
        fontSize: 36,
        lineHeight: 1.5,
        margin: '56px 0 0',
        paddingTop: 28,
        borderTop: `1px solid ${LINE}`,
      }}
    >
      Data penjualan tersebar di empat tempat yang tidak terhubung: kasir, aplikasi ojek online, WhatsApp, dan
      spreadsheet.
    </p>
  </Frame>
);

const Outcome = ({ head, body }: { head: string; body: string }) => (
  <div style={{ borderTop: '3px solid var(--osd-text)', paddingTop: 24 }}>
    <h3 style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.3, margin: 0 }}>{head}</h3>
    <p style={{ fontSize: 28, lineHeight: 1.45, color: MUTED, margin: '12px 0 0' }}>{body}</p>
  </div>
);

const Tujuan: Page = () => (
  <Frame section="Organisasi">
    <Title>Tujuan integrasi</Title>
    <p style={{ ...display, fontWeight: 400, fontSize: 52, lineHeight: 1.3, maxWidth: 1560 }}>
      Menyatukan data penjualan, pre-order, resep, dan stok bahan ke satu basis data harian, supaya rencana produksi
      besok <span style={{ color: 'var(--osd-accent)' }}>siap sebelum pukul 04.00</span>.
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 64, marginTop: 80 }}>
      <Steps>
        <Step>
          <Outcome
            head="Produksi sesuai permintaan"
            body="Jumlah per produk dihitung dari penjualan 4 minggu terakhir dan pre&#8209;order."
          />
        </Step>
        <Step>
          <Outcome head="Belanja bahan sesuai resep" body="Daftar belanja = resep × rencana produksi − stok gudang." />
        </Step>
        <Step>
          <Outcome
            head="Satu laporan untuk pemilik"
            body="Ringkasan pagi menggantikan rekap manual dari tiap outlet."
          />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ---------------------------------------------------------------- 07-08 inventaris

const Part2: Page = () => (
  <SectionPage
    part="Bagian 02"
    title="Inventaris sistem"
    sub="Tujuh sistem yang saat ini menyimpan data Toko Roti Nivla, masing-masing dengan pemilik dan formatnya sendiri."
  />
);

const INV_COLS = '40px 360px 230px 460px 1fr';
const Inventaris: Page = () => (
  <Frame section="Inventaris">
    <Title>Inventaris tujuh sistem</Title>
    <Row cols={INV_COLS} header>
      <span>#</span>
      <span>Sistem</span>
      <span>Pemilik</span>
      <span>Platform</span>
      <span>Jenis data</span>
    </Row>
    <Row cols={INV_COLS}>
      <span style={{ color: MUTED }}>1</span>
      <b style={{ fontWeight: 600 }}>POS kasir</b>
      <span>Kepala Outlet</span>
      <span>Moka POS (cloud)</span>
      <span>Transaksi: item, qty, harga, waktu</span>
    </Row>
    <Row cols={INV_COLS}>
      <span style={{ color: MUTED }}>2</span>
      <b style={{ fontWeight: 600 }}>GoFood & GrabFood</b>
      <span>Admin Online</span>
      <span>Portal merchant, ekspor CSV</span>
      <span>Pesanan online, komisi platform</span>
    </Row>
    <Row cols={INV_COLS}>
      <span style={{ color: MUTED }}>3</span>
      <b style={{ fontWeight: 600 }}>Pre-order kue</b>
      <span>Admin Online</span>
      <span>WhatsApp Business + Google Form</span>
      <span>Pesanan, no. HP, tanggal ambil</span>
    </Row>
    <Row cols={INV_COLS}>
      <span style={{ color: MUTED }}>4</span>
      <b style={{ fontWeight: 600 }}>Resep & produksi</b>
      <span>Kepala Produksi</span>
      <span>Google Sheets</span>
      <span>Resep, target dan hasil produksi</span>
    </Row>
    <Row cols={INV_COLS}>
      <span style={{ color: MUTED }}>5</span>
      <b style={{ fontWeight: 600 }}>Stok bahan baku</b>
      <span>Staf Gudang</span>
      <span>Microsoft Excel</span>
      <span>Stok, penerimaan, pemakaian</span>
    </Row>
    <Row cols={INV_COLS}>
      <span style={{ color: MUTED }}>6</span>
      <b style={{ fontWeight: 600 }}>Catatan roti sisa</b>
      <span>Kepala Outlet</span>
      <span>Google Form</span>
      <span>Sisa per produk, outlet, hari</span>
    </Row>
    <Row cols={INV_COLS}>
      <span style={{ color: MUTED }}>7</span>
      <b style={{ fontWeight: 600 }}>Akuntansi</b>
      <span>Bagian Keuangan</span>
      <span>Jurnal.id (cloud)</span>
      <span>Penjualan, pembelian, HPP</span>
    </Row>
    <p style={{ fontSize: 28, lineHeight: 1.4, color: MUTED, margin: '28px 0 0 20px' }}>
      Sistem baru: basis data terpusat (PostgreSQL) yang diisi oleh ETL terjadwal (n8n).
    </p>
  </Frame>
);

// ---------------------------------------------------------------- 09-12 kebutuhan

const Part3: Page = () => (
  <SectionPage
    part="Bagian 03"
    title="Kebutuhan"
    sub="Tujuh kebutuhan fungsional dan empat non-fungsional, diberi prioritas dengan MoSCoW."
  />
);

const F_COLS = '80px 1fr 150px';
const Fungsional: Page = () => (
  <Frame section="Kebutuhan">
    <Title>Kebutuhan fungsional</Title>
    <Row cols={F_COLS} header>
      <span>ID</span>
      <span>Sistem harus dapat…</span>
      <span>Prioritas</span>
    </Row>
    <Row cols={F_COLS}>
      <b style={{ fontWeight: 600 }}>F1</b>
      <span>Menarik transaksi POS kedua outlet setiap hari pukul 21.30, setelah outlet tutup</span>
      <span><Moscow level="Must" /></span>
    </Row>
    <Row cols={F_COLS}>
      <b style={{ fontWeight: 600 }}>F2</b>
      <span>Menggabungkan pesanan GoFood dan GrabFood ke tabel penjualan dengan kode produk internal</span>
      <span><Moscow level="Must" /></span>
    </Row>
    <Row cols={F_COLS}>
      <b style={{ fontWeight: 600 }}>F3</b>
      <span>Menghitung jumlah produksi besok per produk dari rata-rata 4 minggu, pre-order, dan tren sisa</span>
      <span><Moscow level="Must" /></span>
    </Row>
    <Row cols={F_COLS}>
      <b style={{ fontWeight: 600 }}>F4</b>
      <span>Menghitung kebutuhan bahan dari resep × rencana produksi, lalu membuat daftar belanja</span>
      <span><Moscow level="Must" /></span>
    </Row>
    <Row cols={F_COLS}>
      <b style={{ fontWeight: 600 }}>F5</b>
      <span>Memasukkan pre-order ke rencana produksi sesuai tanggal ambil</span>
      <span><Moscow level="Should" /></span>
    </Row>
    <Row cols={F_COLS}>
      <b style={{ fontWeight: 600 }}>F6</b>
      <span>Mengirim ringkasan penjualan dan roti sisa ke pemilik setiap pagi pukul 06.00</span>
      <span><Moscow level="Should" /></span>
    </Row>
    <Row cols={F_COLS}>
      <b style={{ fontWeight: 600 }}>F7</b>
      <span>Mengirim ringkasan penjualan dan pembelian harian ke Jurnal.id</span>
      <span><Moscow level="Could" /></span>
    </Row>
  </Frame>
);

const NF_COLS = '80px 300px 1fr 150px';
const NonFungsional: Page = () => (
  <Frame section="Kebutuhan">
    <Title>Kebutuhan non-fungsional</Title>
    <Row cols={NF_COLS} header>
      <span>ID</span>
      <span>Aspek</span>
      <span>Kebutuhan</span>
      <span>Prioritas</span>
    </Row>
    <Row cols={NF_COLS}>
      <b style={{ fontWeight: 600 }}>NF1</b>
      <span>Ketepatan waktu</span>
      <span>Rencana produksi siap paling lambat pukul 04.00</span>
      <span><Moscow level="Must" /></span>
    </Row>
    <Row cols={NF_COLS}>
      <b style={{ fontWeight: 600 }}>NF2</b>
      <span>Kualitas data</span>
      <span>Transaksi duplikat ditolak; produk tak dikenal ditandai untuk dicek</span>
      <span><Moscow level="Should" /></span>
    </Row>
    <Row cols={NF_COLS}>
      <b style={{ fontWeight: 600 }}>NF3</b>
      <span>Keamanan</span>
      <span>Akses per peran; nomor HP pelanggan hanya terlihat Admin Online</span>
      <span><Moscow level="Should" /></span>
    </Row>
    <Row cols={NF_COLS}>
      <b style={{ fontWeight: 600 }}>NF4</b>
      <span>Kegunaan</span>
      <span>Rencana produksi dan laporan dapat dibuka di HP</span>
      <span><Moscow level="Could" /></span>
    </Row>
    <Row cols={NF_COLS}>
      <b style={{ fontWeight: 600, color: MUTED }}>W1</b>
      <span style={{ color: MUTED }}>Di luar cakupan</span>
      <span style={{ color: MUTED }}>Integrasi mesin oven/IoT dan aplikasi pemesanan milik sendiri</span>
      <span><Moscow level="Won't" /></span>
    </Row>
    <p style={{ fontSize: 28, lineHeight: 1.4, color: MUTED, margin: '28px 0 0 20px' }}>
      Won't berarti tidak dikerjakan pada fase ini, bukan ditolak selamanya.
    </p>
  </Frame>
);

const MoscowCol = ({
  level,
  count,
  ids,
  desc,
}: {
  level: Level;
  count: string;
  ids: string;
  desc: string;
}) => {
  const strong = level === 'Must';
  const rule = strong ? 'var(--osd-accent)' : level === 'Should' ? 'var(--osd-text)' : MUTED;
  return (
    <div style={{ borderTop: `4px solid ${rule}`, paddingTop: 28 }}>
      <div style={{ ...display, fontSize: 168, lineHeight: 1, color: strong ? 'var(--osd-accent)' : 'var(--osd-text)' }}>
        {count}
      </div>
      <div style={{ fontSize: 36, fontWeight: 600, marginTop: 20 }}>{level}</div>
      <p style={{ fontSize: 28, lineHeight: 1.45, margin: '12px 0 0', minHeight: 82 }}>{desc}</p>
      <div style={{ fontFamily: MONO, fontSize: 24, color: MUTED, marginTop: 20 }}>{ids}</div>
    </div>
  );
};

const RingkasanMoscow: Page = () => (
  <Frame section="Kebutuhan">
    <Title>Prioritas MoSCoW</Title>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 56 }}>
      <MoscowCol level="Must" count="5" desc="Wajib ada agar rencana produksi bisa berjalan." ids="F1 F2 F3 F4 NF1" />
      <MoscowCol level="Should" count="4" desc="Penting, tetapi rencana tetap jalan tanpanya." ids="F5 F6 NF2 NF3" />
      <MoscowCol level="Could" count="2" desc="Dikerjakan bila waktu dan biaya cukup." ids="F7 NF4" />
      <MoscowCol level="Won't" count="1" desc="Tidak dikerjakan pada fase ini." ids="W1" />
    </div>
  </Frame>
);

// ---------------------------------------------------------------- 13-15 aliran data

const Part4: Page = () => (
  <SectionPage
    part="Bagian 04"
    title="Aliran data"
    sub="Bagaimana data berpindah dari enam sistem sumber ke rencana produksi, dan field apa yang dipetakan."
  />
);

type NodeTone = 'plain' | 'outline' | 'accent';
const Node = ({
  x,
  y,
  w,
  h,
  title,
  sub,
  tone = 'plain',
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  tone?: NodeTone;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      boxSizing: 'border-box',
      padding: '0 22px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderRadius: 'var(--osd-radius)',
      background: tone === 'accent' ? 'var(--osd-accent)' : tone === 'outline' ? 'var(--osd-bg)' : SURFACE,
      border: tone === 'outline' ? '2px solid var(--osd-text)' : 'none',
      color: tone === 'accent' ? ACCENT_INK : 'var(--osd-text)',
    }}
  >
    <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2 }}>{title}</div>
    <div style={{ fontSize: 24, lineHeight: 1.25, marginTop: 4, color: tone === 'accent' ? ACCENT_INK : MUTED }}>
      {sub}
    </div>
  </div>
);

// Garis bezier horizontal + kepala panah segitiga (tanpa <marker> agar aman di thumbnail).
const Edge = ({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) => {
  const mx = (x1 + x2) / 2;
  return (
    <g>
      <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2 - 10},${y2}`} fill="none" stroke={color} strokeWidth={2.5} />
      <polygon points={`${x2 - 14},${y2 - 8} ${x2},${y2} ${x2 - 14},${y2 + 8}`} fill={color} />
    </g>
  );
};

const LAYER: CSSProperties = { position: 'absolute', left: 0, top: 0, width: 1680, height: 608 };
const ACCENT_HEX = design.palette.accent;

const PetaAliran: Page = () => (
  <Frame section="Aliran data">
    <Title>Peta aliran data</Title>
    <div style={{ position: 'relative', width: 1680, height: 608 }}>
      {/* sumber: tampil sejak awal */}
      <Node x={0} y={0} w={380} h={88} title="POS kasir" sub="Moka API · transaksi" />
      <Node x={0} y={104} w={380} h={88} title="GoFood & GrabFood" sub="Ekspor CSV · pesanan" />
      <Node x={0} y={208} w={380} h={88} title="Pre-order kue" sub="Form → Sheets · pesanan" />
      <Node x={0} y={312} w={380} h={88} title="Resep & produksi" sub="Sheets API · resep" />
      <Node x={0} y={416} w={380} h={88} title="Stok bahan baku" sub="Unggah Excel · stok" />
      <Node x={0} y={520} w={380} h={88} title="Catatan roti sisa" sub="Form → Sheets · sisa" />
      <Steps>
        <Step>
          <div style={LAYER}>
            <svg width={1680} height={608} style={{ position: 'absolute', left: 0, top: 0 }}>
              <Edge x1={380} y1={44} x2={500} y2={264} color={MUTED} />
              <Edge x1={380} y1={148} x2={500} y2={280} color={MUTED} />
              <Edge x1={380} y1={252} x2={500} y2={296} color={MUTED} />
              <Edge x1={380} y1={356} x2={500} y2={312} color={MUTED} />
              <Edge x1={380} y1={460} x2={500} y2={328} color={MUTED} />
              <Edge x1={380} y1={564} x2={500} y2={344} color={MUTED} />
              <Edge x1={760} y1={304} x2={840} y2={304} color={MUTED} />
            </svg>
            <Node x={500} y={234} w={260} h={140} title="ETL terjadwal" sub="n8n · 21.30" tone="outline" />
            <Node x={840} y={234} w={260} h={140} title="Basis data terpusat" sub="PostgreSQL" tone="accent" />
          </div>
        </Step>
        <Step>
          <div style={LAYER}>
            <svg width={1680} height={608} style={{ position: 'absolute', left: 0, top: 0 }}>
              <Edge x1={1100} y1={280} x2={1220} y2={112} color={ACCENT_HEX} />
              <Edge x1={1100} y1={296} x2={1220} y2={240} color={ACCENT_HEX} />
              <Edge x1={1100} y1={312} x2={1220} y2={368} color={ACCENT_HEX} />
              <Edge x1={1100} y1={328} x2={1220} y2={496} color={ACCENT_HEX} />
            </svg>
            <Node x={1220} y={62} w={460} h={100} title="Rencana produksi" sub="Sheet dapur · siap pukul 04.00" />
            <Node x={1220} y={190} w={460} h={100} title="Daftar belanja bahan" sub="Sheet gudang · Staf Gudang" />
            <Node x={1220} y={318} w={460} h={100} title="Laporan pagi" sub="Email pemilik · pukul 06.00" />
            <Node x={1220} y={446} w={460} h={100} title="Jurnal.id" sub="Jurnal API · Bagian Keuangan" />
          </div>
        </Step>
      </Steps>
    </div>
  </Frame>
);

const Field = ({ top, field }: { top: string; field: string }) => (
  <span style={{ display: 'flex', flexDirection: 'column' }}>
    <span style={{ fontSize: 24, color: MUTED, lineHeight: 1.3 }}>{top}</span>
    <Mono>{field}</Mono>
  </span>
);

const MAP_COLS = '40px 500px 560px 1fr';
const Pemetaan: Page = () => (
  <Frame section="Aliran data">
    <Title>Pemetaan sumber ke target</Title>
    <Row cols={MAP_COLS} header>
      <span>#</span>
      <span>Sumber</span>
      <span>Target</span>
      <span>Transformasi</span>
    </Row>
    <Row cols={MAP_COLS}>
      <span style={{ color: MUTED }}>1</span>
      <Field top="Moka POS" field="item_name" />
      <Field top="VARCHAR" field="dim_produk.kode_produk" />
      <span>Lookup tabel alias nama produk</span>
    </Row>
    <Row cols={MAP_COLS}>
      <span style={{ color: MUTED }}>2</span>
      <Field top="Moka POS" field="created_at" />
      <Field top="DATE" field="fakta_penjualan.tanggal" />
      <span>UTC → WIB, ambil tanggalnya</span>
    </Row>
    <Row cols={MAP_COLS}>
      <span style={{ color: MUTED }}>3</span>
      <Field top="GoFood" field="order_id" />
      <Field top="VARCHAR" field="fakta_penjualan.id_transaksi" />
      <span>Tambah prefix GF- agar unik</span>
    </Row>
    <Row cols={MAP_COLS}>
      <span style={{ color: MUTED }}>4</span>
      <Field top="GoFood" field="gross_amount" />
      <Field top="NUMERIC" field="fakta_penjualan.nilai_bersih" />
      <span>Dikurangi komisi platform</span>
    </Row>
    <Row cols={MAP_COLS}>
      <span style={{ color: MUTED }}>5</span>
      <Field top="Google Form pre-order" field="Tanggal ambil" />
      <Field top="DATE" field="pesanan.tanggal_ambil" />
      <span>Teks dd/mm/yyyy → DATE</span>
    </Row>
    <Row cols={MAP_COLS}>
      <span style={{ color: MUTED }}>6</span>
      <Field top="Sheet resep" field="takaran_gram" />
      <Field top="NUMERIC" field="bom.qty_kg_per_pcs" />
      <span>÷ pcs per adonan ÷ 1000</span>
    </Row>
  </Frame>
);

// ---------------------------------------------------------------- 16 penutup

const TimePoint = ({ time, label, strong = false }: { time: string; label: string; strong?: boolean }) => (
  <div style={{ position: 'relative', paddingTop: 52 }}>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 26,
        height: 26,
        borderRadius: 13,
        boxSizing: 'border-box',
        background: strong ? 'var(--osd-accent)' : 'var(--osd-bg)',
        border: `3px solid ${strong ? 'var(--osd-accent)' : 'var(--osd-text)'}`,
      }}
    />
    <div
      style={{
        ...display,
        fontSize: 56,
        color: strong ? 'var(--osd-accent)' : 'var(--osd-text)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {time}
    </div>
    <p style={{ fontSize: 28, lineHeight: 1.4, margin: '12px 24px 0 0' }}>{label}</p>
  </div>
);

const Penutup: Page = () => (
  <Frame section="Penutup">
    <Title>Alur harian setelah integrasi</Title>
    <div style={{ position: 'relative', marginTop: 24 }}>
      <div style={{ position: 'absolute', top: 12, left: 0, right: 0, height: 2, background: LINE }} />
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <TimePoint time="21.00" label="Outlet tutup" />
        <TimePoint time="21.30" label="ETL menarik data semua kanal" />
        <TimePoint time="22.00" label="Rencana produksi dan daftar belanja dihitung" />
        <TimePoint time="04.00" label="Dapur mulai produksi" strong />
        <TimePoint time="06.00" label="Laporan pagi ke pemilik" />
        <TimePoint time="07.00" label="Outlet buka" />
      </div>
    </div>
    <div
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 150,
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ ...display, fontSize: 96 }}>Terima kasih</div>
      <div style={{ fontSize: 32, color: MUTED }}>Pertanyaan dan masukan dipersilakan.</div>
    </div>
  </Frame>
);

// ---------------------------------------------------------------- export

export const meta: SlideMeta = {
  title: 'Integrasi Data Toko Roti Nivla',
  createdAt: '2026-11-23T16:47:46.666Z',
};

export default [
  Cover,
  Agenda,
  Part1,
  Profil,
  Masalah,
  Tujuan,
  Part2,
  Inventaris,
  Part3,
  Fungsional,
  NonFungsional,
  RingkasanMoscow,
  Part4,
  PetaAliran,
  Pemetaan,
  Penutup,
] satisfies Page[];

export const notes: (string | undefined)[] = [
  `Selamat pagi. Saya akan mempresentasikan rancangan integrasi data untuk Toko Roti Nivla, sebuah usaha fiktif.
Angka 04.00 di kanan adalah inti tugas ini: jam dapur mulai produksi, sehingga rencana produksi harus sudah siap sebelum jam itu.`,
  `Presentasi ini mengikuti empat instruksi tugas: organisasi dan tujuannya, inventaris sistem, kebutuhan dengan MoSCoW, lalu peta aliran data dan pemetaan field.`,
  `Bagian pertama: organisasinya. Toko Roti Nivla fiktif, tetapi masalahnya umum di toko roti kecil.`,
  `Toko Roti Nivla punya satu dapur pusat dan dua outlet. Produksi mulai pukul 04.00, outlet buka 07.00 sampai 21.00.
Pesanan datang dari kasir, GoFood, GrabFood, dan pre-order lewat WhatsApp.`,
  `Masalahnya ada dua sisi. Kalau produksi kebanyakan, roti sisa terbuang karena roti cepat basi. Kalau kurang, produk laris habis sebelum siang.
Penyebabnya bukan dapurnya, tetapi datanya: penjualan tercatat di empat tempat yang tidak terhubung, jadi kepala produksi hanya bisa memperkirakan.`,
  `Tujuan integrasinya: semua data itu masuk ke satu basis data setiap malam, sehingga rencana produksi siap sebelum pukul 04.00.
(klik) Hasil pertama: jumlah produksi per produk dihitung dari data.
(klik) Kedua: daftar belanja bahan langsung dari resep dikali rencana produksi, dikurangi stok.
(klik) Ketiga: pemilik cukup membaca satu laporan pagi.`,
  `Bagian kedua: inventaris sistem yang sekarang dipakai.`,
  `Ada tujuh sistem. Platformnya campuran: dua layanan cloud, portal merchant dengan ekspor CSV, WhatsApp, Google Sheets, Excel, dan Google Form.
Pemiliknya juga berbeda-beda, dan inilah alasan integrasi dibutuhkan. Sistem barunya adalah satu basis data PostgreSQL yang diisi ETL terjadwal dengan n8n.`,
  `Bagian ketiga: kebutuhan. Saya membaginya menjadi fungsional dan non-fungsional, lalu memberi prioritas dengan MoSCoW.`,
  `Empat kebutuhan Must membentuk jalur utama: tarik data POS, gabungkan pesanan online, hitung produksi, hitung kebutuhan bahan.
F5 dan F6 Should karena rencana tetap bisa jalan tanpanya. F7, kirim ke Jurnal.id, Could karena keuangan masih bisa input manual.`,
  `Non-fungsional terpenting adalah NF1: tepat waktu sebelum 04.00. Kalau terlambat, integrasinya tidak berguna untuk hari itu.
NF2 menjaga kualitas data, NF3 melindungi nomor HP pelanggan. Integrasi mesin oven dan aplikasi pemesanan sendiri sengaja di luar cakupan fase ini.`,
  `Ringkasannya: lima Must, empat Should, dua Could, dan satu Won't. Jumlah Must sengaja dibatasi pada hal yang membuat rencana produksi bisa berjalan.`,
  `Bagian terakhir: bagaimana datanya mengalir.`,
  `Di kiri ada enam sumber data, masing-masing dengan cara pengambilan datanya: API untuk Moka dan Google Sheets, ekspor CSV untuk GoFood dan GrabFood, Google Form yang tersimpan ke Sheets, dan unggah file Excel untuk stok. (klik) Setiap pukul 21.30, ETL di n8n menarik data dari semuanya dan menyimpannya ke basis data terpusat di PostgreSQL.
(klik) Dari basis data itu keluar empat hasil: rencana produksi untuk dapur, daftar belanja untuk gudang, laporan pagi untuk pemilik, dan ringkasan ke Jurnal.id.`,
  `Ini enam contoh pemetaan field. Nama produk di kasir diubah menjadi kode produk internal, supaya roti yang sama dari kasir dan GoFood terhitung sebagai satu produk.
Waktu dari UTC dikonversi ke WIB. ID pesanan GoFood diberi awalan agar tidak bentrok dengan ID kasir. Nilai GoFood dikurangi komisi. Tanggal ambil dari Google Form yang berupa teks diubah menjadi tipe DATE. Takaran resep dalam gram per adonan diubah menjadi kilogram per potong roti.`,
  `Sebagai penutup, inilah satu hari setelah integrasi: outlet tutup pukul 21.00, data ditarik pukul 21.30, rencana dihitung pukul 22.00, dapur mulai pukul 04.00 dengan angka yang sudah jelas.
Terima kasih, saya persilakan jika ada pertanyaan atau masukan.`,
];
