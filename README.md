# OuttaCouch - Social Events App 🎉

A React Native mobile application built with Expo that helps users discover, create, and connect through local events and activities.

## 📱 Features

- **User Authentication** - Secure login/signup with Clerk
- **Event Discovery** - Browse and explore local events
- **Event Creation** - Create and share your own events
- **Calendar Integration** - View events in calendar format
- **Real-time Chat** - Connect with other event attendees
- **User Profiles** - Manage your profile and preferences
- **Social Connections** - Build your network of friends
- **Firebase Integration** - Real-time data sync and storage

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tejaswini-co/OuttaCouch-Project.git
   cd OuttaCouch-Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your configuration:
   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
   EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_key_here
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device**
   - Install [Expo Go](https://expo.dev/client) on your mobile device
   - Scan the QR code from the terminal
   - Or press `i` for iOS simulator, `a` for Android emulator

## 📁 Project Structure

```
OuttaCouch/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CustomButton.js
│   │   ├── CustomInput.js
│   │   └── EventCard.js
│   ├── screens/            # App screens
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── ExploreEventsScreen.js
│   │   ├── CalendarScreen.js
│   │   ├── ChatScreen.js
│   │   ├── ProfileScreen.js
│   │   └── ...
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.js
│   ├── config/            # App configuration
│   │   ├── clerk.js       # Clerk auth config
│   │   ├── firebase.js    # Firebase config
│   │   └── tokenCache.js  # Token management
│   ├── services/          # API and external services
│   │   └── firestoreService.js
│   ├── data/              # Mock data and constants
│   │   └── mockEvents.js
│   ├── theme/             # Styling and theming
│   │   └── colors.js
│   └── context/           # React Context providers
├── assets/                # Images, fonts, icons
├── App.js                 # Main app component
├── package.json
└── README.md
```

## 🛠️ Technologies Used

- **Frontend**: React Native with Expo
- **Authentication**: Clerk
- **Database**: Firebase Firestore
- **Navigation**: React Navigation
- **State Management**: React Context
- **Styling**: React Native StyleSheet

## ⚙️ Configuration

### Clerk Authentication
1. Create a Clerk account at [clerk.dev](https://clerk.dev)
2. Create a new application
3. Copy your publishable key to the `.env` file

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Copy your config keys to the `.env` file

## 📱 Screenshots

*Add your app screenshots here*

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Tejaswini** - [Tejaswini-co](https://github.com/Tejaswini-co)

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/Tejaswini-co/OuttaCouch-Project/issues) page
2. Create a new issue if needed
3. Refer to [Expo Documentation](https://docs.expo.dev/)

## 🎯 Roadmap

- [ ] Push notifications for event reminders
- [ ] Event location mapping integration
- [ ] Social media sharing
- [ ] Advanced search and filtering
- [ ] Event recommendations based on preferences
- [ ] Dark mode support

---

**Happy Coding!** 🎉 Get people off their couch and into amazing experiences!