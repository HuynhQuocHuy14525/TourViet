import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TourItem, { Tour } from '../components/TourItem';

const tour: Tour = {
  id: '1',
  name: 'Đà Lạt mộng mơ',
  city: 'Đà Lạt',
  days: 3,
  price: 3590000,
  seats: 2,
  departure: '2026-11-05',
  image: 'https://example.com/dalat.jpg',
  isFavorite: false,
};

describe('TourItem - bố cục', () => {
  test('compact không hiển thị thành phố', () => {
    const { queryByText, getByText } = render(
      <TourItem tour={tour} compact onPress={jest.fn()} onToggleFavorite={jest.fn()} />
    );
    expect(queryByText('Đà Lạt')).toBeNull();
    expect(getByText('Đà Lạt mộng mơ')).toBeTruthy();
    expect(getByText('3.590.000 ₫')).toBeTruthy();
  });

  test('không compact thì hiển thị thành phố và đầy đủ thông tin', () => {
    const { queryByText, getByText } = render(
      <TourItem tour={tour} onPress={jest.fn()} onToggleFavorite={jest.fn()} />
    );
    expect(queryByText('Đà Lạt')).not.toBeNull();
    expect(getByText('📅 05/11/2026 · 3 ngày')).toBeTruthy();
    expect(getByText('Chỉ còn 2 chỗ')).toBeTruthy();
  });
});

describe('TourItem - sự kiện', () => {
  test('nhấn fav-btn gọi onToggleFavorite(id, true) 1 lần, không gọi onPress', () => {
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();
    const { getByTestId } = render(
      <TourItem tour={tour} onPress={onPress} onToggleFavorite={onToggleFavorite} />
    );

    fireEvent.press(getByTestId('fav-btn'));

    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onToggleFavorite).toHaveBeenCalledWith('1', true);
    expect(onPress).not.toHaveBeenCalled();
  });

  test('nhấn tên tour gọi onPress với cả object tour', () => {
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();
    const { getByText } = render(
      <TourItem tour={tour} onPress={onPress} onToggleFavorite={onToggleFavorite} />
    );

    fireEvent.press(getByText('Đà Lạt mộng mơ'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(tour);
    expect(onToggleFavorite).not.toHaveBeenCalled();
  });
});
