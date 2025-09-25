
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';

export default function ChessGame() {
  const [balance, setBalance] = useState(250.00);
  const [betAmount, setBetAmount] = useState(10);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [opponentFound, setOpponentFound] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes per game

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

    console.log(`Starting Chess game with R${betAmount} bet`);
    setBalance(prev => prev - betAmount);
    setGameInProgress(true);
    setGamePhase('waiting');
    setMoveCount(0);
    setTimeLeft(600);
    
    Alert.alert(
      'Finding Opponent...', 
      `Searching for a player with R${betAmount} bet.\n\nWinner takes R${(betAmount * 2 * 0.7).toFixed(2)} (after 30% commission)`
    );

    // Simulate finding opponent
    setTimeout(() => {
      setOpponentFound(true);
      setGamePhase('playing');
      Alert.alert(
        'Opponent Found!', 
        'Match starting now!\n\nGood luck!'
      );
      
      // Start game simulation
      simulateChessGame();
    }, 3000);
  };

  const simulateChessGame = () => {
    const gameInterval = setInterval(() => {
      setMoveCount(prev => prev + 1);
      setTimeLeft(prev => Math.max(0, prev - 15)); // Decrease time each move
      
      // Random game events
      if (Math.random() < 0.1) { // 10% chance per move to end game
        clearInterval(gameInterval);
        endGame();
      }
    }, 2000);

    // Auto-end game after 40 moves or time runs out
    setTimeout(() => {
      clearInterval(gameInterval);
      if (gamePhase === 'playing') {
        endGame();
      }
    }, 80000); // 80 seconds max game time for demo
  };

  const endGame = () => {
    const outcomes = ['win', 'lose', 'draw'];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)] as 'win' | 'lose' | 'draw';
    setGameResult(result);
    setGamePhase('finished');

    setTimeout(() => {
      if (result === 'win') {
        const grossWinnings = betAmount * 2;
        const commission = grossWinnings * 0.3;
        const netWinnings = grossWinnings - commission;
        
        setBalance(prev => prev + netWinnings);
        Alert.alert(
          '🏆 Checkmate! You Won!', 
          `Excellent game!\n\nGross Winnings: R${grossWinnings.toFixed(2)}\nHouse Commission (30%): R${commission.toFixed(2)}\nNet Winnings: R${netWinnings.toFixed(2)}\n\nAdded to your balance!`
        );
      } else if (result === 'lose') {
        Alert.alert(
          '😔 Checkmate! You Lost!', 
          `Good game! Better luck next time.\n\nYou lost: R${betAmount.toFixed(2)}`
        );
      } else {
        // Draw - return bet
        setBalance(prev => prev + betAmount);
        Alert.alert(
          '🤝 Draw!', 
          `The game ended in a draw.\n\nYour bet of R${betAmount.toFixed(2)} has been returned.`
        );
      }
      
      // Reset game state
      setTimeout(() => {
        setGameInProgress(false);
        setGamePhase('waiting');
        setOpponentFound(false);
        setGameResult(null);
        setMoveCount(0);
        setTimeLeft(600);
      }, 2000);
    }, 1000);
  };

  const forfeitGame = () => {
    Alert.alert(
      'Forfeit Game?',
      'Are you sure you want to forfeit? You will lose your bet.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Forfeit', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '😔 Game Forfeited',
              `You forfeited the game.\n\nYou lost: R${betAmount.toFixed(2)}`
            );
            setGameInProgress(false);
            setGamePhase('waiting');
            setOpponentFound(false);
            setGameResult(null);
          }
        }
      ]
    );
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gamePhase === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gamePhase, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              ♟️ Chess PvP
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
                🎯 Player vs Player Chess
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                • Play directly against another real player
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                • Both players bet the same amount
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                • Winner takes 70% of total pot (30% house commission)
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
                • Draw = both players get their bet back
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
                  ♟️ Find Opponent - R{betAmount}
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

            {gamePhase === 'playing' && (
              <>
                {/* Game Status */}
                <View style={[commonStyles.card, { marginBottom: 20 }]}>
                  <View style={[commonStyles.row, { marginBottom: 12 }]}>
                    <Text style={[commonStyles.text, { color: colors.green }]}>
                      🟢 LIVE GAME
                    </Text>
                    <Text style={[commonStyles.text, { color: colors.gold }]}>
                      ⏱️ {formatTime(timeLeft)}
                    </Text>
                  </View>
                  <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                    Move #{moveCount} • Bet: R{betAmount} each
                  </Text>
                </View>

                {/* Chess Board Visualization */}
                <View style={[commonStyles.card, { marginBottom: 20, alignItems: 'center' }]}>
                  <Text style={[commonStyles.text, { marginBottom: 16 }]}>
                    ♟️ Chess Board
                  </Text>
                  
                  {/* Simple board representation */}
                  <View style={{ 
                    width: 240, 
                    height: 240, 
                    backgroundColor: colors.backgroundAlt,
                    borderRadius: 16,
                    borderWidth: 3,
                    borderColor: colors.accent,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16
                  }}>
                    <Text style={{ fontSize: 48, marginBottom: 8 }}>♟️</Text>
                    <Text style={{ color: colors.text, fontWeight: '700', textAlign: 'center' }}>
                      vs Opponent
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      Game in progress...
                    </Text>
                  </View>

                  <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                    Playing against matched opponent
                  </Text>
                </View>

                {/* Game Actions */}
                <TouchableOpacity
                  style={[buttonStyles.secondary, { width: '100%' }]}
                  onPress={forfeitGame}
                >
                  <Text style={{ color: colors.text, fontWeight: '600' }}>
                    🏳️ Forfeit Game
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {gamePhase === 'finished' && gameResult && (
              <View style={[commonStyles.card, { alignItems: 'center' }]}>
                <Text style={{ 
                  fontSize: 64, 
                  marginBottom: 16 
                }}>
                  {gameResult === 'win' ? '🏆' : gameResult === 'lose' ? '😔' : '🤝'}
                </Text>
                <Text style={[commonStyles.subtitle, { marginBottom: 8 }]}>
                  {gameResult === 'win' ? 'You Won!' : 
                   gameResult === 'lose' ? 'You Lost!' : 'Draw!'}
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                  {gameResult === 'win' ? 'Excellent chess skills!' : 
                   gameResult === 'lose' ? 'Better luck next time!' : 'Good game!'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Game Rules */}
        <View style={[commonStyles.card, { margin: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            📋 Chess PvP Rules
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Minimum bet: R10
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Play directly against another player with same bet
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Standard chess rules apply
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Winner gets 70% of total pot (30% house commission)
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Draw returns original bets to both players
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • 10-minute time limit per game
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
