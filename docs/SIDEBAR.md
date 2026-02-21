# 📋 Dokumentasi Komponen Sidebar

## 🎯 Overview

Komponen Sidebar adalah navigasi utama untuk aplikasi masjid-keuangan yang menggunakan Next.js 14 App Router dengan TypeScript dan Tailwind CSS.

## ✨ Fitur

- ✅ **Fixed Position** - Sidebar tetap di kiri dengan full height (h-screen)
- ✅ **Responsive Design** - Menyesuaikan di desktop dan mobile
- ✅ **Modern UI** - Warna hijau masjid (green-700) dengan design clean
- ✅ **Active State** - Highlight menu aktif menggunakan usePathname
- ✅ **Lucide Icons** - Icon modern dan konsisten
- ✅ **Smooth Animation** - Transisi smooth dengan duration 300ms
- ✅ **Toggle Functionality** - Bisa dikecilkan/diperbesar
- ✅ **Logout Button** - Tombol logout di bagian bawah

## 📁 File Location

```
src/
├── components/
│   ├── Sidebar.tsx           # Komponen sidebar utama
│   └── LayoutWithSidebar.tsx # Layout wrapper dengan sidebar
```

## 🎨 Design Specifications

### Colors
- **Primary**: `green-700` (warna hijau masjid)
- **Hover**: `green-600`
- **Active**: `green-600` dengan border putih
- **Text**: `white` untuk teks primary, `green-100` untuk secondary
- **Logout Hover**: `red-600`

### Layout
- **Width**: 256px (w-64) saat terbuka, 64px (w-16) saat tertutup
- **Position**: Fixed left dengan z-index 40
- **Height**: Full screen (h-screen)

### Icons (Lucide React)
- Dashboard: `LayoutDashboard`
- Pemasukan: `TrendingUp`
- Pengeluaran: `TrendingDown`
- Buka Puasa: `Calendar`
- Laporan: `FileText`
- Logout: `LogOut`
- Masjid Header: `Mosque`

## 🔧 Usage

### Basic Implementation

```tsx
import { Sidebar } from "@/components/Sidebar";

export function MyLayout() {
  return (
    <div>
      <Sidebar isOpen={true} onToggle={() => {}} />
      {/* Your content */}
    </div>
  );
}
```

### With LayoutWithSidebar (Recommended)

```tsx
import { LayoutWithSidebar } from "@/components/LayoutWithSidebar";

export default function MyPage() {
  return (
    <LayoutWithSidebar>
      <div className="p-8">
        <h1>Your Page Content</h1>
        {/* Your page content here */}
      </div>
    </LayoutWithSidebar>
  );
}
```

## 📱 Responsive Behavior

### Desktop (lg and above)
- Sidebar tetap terlihat
- Content otomatis menyesuaikan margin-left
- Toggle functionality untuk minimize/maximize

### Mobile (below lg)
- Sidebar sebagai overlay
- Background blur dengan opacity
- Toggle button di kiri atas
- Auto-close saat click overlay

## 🎛️ Props

### Sidebar Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `true` | Status sidebar terbuka/tertutup |
| `onToggle` | `() => void` | - | Callback function untuk toggle sidebar |

### LayoutWithSidebar Component

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Content yang akan ditampilkan |

## 🚀 Features Detail

### Active State Detection
Menggunakan `usePathname` dari `next/navigation`:
```tsx
const pathname = usePathname();
const isActive = pathname === item.href;
```

### Responsive Toggle
```tsx
const [sidebarOpen, setSidebarOpen] = useState(true);

// Mobile button
<button onClick={toggleSidebar} className="lg:hidden">
  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
</button>
```

### Logout Functionality
```tsx
const handleLogout = () => {
  if (confirm("Apakah Anda yakin ingin logout?")) {
    // Add your logout logic here
    console.log("Logout clicked");
  }
};
```

## 🎨 CSS Classes

### Main Container
```tsx
className={cn(
  "fixed left-0 top-0 h-screen bg-green-700 text-white shadow-2xl transition-all duration-300 ease-in-out z-40",
  isOpen ? "w-64" : "w-16"
)}
```

### Menu Item
```tsx
className={cn(
  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
  "hover:bg-green-600 hover:shadow-md",
  isActive
    ? "bg-green-600 shadow-md border-l-4 border-white"
    : "text-green-100 hover:text-white"
)}
```

## 📋 Menu Structure

| Menu | Path | Icon | Description |
|------|------|------|-------------|
| Dashboard | `/dashboard` | LayoutDashboard | Ringkasan keuangan |
| Pemasukan | `/pemasukan` | TrendingUp | Kelola pemasukan |
| Pengeluaran | `/pengeluaran` | TrendingDown | Kelola pengeluaran |
| Buka Puasa | `/buka-puasa` | Calendar | Dana buka puasa |
| Laporan | `/laporan` | FileText | Laporan keuangan |

## 🎭 States

### Sidebar States
- **Open**: `w-64` dengan semua text terlihat
- **Closed**: `w-16` hanya icon terlihat
- **Mobile**: Overlay dengan background blur

### Menu Item States
- **Normal**: `text-green-100`
- **Hover**: `bg-green-600 text-white`
- **Active**: `bg-green-600 border-l-4 border-white`

## 🔧 Customization

### Menambah Menu Item Baru
```tsx
const menuItems = [
  // existing items...
  {
    href: "/new-page",
    label: "New Menu",
    icon: YourLucideIcon,
  },
];
```

### Mengubah Warna
```tsx
// Di file globals.css atau component
.sidebar-custom {
  @apply bg-blue-700; // Ganti green-700
}
```

## 🐛 Troubleshooting

### Sidebar Tidak Muncul
- Pastikan `lucide-react` sudah terinstall
- Check browser console untuk error TypeScript
- Verify import path benar

### Active State Tidak Berfungsi
- Pastikan menggunakan exact path match
- Check spelling pada menu href
- Verify `usePathname` di client component

### Mobile Toggle Tidak Berfungsi
- Pastikan component adalah client component (`"use client"`)
- Check state management pada parent component

## 📦 Dependencies

```json
{
  "lucide-react": "^0.454.0",
  "next": "16.1.6",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.4"
}
```

## ✅ Best Practices

1. **Always use LayoutWithSidebar** untuk konsistensi
2. **Check responsive** di berbagai screen size
3. **Test navigation** di semua menu
4. **Implement logout logic** sesuai kebutuhan
5. **Consider accessibility** untuk screen readers

---

**Made with ❤️ for Masjid Keuangan System**