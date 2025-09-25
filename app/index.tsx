
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';
import CryptoWallet from '../components/CryptoWallet';

export default function MainScreen() {
  const [balance, setBalance] = useState(1000.50);
  const [isWalletVisible, setIsWalletVisible] = useState(false);

  const games = [
    {
      id: 'chess',
      title: 'Chess',
      description: 'Strategic betting on chess matches',
      icon: 'chess-king' as any,
      route: '/games/chess'
    },
    {
      id: 'dice',
      title: 'Dice',
      description: 'Classic dice rolling game',
      icon: 'dice' as any,
      route: '/games/dice'
    },
    {
      id: 'cards',
      title: 'Card Games',
      description: 'Poker, Blackjack & more',
      icon: 'card' as any,
      route: '/games/cards'
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
          borderBottomWidth: 1,
          borderBottomColor: colors.border
        }}>
          <View style={commonStyles.row}>
            <View>
              <Text style={[commonStyles.title, { textAlign: 'left', marginBottom: 4 }]}>
                CryptoStake
              </Text>
              <Text style={commonStyles.textSecondary}>
                Premium Crypto Gaming
              </Text>
            </View>
            <TouchableOpacity 
              style={[buttonStyles.gold, { paddingHorizontal: 16, paddingVertical: 8 }]}
              onPress={() => setIsWalletVisible(true)}
            >
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                ${balance.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Section */}
        <View style={[commonStyles.section, { marginTop: 30 }]}>
          <Text style={commonStyles.subtitle}>
            Choose Your Game
          </Text>
          <Text style={commonStyles.textSecondary}>
            All games support cryptocurrency betting
          </Text>
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
              <Icon 
                name={game.icon} 
                size={48} 
                color={colors.gold}
                style={{ marginBottom: 16 }}
              />
              <Text style={[commonStyles.subtitle, { marginBottom: 8 }]}>
                {game.title}
              </Text>
              <Text style={commonStyles.textSecondary}>
                {game.description}
              </Text>
              
              <View style={[buttonStyles.primary, { marginTop: 16, width: '100%' }]}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>
                  Play Now
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={[commonStyles.card, { margin: 20, marginTop: 0 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Platform Stats
          </Text>
          <View style={commonStyles.row}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.gold, fontSize: 20, fontWeight: '700' }}>
                $2.4M
              </Text>
              <Text style={commonStyles.textSecondary}>
                Total Wagered
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.green, fontSize: 20, fontWeight: '700' }}>
                15,432
              </Text>
              <Text style={commonStyles.textSecondary}>
                Active Players
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.accent, fontSize: 20, fontWeight: '700' }}>
                98.5%
              </Text>
              <Text style={commonStyles.textSecondary}>
                Payout Rate
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Wallet Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={isWalletVisible}
        onClose={() => setIsWalletVisible(false)}
      >
        <CryptoWallet
          balance={balance}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
        />
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
