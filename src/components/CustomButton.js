import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function CustomButton({ title, onPress, type = 'PRIMARY' }) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.container, 
        type === 'PRIMARY' ? styles.containerPrimary : styles.containerSecondary
      ]}
    >
      <Text style={[
        styles.text, 
        type === 'PRIMARY' ? styles.textPrimary : styles.textSecondary
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  containerPrimary: {
    backgroundColor: colors.primary,
  },
  containerSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: colors.primary,
  },
});
