import { Colors } from '@/constants/Colors';
import { useApp } from '@/contexts/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProfileOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { logout, state } = useApp();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const profileOptions: ProfileOption[] = [
    {
      id: '1',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'person-outline',
      type: 'navigation',
      onPress: () => {}
    },
    {
      id: '2',
      title: 'Order History',
      subtitle: 'View your past orders',
      icon: 'receipt-outline',
      type: 'navigation',
      onPress: () => {}
    },
    {
      id: '3',
      title: 'Addresses',
      subtitle: 'Manage delivery addresses',
      icon: 'location-outline',
      type: 'navigation',
      onPress: () => {}
    },
    {
      id: '4',
      title: 'Payment Methods',
      subtitle: 'Manage cards and payment options',
      icon: 'card-outline',
      type: 'navigation',
      onPress: () => {}
    },
    {
      id: '5',
      title: 'Notifications',
      subtitle: 'Push notifications',
      icon: 'notifications-outline',
      type: 'toggle',
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled
    },
    {
      id: '6',
      title: 'Location Services',
      subtitle: 'Allow location access',
      icon: 'location-outline',
      type: 'toggle',
      value: locationEnabled,
      onToggle: setLocationEnabled
    },
    {
      id: '7',
      title: 'Language',
      subtitle: 'English',
      icon: 'language-outline',
      type: 'navigation',
      onPress: () => {}
    },
    {
      id: '8',
      title: 'Help & Support',
      subtitle: 'Get help and contact us',
      icon: 'help-circle-outline',
      type: 'navigation',
      onPress: () => {}
    },
    {
      id: '9',
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      icon: 'shield-outline',
      type: 'navigation',
      onPress: () => {}
    },
    {
      id: '10',
      title: 'Terms of Service',
      subtitle: 'Read our terms of service',
      icon: 'document-text-outline',
      type: 'navigation',
      onPress: () => {}
    },
  ];

  const renderProfileOption = (option: ProfileOption) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.optionItem, { backgroundColor: colors.cardBackground }]}
      onPress={option.onPress}
      disabled={option.type === 'toggle'}
    >
      <View style={styles.optionLeft}>
        <View style={[styles.optionIcon, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={option.icon} size={24} color={colors.primary} />
        </View>
        <View style={styles.optionText}>
          <Text style={[styles.optionTitle, { color: colors.text }]}>
            {option.title}
          </Text>
          {option.subtitle && (
            <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
              {option.subtitle}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.optionRight}>
        {option.type === 'toggle' ? (
          <Switch
            value={option.value}
            onValueChange={option.onToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={[styles.userInfo, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {state.user?.name ? state.user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {state.user?.name || 'Guest User'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {state.user?.email || 'Not logged in'}
            </Text>
            {state.user?.phone && (
              <Text style={[styles.userPhone, { color: colors.textSecondary }]}>
                {state.user.phone}
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Orders</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{state.favorites.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favorites</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>4.8</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          {profileOptions.slice(0, 4).map(renderProfileOption)}
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          {profileOptions.slice(4, 7).map(renderProfileOption)}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
          {profileOptions.slice(7).map(renderProfileOption)}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: '#FF4444' }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Sweet Shop v1.0.0
          </Text>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
  },
  editButton: {
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 30,
    gap: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  optionRight: {
    marginLeft: 10,
  },
  logoutContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '400',
  },
});