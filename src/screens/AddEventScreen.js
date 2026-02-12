import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../config/firebase';
import { getUserProfile, addEvent } from '../services/firestoreService';
import { colors } from '../theme/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function AddEventScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    if (auth.currentUser) {
      const result = await getUserProfile(auth.currentUser.uid);
      if (result.success) {
        setUserProfile(result.data);
      }
    }
  };

  const onPostEvent = async () => {
    if (!title || !date || !location) {
        Alert.alert('Missing Info', 'Please fill in at least Title, Date, and Location.');
        return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      const result = await addEvent({
        title,
        date,
        location,
        description,
        category,
        organizerId: user?.uid || 'unknown',
        organizerName: userProfile?.fullName || user?.displayName || user?.email || 'Anonymous',
      });

      if (result.success) {
        Alert.alert('Success', 'Your event has been posted and is now visible to nearby users!', [
          { text: 'OK', onPress: () => {
            setTitle(''); setDate(''); setLocation(''); setDescription(''); setCategory('');
            navigation.navigate('Explore');
          }}
        ]);
      } else {
        Alert.alert('Error', 'Failed to post event. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.headerTitle}>Host an Event</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Event Title</Text>
        <CustomInput placeholder="e.g. Saturday Night Jazz" value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Date & Time</Text>
        <CustomInput placeholder="e.g. March 12, 8:00 PM" value={date} onChangeText={setDate} />

        <Text style={styles.label}>Location</Text>
        <CustomInput placeholder="e.g. The Blue Note" value={location} onChangeText={setLocation} />

        <Text style={styles.label}>Category</Text>
        <CustomInput placeholder="e.g. Music, Art, Sports" value={category} onChangeText={setCategory} />

        <Text style={styles.label}>Description</Text>
        <CustomInput 
            placeholder="Tell people what to expect..." 
            value={description} 
            onChangeText={setDescription}
            // Multiline would require updating CustomInput to accept props, 
            // but for now single line or updating CustomInput is fine.
        />

        <View style={styles.spacer} />
        
        <CustomButton title={loading ? "Posting..." : "Post Event"} onPress={onPostEvent} />
        {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 10 }} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
      padding: 20,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      alignItems: 'center',
  },
  headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
  },
  content: {
      padding: 20,
  },
  label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginTop: 15,
      marginBottom: 5,
  },
  spacer: {
      height: 30,
  }
});
