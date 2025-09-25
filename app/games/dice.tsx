
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';

export default function DiceGame() {
  const [balance, setBalance] = useState(250.00);
  const [betAmount, setBetAmount] = useState(10);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'rolling' | 'finished'>('waiting');
  const [opponentFound, setOpponentFound] = useState(false);
  const [playerRoll, setPlayerRoll] = useState<number | null>(null);
  const [opponentRoll, setOpponentRoll] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [diceAnimation] = useState(new Animated.Value(0));

  const betAmounts = [10, 25, 50, 100, 250];

  const startGame = () => {
    if (betAmount < 10) {
      Alert.alert('Minimum Bet', 'Minimum bet is R10.');
      return;
    }

    if (betAmount > balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough funds to play this game.');
      return;
    }

    console.log(`Starting Dice PvP with R${betAmount} bet`);
    setBalance(prev => prev - betAmount);
    setGameInProgress(true);
    setGamePhase('waiting');
    setPlayerRoll(null);
    setOpponentRoll(null);
    setGameResult(null);
    
    Alert.alert(
      'Finding Opponent...', 
      `Searching for a player with R${betAmount} bet.\n\nHighest roll wins R${(betAmount * 2 * 0.7).toFixed(2)} (after 30% commission)`
    );

    // Simulate finding opponent
    setTimeout(() => {
      setOpponentFound(true);
      Alert.alert(
        'Opponent Found!', 
        'Rolling dice now!\n\nHighest roll wins!'
      );
      
      // Start dice rolling
      rollDice();
    }, 3000);
  };

  const rollDice = () => {
    setGamePhase('rolling');

    // Animate dice roll
    Animated.sequence([
      Animated.timing(diceAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(diceAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Roll dice after animation
    setTimeout(() => {
      const myRoll = Math.floor(Math.random() * 6) + 1;
      const theirRoll = Math.floor(Math.random() * 6) + 1;
      
      setPlayerRoll(myRoll);
      
      // Show player roll first
      Alert.alert(
        'Your Roll!', 
        `You rolled: ${myRoll}\n\nWaiting for opponent...`
      );

      // Show opponent roll after delay
      setTimeout(() => {
        setOpponentRoll(theirRoll);
        endGame(myRoll, theirRoll);
      }, 2000);
    }, 1500);
  };

  const endGame = (myRoll: number, theirRoll: number) => {
    setGamePhase('finished');
    
    let result: 'win' | 'lose' | 'draw';
    if (myRoll > theirRoll) {
      result = 'win';
    } else if (myRoll < theirRoll) {
      result = 'lose';
    } else {
      result = 'draw';
    }
    
    setGameResult(result);

    setTimeout(() => {
      if (result === 'win') {
        const grossWinnings = betAmount * 2;
        const commission = grossWinnings * 0.3;
        const netWinnings = grossWinnings - commission;
        
        setBalance(prev => prev + netWinnings);
        Alert.alert(
          '🏆 You Won!', 
          `Your roll: ${myRoll}\nOpponent roll: ${theirRoll}\n\nGross Winnings: R${grossWinnings.toFixed(2)}\nHouse Commission (30%): R${commission.toFixed(2)}\nNet Winnings: R${netWinnings.toFixed(2)}\n\nAdded to your balance!`
        );
      } else if (result === 'lose') {
        Alert.alert(
          '😔 You Lost!', 
          `Your roll: ${myRoll}\nOpponent roll: ${theirRoll}\n\nBetter luck next time!\n\nYou lost: R${betAmount.toFixed(2)}`
        );
      } else {
        // Draw - return bet
        setBalance(prev => prev + betAmount);
        Alert.alert(
          '🤝 It\'s a Tie!', 
          `Both rolled: ${myRoll}\n\nYour bet of R${betAmount.toFixed(2)} has been returned.`
        );
      }
      
      // Reset game state
      setTimeout(() => {
        setGameInProgress(false);
        setGamePhase('waiting');
        setOpponentFound(false);
        setPlayerRoll(null);
        setOpponentRoll(null);
        setGameResult(null);
      }, 2000);
    }, 1000);
  };

  const diceRotation = diceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
              🎲 Dice PvP
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

        {!gameInProgress && (
          <>
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

            {/* Game Info */}
            <View style={[commonStyles.card, { margin: 20 }]}>
              <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
                🎯 Player vs Player Dice
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                • Play directly against another real player
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                • Both players bet the same amount
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                • Highest dice roll wins the pot
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                • Winner takes 70% of total pot (30% house commission)
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
                • Same roll = both players get their bet back
              </Text>
              
              <View style={[commonStyles.card, { backgroundColor: colors.accent }]}>
                <Text style={[commonStyles.text, { color: colors.text, textAlign: 'center' }]}>
                  💰 Potential Net Win: R{(betAmount * 2 * 0.7).toFixed(2)}
                </Text>
                <Text style={[commonStyles.textSecondary, { color: colors.text, opacity: 0.9, textAlign: 'center', fontSize: 12 }]}>
                  (After 30% house commission)
                </Text>
              </View>
            </View>

            {/* Start Game Button */}
            <View style={{ padding: 20, paddingTop: 0 }}>
              <TouchableOpacity
                style={[buttonStyles.gold, { width: '100%' }]}
                onPress={startGame}
              >
                <Text style={{ color: colors.primary, fontWeight: '900', fontSize: 16 }}>
                  🎲 Find Opponent - R{betAmount}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {gameInProgress && (
          <View style={{ padding: 20 }}>
            {gamePhase === 'waiting' && (
              <View style={[commonStyles.card, { alignItems: 'center' }]}>
                <Text style={{ fontSize: 64, marginBottom: 16 }}>⏳</Text>
                <Text style={[commonStyles.subtitle, { marginBottom: 8 }]}>
                  Finding Opponent...
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                  Looking for a player with R{betAmount} bet
                </Text>
              </View>
            )}

            {(gamePhase === 'rolling' || gamePhase === 'finished') && (
              <>
                {/* Dice Display */}
                <View style={[commonStyles.card, { marginBottom: 20, alignItems: 'center' }]}>
                  <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
                    🎲 Dice Battle
                  </Text>
                  
                  <Animated.View style={{ transform: [{ rotate: diceRotation }] }}>
                    <Text style={{ fontSize: 100, textAlign: 'center' }}>🎲</Text>
                  </Animated.View>

                  {gamePhase === 'rolling' && (
                    <Text style={[commonStyles.text, { marginTop: 16, color: colors.gold }]}>
                      Rolling dice...
                    </Text>
                  )}
                </View>

                {/* Results */}
                {playerRoll && (
                  <View style={[commonStyles.card, { marginBottom: 20 }]}>
                    <View style={[commonStyles.row, { marginBottom: 12 }]}>
                      <Text style={commonStyles.text}>Your Roll:</Text>
                      <Text style={{ color: colors.gold, fontSize: 24, fontWeight: '900' }}>
                        {playerRoll}
                      </Text>
                    </View>
                    
                    {opponentRoll && (
                      <View style={[commonStyles.row, { marginBottom: 12 }]}>
                        <Text style={commonStyles.text}>Opponent Roll:</Text>
                        <Text style={{ color: colors.accent, fontSize: 24, fontWeight: '900' }}>
                          {opponentRoll}
                        </Text>
                      </View>
                    )}

                    {gameResult && (
                      <View style={{ alignItems: 'center', marginTop: 16 }}>
                        <Text style={{ 
                          fontSize: 48, 
                          marginBottom: 8 
                        }}>
                          {gameResult === 'win' ? '🏆' : gameResult === 'lose' ? '😔' : '🤝'}
                        </Text>
                        <Text style={[commonStyles.subtitle, { 
                          color: gameResult === 'win' ? colors.green : 
                                 gameResult === 'lose' ? colors.red : colors.gold
                        }]}>
                          {gameResult === 'win' ? 'You Won!' : 
                           gameResult === 'lose' ? 'You Lost!' : 'It\'s a Tie!'}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Game Rules */}
        <View style={[commonStyles.card, { margin: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            📋 Dice PvP Rules
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Minimum bet: R10
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Play directly against another player with same bet
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Both players roll a 6-sided die simultaneously
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Highest roll wins 70% of total pot (30% house commission)
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Same roll returns original bets to both players
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Quick games - results in seconds
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
