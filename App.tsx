import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SectionList,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TourItem, { Tour } from './components/TourItem';
import { groupByCity, formatDate, formatPrice } from './utils/tour';

const API_URL = 'https://6ac9d2d43115bcc95820099f.mockapi.io/tours';

// TODO: thay bằng MSSV và họ tên của bạn
const STUDENT = '23654001 – Huỳnh Quốc Huy';

function HomeScreen() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState(''); // Câu 1c

  // Câu 2: GET danh sách
  const fetchTours = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Tour[] = await res.json();
      setTours(data);
    } catch (e) {
      Alert.alert('Lỗi', 'Không tải được danh sách tour');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Câu 6a: lọc theo tên (không phân biệt hoa thường, trim), tính bằng useMemo.
  // groupByCity chỉ tạo nhóm từ tour còn lại → nhóm rỗng tự biến mất.
  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? tours.filter((t) => t.name.toLowerCase().includes(q)) : tours;
    return groupByCity(filtered);
  }, [tours, query]);

  // Câu 4c: mục yêu thích lấy từ toàn bộ tours (không bị ảnh hưởng bởi ô tìm kiếm)
  const favorites = useMemo(() => tours.filter((t) => t.isFavorite), [tours]);

  // Câu 3e: nhấn thẻ → Alert
  const handlePress = useCallback((tour: Tour) => {
    Alert.alert(
      tour.name,
      `Khởi hành: ${formatDate(tour.departure)}\nSố ngày: ${tour.days} ngày\nGiá: ${formatPrice(tour.price)}`
    );
  }, []);

  // Câu 5: PUT + cập nhật lạc quan + hoàn tác khi lỗi
  const handleToggleFavorite = useCallback(async (id: string, next: boolean) => {
    // 5b: đổi state ngay trước khi API trả về
    setTours((prev) => prev.map((t) => (t.id === id ? { ...t, isFavorite: next } : t)));
    try {
      // 5a
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      // 5c: hoàn tác + báo lỗi
      setTours((prev) => prev.map((t) => (t.id === id ? { ...t, isFavorite: !next } : t)));
      Alert.alert('Lỗi', 'Không cập nhật được yêu thích. Vui lòng thử lại.');
    }
  }, []);

  const renderFavorites = () => (
    <View style={styles.favSection}>
      <Text style={styles.favTitle}>Tour yêu thích ({favorites.length})</Text>
      {favorites.length === 0 ? (
        <Text style={styles.muted}>Chưa có tour yêu thích</Text>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.favList}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <TourItem
              tour={item}
              compact
              onPress={handlePress}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Câu 1c: Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tour Việt</Text>
        <Text style={styles.student}>{STUDENT}</Text>
        <TextInput
          style={styles.search}
          placeholder="Tìm tour theo tên..."
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        // Câu 2c
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0e7490" />
          <Text style={styles.muted}>Đang tải tour...</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {section.title} · {section.data.length} tour
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TourItem
              tour={item}
              onPress={handlePress}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          ListHeaderComponent={renderFavorites()}
          ListEmptyComponent={
            <Text style={[styles.muted, styles.empty]}>Không tìm thấy tour phù hợp</Text>
          }
          // Câu 6b: kéo để làm mới, giữ nguyên từ khoá (query không bị reset)
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchTours(true)} />
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}

// Câu 1a: toàn bộ app bọc trong SafeAreaProvider
export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#0e7490',
  },
  title: { fontSize: 26, fontWeight: '800', color: '#fff' },
  student: { fontSize: 13, color: '#cffafe', marginTop: 2 },
  search: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  favSection: { paddingTop: 14, paddingBottom: 6 },
  favTitle: { fontSize: 17, fontWeight: '700', marginHorizontal: 16, marginBottom: 10, color: '#111827' },
  favList: { paddingHorizontal: 16, paddingBottom: 6 },
  sectionHeader: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#075985' },
  muted: { color: '#6b7280', marginHorizontal: 16, marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 24 },
});
