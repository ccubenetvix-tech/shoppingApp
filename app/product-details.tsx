import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const productImages = ['🍎', '🍏', '🍎', '🍏'];

const reviews = [
  {
    id: '1',
    user: 'Sarah M.',
    rating: 5,
    comment: 'Fresh and delicious! Great quality apples.',
    date: '2 days ago'
  },
  {
    id: '2',
    user: 'John D.',
    rating: 4,
    comment: 'Good quality, fast delivery. Will order again.',
    date: '1 week ago'
  },
  {
    id: '3',
    user: 'Emma L.',
    rating: 5,
    comment: 'Perfect for my kids\' lunch boxes. Highly recommended!',
    date: '2 weeks ago'
  },
];

const relatedProducts = [
  { id: '1', name: 'Green Apples', price: 'R22.99', image: '🍏' },
  { id: '2', name: 'Bananas', price: 'R18.99', image: '🍌' },
  { id: '3', name: 'Oranges', price: 'R28.99', image: '🍊' },
  { id: '4', name: 'Pears', price: 'R32.99', image: '🍐' },
];

export default function ProductDetailsScreen() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'description' | 'reviews' | 'related'>('description');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const product = {
    name: 'Fresh Organic Apples',
    price: 25.99,
    originalPrice: 29.99,
    rating: 4.5,
    reviewCount: 128,
    store: 'Fresh Market',
    category: 'Groceries',
    inStock: true,
    description: 'Premium quality organic apples, freshly picked from local orchards. These crisp and juicy apples are perfect for snacking, baking, or adding to your favorite recipes. Rich in vitamins and fiber, they make a healthy choice for the whole family.',
    features: [
      'Organically grown',
      'No pesticides or chemicals',
      'Fresh from local farms',
      'Rich in vitamins A & C',
      'High fiber content'
    ],
    nutritionFacts: {
      calories: '52 per 100g',
      carbs: '14g',
      fiber: '2.4g',
      sugar: '10g',
      protein: '0.3g'
    }
  };

  const updateQuantity = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    // Add to cart logic here
  };

  const renderImageCarousel = () => (
    <View style={styles.imageContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setSelectedImageIndex(index);
        }}
      >
        {productImages.map((image, index) => (
          <View key={index} style={styles.imageSlide}>
            <Text style={styles.productImage}>{image}</Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.imageIndicators}>
        {productImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === selectedImageIndex ? colors.primary : colors.border,
              }
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => setIsFavorite(!isFavorite)}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite ? "#FF4444" : colors.text}
        />
      </TouchableOpacity>
    </View>
  );

  const renderDescription = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.description, { color: colors.text }]}>
        {product.description}
      </Text>
      
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>
      {product.features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Nutrition Facts</Text>
      <View style={[styles.nutritionContainer, { backgroundColor: colors.cardBackground }]}>
        {Object.entries(product.nutritionFacts).map(([key, value]) => (
          <View key={key} style={styles.nutritionItem}>
            <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <Text style={[styles.nutritionValue, { color: colors.text }]}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      {reviews.map((review) => (
        <View key={review.id} style={[styles.reviewItem, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.reviewHeader}>
            <Text style={[styles.reviewUser, { color: colors.text }]}>{review.user}</Text>
            <View style={styles.reviewRating}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name="star"
                  size={12}
                  color={i < review.rating ? "#FFD700" : colors.border}
                />
              ))}
            </View>
            <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>{review.date}</Text>
          </View>
          <Text style={[styles.reviewComment, { color: colors.text }]}>{review.comment}</Text>
        </View>
      ))}
    </View>
  );

  const renderRelated = () => (
    <View style={styles.tabContent}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {relatedProducts.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.relatedItem, { backgroundColor: colors.cardBackground }]}>
            <Text style={styles.relatedImage}>{item.image}</Text>
            <Text style={[styles.relatedName, { color: colors.text }]} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={[styles.relatedPrice, { color: colors.primary }]}>{item.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        {renderImageCarousel()}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <View style={styles.productTitleContainer}>
              <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
              <Text style={[styles.productCategory, { color: colors.textSecondary }]}>
                {product.category} • {product.store}
              </Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.rating, { color: colors.text }]}>{product.rating}</Text>
              <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
                ({product.reviewCount})
              </Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.primary }]}>
              R{product.price.toFixed(2)}
            </Text>
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              R{product.originalPrice.toFixed(2)}
            </Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Text>
            </View>
          </View>

          <View style={[styles.stockStatus, { backgroundColor: '#E8F5E8' }]}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={[styles.stockText, { color: '#4CAF50' }]}>In Stock</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['description', 'reviews', 'related'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                {
                  borderBottomColor: selectedTab === tab ? colors.primary : 'transparent',
                }
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[
                styles.tabText,
                { color: selectedTab === tab ? colors.primary : colors.textSecondary }
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {selectedTab === 'description' && renderDescription()}
        {selectedTab === 'reviews' && renderReviews()}
        {selectedTab === 'related' && renderRelated()}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.border }]}
            onPress={() => updateQuantity(-1)}
          >
            <Ionicons name="remove" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.quantity, { color: colors.text }]}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: colors.primary }]}
            onPress={() => updateQuantity(1)}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
          onPress={addToCart}
        >
          <Ionicons name="bag-add" size={20} color="#fff" />
          <Text style={styles.addToCartText}>
            Add to Cart • R{(product.price * quantity).toFixed(2)}
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  imageSlide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    fontSize: 120,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 20,
  },
  productHeader: {
    marginBottom: 15,
  },
  productTitleContainer: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabContent: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
  },
  nutritionContainer: {
    borderRadius: 12,
    padding: 15,
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  nutritionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewItem: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
  relatedItem: {
    width: 120,
    padding: 12,
    borderRadius: 12,
    marginRight: 15,
    alignItems: 'center',
  },
  relatedImage: {
    fontSize: 40,
    marginBottom: 8,
  },
  relatedName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});