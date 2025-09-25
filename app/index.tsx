
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';
import PaymentWallet from '../components/PaymentWallet';

export default function MainScreen() {
  const [balance, setBalance] = useState(250.00);
  const [isWalletVisible, setIsWalletVisible] = useState(false);

  const games = [
    {
      id: 'chess',
      title: 'Chess',
      description: 'Strategic betting on live chess matches',
      icon: 'chess-king' as any,
      route: '/games/chess',
      minBet: 10,
      emoji: '♟️'
    },
    {
      id: 'dice',
      title: 'Dice',
      description: 'Roll the dice and predict the outcome',
      icon: 'dice' as any,
      route: '/games/dice',
      minBet: 10,
      emoji: '🎲'
    },
    {
      id: 'cards',
      title: 'Card Games',
      description: 'Blackjack, Poker & more card games',
      icon: 'card' as any,
      route: '/games/cards',
      minBet: 10,
      emoji: '🃏'
    },
    {
      id: 'ludo',
      title: 'Ludo',
      description: 'Classic board game with real money',
      icon: 'game-controller' as any,
      route: '/games/ludo',
      minBet: 10,
      emoji: '🎯'
    }
  ];

  const navigateToGame = (route: string) => {
    console.log('Navigating to game:', route);
    router.push(route);
  };

  const handleDeposit = (amount: number) => {
    console.log('Depositing:', amount);
    setBalance(prev => prev + amount);
  };

  const handleWithdraw = (amount: number) => {
    console.log('Withdrawing:', amount);
    setBalance(prev => prev - amount);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={{ 
          padding: 20, 
          backgroundColor: colors.primary,
          borderBottomWidth: 3,
          borderBottomColor: colors.accent
        }}>
          <View style={commonStyles.row}>
            <View>
              <Text style={[commonStyles.title, { textAlign: 'left', marginBottom: 4, fontSize: 28 }]}>
                🎰 Mzansikasino
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'left' }]}>
                South Africa's Premier Gaming Platform
              </Text>
            </View>
            <TouchableOpacity 
              style={[buttonStyles.gold, { paddingHorizontal: 16, paddingVertical: 8 }]}
              onPress={() => setIsWalletVisible(true)}
            >
              <Text style={{ color: colors.primary, fontWeight: '900', fontSize: 16 }}>
                R{balance.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Section */}
        <View style={[commonStyles.section, { marginTop: 30 }]}>
          <Text style={commonStyles.subtitle}>
            🔥 Choose Your Game
          </Text>
          <Text style={commonStyles.textSecondary}>
            Minimum bet R10 • 30% commission on winnings
          </Text>
          <View style={[commonStyles.commissionBadge, { marginTop: 8 }]}>
            <Text style={commonStyles.commissionText}>
              HOUSE EDGE: 30%
            </Text>
          </View>
        </View>

        {/* Games Grid */}
        <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 20 }}>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={commonStyles.gameCard}
              onPress={() => navigateToGame(game.route)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 64, marginBottom: 16 }}>
                {game.emoji}
              </Text>
              <Text style={[commonStyles.subtitle, { marginBottom: 8 }]}>
                {game.title}
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>
                {game.description}
              </Text>
              <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 16 }]}>
                Min Bet: R{game.minBet}
              </Text>
              
              <View style={[buttonStyles.primary, { marginTop: 16, width: '100%' }]}>
                <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>
                  🎮 Play Now
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Platform Stats */}
        <View style={[commonStyles.card, { margin: 20, marginTop: 0 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            📈 Mzansikasino Stats
          </Text>
          <View style={commonStyles.row}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.gold, fontSize: 20, fontWeight: '900' }}>
                R2.4M
              </Text>
              <Text style={commonStyles.textSecondary}>
                Total Wagered
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.green, fontSize: 20, fontWeight: '900' }}>
                8,432
              </Text>
              <Text style={commonStyles.textSecondary}>
                Active Players
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.accent, fontSize: 20, fontWeight: '900' }}>
                70%
              </Text>
              <Text style={commonStyles.textSecondary}>
                Player Payout
              </Text>
            </View>
          </View>
        </View>

        {/* Live Games */}
        <View style={[commonStyles.card, { margin: 20, marginTop: 0 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            🔴 Live Games
          </Text>
          <View style={{ gap: 8 }}>
            <View style={[commonStyles.row, { paddingVertical: 4 }]}>
              <Text style={commonStyles.textSecondary}>♟️ Chess Match #1</Text>
              <Text style={{ color: colors.green, fontWeight: '600' }}>LIVE</Text>
            </View>
            <View style={[commonStyles.row, { paddingVertical: 4 }]}>
              <Text style={commonStyles.textSecondary}>🎲 Dice Room #3</Text>
              <Text style={{ color: colors.green, fontWeight: '600' }}>LIVE</Text>
            </View>
            <View style={[commonStyles.row, { paddingVertical: 4 }]}>
              <Text style={commonStyles.textSecondary}>🃏 Blackjack Table #2</Text>
              <Text style={{ color: colors.green, fontWeight: '600' }}>LIVE</Text>
            </View>
            <View style={[commonStyles.row, { paddingVertical: 4 }]}>
              <Text style={commonStyles.textSecondary}>🎯 Ludo Tournament</Text>
              <Text style={{ color: colors.accent, fontWeight: '600' }}>STARTING</Text>
            </View>
          </View>
        </View>

        {/* Promotions */}
        <View style={[commonStyles.card, { margin: 20, marginTop: 0, backgroundColor: colors.accent }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12, color: colors.text }]}>
            🎁 Welcome Bonus
          </Text>
          <Text style={[commonStyles.text, { color: colors.text, fontWeight: '600' }]}>
            Deposit R100+ and get 50% bonus!
          </Text>
          <Text style={[commonStyles.textSecondary, { color: colors.text, opacity: 0.9 }]}>
            *Terms and conditions apply. 30% commission still applies to winnings.
          </Text>
        </View>
      </ScrollView>

      {/* Wallet Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={isWalletVisible}
        onClose={() => setIsWalletVisible(false)}
      >
        <PaymentWallet
          balance={balance}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
        />
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
