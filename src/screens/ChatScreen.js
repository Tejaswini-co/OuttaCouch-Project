import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const mockChats = [
    {
        id: 1,
        name: 'Aarav Sharma',
        lastMessage: 'See you at the Qutub Minar night walk!',
        time: '2m ago',
        emoji: '👨‍💻',
        bgColor: '#E3F2FD',
        unread: true,
        unreadCount: 3,
        context: 'Qutub Minar Night Walk',
        online: true,
    },
    {
        id: 2,
        name: 'Priya Gupta',
        lastMessage: 'That food festival was amazing! We should go again.',
        time: '15m ago',
        emoji: '👩‍🎨',
        bgColor: '#FFF3E0',
        unread: true,
        unreadCount: 1,
        context: 'Chandni Chowk Food Walk',
        online: true,
    },
    {
        id: 3,
        name: 'Rohan Mehta',
        lastMessage: 'The startup pitch was incredible. Did you connect with the VCs?',
        time: '1h ago',
        emoji: '🧑‍💼',
        bgColor: '#E8F5E9',
        unread: false,
        unreadCount: 0,
        context: 'Delhi Startup Meetup',
        online: false,
    },
    {
        id: 4,
        name: 'Ananya Singh',
        lastMessage: 'The yoga session at Lodhi Garden was so peaceful',
        time: '3h ago',
        emoji: '🧘‍♀️',
        bgColor: '#F3E5F5',
        unread: false,
        unreadCount: 0,
        context: 'Sunrise Yoga at Lodhi Garden',
        online: true,
    },
    {
        id: 5,
        name: 'Kabir Verma',
        lastMessage: 'Hey, want to check out the Dilli Haat crafts fair this weekend?',
        time: '5h ago',
        emoji: '🎸',
        bgColor: '#FFEBEE',
        unread: false,
        unreadCount: 0,
        context: 'Dilli Haat Crafts Fair',
        online: false,
    },
    {
        id: 6,
        name: 'Meera Kapoor',
        lastMessage: 'The comedy show at Kingdom of Dreams was hilarious!',
        time: 'Yesterday',
        emoji: '😄',
        bgColor: '#FFF8E1',
        unread: false,
        unreadCount: 0,
        context: 'Stand-up Comedy Night',
        online: false,
    },
    {
        id: 7,
        name: 'Vikram Joshi',
        lastMessage: 'Are you going to the Sufi night at Nizamuddin?',
        time: 'Yesterday',
        emoji: '🎵',
        bgColor: '#E0F7FA',
        unread: false,
        unreadCount: 0,
        context: 'Sufi Night at Nizamuddin',
        online: false,
    },
    {
        id: 8,
        name: 'Sanya Malhotra',
        lastMessage: 'Thanks for the pottery tips! My vase turned out great.',
        time: '2 days ago',
        emoji: '🎨',
        bgColor: '#FCE4EC',
        unread: false,
        unreadCount: 0,
        context: 'Pottery Workshop',
        online: false,
    },
];

export default function ChatScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChats = mockChats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.context.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onChatPress = (chat) => {
        console.log('Open chat with', chat.name);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.chatItem} onPress={() => onChatPress(item)} activeOpacity={0.7}>
            <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: item.bgColor }]}>
                    <Text style={styles.avatarEmoji}>{item.emoji}</Text>
                </View>
                {item.online && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={[styles.name, item.unread && styles.nameUnread]}>{item.name}</Text>
                    <Text style={[styles.time, item.unread && styles.timeUnread]}>{item.time}</Text>
                </View>
                <Text style={[styles.message, item.unread && styles.messageUnread]} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
                <View style={styles.contextRow}>
                    <Ionicons name="link-outline" size={10} color={colors.primary} />
                    <Text style={styles.context}>{item.context}</Text>
                </View>
            </View>
            {item.unread && item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
                </View>
            )}
            <Ionicons name="chevron-forward" size={18} color="#ddd" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
    );

    const ListEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={60} color="#ddd" />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>Start exploring events and connect with people!</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
                <Text style={styles.headerSubtitle}>{mockChats.filter(c => c.unread).length} unread</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search messages..."
                    placeholderTextColor="#bbb"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color="#ccc" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Chat List */}
            <FlatList
                data={filteredChats}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={ListEmpty}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={filteredChats.length === 0 ? { flex: 1 } : {}}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#00C853',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    color: '#444',
  },
  nameUnread: {
    fontWeight: '700',
    color: '#1a1a1a',
  },
  time: {
    fontSize: 11,
    color: '#bbb',
  },
  timeUnread: {
    color: colors.primary,
    fontWeight: '600',
  },
  message: {
    fontSize: 13,
    color: '#999',
    marginBottom: 3,
  },
  messageUnread: {
    color: '#555',
    fontWeight: '500',
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  context: {
    fontSize: 11,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 6,
  },
});
