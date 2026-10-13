import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDate, formatPrice, getSeatLabel } from '../utils/tour';

// ===== Câu 3a: kiểu dữ liệu =====
export type Tour = {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string; // "YYYY-MM-DD"
  image: string;
  isFavorite: boolean;
};

export type TourItemProps = {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
};

function TourItem({ tour, compact = false, onPress, onToggleFavorite }: TourItemProps) {
  const lowSeats = tour.seats <= 3; // còn ≤ 3 chỗ hoặc hết chỗ → chữ đỏ

  return (
    // Nhấn phần còn lại của thẻ → onPress(tour)
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.card, compact ? styles.cardCompact : styles.cardRow]}
      onPress={() => onPress(tour)}
    >
      <Image
        source={{ uri: tour.image }}
        style={compact ? styles.imageCompact : styles.image}
      />

      <View style={[styles.info, compact && styles.infoCompact]}>
        <Text style={styles.name} numberOfLines={compact ? 1 : 2}>
          {tour.name}
        </Text>

        {/* Câu 4b: compact ẩn thành phố, ngày, số chỗ */}
        {!compact && (
          <>
            <Text style={styles.city}>{tour.city}</Text>
            <Text style={styles.meta}>
              📅 {formatDate(tour.departure)} · {tour.days} ngày
            </Text>
          </>
        )}

        <Text style={styles.price}>{formatPrice(tour.price)}</Text>

        {!compact && (
          <Text style={[styles.seats, lowSeats && styles.seatsLow]}>
            {getSeatLabel(tour.seats)}
          </Text>
        )}
      </View>

      {/* Câu 3e: nút tim là TouchableOpacity riêng, không mở Alert */}
      <TouchableOpacity
        testID="fav-btn"
        style={[styles.favBtn, compact && styles.favBtnCompact]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
      >
        <Text style={[styles.heart, tour.isFavorite && styles.heartActive]}>
          {tour.isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  // compact = false: bố cục ngang
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  // compact = true: thẻ dọc rộng 160
  cardCompact: {
    flexDirection: 'column',
    width: 160,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  imageCompact: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#e5e7eb',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  infoCompact: {
    flex: 0,
    marginLeft: 0,
    padding: 8,
  },
  name: { fontSize: 15, fontWeight: '700', color: '#111827' },
  city: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  meta: { fontSize: 13, color: '#374151', marginTop: 2 },
  price: { fontSize: 14, fontWeight: '700', color: '#0e7490', marginTop: 4 },
  seats: { fontSize: 12, color: '#16a34a', marginTop: 2 },
  seatsLow: { color: '#dc2626', fontWeight: '600' },
  favBtn: {
    paddingHorizontal: 6,
    alignSelf: 'center',
  },
  // nút tim đè lên góc phải trên của ảnh
  favBtnCompact: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  heart: { fontSize: 22, color: '#9ca3af' },
  heartActive: { color: '#e11d48' },
});

export default React.memo(TourItem);
