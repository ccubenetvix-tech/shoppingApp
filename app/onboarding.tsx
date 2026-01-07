import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingData {
  id: number;
  title: string;
  titleAfrikaans: string;
  subtitle: string;
  subtitleAfrikaans: string;
  image: any;
}

const onboardingData: OnboardingData[] = [
  {
    id: 1,
    title: 'Your holiday shopping delivered to your home 🏠',
    titleAfrikaans: 'Jou vakansie-inkopies afgelewer by jou huis 🏠',
    subtitle: "There's something for everyone to enjoy with Sweet Shop Favourites",
    subtitleAfrikaans: "Daar is iets vir almal om te geniet met Sweet Shop Gunstelinge",
    image: require('@/assets/images/react-logo.png'), // Placeholder image
  },
  {
    id: 2,
    title: 'Discover Local Stores & Products',
    titleAfrikaans: 'Ontdek Plaaslike Winkels & Produkte',
    subtitle: 'Browse through our gallery of stores and find exactly what you need',
    subtitleAfrikaans: 'Blaai deur ons galery van winkels en vind presies wat jy nodig het',
    image: require('@/assets/images/react-logo.png'), // Placeholder image
  },
  {
    id: 3,
    title: 'Safe & Secure Shopping',
    titleAfrikaans: 'Veilige & Beveiligde Inkopies',
    subtitle: 'Pay securely with card or mobile money. Your safety is our priority',
    subtitleAfrikaans: 'Betaal veilig met kaart of mobiele geld. Jou veiligheid is ons prioriteit',
    image: require('@/assets/images/react-logo.png'), // Placeholder image
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAfrikaans, setIsAfrikaans] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const currentData = onboardingData[currentIndex];

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Mark onboarding as seen
      await AsyncStorage.setItem('onboardingSeen', 'true');
      // Navigate to login screen
      router.replace('/login');
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as seen
    await AsyncStorage.setItem('onboardingSeen', 'true');
    router.replace('/login');
  };

  const toggleLanguage = () => {
    setIsAfrikaans(!isAfrikaans);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Language Toggle */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>
            {isAfrikaans ? 'Slaan oor' : 'Skip'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
          <Text style={[styles.languageText, { color: colors.primary }]}>
            {isAfrikaans ? 'EN' : 'AF'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Image Container */}
        <View style={[styles.imageContainer, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.imagePlaceholder}>
            <View style={[styles.placeholderIcon, { borderColor: colors.textSecondary }]}>
              <View style={[styles.iconInner, { backgroundColor: colors.textSecondary }]} />
              <View style={[styles.iconLine, { backgroundColor: colors.textSecondary }]} />
            </View>
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {isAfrikaans ? currentData.titleAfrikaans : currentData.title}
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isAfrikaans ? currentData.subtitleAfrikaans : currentData.subtitle}
          </Text>
        </View>

        {/* Page Indicators */}
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: index === currentIndex ? colors.primary : colors.textSecondary,
                  width: index === currentIndex ? 24 : 8,
                }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Get Started Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.getStartedButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === onboardingData.length - 1
              ? (isAfrikaans ? 'Begin' : 'Get Started')
              : (isAfrikaans ? 'Volgende' : 'Next')
            }
          </Text>
          <Text style={styles.buttonArrow}>→</Text>
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
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  languageButton: {
    padding: 8,
    borderRadius: 20,
    minWidth: 40,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 20,
    marginBottom: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '60%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: 12,
    left: 12,
  },
  iconLine: {
    width: 30,
    height: 3,
    borderRadius: 2,
    position: 'absolute',
    bottom: 12,
    right: 12,
    transform: [{ rotate: '45deg' }],
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
