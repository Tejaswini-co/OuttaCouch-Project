import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { colors } from '../theme/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

// Mock Logo (in a real app, use an Image component)
const Logo = () => (
    <View style={styles.logoContainer}>
       <Text style={styles.logoTextMain}>Ou</Text>
       <Text style={styles.logoTextMainLarge}>Couch</Text>
       <Text style={styles.logoTextSub}>tta</Text>
    </View>
);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLoginPressed = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation handled automatically by onAuthStateChanged in App.js
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignupPressed = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Logo />
        
        <Text style={styles.title}>Login</Text>

        <CustomInput
          placeholder="Enter Your Email ID"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomInput
          placeholder="Enter Your Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity onPress={onForgotPasswordPressed}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>

        <CustomButton title={loading ? "Logging in..." : "Login"} onPress={onLoginPressed} />
        {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 10 }} />}

        <TouchableOpacity onPress={onSignupPressed} style={styles.signupContainer}>
             <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupLink}>Signup</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
      marginBottom: 50,
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
  forgotPasswordContainer: {
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: 20,
  },
  forgotPasswordText: {
      color: 'gray',
      fontSize: 12,
  },
  signupContainer: {
      marginTop: 20,
  },
  signupText: {
      color: 'gray',
  },
  signupLink: {
      color: '#000',
      fontWeight: 'bold',
  }
});
