
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
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);

  const cardGames = [
    {
      id: 'blackjack',
      title: 'Blackjack',
      description: 'Classic 21 card game',
      minBet: 10,
      maxBet: 1000,
      emoji: '🃏',
      payout: '1:1 (after 30% commission)'
    },
    {
      id: 'poker',
      title: 'Video Poker',
      description: 'Five-card draw poker',
      minBet: 10,
      maxBet: 2000,
      emoji: '🎰',
      payout: 'Varies (after 30% commission)'
    },
    {
      id: 'baccarat',
      title: 'Baccarat',
      description: 'Player vs Banker',
      minBet: 25,
      maxBet: 5000,
      emoji: '💎',
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

  const calculateScore = (cards: string[]) => {
    let score = 0;
    let aces = 0;
    
    cards.forEach(card => {
      const value = getCardValue(card);
      if (value === 11) aces++;
      score += value;
    });

    // Adjust for aces
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  };

  const startBlackjack = () => {
    if (betAmount < 10) {
      Alert.alert('Minimum Bet', 'Minimum bet is R10.');
      return;
    }

    if (betAmount > balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough funds to place this bet.');
      return;
    }

    console.log(`Starting Blackjack with R${betAmount} bet`);
    setBalance(prev => prev - betAmount);
    setGameInProgress(true);

    // Deal initial cards
    const newPlayerCards = [getRandomCard(), getRandomCard()];
    const newDealerCards = [getRandomCard(), getRandomCard()];
    
    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setPlayerScore(calculateScore(newPlayerCards));
    setDealerScore(calculateScore(newDealerCards));
  };

  const hit = () => {
    const newCard = getRandomCard();
    const newPlayerCards = [...playerCards, newCard];
    const newScore = calculateScore(newPlayerCards);
    
    setPlayerCards(newPlayerCards);
    setPlayerScore(newScore);

    if (newScore > 21) {
      // Player busts
      Alert.alert(
        '💥 Bust!', 
        `You went over 21 with ${newScore}.\n\nYou lost: R${betAmount.toFixed(2)}`
      );
      endGame();
    }
  };

  const stand = () => {
    // Dealer plays
    let newDealerCards = [...dealerCards];
    let newDealerScore = dealerScore;

    while (newDealerScore < 17) {
      const newCard = getRandomCard();
      newDealerCards.push(newCard);
      newDealerScore = calculateScore(newDealerCards);
    }

    setDealerCards(newDealerCards);
    setDealerScore(newDealerScore);

    // Determine winner
    setTimeout(() => {
      if (newDealerScore > 21) {
        // Dealer busts, player wins
        const grossWinnings = betAmount * 2;
        const commission = grossWinnings * 0.3;
        const netWinnings = grossWinnings - commission;
        
        setBalance(prev => prev + netWinnings);
        Alert.alert(
          '🏆 You Win!', 
          `Dealer busted with ${newDealerScore}!\n\nGross Winnings: R${grossWinnings.toFixed(2)}\nHouse Commission (30%): R${commission.toFixed(2)}\nNet Winnings: R${netWinnings.toFixed(2)}\n\nAdded to your balance!`
        );
      } else if (playerScore > newDealerScore) {
        // Player wins
        const grossWinnings = betAmount * 2;
        const commission = grossWinnings * 0.3;
        const netWinnings = grossWinnings - commission;
        
        setBalance(prev => prev + netWinnings);
        Alert.alert(
          '🏆 You Win!', 
          `${playerScore} beats ${newDealerScore}!\n\nGross Winnings: R${grossWinnings.toFixed(2)}\nHouse Commission (30%): R${commission.toFixed(2)}\nNet Winnings: R${netWinnings.toFixed(2)}\n\nAdded to your balance!`
        );
      } else if (playerScore === newDealerScore) {
        // Push
        setBalance(prev => prev + betAmount);
        Alert.alert(
          '🤝 Push!', 
          `Both have ${playerScore}. It's a tie!\n\nYour bet of R${betAmount.toFixed(2)} is returned.`
        );
      } else {
        // Dealer wins
        Alert.alert(
          '😔 Dealer Wins!', 
          `${newDealerScore} beats ${playerScore}.\n\nYou lost: R${betAmount.toFixed(2)}`
        );
      }
      endGame();
    }, 1000);
  };

  const endGame = () => {
    setGameInProgress(false);
    setPlayerCards([]);
    setDealerCards([]);
    setPlayerScore(0);
    setDealerScore(0);
  };

  const startOtherGame = (gameId: string) => {
    if (betAmount < 10) {
      Alert.alert('Minimum Bet', 'Minimum bet is R10.');
      return;
    }

    if (betAmount > balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough funds to place this bet.');
      return;
    }

    console.log(`Starting ${gameId} with R${betAmount} bet`);
    setBalance(prev => prev - betAmount);
    
    Alert.alert(
      'Game Starting!', 
      `${cardGames.find(g => g.id === gameId)?.title} starting...\n\nBet: R${betAmount}\nPotential Win: R${(betAmount * 2 * 0.7).toFixed(2)}\n(After 30% commission)`
    );
    
    // Simulate game result
    setTimeout(() => {
      const won = Math.random() > 0.5;
      if (won) {
        const grossWinnings = betAmount * 2;
        const commission = grossWinnings * 0.3;
        const netWinnings = grossWinnings - commission;
        
        setBalance(prev => prev + netWinnings);
        Alert.alert(
          '🏆 You Won!', 
          `Gross Winnings: R${grossWinnings.toFixed(2)}\nHouse Commission (30%): R${commission.toFixed(2)}\nNet Winnings: R${netWinnings.toFixed(2)}\n\nAdded to your balance!`
        );
      } else {
        Alert.alert(
          '😔 You Lost!', 
          `Better luck next time!\n\nYou lost: R${betAmount.toFixed(2)}`
        );
      }
    }, 2000);
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
              🃏 Card Games
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

        {!selectedGame && (
          <>
            {/* Game Selection */}
            <View style={[commonStyles.section, { marginTop: 0 }]}>
              <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
                🎮 Choose Your Card Game
              </Text>
              
              {cardGames.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={[commonStyles.gameCard, { marginBottom: 16 }]}
                  onPress={() => setSelectedGame(game.id)}
                >
                  <Text style={{ fontSize: 64, marginBottom: 12 }}>
                    {game.emoji}
                  </Text>
                  <Text style={[commonStyles.subtitle, { marginBottom: 8 }]}>
                    {game.title}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                    {game.description}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 8 }]}>
                    Min: R{game.minBet} • Max: R{game.maxBet}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 12 }]}>
                    Payout: {game.payout}
                  </Text>
                  
                  <View style={[buttonStyles.primary, { width: '100%' }]}>
                    <Text style={{ color: colors.text, fontWeight: '700' }}>
                      🎯 Play {game.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {selectedGame === 'blackjack' && (
          <View style={{ padding: 20 }}>
            <TouchableOpacity 
              onPress={() => setSelectedGame(null)}
              style={[buttonStyles.secondary, { alignSelf: 'flex-start', marginBottom: 20 }]}
            >
              <Text style={{ color: colors.text, fontWeight: '600' }}>← Back to Games</Text>
            </TouchableOpacity>

            <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
              🃏 Blackjack
            </Text>

            {/* Bet Amount Selection */}
            {!gameInProgress && (
              <View style={{ marginBottom: 20 }}>
                <Text style={[commonStyles.text, { marginBottom: 12 }]}>
                  💰 Select Bet Amount (Min R10)
                </Text>
                <View style={{ 
                  flexDirection: 'row', 
                  flexWrap: 'wrap', 
                  gap: 8,
                  marginBottom: 16
                }}>
                  {betAmounts.map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={[
                        buttonStyles.secondary,
                        { 
                          paddingHorizontal: 12, 
                          paddingVertical: 6,
                          backgroundColor: betAmount === amount ? colors.gold : colors.backgroundAlt,
                          borderColor: betAmount === amount ? colors.gold : colors.border
                        }
                      ]}
                      onPress={() => setBetAmount(amount)}
                    >
                      <Text style={{ 
                        color: betAmount === amount ? colors.primary : colors.text,
                        fontWeight: '700',
                        fontSize: 14
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

                <TouchableOpacity
                  style={[buttonStyles.gold, { width: '100%' }]}
                  onPress={startBlackjack}
                >
                  <Text style={{ color: colors.primary, fontWeight: '900' }}>
                    🃏 Deal Cards - R{betAmount}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Game Area */}
            {gameInProgress && (
              <View>
                {/* Dealer Cards */}
                <View style={[commonStyles.card, { marginBottom: 16 }]}>
                  <Text style={[commonStyles.text, { marginBottom: 8 }]}>
                    🎩 Dealer ({dealerScore})
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                    {dealerCards.map((card, index) => (
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

                {/* Player Cards */}
                <View style={[commonStyles.card, { marginBottom: 16 }]}>
                  <Text style={[commonStyles.text, { marginBottom: 8 }]}>
                    👤 Your Hand ({playerScore})
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

                {/* Game Actions */}
                {playerScore <= 21 && (
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                      style={[buttonStyles.primary, { flex: 1 }]}
                      onPress={hit}
                    >
                      <Text style={{ color: colors.text, fontWeight: '700' }}>
                        👆 Hit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[buttonStyles.gold, { flex: 1 }]}
                      onPress={stand}
                    >
                      <Text style={{ color: colors.primary, fontWeight: '700' }}>
                        ✋ Stand
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {(selectedGame === 'poker' || selectedGame === 'baccarat') && (
          <View style={{ padding: 20 }}>
            <TouchableOpacity 
              onPress={() => setSelectedGame(null)}
              style={[buttonStyles.secondary, { alignSelf: 'flex-start', marginBottom: 20 }]}
            >
              <Text style={{ color: colors.text, fontWeight: '600' }}>← Back to Games</Text>
            </TouchableOpacity>

            <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
              {cardGames.find(g => g.id === selectedGame)?.emoji} {cardGames.find(g => g.id === selectedGame)?.title}
            </Text>

            {/* Bet Amount Selection */}
            <View style={{ marginBottom: 20 }}>
              <Text style={[commonStyles.text, { marginBottom: 12 }]}>
                💰 Select Bet Amount (Min R10)
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap', 
                gap: 8,
                marginBottom: 16
              }}>
                {betAmounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      buttonStyles.secondary,
                      { 
                        paddingHorizontal: 12, 
                        paddingVertical: 6,
                        backgroundColor: betAmount === amount ? colors.gold : colors.backgroundAlt,
                        borderColor: betAmount === amount ? colors.gold : colors.border
                      }
                    ]}
                    onPress={() => setBetAmount(amount)}
                  >
                    <Text style={{ 
                      color: betAmount === amount ? colors.primary : colors.text,
                      fontWeight: '700',
                      fontSize: 14
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

              <TouchableOpacity
                style={[buttonStyles.gold, { width: '100%' }]}
                onPress={() => startOtherGame(selectedGame)}
              >
                <Text style={{ color: colors.primary, fontWeight: '900' }}>
                  🎮 Play {cardGames.find(g => g.id === selectedGame)?.title} - R{betAmount}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={commonStyles.card}>
              <Text style={[commonStyles.text, { textAlign: 'center', marginBottom: 8 }]}>
                🎮 Game simulation in progress...
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                Full {cardGames.find(g => g.id === selectedGame)?.title} implementation coming soon!
              </Text>
            </View>
          </View>
        )}

        {/* Game Rules */}
        <View style={[commonStyles.card, { margin: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            📋 Card Game Rules
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Minimum bet: R10 for all games
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Blackjack: Get as close to 21 as possible without going over
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Video Poker: Get the best 5-card poker hand
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Baccarat: Bet on Player or Banker closest to 9
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • All winnings subject to 30% house commission
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
