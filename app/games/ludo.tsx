
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';

export default function LudoGame() {
  const [balance, setBalance] = useState(250.00);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [lastDiceRoll, setLastDiceRoll] = useState<number | null>(null);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'finished'>('waiting');

  const ludoRooms = [
    {
      id: '1',
      name: 'Beginners Room',
      players: '3/4',
      betAmount: 10,
      prize: 28, // 40 - 30% commission = 28
      status: 'waiting',
      timeLeft: '2:45'
    },
    {
      id: '2',
      name: 'Pro Players',
      players: '4/4',
      betAmount: 50,
      prize: 140, // 200 - 30% commission = 140
      status: 'playing',
      timeLeft: '15:32'
    },
    {
      id: '3',
      name: 'High Rollers',
      players: '2/4',
      betAmount: 100,
      prize: 280, // 400 - 30% commission = 280
      status: 'waiting',
      timeLeft: '5:12'
    },
    {
      id: '4',
      name: 'VIP Tournament',
      players: '1/4',
      betAmount: 250,
      prize: 700, // 1000 - 30% commission = 700
      status: 'waiting',
      timeLeft: '8:30'
    }
  ];

  const betAmounts = [10, 25, 50, 100, 250];
  const playerColors = ['🔴', '🔵', '🟢', '🟡'];

  const joinRoom = (roomId: string, roomBetAmount: number) => {
    if (roomBetAmount > balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough funds to join this room.');
      return;
    }

    const room = ludoRooms.find(r => r.id === roomId);
    if (!room) return;

    console.log(`Joining Ludo room: ${room.name} with R${roomBetAmount} bet`);
    setBalance(prev => prev - roomBetAmount);
    setBetAmount(roomBetAmount);
    setSelectedRoom(roomId);
    setGameInProgress(true);
    setGamePhase('playing');
    setPlayerPosition(0);
    
    Alert.alert(
      'Joined Game!', 
      `You joined ${room.name}!\nBet: R${roomBetAmount}\nPotential Win: R${room.prize}\n\nGame starting...`
    );

    // Simulate game progression
    simulateGame(room);
  };

  const simulateGame = (room: any) => {
    let position = 0;
    const gameInterval = setInterval(() => {
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      setLastDiceRoll(diceRoll);
      position += diceRoll;
      setPlayerPosition(position);

      if (position >= 56) { // Ludo board has 56 spaces to home
        clearInterval(gameInterval);
        const won = Math.random() > 0.6; // 40% win rate (house edge)
        
        setTimeout(() => {
          if (won) {
            const winnings = room.prize;
            setBalance(prev => prev + winnings);
            Alert.alert(
              '🏆 Congratulations!', 
              `You won the Ludo game!\n\nPrize: R${winnings.toFixed(2)}\n(After 30% house commission)\n\nOriginal pot was R${(winnings / 0.7).toFixed(2)}`
            );
          } else {
            Alert.alert(
              '😔 Game Over!', 
              `You didn't win this time.\n\nBetter luck next game!\n\nYou lost: R${room.betAmount}`
            );
          }
          endGame();
        }, 1000);
      }
    }, 2000);
  };

  const rollDice = () => {
    if (!gameInProgress) return;
    
    const roll = Math.floor(Math.random() * 6) + 1;
    setLastDiceRoll(roll);
    setPlayerPosition(prev => Math.min(prev + roll, 56));
  };

  const endGame = () => {
    setGameInProgress(false);
    setSelectedRoom(null);
    setGamePhase('waiting');
    setPlayerPosition(0);
    setLastDiceRoll(null);
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
              🎯 Ludo
            </Text>
            <Text style={{ color: colors.gold, fontWeight: '900', fontSize: 16 }}>
              R{balance.toFixed(2)}
            </Text>
          </View>
        </View>

        {!gameInProgress && (
          <>
            {/* Game Rooms */}
            <View style={[commonStyles.section, { marginTop: 20 }]}>
              <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
                🏠 Available Rooms
              </Text>
              
              {ludoRooms.map((room) => (
                <View key={room.id} style={[commonStyles.gameCard, { marginBottom: 16 }]}>
                  <View style={[commonStyles.row, { marginBottom: 12 }]}>
                    <View style={{ 
                      backgroundColor: room.status === 'playing' ? colors.green : 
                                     room.status === 'waiting' ? colors.accent : colors.purple,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8
                    }}>
                      <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700' }}>
                        {room.status.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                      {room.timeLeft}
                    </Text>
                  </View>

                  <Text style={[commonStyles.text, { fontSize: 20, fontWeight: '700', marginBottom: 8 }]}>
                    {room.name}
                  </Text>

                  <View style={[commonStyles.row, { marginBottom: 12 }]}>
                    <Text style={commonStyles.textSecondary}>Players:</Text>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>{room.players}</Text>
                  </View>

                  <View style={[commonStyles.row, { marginBottom: 12 }]}>
                    <Text style={commonStyles.textSecondary}>Entry Fee:</Text>
                    <Text style={{ color: colors.accent, fontWeight: '700' }}>R{room.betAmount}</Text>
                  </View>

                  <View style={[commonStyles.row, { marginBottom: 16 }]}>
                    <Text style={commonStyles.textSecondary}>Winner Prize:</Text>
                    <Text style={{ color: colors.gold, fontWeight: '900' }}>R{room.prize}</Text>
                  </View>

                  <View style={[commonStyles.commissionBadge, { marginBottom: 12, alignSelf: 'center' }]}>
                    <Text style={commonStyles.commissionText}>
                      30% HOUSE COMMISSION APPLIED
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      room.status === 'playing' ? buttonStyles.secondary : buttonStyles.primary,
                      { 
                        width: '100%',
                        opacity: room.status === 'playing' ? 0.5 : 1
                      }
                    ]}
                    onPress={() => room.status !== 'playing' && joinRoom(room.id, room.betAmount)}
                    disabled={room.status === 'playing'}
                  >
                    <Text style={{ 
                      color: room.status === 'playing' ? colors.textSecondary : colors.text, 
                      fontWeight: '700' 
                    }}>
                      {room.status === 'playing' ? '🎮 Game in Progress' : `🎯 Join Room - R${room.betAmount}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {gameInProgress && (
          <View style={{ padding: 20 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
              🎮 Game in Progress
            </Text>

            {/* Game Board Visualization */}
            <View style={[commonStyles.card, { marginBottom: 20, alignItems: 'center' }]}>
              <Text style={[commonStyles.text, { marginBottom: 16 }]}>
                🎯 Ludo Board
              </Text>
              
              {/* Simple board representation */}
              <View style={{ 
                width: 200, 
                height: 200, 
                backgroundColor: colors.backgroundAlt,
                borderRadius: 16,
                borderWidth: 3,
                borderColor: colors.accent,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <Text style={{ fontSize: 48, marginBottom: 8 }}>🎯</Text>
                <Text style={{ color: colors.gold, fontWeight: '700' }}>
                  Position: {playerPosition}/56
                </Text>
                <View style={{ 
                  width: `${(playerPosition / 56) * 100}%`, 
                  height: 4, 
                  backgroundColor: colors.gold,
                  marginTop: 8,
                  borderRadius: 2
                }} />
              </View>

              {lastDiceRoll && (
                <View style={{ alignItems: 'center' }}>
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

            {/* Game Status */}
            <View style={[commonStyles.card, { marginBottom: 20 }]}>
              <Text style={[commonStyles.text, { marginBottom: 8 }]}>
                🏁 Progress: {Math.round((playerPosition / 56) * 100)}%
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                Spaces to Home: {56 - playerPosition}
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                Your Color: {playerColors[0]}
              </Text>
            </View>

            {/* Manual Dice Roll (for demonstration) */}
            <TouchableOpacity
              style={[buttonStyles.gold, { width: '100%', marginBottom: 16 }]}
              onPress={rollDice}
            >
              <Text style={{ color: colors.primary, fontWeight: '900', fontSize: 16 }}>
                🎲 Roll Dice
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.secondary, { width: '100%' }]}
              onPress={endGame}
            >
              <Text style={{ color: colors.text, fontWeight: '600' }}>
                ❌ Leave Game
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Game Rules */}
        <View style={[commonStyles.card, { margin: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            📋 How Ludo Works
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Join a room by paying the entry fee
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Race your pieces around the board to reach home first
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • First player to get all pieces home wins the prize
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Winner receives 70% of total pot (30% house commission)
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Real-time multiplayer with live opponents
          </Text>
        </View>

        {/* Commission Info */}
        <View style={[commonStyles.card, { margin: 20, marginTop: 0, backgroundColor: colors.commission }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12, color: colors.text }]}>
            💰 Prize Structure
          </Text>
          <Text style={[commonStyles.text, { color: colors.text, fontWeight: '600' }]}>
            Example: 4 players × R50 = R200 total pot
          </Text>
          <Text style={[commonStyles.textSecondary, { color: colors.text, opacity: 0.9 }]}>
            • House commission (30%): R60
          </Text>
          <Text style={[commonStyles.textSecondary, { color: colors.text, opacity: 0.9 }]}>
            • Winner receives: R140
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
