
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';

export default function CardGames() {
  const [balance, setBalance] = useState(250.00);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [opponentCards, setOpponentCards] = useState<string[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'draw' | null>(null);

  const cardGames = [
    {
      id: 'blackjack',
      title: 'Blackjack PvP',
      description: 'Player vs Player 21',
      minBet: 10,
      emoji: '🃏',
      payout: '1:1 (after 30% commission)'
    },
    {
      id: 'poker',
      title: 'Poker PvP',
      description: 'Head-to-head poker',
      minBet: 10,
      emoji: '🎰',
      payout: '1:1 (after 30% commission)'
    },
    {
      id: 'war',
      title: 'Card War PvP',
      description: 'Highest card wins',
      minBet: 10,
      emoji: '⚔️',
      payout: '1:1 (after 30% commission)'
    }
  ];

  const betAmounts = [10, 25, 50, 100, 250];
  const suits = ['♠️', '♥️', '♦️', '♣️'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const getRandomCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return `${rank}${suit}`;
  };

  const getCardValue = (card: string) => {
    const rank = card.slice(0, -2);
    if (rank === 'A') return 11;
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    return parseInt(rank);
  };

  const getWarCardValue = (card: string) => {
    const rank = card.slice(0, -2);
    if (rank === 'A') return 14;
    if (rank === 'K') return 13;
    if (rank === 'Q') return 12;
    if (rank === 'J') return 11;
    return parseInt(rank);
  };

  const calculateScore = (cards: string[]) => {
    let score = 0;
    let aces = 0;
    
    cards.forEach(card => {
      const value = getCardValue(card);
      if (value === 11) aces++;
      score += value;
    });

    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  };

  const startGame = (gameId: string) => {
    if (betAmount < 10) {
      Alert.alert('Minimum Bet', 'Minimum bet is R10.');
      return;
    }

    if (betAmount > balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough funds to play this game.');
      return;
    }

    console.log(`Starting ${gameId} PvP with R${betAmount} bet`);
    setBalance(prev => prev - betAmount);
    setSelectedGame(gameId);
    setGameInProgress(true);
    setGamePhase('waiting');
    setPlayerCards([]);
    setOpponentCards([]);
    setPlayerScore(0);
    setOpponentScore(0);
    setGameResult(null);
    
    Alert.alert(
      'Finding Opponent...', 
      `Searching for a player with R${betAmount} bet.\n\nWinner takes R${(betAmount * 2 * 0.7).toFixed(2)} (after 30% commission)`
    );

    // Simulate finding opponent
    setTimeout(() => {
      Alert.alert(
        'Opponent Found!', 
        'Game starting now!\n\nGood luck!'
      );
      
      if (gameId === 'blackjack') {
        startBlackjackPvP();
      } else if (gameId === 'war') {
        startCardWar();
      } else {
        startPokerPvP();
      }
    }, 3000);
  };

  const startBlackjackPvP = () => {
    setGamePhase('playing');
    
    // Deal initial cards
    const newPlayerCards = [getRandomCard(), getRandomCard()];
    const newOpponentCards = [getRandomCard(), getRandomCard()];
    
    setPlayerCards(newPlayerCards);
    setOpponentCards(newOpponentCards);
    setPlayerScore(calculateScore(newPlayerCards));
    setOpponentScore(calculateScore(newOpponentCards));

    // Simulate opponent play and end game
    setTimeout(() => {
      endBlackjackGame(calculateScore(newPlayerCards), calculateScore(newOpponentCards));
    }, 5000);
  };

  const startCardWar = () => {
    setGamePhase('playing');
    
    const playerCard = getRandomCard();
    const opponentCard = getRandomCard();
    
    setPlayerCards([playerCard]);
    setOpponentCards([opponentCard]);
    
    const playerValue = getWarCardValue(playerCard);
    const opponentValue = getWarCardValue(opponentCard);
    
    setPlayerScore(playerValue);
    setOpponentScore(opponentValue);

    setTimeout(() => {
      endCardWarGame(playerValue, opponentValue);
    }, 3000);
  };

  const startPokerPvP = () => {
    setGamePhase('playing');
    
    // Deal 5 cards each
    const newPlayerCards = Array(5).fill(null).map(() => getRandomCard());
    const newOpponentCards = Array(5).fill(null).map(() => getRandomCard());
    
    setPlayerCards(newPlayerCards);
    setOpponentCards(newOpponentCards);

    // Simulate poker hand evaluation
    setTimeout(() => {
      const playerHandStrength = Math.floor(Math.random() * 100);
      const opponentHandStrength = Math.floor(Math.random() * 100);
      endPokerGame(playerHandStrength, opponentHandStrength);
    }, 5000);
  };

  const endBlackjackGame = (playerFinalScore: number, opponentFinalScore: number) => {
    setGamePhase('finished');
    
    let result: 'win' | 'lose' | 'draw';
    
    if (playerFinalScore > 21 && opponentFinalScore > 21) {
      result = 'draw'; // Both bust
    } else if (playerFinalScore > 21) {
      result = 'lose'; // Player busts
    } else if (opponentFinalScore > 21) {
      result = 'win'; // Opponent busts
    } else if (playerFinalScore > opponentFinalScore) {
      result = 'win';
    } else if (playerFinalScore < opponentFinalScore) {
      result = 'lose';
    } else {
      result = 'draw';
    }
    
    setGameResult(result);
    processGameResult(result, `Your score: ${playerFinalScore}, Opponent: ${opponentFinalScore}`);
  };

  const endCardWarGame = (playerValue: number, opponentValue: number) => {
    setGamePhase('finished');
    
    let result: 'win' | 'lose' | 'draw';
    if (playerValue > opponentValue) {
      result = 'win';
    } else if (playerValue < opponentValue) {
      result = 'lose';
    } else {
      result = 'draw';
    }
    
    setGameResult(result);
    processGameResult(result, `Your card value: ${playerValue}, Opponent: ${opponentValue}`);
  };

  const endPokerGame = (playerStrength: number, opponentStrength: number) => {
    setGamePhase('finished');
    
    let result: 'win' | 'lose' | 'draw';
    if (playerStrength > opponentStrength) {
      result = 'win';
    } else if (playerStrength < opponentStrength) {
      result = 'lose';
    } else {
      result = 'draw';
    }
    
    setGameResult(result);
    processGameResult(result, 'Hand strength comparison');
  };

  const processGameResult = (result: 'win' | 'lose' | 'draw', details: string) => {
    setTimeout(() => {
      if (result === 'win') {
        const grossWinnings = betAmount * 2;
        const commission = grossWinnings * 0.3;
        const netWinnings = grossWinnings - commission;
        
        setBalance(prev => prev + netWinnings);
        Alert.alert(
          '🏆 You Won!', 
          `${details}\n\nGross Winnings: R${grossWinnings.toFixed(2)}\nHouse Commission (30%): R${commission.toFixed(2)}\nNet Winnings: R${netWinnings.toFixed(2)}\n\nAdded to your balance!`
        );
      } else if (result === 'lose') {
        Alert.alert(
          '😔 You Lost!', 
          `${details}\n\nBetter luck next time!\n\nYou lost: R${betAmount.toFixed(2)}`
        );
      } else {
        setBalance(prev => prev + betAmount);
        Alert.alert(
          '🤝 It\'s a Draw!', 
          `${details}\n\nYour bet of R${betAmount.toFixed(2)} has been returned.`
        );
      }
      
      // Reset game state
      setTimeout(() => {
        setGameInProgress(false);
        setSelectedGame(null);
        setGamePhase('waiting');
        setPlayerCards([]);
        setOpponentCards([]);
        setPlayerScore(0);
        setOpponentScore(0);
        setGameResult(null);
      }, 2000);
    }, 1000);
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
              🃏 Card Games PvP
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
            {/* Game Selection */}
            <View style={[commonStyles.section, { marginTop: 0 }]}>
              <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
                🎮 Choose Your Card Game
              </Text>
              
              {cardGames.map((game) => (
                <View key={game.id} style={[commonStyles.gameCard, { marginBottom: 16 }]}>
                  <Text style={{ fontSize: 64, marginBottom: 12, textAlign: 'center' }}>
                    {game.emoji}
                  </Text>
                  <Text style={[commonStyles.subtitle, { marginBottom: 8, textAlign: 'center' }]}>
                    {game.title}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { marginBottom: 8, textAlign: 'center' }]}>
                    {game.description}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 16, textAlign: 'center' }]}>
                    Min: R{game.minBet} • Payout: {game.payout}
                  </Text>
                  
                  <TouchableOpacity
                    style={[buttonStyles.primary, { width: '100%' }]}
                    onPress={() => setSelectedGame(game.id)}
                  >
                    <Text style={{ color: colors.text, fontWeight: '700' }}>
                      🎯 Play {game.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Bet Amount Selection */}
            {selectedGame && (
              <View style={[commonStyles.section, { marginTop: 0 }]}>
                <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
                  💰 Select Bet Amount (Min R10)
                </Text>
                <View style={{ 
                  flexDirection: 'row', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center',
                  gap: 12,
                  marginBottom: 20
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

                <View style={[commonStyles.card, { marginBottom: 16, backgroundColor: colors.accent }]}>
                  <Text style={[commonStyles.text, { color: colors.text, textAlign: 'center' }]}>
                    💰 Potential Net Win: R{(betAmount * 2 * 0.7).toFixed(2)}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { color: colors.text, opacity: 0.9, textAlign: 'center', fontSize: 12 }]}>
                    (After 30% house commission)
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity
                    style={[buttonStyles.secondary, { flex: 1 }]}
                    onPress={() => setSelectedGame(null)}
                  >
                    <Text style={{ color: colors.text, fontWeight: '600' }}>
                      ← Back
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[buttonStyles.gold, { flex: 2 }]}
                    onPress={() => startGame(selectedGame)}
                  >
                    <Text style={{ color: colors.primary, fontWeight: '900' }}>
                      🎮 Find Opponent - R{betAmount}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
                <View style={[commonStyles.card, { marginBottom: 20 }]}>
                  <Text style={[commonStyles.subtitle, { marginBottom: 12, textAlign: 'center' }]}>
                    🎮 {cardGames.find(g => g.id === selectedGame)?.title}
                  </Text>
                  <Text style={[commonStyles.text, { color: colors.green, textAlign: 'center' }]}>
                    🟢 LIVE GAME • Bet: R{betAmount} each
                  </Text>
                </View>

                {/* Player Cards */}
                {playerCards.length > 0 && (
                  <View style={[commonStyles.card, { marginBottom: 16 }]}>
                    <Text style={[commonStyles.text, { marginBottom: 8 }]}>
                      👤 Your Cards {selectedGame === 'blackjack' ? `(${playerScore})` : ''}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                      {playerCards.map((card, index) => (
                        <View key={index} style={{
                          backgroundColor: colors.text,
                          padding: 8,
                          borderRadius: 8,
                          minWidth: 50,
                          alignItems: 'center',
                          borderWidth: 2,
                          borderColor: colors.gold
                        }}>
                          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>
                            {card}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Opponent Cards */}
                {opponentCards.length > 0 && (
                  <View style={[commonStyles.card, { marginBottom: 16 }]}>
                    <Text style={[commonStyles.text, { marginBottom: 8 }]}>
                      🤖 Opponent Cards {selectedGame === 'blackjack' ? `(${opponentScore})` : ''}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                      {opponentCards.map((card, index) => (
                        <View key={index} style={{
                          backgroundColor: colors.text,
                          padding: 8,
                          borderRadius: 8,
                          minWidth: 50,
                          alignItems: 'center',
                          borderWidth: 2,
                          borderColor: colors.accent
                        }}>
                          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>
                            {card}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={[commonStyles.card, { alignItems: 'center' }]}>
                  <Text style={[commonStyles.text, { textAlign: 'center' }]}>
                    🎮 Game in progress...
                  </Text>
                  <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                    Waiting for results...
                  </Text>
                </View>
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
                   gameResult === 'lose' ? 'You Lost!' : 'It\'s a Draw!'}
                </Text>
                <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                  {gameResult === 'win' ? 'Great card skills!' : 
                   gameResult === 'lose' ? 'Better luck next time!' : 'Good game!'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Game Rules */}
        <View style={[commonStyles.card, { margin: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            📋 Card Game PvP Rules
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Minimum bet: R10 for all games
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Play directly against another player with same bet
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Winner takes 70% of total pot (30% house commission)
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Draw returns original bets to both players
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Blackjack: Closest to 21 without going over
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Card War: Highest card value wins
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Poker: Best 5-card hand wins
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
