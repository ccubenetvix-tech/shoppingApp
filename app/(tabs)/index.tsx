import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'Groceries', icon: 'local-grocery-store' as const, color: '#4CAF50' },
  { id: '2', name: 'Electronics', icon: 'devices' as const, color: '#2196F3' },
  { id: '3', name: 'Fashion', icon: 'checkroom' as const, color: '#E91E63' },
  { id: '4', name: 'Home & Garden', icon: 'home' as const, color: '#FF9800' },
  { id: '5', name: 'Sports', icon: 'sports-soccer' as const, color: '#9C27B0' },
  { id: '6', name: 'Books', icon: 'menu-book' as const, color: '#795548' },
];

const featuredProducts = [
  { id: '1', name: 'Fresh Organic Apples', price: 'R25.99', originalPrice: 'R29.99', image: '🍎', category: 'Groceries', rating: 4.5 },
  { id: '2', name: 'Wireless Headphones', price: 'R899.99', originalPrice: 'R1299.99', image: '🎧', category: 'Electronics', rating: 4.8 },
  { id: '3', name: 'Cotton T-Shirt', price: 'R199.99', originalPrice: 'R249.99', image: '👕', category: 'Fashion', rating: 4.3 },
  { id: '4', name: 'Coffee Beans 1kg', price: 'R149.99', originalPrice: 'R179.99', image: '☕', category: 'Groceries', rating: 4.7 },
];

const stores = [
  { id: '1', name: 'Fresh Market', image: '🏪', rating: 4.6, deliveryTime: '20-30 min' },
  { id: '2', name: 'Tech World', image: '💻', rating: 4.8, deliveryTime: '45-60 min' },
  { id: '3', name: 'Fashion Hub', image: '👗', rating: 4.4, deliveryTime: '30-45 min' },
  { id: '4', name: 'Home Essentials', image: '🏠', rating: 4.5, deliveryTime: '25-40 min' },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => router.push('/categories')}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <MaterialIcons name={item.icon} size={24} color="#fff" />
      </View>
      <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: typeof featuredProducts[0] }) => (
    <TouchableOpacity 
      style={[styles.productCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => router.push('/product-details')}
    >
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>{item.image}</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.productCategory, { color: colors.textSecondary }]}>
          {item.category}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={[styles.rating, { color: colors.textSecondary }]}>{item.rating}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.primary }]}>{item.price}</Text>
          <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
            {item.originalPrice}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          <Ionicons name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderStore = ({ item }: { item: typeof stores[0] }) => (
    <TouchableOpacity style={[styles.storeCard, { backgroundColor: colors.cardBackground }]}>
      <Text style={styles.storeEmoji}>{item.image}</Text>
      <View style={styles.storeInfo}>
        <Text style={[styles.storeName, { color: colors.text }]}>{item.name}</Text>
        <View style={styles.storeDetails}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={[styles.rating, { color: colors.textSecondary }]}>{item.rating}</Text>
          </View>
          <Text style={[styles.deliveryTime, { color: colors.textSecondary }]}>
            {item.deliveryTime}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <Text style={styles.userName}>Welcome to Sweet Shop</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search products, stores..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => router.push('/search')}
          />
          <TouchableOpacity>
            <Ionicons name="options" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color="#fff" />
          <Text style={styles.locationText}>Deliver to: Green Way 3000, Sylhet</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Stores */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Stores</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={stores}
            renderItem={renderStore}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storesList}
          />
        </View>

        {/* Special Offers Banner */}
        <View style={[styles.offerBanner, { backgroundColor: colors.secondary }]}>
          <View style={styles.offerContent}>
            <Text style={styles.offerTitle}>🎉 Special Offer!</Text>
            <Text style={styles.offerSubtitle}>Get 20% off on your first order</Text>
            <TouchableOpacity style={styles.offerButton}>
              <Text style={styles.offerButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 15,
  },
  categoryCard: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    width: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  storesList: {
    paddingHorizontal: 20,
    gap: 15,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    width: width * 0.7,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storeEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  storeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    fontSize: 12,
    fontWeight: '500',
  },
  deliveryTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  offerBanner: {
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  offerContent: {
    alignItems: 'center',
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  offerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  offerButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  offerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  productsList: {
    paddingHorizontal: 20,
    gap: 15,
  },
  productCard: {
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
  productImage: {
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  productEmoji: {
    fontSize: 40,
  },
  favoriteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    padding: 5,
  },
  productInfo: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 6,
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
  addToCartButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
