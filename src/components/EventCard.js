import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height - 220; // Full screen minus header, hints, tab bar

const categoryColors = {
  'Networking': '#2D6A4F',
  'Outdoor': '#2D6A4F',
  'Business': '#5C4033',
  'Music': '#7B2D8B',
  'Food & Drink': '#C44536',
  'Fitness': '#1B7A4A',
  'Art': '#8B5CF6',
  'Entertainment': '#D97706',
  'Workshop': '#B45309',
  'Cultural': '#B91C1C',
  'Festival': '#D97706',
  'Social': '#059669',
  'Wellness': '#0891B2',
  'Comedy': '#CA8A04',
  'Tech': '#6366F1',
  'Sports': '#DC2626',
  'Theatre': '#9333EA',
};

const categoryIcons = {
  'Networking': 'people-outline',
  'Outdoor': 'leaf-outline',
  'Business': 'briefcase-outline',
  'Music': 'musical-notes-outline',
  'Food & Drink': 'restaurant-outline',
  'Fitness': 'fitness-outline',
  'Art': 'color-palette-outline',
  'Entertainment': 'film-outline',
  'Workshop': 'build-outline',
  'Cultural': 'earth-outline',
  'Festival': 'sparkles-outline',
  'Social': 'chatbubbles-outline',
  'Wellness': 'heart-outline',
  'Comedy': 'happy-outline',
  'Tech': 'laptop-outline',
  'Sports': 'football-outline',
  'Theatre': 'ticket-outline',
};

export default function EventCard({ event }) {
  const catColor = categoryColors[event.type] || colors.primary;
  const catIcon = categoryIcons[event.type] || 'pricetag-outline';

  return (
    <View style={styles.card}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: catColor }]}>
          <Ionicons name={catIcon} size={12} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.categoryText}>{event.type.toUpperCase()}</Text>
        </View>
        {/* Price Badge */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{event.price}</Text>
        </View>
        {/* Bookmark Button */}
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="star-outline" size={22} color="#D4A017" />
        </TouchableOpacity>
      </View>

      {/* Details Section */}
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={15} color="#888" />
          <Text style={styles.infoText}>{event.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={15} color="#888" />
          <Text style={styles.infoText} numberOfLines={1}>{event.location} {event.area ? `\u2022 ${event.area}` : ''}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={15} color="#888" />
          <Text style={styles.infoText}>{event.attending}/{event.capacity} attending</Text>
        </View>

        {event.friendsInterested > 0 && (
          <View style={styles.friendsRow}>
            <View style={styles.friendsBadge}>
              <Text style={styles.friendsBadgeText}>+{event.friendsInterested}</Text>
            </View>
            <Text style={styles.friendsText}>{event.friendsInterested} friends interested</Text>
          </View>
        )}

        <Text style={styles.description} numberOfLines={3}>{event.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '50%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  bookmarkButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#fff',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  details: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
    lineHeight: 26,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  friendsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  friendsBadge: {
    backgroundColor: colors.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  friendsBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  friendsText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: '#777',
    lineHeight: 19,
    marginTop: 4,
  },
});
