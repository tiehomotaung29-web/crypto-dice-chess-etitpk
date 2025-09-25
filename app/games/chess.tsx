
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';

export default function ChessGame() {
  const [balance, setBalance] = useState(250.00);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [gameInProgress, setGameInProgress] = useState(false);

  const matches = [
    {
      id: '1',
      player1: 'Magnus Carlsen',
      player2: 'Hikaru Nakamura',
      odds1: 1.85,
      odds2: 2.10,
      status: 'live',
      timeLeft: '45:32',
      viewers: '2.3K'
    },
    {
      id: '2',
      player1: 'Garry Kasparov',
      player2: 'Fabiano Caruana',
      odds1: 2.25,
      odds2: 1.75,
      status: 'upcoming',
      timeLeft: '2:15:00',
      viewers: '1.8K'
    },
    {
      id: '3',
      player1: 'Ding Liren',
      player2: 'Ian Nepomniachtchi',
      odds1: 1.95,
      odds2: 1.95,
      status: 'live',
      timeLeft: '1:23:45',
      viewers: '3.1K'
    }
  ];

  const betAmounts = [10, 25, 50, 100, 250];

  const placeBet = (matchId: string, player: string, odds: number) => {
    if (betAmount < 10) {
      Alert.alert('Minimum Bet', 'Minimum bet is R10.');
      return;
    }

    if (betAmount > balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough funds to place this bet.');
      return;
    }

    console.log(`Placing bet: R${betAmount} on ${player} with odds ${odds}`);
    setBalance(prev => prev - betAmount);
    setGameInProgress(true);
    
    Alert.alert(
      'Bet Placed!', 
      `Bet: R${betAmount} on ${player}\nPotential Win: R${(betAmount * odds * 0.7).toFixed(2)}\n(After 30% house commission)\n\nWaiting for match result...`
    );
    
    // Simulate game result after 3 seconds
    setTimeout(() => {
      const won = Math.random() > 0.5;
      if (won) {
        const grossWinnings = betAmount * odds;
        const commission = grossWinnings * 0.3;
        const netWinnings = grossWinnings - commission;
        
        setBalance(prev => prev + netWinnings);
        Alert.alert(
          '🏆 Congratulations!', 
          `${player} won!\n\nGross Winnings: R${grossWinnings.toFixed(2)}\nHouse Commission (30%): R${commission.toFixed(2)}\nNet Winnings: R${netWinnings.toFixed(2)}\n\nAdded to your balance!`
        );
      } else {
        Alert.alert(
          '😔 Better luck next time!', 
          `${player} lost the match.\n\nYou lost: R${betAmount.toFixed(2)}`
        );
      }
      setGameInProgress(false);
    }, 3000);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ 
          padding: 20, 
          backgroundColor: colors.primary,
          borderBottomWidth: 3,
          borderBottomColor: colors.accent
        }}>
          <View style={commonStyles.row}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ padding: 8, marginLeft: -8 }}
            >
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[commonStyles.title, { flex: 1, textAlign: 'center', marginBottom: 0 }]}>
              ♟️ Chess Betting
            </Text>
            <Text style={{ color: colors.gold, fontWeight: '900', fontSize: 16 }}>
              R{balance.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Commission Notice */}
        <View style={[commonStyles.card, { margin: 20, backgroundColor: colors.commission }]}>
          <Text style={[commonStyles.text, { color: colors.text, fontWeight: '700', textAlign: 'center' }]}>
            🏆 30% Commission Applied to All Winnings
          </Text>
        </View>

        {/* Bet Amount Selection */}
        <View style={[commonStyles.section, { marginTop: 0 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            💰 Select Bet Amount (Min R10)
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            gap: 12
          }}>
            {betAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  buttonStyles.secondary,
                  { 
                    paddingHorizontal: 16, 
                    paddingVertical: 8,
                    backgroundColor: betAmount === amount ? colors.gold : colors.backgroundAlt,
                    borderColor: betAmount === amount ? colors.gold : colors.border
                  }
                ]}
                onPress={() => setBetAmount(amount)}
              >
                <Text style={{ 
                  color: betAmount === amount ? colors.primary : colors.text,
                  fontWeight: '700' 
                }}>
                  R{amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Live Matches */}
        <View style={[commonStyles.section, { marginTop: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            🔴 Live Chess Matches
          </Text>
          
          {matches.map((match) => (
            <View key={match.id} style={[commonStyles.gameCard, { marginBottom: 16 }]}>
              <View style={[commonStyles.row, { marginBottom: 12 }]}>
                <View style={{ 
                  backgroundColor: match.status === 'live' ? colors.green : colors.accent,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8
                }}>
                  <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700' }}>
                    {match.status.toUpperCase()}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    ⏱️ {match.timeLeft}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 10 }]}>
                    👥 {match.viewers} watching
                  </Text>
                </View>
              </View>

              <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '700', marginBottom: 16 }]}>
                {match.player1} vs {match.player2}
              </Text>

              <View style={commonStyles.row}>
                <TouchableOpacity
                  style={[
                    buttonStyles.primary,
                    { 
                      flex: 1, 
                      marginRight: 8,
                      opacity: gameInProgress ? 0.5 : 1
                    }
                  ]}
                  onPress={() => placeBet(match.id, match.player1, match.odds1)}
                  disabled={gameInProgress}
                >
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 12, textAlign: 'center' }}>
                    {match.player1}
                  </Text>
                  <Text style={{ color: colors.gold, fontWeight: '900', fontSize: 14 }}>
                    {match.odds1}x
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 10 }}>
                    Win: R{(betAmount * match.odds1 * 0.7).toFixed(0)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    buttonStyles.primary,
                    { 
                      flex: 1, 
                      marginLeft: 8,
                      opacity: gameInProgress ? 0.5 : 1
                    }
                  ]}
                  onPress={() => placeBet(match.id, match.player2, match.odds2)}
                  disabled={gameInProgress}
                >
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 12, textAlign: 'center' }}>
                    {match.player2}
                  </Text>
                  <Text style={{ color: colors.gold, fontWeight: '900', fontSize: 14 }}>
                    {match.odds2}x
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 10 }}>
                    Win: R{(betAmount * match.odds2 * 0.7).toFixed(0)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {gameInProgress && (
          <View style={[commonStyles.card, { margin: 20 }]}>
            <Text style={[commonStyles.text, { textAlign: 'center' }]}>
              ♟️ Match in progress...
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              Waiting for results...
            </Text>
          </View>
        )}

        {/* Game Rules */}
        <View style={[commonStyles.card, { margin: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            📋 Chess Betting Rules
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Minimum bet: R10
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Choose a live or upcoming chess match
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Select your bet amount and preferred player
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Win = Bet × Odds × 0.7 (30% house commission)
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • All payments in South African Rand (ZAR)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
