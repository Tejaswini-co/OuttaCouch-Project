import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { colors } from '../theme/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

const Logo = () => (
    <View style={styles.logoContainer}>
       <Text style={styles.logoTextMain}>Ou</Text>
       <Text style={styles.logoTextMainLarge}>Couch</Text>
       <Text style={styles.logoTextSub}>tta</Text>
    </View>
);

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const onResetPressed = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                'Success!',
                'Password reset email sent. Please check your inbox.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (err) {
            let errorMessage = 'Failed to send reset email. Please try again.';
            if (err.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onBackDatePressed = () => {
        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
             <TouchableOpacity onPress={onBackDatePressed} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.content}>
                <Logo />
                
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                    Lost your password? please enter your Email address. You will receive a verification code to rest your password via Email
                </Text>

                <CustomInput
                    placeholder="Enter Your Email ID"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <CustomButton title={loading ? "Sending..." : "Forgot Password"} onPress={onResetPressed} />
                {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 10 }} />}

                <TouchableOpacity onPress={onBackDatePressed} style={styles.loginContainer}>
                    <Text style={styles.loginText}>Back to login</Text>
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
    loginContainer: {
        marginTop: 20,
    },
    loginText: {
        color: '#000',
        textDecorationLine: 'underline',
    }
});
