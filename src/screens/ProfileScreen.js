import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserProfile, updateUserProfile } from '../services/firestoreService';
import { colors } from '../theme/colors';
import { mockEvents } from '../data/mockEvents';
import { Ionicons } from '@expo/vector-icons';

const PROFILE_EMOJIS = ['😊', '😎', '🤩', '🥳', '😇', '🤠', '🧑‍💻', '👩‍🎨', '🧑‍🚀', '🦸', '🧑‍🎤', '🧑‍🔬'];

export default function ProfileScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  // Edit profile state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editEmoji, setEditEmoji] = useState('😊');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    if (auth.currentUser) {
      const result = await getUserProfile(auth.currentUser.uid);
      if (result.success) {
        setUserProfile(result.data);
        if (result.data.emoji) setEditEmoji(result.data.emoji);
      }
    }
  };

  const user = auth.currentUser;
  const userName = userProfile?.fullName || user?.displayName || 'Set your name';
  const userEmail = user?.email || '';
  const userBio = userProfile?.bio || '';
  const userCity = userProfile?.city || '';
  const profileEmoji = userProfile?.emoji || editEmoji;

  const openEditModal = () => {
    setEditName(userName === 'Set your name' ? '' : userName);
    setEditBio(userBio);
    setEditCity(userCity);
    setEditEmoji(profileEmoji);
    setEditModalVisible(true);
  };

  const saveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    setSaving(true);
    try {
      // Update Firebase Auth displayName (with timeout)
      try {
        await Promise.race([
          updateProfile(auth.currentUser, { displayName: editName.trim() }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 6000)),
        ]);
      } catch (e) {
        if (e.message !== 'timeout') throw e;
        console.log('Auth profile update timed out, continuing...');
      }

      // Update Firestore profile (has its own internal timeout)
      await updateUserProfile(auth.currentUser.uid, {
        fullName: editName.trim(),
        bio: editBio.trim(),
        city: editCity.trim(),
        emoji: editEmoji,
        profileComplete: true,
      });

      // Update local state immediately so UI reflects changes
      setUserProfile(prev => ({
        ...prev,
        fullName: editName.trim(),
        bio: editBio.trim(),
        city: editCity.trim(),
        emoji: editEmoji,
      }));

      setEditModalVisible(false);
      Alert.alert('✅ Saved', 'Your profile has been updated!');
    } catch (err) {
      console.error('Error saving profile:', err);
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => firebaseSignOut(auth) },
    ]);
  };

  const markedDates = {
    '2026-03-12': { marked: true, dotColor: colors.primary },
    '2026-02-14': { selected: true, selectedColor: colors.accent, marked: true, dotColor: 'white' },
    [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: colors.primary }
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setSelectedEvents(mockEvents.slice(0, 2));
    setCalendarModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Profile Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.profileEmojiCircle}>
            <Text style={styles.profileEmoji}>{profileEmoji}</Text>
          </View>
          <Text style={styles.name}>{userName}</Text>
          {userBio ? <Text style={styles.bio}>{userBio}</Text> : null}
          <View style={styles.emailRow}>
            <Ionicons name="mail-outline" size={14} color="#999" />
            <Text style={styles.emailText}>{userEmail}</Text>
          </View>
          {userCity ? (
            <View style={styles.cityRow}>
              <Ionicons name="location-outline" size={14} color={colors.primary} />
              <Text style={styles.cityText}>{userCity}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.editButton} onPress={openEditModal} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Attended</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="calendar" size={20} color="#2196F3" />
            </View>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="flame" size={20} color="#FF9800" />
            </View>
            <Text style={styles.statNumber}>84</Text>
            <Text style={styles.statLabel}>Vibe Score</Text>
          </View>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="journal-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>Event Journal</Text>
          </View>
          <Calendar
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: colors.primary,
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: colors.primary,
              selectedDotColor: '#ffffff',
              arrowColor: colors.primary,
              monthTextColor: colors.primary,
              textDayFontWeight: '400',
              textMonthFontWeight: '700',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 15,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
            markedDates={markedDates}
            onDayPress={onDayPress}
            enableSwipeMonths={true}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="bookmark" size={20} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Saved Events</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="settings" size={20} color="#FF9800" />
            </View>
            <Text style={styles.actionText}>Preferences</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="help-circle" size={20} color="#2196F3" />
            </View>
            <Text style={styles.actionText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={18} color="#FF3B30" style={{ marginRight: 8 }} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ===== EDIT PROFILE MODAL ===== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.editModal}>
            {/* Modal Header */}
            <View style={styles.editModalHeader}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.editModalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.editModalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={saveProfile} disabled={saving}>
                <Text style={[styles.editModalSave, saving && { opacity: 0.5 }]}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Emoji Picker */}
              <Text style={styles.editLabel}>Choose Avatar</Text>
              <View style={styles.emojiGrid}>
                {PROFILE_EMOJIS.map((em) => (
                  <TouchableOpacity
                    key={em}
                    style={[styles.emojiOption, editEmoji === em && styles.emojiOptionActive]}
                    onPress={() => setEditEmoji(em)}
                  >
                    <Text style={styles.emojiOptionText}>{em}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Name */}
              <Text style={styles.editLabel}>Full Name</Text>
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your full name"
                placeholderTextColor="#bbb"
              />

              {/* Bio */}
              <Text style={styles.editLabel}>Bio</Text>
              <TextInput
                style={[styles.editInput, styles.editTextArea]}
                value={editBio}
                onChangeText={setEditBio}
                placeholder="Tell people about yourself..."
                placeholderTextColor="#bbb"
                multiline
                numberOfLines={3}
              />

              {/* City */}
              <Text style={styles.editLabel}>City</Text>
              <TextInput
                style={styles.editInput}
                value={editCity}
                onChangeText={setEditCity}
                placeholder="e.g. New Delhi"
                placeholderTextColor="#bbb"
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ===== CALENDAR DAY MODAL ===== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={calendarModalVisible}
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <Text style={styles.calendarModalTitle}>Events on {selectedDate}</Text>

            {selectedEvents.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>{event.date}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.calendarModalClose}
              onPress={() => setCalendarModalVisible(false)}
            >
              <Text style={styles.calendarModalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // ---- Header Card ----
  headerCard: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  profileEmojiCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileEmoji: {
    fontSize: 44,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  emailText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 4,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cityText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  // ---- Stats ----
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 14,
    marginHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  // ---- Calendar ----
  calendarContainer: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6,
  },
  // ---- Actions ----
  actionsContainer: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  // ---- Sign Out ----
  signOutButton: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  signOutText: {
    color: '#FF3B30',
    fontWeight: '700',
    fontSize: 15,
  },
  // ---- Edit Profile Modal ----
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  editModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '85%',
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 16,
  },
  editModalCancel: {
    fontSize: 15,
    color: '#999',
    fontWeight: '600',
  },
  editModalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  editModalSave: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '700',
  },
  editLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 12,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiOptionActive: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  emojiOptionText: {
    fontSize: 24,
  },
  editInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
  },
  editTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  // ---- Calendar Day Modal ----
  calendarModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  calendarModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  eventItem: {
    marginVertical: 6,
    alignItems: 'center',
  },
  eventTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#333',
  },
  eventTime: {
    color: '#999',
    fontSize: 13,
    marginTop: 2,
  },
  calendarModalClose: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  calendarModalCloseText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
