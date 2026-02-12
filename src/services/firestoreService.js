// Firestore Service Helpers
// =========================
// All Firestore database operations for the Outtacouch app

import { db } from '../config/firebase';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

// ==================== USER PROFILES ====================

// Create or update user profile in Firestore
export const createUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(userRef, {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileComplete: false,
      });
    }
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error };
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, data: null };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error };
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    // Use setDoc with merge so it works even if the document doesn't exist yet
    const writePromise = setDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Add a 8-second timeout so it doesn't hang forever on slow connections
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 8000)
    );

    try {
      await Promise.race([writePromise, timeout]);
    } catch (e) {
      if (e.message === 'timeout') {
        // Data is cached locally by Firestore and will sync when back online
        console.log('Profile update cached locally, will sync when online');
      } else {
        throw e;
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
};

// ==================== EVENTS ====================

// Add a new event
export const addEvent = async (eventData) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: serverTimestamp(),
      attendees: [],
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding event:', error);
    return { success: false, error };
  }
};

// Get all events (for the explore feed)
export const getEvents = async () => {
  try {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: events };
  } catch (error) {
    console.error('Error getting events:', error);
    return { success: false, error };
  }
};

// Get events by location (city)
export const getEventsByCity = async (city) => {
  try {
    const q = query(collection(db, 'events'), where('city', '==', city));
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: events };
  } catch (error) {
    console.error('Error getting events by city:', error);
    return { success: false, error };
  }
};

// Commit to an event (add user to attendees)
export const commitToEvent = async (eventId, userId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    if (eventSnap.exists()) {
      const currentAttendees = eventSnap.data().attendees || [];
      if (!currentAttendees.includes(userId)) {
        await updateDoc(eventRef, {
          attendees: [...currentAttendees, userId],
        });
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error committing to event:', error);
    return { success: false, error };
  }
};

// ==================== CONNECTIONS ====================

// Send a connection request
export const sendConnectionRequest = async (fromUserId, toUserId, sharedEventId) => {
  try {
    await addDoc(collection(db, 'connections'), {
      from: fromUserId,
      to: toUserId,
      sharedEvent: sharedEventId,
      status: 'pending', // pending | accepted | rejected
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending connection request:', error);
    return { success: false, error };
  }
};

// Get connections for a user
export const getUserConnections = async (userId) => {
  try {
    const q = query(
      collection(db, 'connections'),
      where('status', '==', 'accepted')
    );
    const querySnapshot = await getDocs(q);
    const connections = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.from === userId || data.to === userId) {
        connections.push({ id: doc.id, ...data });
      }
    });
    return { success: true, data: connections };
  } catch (error) {
    console.error('Error getting connections:', error);
    return { success: false, error };
  }
};

// Accept a connection request
export const acceptConnection = async (connectionId) => {
  try {
    const connRef = doc(db, 'connections', connectionId);
    await updateDoc(connRef, { status: 'accepted' });
    return { success: true };
  } catch (error) {
    console.error('Error accepting connection:', error);
    return { success: false, error };
  }
};

// ==================== CHAT ====================

// Send a message
export const sendMessage = async (chatId, senderId, text) => {
  try {
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      senderId,
      text,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error };
  }
};

// Listen for real-time messages in a chat
export const subscribeToMessages = (chatId, callback) => {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });
};

// Get all chats for a user
export const getUserChats = async (userId) => {
  try {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId)
    );
    const querySnapshot = await getDocs(q);
    const chats = [];
    querySnapshot.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: chats };
  } catch (error) {
    console.error('Error getting user chats:', error);
    return { success: false, error };
  }
};

// Create a new chat between two users
export const createChat = async (user1Id, user2Id, sharedEventName) => {
  try {
    const docRef = await addDoc(collection(db, 'chats'), {
      participants: [user1Id, user2Id],
      sharedEvent: sharedEventName,
      createdAt: serverTimestamp(),
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating chat:', error);
    return { success: false, error };
  }
};
