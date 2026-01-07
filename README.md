# Wnzee Tii Ndaku 🛒

A modern React Native shopping application built with Expo, featuring email/password authentication and Google OAuth integration.

## 🚀 Features

- **Authentication**
  - Email/Password login and registration
  - Google OAuth integration
  - Secure token storage
  - Auto-login on app restart

- **Shopping Features**
  - Browse products by categories
  - Search functionality
  - Shopping cart management
  - Favorites/Wishlist
  - Product details
  - Checkout flow

- **Technical Features**
  - TypeScript for type safety
  - Centralized API client with timeout handling
  - Mock API mode for development
  - Error boundary for crash prevention
  - Secure storage abstraction (ready for production upgrade)
  - Environment-based configuration

## 📋 Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- iOS Simulator (for iOS development on macOS)
- Android Studio & Android SDK (for Android development)
- Xcode (for iOS development on macOS)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wnzee-tii-ndaku
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your values:
   ```env
   EXPO_PUBLIC_API_BASE_URL=https://your-api.com
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   EXPO_PUBLIC_USE_MOCK_API=true
   ```

4. **Configure Google OAuth** (Optional, for production)

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URIs:
     - `wnzee-tii-ndaku://auth`
     - `https://auth.expo.io/@your-username/wnzee-tii-ndaku`
   - Copy the Client ID to your `.env` file

5. **Generate native projects**
   ```bash
   npm run prebuild
   ```

## 🏃 Running the App

### Development Mode (Mock API)

```bash
# Start Expo dev server with mock API
npm run start:dev

# Run on iOS with mock API
npm run ios:dev

# Run on Android with mock API
npm run android:dev
```

### Production Mode (Real API)

```bash
# Start with real API
npm run start:prod

# Run on iOS with real API
npm run ios:prod

# Run on Android with real API
npm run android:prod
```

### Standard Expo Commands

```bash
# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 🏗️ Project Structure

```
wnzee-tii-ndaku/
├── app/                    # App screens (expo-router)
│   ├── (tabs)/            # Tab navigation screens
│   ├── _layout.tsx        # Root layout with providers
│   ├── index.tsx          # Entry point (redirect logic)
│   ├── login.tsx          # Login/Signup screen
│   ├── onboarding.tsx     # Onboarding screen
│   └── ...                # Other screens
├── components/            # Reusable components
│   ├── ErrorBoundary.tsx  # Error boundary wrapper
│   ├── ThemedText.tsx     # Themed text component
│   ├── ThemedView.tsx     # Themed view component
│   └── ui/                # UI components
├── config/                # Configuration files
│   ├── constants.ts       # App constants
│   └── env.ts             # Environment configuration
├── constants/             # App-wide constants
│   └── Colors.ts          # Color scheme
├── contexts/              # React contexts
│   └── AppContext.tsx     # Global app state (user, cart, favorites)
├── hooks/                 # Custom React hooks
├── lib/                   # Core utilities
│   ├── api-client.ts      # Centralized API client
│   └── storage.ts         # Secure storage wrapper
├── assets/                # Static assets (images, fonts)
├── .env                   # Environment variables (not committed)
├── .env.example           # Environment template
├── app.json               # Expo configuration
├── package.json           # Dependencies & scripts
└── tsconfig.json          # TypeScript configuration
```

## 🔒 Security

### Environment Variables

**Never commit `.env` to version control!** It's already in `.gitignore`.

Required environment variables:
- `EXPO_PUBLIC_API_BASE_URL` - Your backend API URL
- `EXPO_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `EXPO_PUBLIC_USE_MOCK_API` - Use mock API for development (true/false)

### Storage

Currently using `@react-native-async-storage/async-storage` for simplicity. For production:

1. Install expo-secure-store:
   ```bash
   npx expo install expo-secure-store
   ```

2. Update `lib/storage.ts` to use SecureStore instead of AsyncStorage

3. Rebuild native apps:
   ```bash
   npm run prebuild:clean
   npm run ios  # or android
   ```

### OAuth Configuration

**Google OAuth Redirect URIs** must be configured in Google Cloud Console:

1. Navigate to APIs & Services → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add these Authorized redirect URIs:
   - `wnzee-tii-ndaku://auth` (for native builds)
   - `https://auth.expo.io/@your-username/wnzee-tii-ndaku` (for Expo Go)

4. **Important**: Changes take 5-10 minutes to propagate

## 🧪 Development

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Mock API Mode

The app includes a mock API mode for development without a backend:

- Set `EXPO_PUBLIC_USE_MOCK_API=true` in `.env`
- Use `npm run start:dev` or `npm run ios:dev`
- Mock credentials: `test@example.com` / `password123`

## 📱 Building for Production

### iOS

1. Configure signing in Xcode
2. Update bundle identifier in `app.json`
3. Build:
   ```bash
   npm run ios:prod
   ```

For App Store:
```bash
eas build --platform ios --profile production
```

### Android

1. Configure signing in `android/app/build.gradle`
2. Update package name in `app.json`
3. Build:
   ```bash
   npm run android:prod
   ```

For Play Store:
```bash
eas build --platform android --profile production
```

## 🔧 Troubleshooting

### OAuth Issues

**Error 400: redirect_uri_mismatch**
- Verify redirect URI in Google Cloud Console matches exactly
- Wait 5-10 minutes after making changes
- Check that you're using the correct Client ID

**"Something went wrong finishing sign in"**
- Ensure `WebBrowser.maybeCompleteAuthSession()` is in root layout
- Verify app scheme in `app.json` matches redirect URI
- Check native build is up to date: `npm run prebuild:clean`

### Build Issues

**TypeScript errors**
```bash
npm run typecheck
```

**Cache issues**
```bash
npx expo start -c
```

**Native build issues**
```bash
npm run prebuild:clean
cd ios && pod install && cd ..
npm run ios
```

## 📚 Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript
- **State Management**: React Context API
- **Authentication**: expo-auth-session (Google OAuth)
- **Storage**: AsyncStorage (production: SecureStore)
- **Styling**: StyleSheet API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the [Troubleshooting](#-troubleshooting) section
- Search existing [GitHub Issues](https://github.com/your-repo/issues)
- Open a new issue with detailed information

---

**Built with ❤️ using Expo and React Native**
