import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

// This screen is no longer used - Firebase handles verification via email links
export default function OTPScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text>This screen is no longer needed with Firebase Auth.</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colors.text,
  },
});

const Logo = () => (
    <View style={styles.logoContainer}>
       <Text style={styles.logoTextMain}>Ou</Text>
       <Text style={styles.logoTextMainLarge}>Couch</Text>
       <Text style={styles.logoTextSub}>tta</Text>
    </View>
);

export default function OTPScreen({ navigation, route }) {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const email = route.params?.email || 'your email';

  const onConfirmPressed = useCallback(async () => {
    if (!isLoaded) return;

    if (!otp) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: otp,
      });

      if (result.status === 'complete') {
        // Set the active session
        await setActive({ session: result.createdSessionId });

        // Create user profile in Firestore
        await createUserProfile(result.createdUserId, {
          email: email,
          profileComplete: false,
        });

        // Navigate to Main App
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Error', 'Verification incomplete. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.errors?.[0]?.longMessage || 'Invalid verification code.';
      Alert.alert('Verification Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, otp]);

  const onBackDatePressed = () => {
      navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onBackDatePressed} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Logo />
        
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          we have sent you the verification code to your Email ID to reset your password {email}
        </Text>

        <CustomInput
          placeholder="Enter OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />
        
        {/* Resend Link logic typically goes here */}
        <View style={styles.resendContainer}>
            <Text style={styles.resendText}>00:30</Text> 
             {/* Timer placeholder */}
        </View>

        <CustomButton title={loading ? "Verifying..." : "Confirm"} onPress={onConfirmPressed} />
        {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 10 }} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
      padding: 10,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    flex: 1,
    paddingTop: 50,
  },
  logoContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 30,
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
      color: 'gray',
      marginBottom: 30,
      textAlign: 'center',
      paddingHorizontal: 10,
  },
  resendContainer: {
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: 20,
  },
  resendText: {
      color: '#000',
      fontWeight: 'bold',
  }
});
