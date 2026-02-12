import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

// Mock data for calendar events
const publicEvents = [
  { id: 'p1', title: 'Rooftop Networking at CP', date: 'Today', time: '7:30 PM', location: 'Social CP, Connaught Place', type: 'Networking', emoji: '🤝', attendees: 58, friends: ['Arjun', 'Priya', 'Rahul'] },
  { id: 'p2', title: 'Indie Music Fest', date: 'Mar 7', time: '6:00 PM', location: 'Zorba, Mehrauli', type: 'Music', emoji: '🎵', attendees: 150, friends: ['Sneha'] },
  { id: 'p3', title: 'Holi Color Festival', date: 'Mar 14', time: '10:00 AM', location: 'Chattarpur Farm', type: 'Festival', emoji: '🎨', attendees: 280, friends: ['Arjun', 'Kavya', 'Ankit', 'Meera'] },
  { id: 'p4', title: 'Delhi Tech Conference', date: 'Mar 15', time: '9:00 AM', location: 'The Leela Palace', type: 'Tech', emoji: '💻', attendees: 350, friends: ['Rahul', 'Priya'] },
  { id: 'p5', title: 'Night Cycling Tour', date: 'Mar 8', time: '10:00 PM', location: 'India Gate', type: 'Sports', emoji: '🚴', attendees: 28, friends: ['Vikram'] },
];

const privateEvents = [
  { id: 'v1', title: 'Sunrise Yoga at Lodhi Garden', date: 'Sun, Mar 1', time: '6:00 AM', location: 'Lodhi Garden', type: 'Fitness', emoji: '🧘', note: 'Bring mat + water bottle' },
  { id: 'v2', title: 'Pottery Workshop', date: 'Mar 8', time: '3:00 PM', location: 'Hauz Khas Village', type: 'Workshop', emoji: '🏺', note: 'Birthday gift idea for mom' },
  { id: 'v3', title: 'Sound Healing Session', date: 'Mar 5', time: '7:00 PM', location: 'Greater Kailash', type: 'Wellness', emoji: '🔔', note: 'Try something new' },
  { id: 'v4', title: 'Book Club at Bahrisons', date: 'Mar 8', time: '11:00 AM', location: 'Khan Market', type: 'Social', emoji: '📚', note: 'Finish reading before!' },
  { id: 'v5', title: 'Stand-up Comedy Night', date: 'Feb 28', time: '8:00 PM', location: 'The Laugh Factory, Saket', type: 'Comedy', emoji: '😂', note: 'Book 2 tickets' },
  { id: 'v6', title: 'Chandni Chowk Food Walk', date: 'Tomorrow', time: '10:00 AM', location: 'Old Delhi', type: 'Food', emoji: '🍛', note: 'Go empty stomach!' },
];

