
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#1a0d00',        // Deep brown/black for primary elements
  secondary: '#2d1810',      // Rich brown
  accent: '#ff6b35',         // Vibrant orange accent
  gold: '#ffd700',           // Gold for highlights
  green: '#00ff88',          // Success/win color
  red: '#ff4757',            // Error/loss color
  purple: '#8e44ad',         // Royal purple
  background: '#0f0a05',     // Very dark brown background
  backgroundAlt: '#1f1611',  // Card background
  text: '#ffffff',           // White text
  textSecondary: '#c7a882',  // Warm gold-brown text
  border: '#3d2817',         // Border color
  card: '#1a0d00',           // Card background
  commission: '#e74c3c',     // Commission color (red)
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(255, 107, 53, 0.3)',
    elevation: 6,
  },
  secondary: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  gold: {
    backgroundColor: colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(255, 215, 0, 0.4)',
    elevation: 6,
  },
  purple: {
    backgroundColor: colors.purple,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(142, 68, 173, 0.3)',
    elevation: 6,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
    textShadowColor: colors.accent,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 8,
    textShadowColor: colors.gold,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 6px 16px rgba(255, 107, 53, 0.2)',
    elevation: 8,
  },
  gameCard: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
    borderWidth: 2,
    borderRadius: 20,
    padding: 24,
    marginVertical: 12,
    width: '100%',
    alignItems: 'center',
    boxShadow: '0px 8px 20px rgba(255, 107, 53, 0.3)',
    elevation: 10,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.gold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commissionBadge: {
    backgroundColor: colors.commission,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  commissionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
});
