import { groupByCity, formatDate, getSeatLabel } from '../utils/tour';
import type { Tour } from '../components/TourItem';

const make = (id: string, city: string, departure: string): Tour => ({
  id,
  name: `Tour ${id}`,
  city,
  days: 3,
  price: 1000000,
  seats: 5,
  departure,
  image: 'https://example.com/a.jpg',
  isFavorite: false,
});

const fakeTours: Tour[] = [
  make('1', 'Huế', '2026-12-01'),
  make('2', 'Đà Lạt', '2026-11-20'),
  make('3', 'Cần Thơ', '2026-10-30'),
  make('4', 'Đà Lạt', '2026-11-05'),
  make('5', 'Huế', '2026-11-10'),
  make('6', 'Đà Lạt', '2026-12-24'),
];

describe('groupByCity', () => {
  const groups = groupByCity(fakeTours);

  test('đúng số nhóm', () => {
    expect(groups).toHaveLength(3);
  });

  test('tên thành phố sắp xếp A → Z', () => {
    expect(groups.map((g) => g.title)).toEqual(['Cần Thơ', 'Đà Lạt', 'Huế']);
  });

  test('tour trong nhóm sắp theo departure tăng dần', () => {
    const daLat = groups.find((g) => g.title === 'Đà Lạt')!;
    expect(daLat.data.map((t) => t.departure)).toEqual([
      '2026-11-05',
      '2026-11-20',
      '2026-12-24',
    ]);
    expect(daLat.data.map((t) => t.id)).toEqual(['4', '2', '6']);
  });
});

describe('formatDate', () => {
  test('"2026-11-05" → "05/11/2026"', () => {
    expect(formatDate('2026-11-05')).toBe('05/11/2026');
  });
});

describe('getSeatLabel', () => {
  test('0 → Hết chỗ', () => {
    expect(getSeatLabel(0)).toBe('Hết chỗ');
  });
  test('3 → Chỉ còn 3 chỗ', () => {
    expect(getSeatLabel(3)).toBe('Chỉ còn 3 chỗ');
  });
  test('4 → Còn 4 chỗ', () => {
    expect(getSeatLabel(4)).toBe('Còn 4 chỗ');
  });
});