export default function CalendarScreen() {
  const [activeTab, setActiveTab] = useState('public'); // 'public' or 'private'
  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchTab = (tab) => {
    setActiveTab(tab);
    Animated.spring(slideAnim, {
      toValue: tab === 'public' ? 0 : 1,
      useNativeDriver: true,
      tension: 68,
      friction: 10,
    }).start();
  };

  const sliderTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (width - 40) / 2],
  });

  const isPublic = activeTab === 'public';
  const themeColor = isPublic ? '#E53935' : '#2E7D32';
  const themeLightBg = isPublic ? '#FFF5F5' : '#F0FFF4';
  const themeAccent = isPublic ? '#FFCDD2' : '#C8E6C9';
  const events = isPublic ? publicEvents : privateEvents;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>My Calendar</Text>
            <Text style={styles.headerSubtitle}>
              {isPublic ? 'Events your friends can see' : 'Your personal event list'}
            </Text>
          </View>
          <View style={[styles.eventCountBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
            <Text style={styles.eventCountText}>{events.length}</Text>
            <Text style={styles.eventCountLabel}>events</Text>
          </View>
        </View>

        {/* Toggle Switch */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleTrack}>
            <Animated.View
              style={[
                styles.toggleSlider,
                {
                  transform: [{ translateX: sliderTranslate }],
                },
              ]}
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => switchTab('public')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="globe-outline"
                size={16}
                color={isPublic ? themeColor : '#999'}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.toggleText, isPublic && { color: themeColor, fontWeight: '800' }]}>
                Public
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => switchTab('private')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color={!isPublic ? themeColor : '#999'}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.toggleText, !isPublic && { color: themeColor, fontWeight: '800' }]}>
                Private
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Events List */}
      <ScrollView
        style={[styles.eventsList, { backgroundColor: themeLightBg }]}
        contentContainerStyle={styles.eventsContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <View style={[styles.infoBanner, { backgroundColor: themeAccent, borderColor: themeColor }]}>
          <Ionicons
            name={isPublic ? 'eye-outline' : 'eye-off-outline'}
            size={18}
            color={themeColor}
          />
          <Text style={[styles.infoBannerText, { color: themeColor }]}>
            {isPublic
              ? 'These events are visible to your connections'
              : 'Only you can see these events'}
          </Text>
        </View>

        {events.map((event, index) => (
          <TouchableOpacity key={event.id} activeOpacity={0.7}>
            <View style={[styles.eventCard, { borderLeftColor: themeColor }]}>
              {/* Emoji Circle */}
              <View style={[styles.emojiCircle, { backgroundColor: themeAccent }]}>
                <Text style={styles.emojiText}>{event.emoji}</Text>
              </View>

              <View style={styles.eventDetails}>
                <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>

                <View style={styles.eventMeta}>
                  <Ionicons name="calendar-outline" size={12} color="#888" />
                  <Text style={styles.eventMetaText}>{event.date} at {event.time}</Text>
                </View>

                <View style={styles.eventMeta}>
                  <Ionicons name="location-outline" size={12} color="#888" />
                  <Text style={styles.eventMetaText} numberOfLines={1}>{event.location}</Text>
                </View>

                {/* Public: show friends & attendees */}
                {isPublic && event.friends && (
                  <View style={styles.friendsRow}>
                    <View style={styles.friendAvatars}>
                      {event.friends.slice(0, 3).map((f, i) => (
                        <View
                          key={i}
                          style={[
                            styles.friendDot,
                            { backgroundColor: ['#E53935', '#FF7043', '#FF8A80'][i], marginLeft: i > 0 ? -6 : 0 },
                          ]}
                        >
                          <Text style={styles.friendDotText}>{f[0]}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.friendsText}>
                      {event.friends.slice(0, 2).join(', ')}
                      {event.friends.length > 2 ? ` +${event.friends.length - 2} more` : ''} going
                    </Text>
                  </View>
                )}

                {/* Private: show personal note */}
                {!isPublic && event.note && (
                  <View style={styles.noteRow}>
                    <Ionicons name="document-text-outline" size={12} color="#2E7D32" />
                    <Text style={styles.noteText}>{event.note}</Text>
                  </View>
                )}
              </View>

              {/* Type Badge */}
              <View style={[styles.typeBadge, { backgroundColor: themeAccent }]}>
                <Text style={[styles.typeBadgeText, { color: themeColor }]}>{event.type}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Add Event CTA */}
        <TouchableOpacity style={[styles.addEventCard, { borderColor: themeColor }]} activeOpacity={0.7}>
          <Ionicons name="add-circle" size={28} color={themeColor} />
          <Text style={[styles.addEventText, { color: themeColor }]}>
            {isPublic ? 'Share an event with friends' : 'Add a personal event'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  eventCountBadge: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  eventCountText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  eventCountLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  toggleContainer: {
    alignItems: 'center',
  },
  toggleTrack: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 3,
    width: '100%',
    position: 'relative',
  },
  toggleSlider: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: '50%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    zIndex: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  eventsList: {
    flex: 1,
  },
  eventsContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 3,
    marginBottom: 14,
  },
  infoBannerText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emojiText: {
    fontSize: 20,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventMetaText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  friendsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  friendAvatars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  friendDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  friendDotText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  friendsText: {
    fontSize: 11,
    color: '#E53935',
    fontWeight: '600',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#F0FFF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  noteText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  addEventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 18,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  addEventText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});
