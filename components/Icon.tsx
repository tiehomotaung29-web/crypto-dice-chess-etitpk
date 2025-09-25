
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/commonStyles';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap | 'chess-king' | 'dice' | 'card';
  size?: number;
  style?: any;
  color?: string;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Icon({ name, size = 24, style, color = colors.text }: IconProps) {
  // Handle custom icons that aren't in Ionicons
  if (name === 'chess-king') {
    return (
      <View style={[styles.container, style]}>
        <Text style={{ fontSize: size, color }}>♔</Text>
      </View>
    );
  }
  
  if (name === 'dice') {
    return (
      <View style={[styles.container, style]}>
        <Text style={{ fontSize: size, color }}>🎲</Text>
      </View>
    );
  }
  
  if (name === 'card') {
    return (
      <View style={[styles.container, style]}>
        <Text style={{ fontSize: size, color }}>🃏</Text>
      </View>
    );
  }

  // Use Ionicons for standard icons
  return (
    <View style={[styles.container, style]}>
      <Ionicons 
        name={name as keyof typeof Ionicons.glyphMap} 
        size={size} 
        color={color} 
      />
    </View>
  );
}
