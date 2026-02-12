import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

// Mock Suggestions
const suggestions = [
  {
    id: 1,
    name: 'Jordan Smith',
    sharedEvent: 'Pottery Workshop',
    emoji: '🧑‍🎨',
    bgColor: '#E8F5E9',
    reason: 'You both attended'
  },
  {
    id: 2,
    name: 'Sarah Lee',
    sharedEvent: 'Comedy Night',
    emoji: '😂',
    bgColor: '#FFF3E0',
    reason: 'You are both going to'
  },
  {
    id: 3,
    name: 'Mike Chen',
    sharedEvent: 'Tech Meetup',
    emoji: '💻',
    bgColor: '#E3F2FD',
    reason: 'Shared interest: Tech'
  },
];

export default function ConnectionsScreen() {
  const [data, setData] = useState(suggestions);

  const handleConnect = (name) => {
    Alert.alert('Connection Sent', `Invitation sent to ${name}!`);
    // Remove from list for demo
    setData(data.filter(item => item.name !== name));
  };

  const handleSkip = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={[styles.emojiAvatar, { backgroundColor: item.bgColor }]}>
        <Text style={styles.emojiText}>{item.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.reason}>
            {item.reason}: <Text style={styles.event}>{item.sharedEvent}</Text>
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleSkip(item.id)} style={styles.skipButton}>
            <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleConnect(item.name)} style={styles.connectButton}>
            <Ionicons name="person-add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>People Nearby</Text>
        <Text style={styles.subTitle}>Based on your events</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text>No new suggestions right now.</Text>
            </View>
        }
      />
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subTitle: {
      color: '#666',
      marginTop: 5,
  },
  list: {
      padding: 20,
  },
  card: {
      backgroundColor: '#fff',
      borderRadius: 15,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
  },
  image: {
      width: 60,
      height: 60,
      borderRadius: 30,
  },
  emojiAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
  },
  emojiText: {
      fontSize: 28,
  },
  info: {
      flex: 1,
      marginLeft: 15,
  },
  name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
  },
  reason: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
  },
  event: {
      fontWeight: 'bold',
      color: colors.primary,
  },
  actions: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  skipButton: {
      padding: 10,
      marginRight: 5,
  },
  connectButton: {
      padding: 10,
      backgroundColor: colors.primary,
      borderRadius: 50,
  },
  emptyContainer: {
      alignItems: 'center',
      marginTop: 50,
  }
});
