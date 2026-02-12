import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../config/firebase';
import { createUserProfile } from '../services/firestoreService';
import { colors } from '../theme/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

// Reuse Logo
const Logo = () => (
    <View style={styles.logoContainer}>
       <Text style={styles.logoTextMain}>Ou</Text>
       <Text style={styles.logoTextMainLarge}>Couch</Text>
       <Text style={styles.logoTextSub}>tta</Text>
    </View>
);

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignupPressed = useCallback(async () => {
    // Basic validation
    if (!email || !password || !confirmPassword || !fullName) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
    }
    if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
    }
    if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create Firestore profile
      await createUserProfile(user.uid, {
        email,
        fullName,
        profileComplete: false,
        createdAt: new Date(),
      });

      // Send email verification
      await sendEmailVerification(user);
      
      Alert.alert(
        'Success!',
        'Account created! Please check your email for verification link. You can now login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      console.error('Signup error:', err.code, err.message);
      let errorMessage = 'Signup failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already registered. Please login.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      Alert.alert('Signup Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, fullName]);

  const onLoginSimplePressed = () => {
      navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Logo />
          
          <Text style={styles.title}>Signup</Text>

          <CustomInput
            placeholder="Enter your Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <CustomInput
            placeholder="Enter your Email ID"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <CustomInput
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <CustomButton title={loading ? "Creating account..." : "Signup"} onPress={onSignupPressed} />
          {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 10 }} />}

          <TouchableOpacity onPress={onLoginSimplePressed} style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 40,
  },
  logoTextMain: {
      fontSize: 40,
      fontStyle: 'italic',
      color: colors.primary,
      fontFamily: 'serif', 
  },
  logoTextMainLarge: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#000', // Black
      marginLeft: 5,
  },
  logoTextSub: {
      fontSize: 30,
      fontStyle: 'italic',
      color: colors.primary,
      position: 'absolute',
      bottom: -15,
      left: 0,
      fontFamily: 'serif',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    alignSelf: 'center',
  },
  loginContainer: {
      marginTop: 20,
  },
  loginText: {
      color: 'gray',
  },
  loginLink: {
      color: '#000',
      fontWeight: 'bold',
  }
});
