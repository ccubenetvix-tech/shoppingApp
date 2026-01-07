import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  store: string;
  inStock: boolean;
}

const favoriteItems: FavoriteItem[] = [
  {
    id: '1',
    name: 'Fresh Organic Apples',
    price: 25.99,
    originalPrice: 29.99,
    image: '🍎',
    category: 'Groceries',
    rating: 4.5,
    store: 'Fresh Market',
    inStock: true,
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 899.99,
    originalPrice: 1299.99,
    image: '🎧',
    category: 'Electronics',
    rating: 4.8,
    store: 'Tech World',
    inStock: true,
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    price: 199.99,
    originalPrice: 249.99,
    image: '👕',
    category: 'Fashion',
    rating: 4.3,
    store: 'Fashion Hub',
    inStock: false,
  },
  {
    id: '4',
    name: 'Coffee Beans 1kg',
    price: 149.99,
    image: '☕',
    category: 'Groceries',
    rating: 4.7,
    store: 'Fresh Market',
    inStock: true,
  },
  {
    id: '5',
    name: 'Yoga Mat',
    price: 299.99,
    originalPrice: 399.99,
    image: '🧘‍♀️',
    category: 'Sports',
    rating: 4.6,
    store: 'Sports Zone',
    inStock: true,
  },
  {
    id: '6',
    name: 'Skincare Set',
    price: 450.00,
    image: '🧴',
    category: 'Beauty',
    rating: 4.4,
    store: 'Beauty Corner',
    inStock: true,
  },
];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(favoriteItems);
  const [filter, setFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const removeFavorite = (id: string) => {
    setFavorites(items => items.filter(item => item.id !== id));
  };

  const addToCart = (item: FavoriteItem) => {
    // Add to cart logic here
  };

  const filteredFavorites = favorites.filter(item => {
    if (filter === 'inStock') return item.inStock;
    if (filter === 'outOfStock') return !item.inStock;
    return true;
  });

  const renderFavoriteItem = ({ item }: { item: FavoriteItem }) => (
    <View style={[styles.favoriteItem, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemEmoji}>{item.image}</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => removeFavorite(item.id)}
        >
          <Ionicons name="heart" size={24} color="#FF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.itemContent}>
        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={[styles.itemCategory, { color: colors.textSecondary }]}>
          {item.category} • {item.store}
        </Text>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={[styles.rating, { color: colors.textSecondary }]}>
            {item.rating}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            R{item.price.toFixed(2)}
          </Text>
          {item.originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              R{item.originalPrice.toFixed(2)}
            </Text>
          )}
        </View>

        <View style={styles.actionContainer}>
          <View style={[
            styles.stockStatus,
            { backgroundColor: item.inStock ? '#E8F5E8' : '#FFE8E8' }
          ]}>
            <Text style={[
              styles.stockText,
              { color: item.inStock ? '#4CAF50' : '#FF4444' }
            ]}>
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.addToCartButton,
              { 
                backgroundColor: item.inStock ? colors.primary : colors.border,
                opacity: item.inStock ? 1 : 0.5
              }
            ]}
            onPress={() => addToCart(item)}
            disabled={!item.inStock}
          >
            <Ionicons 
              name="bag-add" 
              size={16} 
              color={item.inStock ? "#fff" : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const FilterButton = ({ 
    title, 
    value, 
    count 
  }: { 
    title: string; 
    value: typeof filter; 
    count: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: filter === value ? colors.primary : colors.cardBackground,
          borderColor: colors.border,
        }
      ]}
      onPress={() => setFilter(value)}
    >
      <Text style={[
        styles.filterButtonText,
        { color: filter === value ? '#fff' : colors.text }
      ]}>
        {title} ({count})
      </Text>
    </TouchableOpacity>
  );

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
        </View>
        
        <View style={styles.emptyFavorites}>
          <Text style={styles.emptyFavoritesEmoji}>💝</Text>
          <Text style={[styles.emptyFavoritesTitle, { color: colors.text }]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptyFavoritesSubtitle, { color: colors.textSecondary }]}>
            Start adding items to your favorites to see them here
          </Text>
          <TouchableOpacity style={[styles.shopButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <FilterButton 
          title="All" 
          value="all" 
          count={favorites.length} 
        />
        <FilterButton 
          title="In Stock" 
          value="inStock" 
          count={favorites.filter(item => item.inStock).length} 
        />
        <FilterButton 
          title="Out of Stock" 
          value="outOfStock" 
          count={favorites.filter(item => !item.inStock).length} 
        />
      </View>

      {/* Favorites List */}
      <FlatList
        data={filteredFavorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.favoritesList}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />

      {/* Quick Actions */}
      <View style={[styles.quickActions, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="bag-add" size={20} color="#fff" />
          <Text style={styles.quickActionText}>Add All to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: colors.secondary }]}>
          <Ionicons name="share" size={20} color="#fff" />
          <Text style={styles.quickActionText}>Share List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  favoritesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  favoriteItem: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  itemEmoji: {
    fontSize: 40,
  },
  favoriteButton: {
    padding: 5,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  itemCategory: {
    fontSize: 12,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '600',
  },
  addToCartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyFavorites: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyFavoritesEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyFavoritesTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyFavoritesSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});