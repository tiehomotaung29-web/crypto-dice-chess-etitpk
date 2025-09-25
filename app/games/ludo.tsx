
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';

export default function LudoGame() {
  const [balance, setBalance] = useState(250.00);
  const [betAmount, setBetAmount] = useState(10);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [playersFound, setPlayersFound] = useState(1);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [opponentPositions, setOpponentPositions] = useState([0, 0, 0]);
  const [lastDiceRoll, setLastDiceRoll] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [currentTurn, setCurrentTurn] = useState(0); // 0 = player, 1-3 = opponents

  const betAmounts = [10, 25, 50, 100, 250];
  const playerColors = ['🔴', '🔵', '🟢', '🟡'];
  const maxPosition = 56; // Ludo board positions

  const startGame = () => {
    if (betAmount < 10) {
      Alert.alert('Minimum Bet', 'Minimum bet is R10.');
      return;
    }

    if (betAmount > balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough funds to play this game.');
      return;
    }

    console.log(`Starting Ludo PvP with R${betAmount} bet`);
    setBalance(prev => prev - betAmount);
    setGameInProgress(true);
    setGamePhase('waiting');
    setPlayersFound(1);
    setPlayerPosition(0);
    setOpponentPositions([0, 0, 0]);
    setLastDiceRoll(null);
    setGameResult(null);
    setCurrentTurn(0);
    
    Alert.alert(
      'Finding Players...', 
      `Searching for 3 more players with R${betAmount} bet.\n\nWinner takes R${(betAmount * 4 * 0.7).toFixed(2)} (after 30% commission)`
    );

    // Simulate finding players
    const findPlayersInterval = setInterval(() => {
      setPlayersFound(prev => {
        if (prev >= 4) {
          clearInterval(findPlayersInterval);
          Alert.alert(
            'All Players Found!', 
            'Ludo game starting now!\n\nRace to get all pieces home first!'
          );
          setGamePhase('playing');
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const rollDice = () => {
    if (currentTurn !== 0 || gamePhase !== 'playing') return;
    
    const roll = Math.floor(Math.random() * 6) + 1;
    setLastDiceRoll(roll);
    setPlayerPosition(prev => Math.min(prev + roll, maxPosition));
    
    // Move to next turn
    setCurrentTurn(1);
    
    // Simulate opponent turns
    setTimeout(() => {
      simulateOpponentTurns();
    }, 1000);
  };

  const simulateOpponentTurns = () => {
    let turn = 1;
    const turnInterval = setInterval(() => {
      if (turn > 3) {
        clearInterval(turnInterval);
        setCurrentTurn(0);
        
        // Check for game end
        checkGameEnd();
        return;
      }
      
      // Simulate opponent roll and move
      const opponentRoll = Math.floor(Math.random() * 6) + 1;
      setOpponentPositions(prev => {
        const newPositions = [...prev];
        newPositions[turn - 1] = Math.min(newPositions[turn - 1] + opponentRoll, maxPosition);
        return newPositions;
      });
      
      turn++;
    }, 1500);
  };

  const checkGameEnd = () => {
    // Check if player won
    if (playerPosition >= maxPosition) {
      endGame('win');
      return;
    }
    
    // Check if any opponent won
    const opponentWon = opponentPositions.some(pos => pos >= maxPosition);
    if (opponentWon) {
      endGame('lose');
      return;
    }
    
    // Continue game if no winner yet
  };

  const endGame = (result: 'win' | 'lose') => {
    setGamePhase('finished');
    setGameResult(result);

    setTimeout(() => {
      if (result === 'win') {
        const grossWinnings = betAmount * 4;
        const commission = grossWinnings * 0.3;
        const netWinnings = grossWinnings - commission;
        
        setBalance(prev => prev + netWinnings);
        Alert.alert(
          '🏆 Congratulations!', 
          `You won the Ludo game!\n\nGross Winnings: R${grossWinnings.toFixed(2)}\nHouse Commission (30%): R${commission.toFixed(2)}\nNet Winnings: R${netWinnings.toFixed(2)}\n\nAdded to your balance!`
        );
      } else {
        Alert.alert(
          '😔 Game Over!', 
          `Another player reached home first.\n\nBetter luck next game!\n\nYou lost: R${betAmount.toFixed(2)}`
        );
      }
      
      // Reset game state
      setTimeout(() => {
        setGameInProgress(false);
        setGamePhase('waiting');
        setPlayersFound(1);
        setPlayerPosition(0);
        setOpponentPositions([0, 0, 0]);
        setLastDiceRoll(null);
        setGameResult(null);
        setCurrentTurn(0);
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
            setPlayersFound(1);
            setPlayerPosition(0);
            setOpponentPositions([0, 0, 0]);
            setLastDiceRoll(null);
            setGameResult(null);
            setCurrentTurn(0);
          }
        }
      ]
    );
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
              🎯 Ludo PvP
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
                🎯 4-Player Ludo Battle
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                • Play against 3 other real players
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                • All players bet the same amount
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                • First to get all pieces home wins
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                • Winner takes 70% of total pot (30% house commission)
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
                • Turn-based gameplay with dice rolls
              </Text>
              
              <View style={[commonStyles.card, { backgroundColor: colors.accent }]}>
                <Text style={[commonStyles.text, { color: colors.text, textAlign: 'center' }]}>
                  💰 Potential Net Win: R{(betAmount * 4 * 0.7).toFixed(2)}
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
                  🎯 Find 3 Players - R{betAmount}
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
                  Finding Players...
                </Text>
                <Text style={[commonStyles.text, { color: colors.gold, marginBottom: 8 }]}>
                  {playersFound}/4 Players Found
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                  Looking for players with R{betAmount} bet
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
                      {currentTurn === 0 ? 'Your Turn' : `Player ${currentTurn + 1} Turn`}
                    </Text>
                  </View>
                  <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                    4 Players • Bet: R{betAmount} each
                  </Text>
                </View>

                {/* Game Board Visualization */}
                <View style={[commonStyles.card, { marginBottom: 20, alignItems: 'center' }]}>
                  <Text style={[commonStyles.text, { marginBottom: 16 }]}>
                    🎯 Ludo Board
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
                    <Text style={{ fontSize: 48, marginBottom: 8 }}>🎯</Text>
                    <Text style={{ color: colors.text, fontWeight: '700', textAlign: 'center' }}>
                      4-Player Race
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      First to home wins!
                    </Text>
                  </View>

                  {lastDiceRoll && (
                    <View style={{ alignItems: 'center', marginBottom: 16 }}>
                      <Text style={[commonStyles.text, { marginBottom: 8 }]}>
                        Last Roll:
                      </Text>
                      <Text style={{ fontSize: 32 }}>🎲</Text>
                      <Text style={{ color: colors.gold, fontSize: 24, fontWeight: '900' }}>
                        {lastDiceRoll}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Player Positions */}
                <View style={[commonStyles.card, { marginBottom: 20 }]}>
                  <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
                    🏁 Race Progress
                  </Text>
                  
                  {/* Your Position */}
                  <View style={[commonStyles.row, { marginBottom: 8 }]}>
                    <Text style={commonStyles.text}>{playerColors[0]} You:</Text>
                    <Text style={{ color: colors.gold, fontWeight: '700' }}>
                      {playerPosition}/{maxPosition}
                    </Text>
                  </View>
                  <View style={{ 
                    width: '100%', 
                    height: 8, 
                    backgroundColor: colors.backgroundAlt,
                    borderRadius: 4,
                    marginBottom: 12
                  }}>
                    <View style={{ 
                      width: `${(playerPosition / maxPosition) * 100}%`, 
                      height: '100%', 
                      backgroundColor: colors.gold,
                      borderRadius: 4
                    }} />
                  </View>

                  {/* Opponent Positions */}
                  {opponentPositions.map((position, index) => (
                    <View key={index}>
                      <View style={[commonStyles.row, { marginBottom: 8 }]}>
                        <Text style={commonStyles.text}>{playerColors[index + 1]} Player {index + 2}:</Text>
                        <Text style={{ color: colors.accent, fontWeight: '700' }}>
                          {position}/{maxPosition}
                        </Text>
                      </View>
                      <View style={{ 
                        width: '100%', 
                        height: 6, 
                        backgroundColor: colors.backgroundAlt,
                        borderRadius: 3,
                        marginBottom: 12
                      }}>
                        <View style={{ 
                          width: `${(position / maxPosition) * 100}%`, 
                          height: '100%', 
                          backgroundColor: colors.accent,
                          borderRadius: 3
                        }} />
                      </View>
                    </View>
                  ))}
                </View>

                {/* Game Actions */}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity
                    style={[
                      buttonStyles.gold, 
                      { 
                        flex: 2,
                        opacity: currentTurn === 0 ? 1 : 0.5
                      }
                    ]}
                    onPress={rollDice}
                    disabled={currentTurn !== 0}
                  >
                    <Text style={{ color: colors.primary, fontWeight: '900' }}>
                      {currentTurn === 0 ? '🎲 Roll Dice' : '⏳ Wait Turn'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[buttonStyles.secondary, { flex: 1 }]}
                    onPress={forfeitGame}
                  >
                    <Text style={{ color: colors.text, fontWeight: '600' }}>
                      🏳️ Forfeit
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {gamePhase === 'finished' && gameResult && (
              <View style={[commonStyles.card, { alignItems: 'center' }]}>
                <Text style={{ 
                  fontSize: 64, 
                  marginBottom: 16 
                }}>
                  {gameResult === 'win' ? '🏆' : '😔'}
                </Text>
                <Text style={[commonStyles.subtitle, { marginBottom: 8 }]}>
                  {gameResult === 'win' ? 'You Won!' : 'You Lost!'}
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                  {gameResult === 'win' ? 'First to reach home!' : 'Another player won!'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Game Rules */}
        <View style={[commonStyles.card, { margin: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            📋 Ludo PvP Rules
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Minimum bet: R10
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • 4 players compete in each game
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Take turns rolling dice and moving pieces
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • First player to reach home wins 70% of pot
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • 30% house commission applied to winnings
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Real-time multiplayer with live opponents
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
