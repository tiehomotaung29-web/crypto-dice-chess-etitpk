
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';

export default function ChessGame() {
  const [balance, setBalance] = useState(1000.50);
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
      timeLeft: '45:32'
    },
    {
      id: '2',
      player1: 'Garry Kasparov',
      player2: 'Fabiano Caruana',
      odds1: 2.25,
      odds2: 1.75,
      status: 'upcoming',
      timeLeft: '2:15:00'
    },
    {
      id: '3',
      player1: 'Ding Liren',
      player2: 'Ian Nepomniachtchi',
      odds1: 1.95,
      odds2: 1.95,
      status: 'live',
      timeLeft: '1:23:45'
    }
  ];

  const betAmounts = [5, 10, 25, 50, 100];

  const placeBet = (matchId: string, player: string, odds: number) => {
    if (betAmount > balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough funds to place this bet.');
      return;
    }

    console.log(`Placing bet: $${betAmount} on ${player} with odds ${odds}`);
    setBalance(prev => prev - betAmount);
    setGameInProgress(true);
    
    // Simulate game result after 3 seconds
    setTimeout(() => {
      const won = Math.random() > 0.5;
      if (won) {
        const winnings = betAmount * odds;
        setBalance(prev => prev + winnings);
        Alert.alert('Congratulations!', `You won $${winnings.toFixed(2)}!`);
      } else {
        Alert.alert('Better luck next time!', `You lost $${betAmount.toFixed(2)}.`);
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
          borderBottomWidth: 1,
          borderBottomColor: colors.border
        }}>
          <View style={commonStyles.row}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ padding: 8, marginLeft: -8 }}
            >
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[commonStyles.title, { flex: 1, textAlign: 'center', marginBottom: 0 }]}>
              Chess Betting
            </Text>
            <Text style={{ color: colors.gold, fontWeight: '600', fontSize: 16 }}>
              ${balance.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Bet Amount Selection */}
        <View style={[commonStyles.section, { marginTop: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Select Bet Amount
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
                  fontWeight: '600' 
                }}>
                  ${amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Live Matches */}
        <View style={[commonStyles.section, { marginTop: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Available Matches
          </Text>
          
          {matches.map((match) => (
            <View key={match.id} style={[commonStyles.gameCard, { marginBottom: 16 }]}>
              <View style={[commonStyles.row, { marginBottom: 12 }]}>
                <View style={{ 
                  backgroundColor: match.status === 'live' ? colors.green : colors.accent,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4
                }}>
                  <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>
                    {match.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                  {match.timeLeft}
                </Text>
              </View>

              <Text style={[commonStyles.text, { fontSize: 18, fontWeight: '600', marginBottom: 16 }]}>
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
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 12 }}>
                    {match.player1}
                  </Text>
                  <Text style={{ color: colors.gold, fontWeight: '700' }}>
                    {match.odds1}x
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
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 12 }}>
                    {match.player2}
                  </Text>
                  <Text style={{ color: colors.gold, fontWeight: '700' }}>
                    {match.odds2}x
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {gameInProgress && (
          <View style={[commonStyles.card, { margin: 20 }]}>
            <Text style={[commonStyles.text, { textAlign: 'center' }]}>
              🎲 Game in progress...
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              Waiting for results...
            </Text>
          </View>
        )}

        {/* Game Rules */}
        <View style={[commonStyles.card, { margin: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            How Chess Betting Works
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Choose a live or upcoming chess match
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Select your bet amount and preferred player
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Win multiplied by the odds if your player wins
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • All bets are settled in cryptocurrency
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
