import type { Tour } from '../components/TourItem';

export type TourSection = { title: string; data: Tour[] };

// Câu 2a: nhóm theo thành phố, nhóm sắp A → Z, tour trong nhóm theo departure tăng dần
export function groupByCity(tours: Tour[]): TourSection[] {
  const map: Record<string, Tour[]> = {};
  tours.forEach((t) => {
    if (!map[t.city]) map[t.city] = [];
    map[t.city].push(t);
  });

  return Object.keys(map)
    .sort((a, b) => a.localeCompare(b, 'vi'))
    .map((city) => ({
      title: city,
      // "YYYY-MM-DD" so sánh chuỗi chính là so sánh ngày
      data: [...map[city]].sort((a, b) => a.departure.localeCompare(b.departure)),
    }));
}

// Câu 3c: "2026-11-05" → "05/11/2026"
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

// Câu 3c: 0 → "Hết chỗ", 1–3 → "Chỉ còn N chỗ", > 3 → "Còn N chỗ"
export function getSeatLabel(seats: number): string {
  if (seats <= 0) return 'Hết chỗ';
  if (seats <= 3) return `Chỉ còn ${seats} chỗ`;
  return `Còn ${seats} chỗ`;
}

// 3590000 → "3.590.000 ₫"
export function formatPrice(price: number): string {
  return `${Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ₫`;
}
