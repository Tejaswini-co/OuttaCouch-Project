import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, ScrollView, Animated } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { mockEvents } from '../data/mockEvents';
import EventCard from '../components/EventCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ALL_CATEGORIES = [
  { label: 'All', icon: 'apps' },
  { label: 'Networking', icon: 'people' },
  { label: 'Food & Drink', icon: 'restaurant' },
  { label: 'Music', icon: 'musical-notes' },
  { label: 'Fitness', icon: 'fitness' },
  { label: 'Art', icon: 'color-palette' },
  { label: 'Comedy', icon: 'happy' },
  { label: 'Business', icon: 'briefcase' },
  { label: 'Workshop', icon: 'construct' },
  { label: 'Cultural', icon: 'earth' },
  { label: 'Festival', icon: 'sparkles' },
  { label: 'Outdoor', icon: 'leaf' },
  { label: 'Social', icon: 'chatbubbles' },
  { label: 'Wellness', icon: 'heart' },
  { label: 'Tech', icon: 'hardware-chip' },
  { label: 'Sports', icon: 'football' },
  { label: 'Theatre', icon: 'film' },
  { label: 'Entertainment', icon: 'star' },
];

export default function ExploreEventsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [swipeCount, setSwipeCount] = useState(0);
  const [allSwiped, setAllSwiped] = useState(false);
  const [key, setKey] = useState(0);
  const swiperRef = useRef(null);

  const filteredEvents = useMemo(() => {
    let events = mockEvents;
    if (selectedCategory !== 'All') {
      events = events.filter(e => e.type === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      events = events.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.area.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }
    return events;
  }, [searchQuery, selectedCategory]);

  // Reset swiper when filters change
  const applyFilter = useCallback((category) => {
    setSelectedCategory(category);
    setAllSwiped(false);
    setSwipeCount(0);
    setKey(prev => prev + 1);
  }, []);

  const applySearch = useCallback((text) => {
    setSearchQuery(text);
    setAllSwiped(false);
    setSwipeCount(0);
    setKey(prev => prev + 1);
  }, []);

  const onSwipedRight = useCallback((cardIndex) => {
    setSwipeCount(prev => prev + 1);
    console.log('Added to Private Calendar:', mockEvents[cardIndex].title);
  }, []);

  const onSwipedLeft = useCallback((cardIndex) => {
    setSwipeCount(prev => prev + 1);
    console.log('Not Interested:', mockEvents[cardIndex].title);
  }, []);

  const onSwipedTop = useCallback((cardIndex) => {
    setSwipeCount(prev => prev + 1);
    console.log('Added to Public Calendar:', mockEvents[cardIndex].title);
  }, []);

  const onSwipedBottom = useCallback((cardIndex) => {
    setSwipeCount(prev => prev + 1);
    console.log('Saved for Later:', mockEvents[cardIndex].title);
  }, []);

  const onSwipedAll = useCallback(() => {
    setAllSwiped(true);
  }, []);

  const resetCards = useCallback(() => {
    setAllSwiped(false);
    setSwipeCount(0);
    setKey(prev => prev + 1);
  }, []);

  // Overlay that renders OVER the card with a colored tint
  const OverlayTint = ({ label, icon, color, bgColor }) => (
    <View style={[styles.overlayTint, { backgroundColor: bgColor }]}> 
      <View style={styles.overlayIconRow}>
        <View style={[styles.overlayCircle, { backgroundColor: color }]}>
          <Ionicons name={icon} size={32} color="#fff" />
        </View>
      </View>
      <Text style={[styles.overlayLabel, { color }]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, places, categories..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={applySearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => applySearch('')}>
              <Ionicons name="close-circle" size={18} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter Pills */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {ALL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.label;
            return (
              <TouchableOpacity
                key={cat.label}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => applyFilter(cat.label)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={cat.icon}
                  size={14}
                  color={isActive ? '#fff' : '#666'}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Swipe Count */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>
          {filteredEvents.length} events {selectedCategory !== 'All' ? `in ${selectedCategory}` : 'in Delhi'} {' \u2022 '} {swipeCount} swiped
        </Text>
      </View>

      {!allSwiped && filteredEvents.length > 0 ? (
        <View style={styles.swiperContainer}>
          <Swiper
            key={key}
            ref={swiperRef}
            cards={filteredEvents}
            renderCard={(card) => {
              if (!card) return null;
              return <EventCard event={card} />;
            }}
            onSwipedRight={onSwipedRight}
            onSwipedLeft={onSwipedLeft}
            onSwipedTop={onSwipedTop}
            onSwipedBottom={onSwipedBottom}
            onSwipedAll={onSwipedAll}
            cardIndex={0}
            backgroundColor={'transparent'}
            stackSize={3}
            stackSeparation={10}
            stackScale={4}
            infinite={false}
            animateCardOpacity
            cardVerticalMargin={0}
            cardHorizontalMargin={16}
            disableBottomSwipe={false}
            disableTopSwipe={false}
            useViewOverflow={false}
            overlayLabels={{
              left: {
                element: <OverlayTint label="NOT INTERESTED" icon="close" color="#FF4458" bgColor="rgba(255, 68, 88, 0.25)" />,
                style: { wrapper: styles.overlayWrapper },
              },
              right: {
                element: <OverlayTint label="ADD TO PRIVATE CALENDAR" icon="lock-closed" color="#00C853" bgColor="rgba(0, 200, 83, 0.25)" />,
                style: { wrapper: styles.overlayWrapper },
              },
              top: {
                element: <OverlayTint label="ADD TO PUBLIC CALENDAR" icon="globe" color="#2196F3" bgColor="rgba(33, 150, 243, 0.25)" />,
                style: { wrapper: styles.overlayWrapper },
              },
              bottom: {
                element: <OverlayTint label="SAVE FOR LATER" icon="bookmark" color="#FF9800" bgColor="rgba(255, 152, 0, 0.25)" />,
                style: { wrapper: styles.overlayWrapper },
              },
            }}
          />
        </View>
      ) : allSwiped ? (
        <View style={styles.noCardsContainer}>
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
            <Text style={styles.noCardsTitle}>All Caught Up!</Text>
            <Text style={styles.noCardsText}>You've explored all {selectedCategory !== 'All' ? selectedCategory : 'Delhi'} events.</Text>
            <Text style={styles.noCardsSubtext}>You swiped {swipeCount} events</Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetCards}>
              <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.resetButtonText}>Explore Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.noCardsContainer}>
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.noCardsTitle}>No Events Found</Text>
            <Text style={styles.noCardsText}>Try a different search or category</Text>
            <TouchableOpacity style={styles.resetButton} onPress={() => { applySearch(''); applyFilter('All'); }}>
              <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.resetButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Swipe hints bar */}
      {!allSwiped && filteredEvents.length > 0 && (
        <View style={styles.hintContainer}>
          <View style={styles.hintRow}>
            <View style={styles.hintItem}>
              <Ionicons name="arrow-back" size={14} color="#FF4458" />
              <Text style={[styles.hintText, { color: '#FF4458' }]}>Pass</Text>
            </View>
            <View style={styles.hintItem}>
              <Ionicons name="arrow-down" size={14} color="#FF9800" />
              <Text style={[styles.hintText, { color: '#FF9800' }]}>Save</Text>
            </View>
            <View style={styles.hintItem}>
              <Ionicons name="arrow-up" size={14} color="#2196F3" />
              <Text style={[styles.hintText, { color: '#2196F3' }]}>Public</Text>
            </View>
            <View style={styles.hintItem}>
              <Ionicons name="arrow-forward" size={14} color="#00C853" />
              <Text style={[styles.hintText, { color: '#00C853' }]}>Private</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
  },
  categoryContainer: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  swiperContainer: {
    flex: 1,
  },
  // Overlay clipped to card bounds
  overlayWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height - 220,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 10,
  },
  overlayTint: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  overlayIconRow: {
    marginBottom: 10,
  },
  overlayCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  overlayLabel: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  noCardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyState: {
    alignItems: 'center',
  },
  noCardsTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  noCardsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 4,
  },
  noCardsSubtext: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 24,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  hintContainer: {
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  hintRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 11,
    marginLeft: 3,
    fontWeight: '600',
  },
});
