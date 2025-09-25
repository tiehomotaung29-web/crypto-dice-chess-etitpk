
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '../../components/Icon';

export default function DiceGame() {
  const [balance, setBalance] = useState(250.00);
  const [betAmount, setBetAmount] = useState(10);
  const [prediction, setPrediction] = useState<'over' | 'under'>('over');
  const [targetNumber, setTargetNumber] = useState(50);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceAnimation] = useState(new Animated.Value(0));

  const betAmounts = [10, 25, 50, 100, 250];
  
  // Calculate multiplier and apply house edge
  const baseMultiplier = prediction === 'over' 
    ? (100 / (100 - targetNumber))
    : (100 / targetNumber);
  const multiplier = (baseMultiplier * 0.7).toFixed(2); // 30% house commission

  const rollDice = () => {
    if (betAmount < 10) {
      Alert.alert('Minimum Bet', 'Minimum bet is R10.');
      return;
    }

    if (betAmount > balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough funds to place this bet.');
      return;
    }

    console.log(`Rolling dice: R${betAmount} bet, ${prediction} ${targetNumber}`);
    setIsRolling(true);
    setBalance(prev => prev - betAmount);

    // Animate dice roll
    Animated.sequence([
      Animated.timing(diceAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(diceAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate dice roll after animation
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 100) + 1;
      setLastRoll(roll);
      
      let won = false;
      if (prediction === 'over' && roll > targetNumber) {
        won = true;
      } else if (prediction === 'under' && roll < targetNumber) {
        won = true;
      }

      if (won) {
        const grossWinnings = betAmount * parseFloat(multiplier) / 0.7; // Calculate gross before commission
        const commission = grossWinnings * 0.3;
        const netWinnings = grossWinnings - commission;
        
        setBalance(prev => prev + netWinnings);
        Alert.alert(
          '🎉 You Won!', 
          `Roll: ${roll}\n\nGross Winnings: R${grossWinnings.toFixed(2)}\nHouse Commission (30%): R${commission.toFixed(2)}\nNet Winnings: R${netWinnings.toFixed(2)}\n\nAdded to your balance!`
        );
      } else {
        Alert.alert(
          '😔 You Lost!', 
          `Roll: ${roll}\n\nYou needed ${prediction} ${targetNumber}\nYou lost: R${betAmount.toFixed(2)}`
        );
      }
      
      setIsRolling(false);
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
              🎲 Dice Game
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

        {/* Dice Display */}
        <View style={[commonStyles.section, { marginTop: 0 }]}>
          <Animated.View style={{ transform: [{ rotate: diceRotation }] }}>
            <Text style={{ fontSize: 100, textAlign: 'center' }}>🎲</Text>
          </Animated.View>
          {lastRoll && (
            <Text style={[commonStyles.title, { color: colors.gold, marginTop: 16 }]}>
              Last Roll: {lastRoll}
            </Text>
          )}
        </View>

        {/* Bet Configuration */}
        <View style={[commonStyles.card, { margin: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            🎯 Configure Your Bet
          </Text>

          {/* Bet Amount */}
          <Text style={[commonStyles.text, { marginBottom: 12 }]}>
            💰 Bet Amount (Min R10)
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            gap: 8,
            marginBottom: 20
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

          {/* Prediction Type */}
          <Text style={[commonStyles.text, { marginBottom: 12 }]}>
            🎯 Prediction
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <TouchableOpacity
              style={[
                buttonStyles.secondary,
                { 
                  flex: 1,
                  backgroundColor: prediction === 'over' ? colors.green : colors.backgroundAlt,
                  borderColor: prediction === 'over' ? colors.green : colors.border
                }
              ]}
              onPress={() => setPrediction('over')}
            >
              <Text style={{ 
                color: prediction === 'over' ? colors.text : colors.textSecondary,
                fontWeight: '700' 
              }}>
                📈 Over
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                buttonStyles.secondary,
                { 
                  flex: 1,
                  backgroundColor: prediction === 'under' ? colors.red : colors.backgroundAlt,
                  borderColor: prediction === 'under' ? colors.red : colors.border
                }
              ]}
              onPress={() => setPrediction('under')}
            >
              <Text style={{ 
                color: prediction === 'under' ? colors.text : colors.textSecondary,
                fontWeight: '700' 
              }}>
                📉 Under
              </Text>
            </TouchableOpacity>
          </View>

          {/* Target Number */}
          <Text style={[commonStyles.text, { marginBottom: 12 }]}>
            🎯 Target Number: {targetNumber}
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: 20,
            gap: 12
          }}>
            <TouchableOpacity
              style={[buttonStyles.secondary, { paddingHorizontal: 16 }]}
              onPress={() => setTargetNumber(Math.max(1, targetNumber - 5))}
            >
              <Text style={{ color: colors.text, fontWeight: '700' }}>-5</Text>
            </TouchableOpacity>
            <View style={{ 
              flex: 1, 
              backgroundColor: colors.backgroundAlt, 
              padding: 12, 
              borderRadius: 12,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: colors.accent
            }}>
              <Text style={{ color: colors.gold, fontSize: 20, fontWeight: '900' }}>
                {targetNumber}
              </Text>
            </View>
            <TouchableOpacity
              style={[buttonStyles.secondary, { paddingHorizontal: 16 }]}
              onPress={() => setTargetNumber(Math.min(99, targetNumber + 5))}
            >
              <Text style={{ color: colors.text, fontWeight: '700' }}>+5</Text>
            </TouchableOpacity>
          </View>

          {/* Multiplier Display */}
          <View style={[commonStyles.row, { marginBottom: 20 }]}>
            <Text style={commonStyles.text}>💎 Net Multiplier:</Text>
            <Text style={{ color: colors.gold, fontSize: 20, fontWeight: '900' }}>
              {multiplier}x
            </Text>
          </View>

          {/* Potential Win Display */}
          <View style={[commonStyles.card, { marginBottom: 20, backgroundColor: colors.accent }]}>
            <Text style={[commonStyles.text, { color: colors.text, textAlign: 'center' }]}>
              💰 Potential Net Win: R{(betAmount * parseFloat(multiplier)).toFixed(2)}
            </Text>
            <Text style={[commonStyles.textSecondary, { color: colors.text, opacity: 0.9, textAlign: 'center', fontSize: 12 }]}>
              (After 30% house commission)
            </Text>
          </View>

          {/* Roll Button */}
          <TouchableOpacity
            style={[
              buttonStyles.gold,
              { 
                width: '100%',
                opacity: isRolling ? 0.5 : 1
              }
            ]}
            onPress={rollDice}
            disabled={isRolling}
          >
            <Text style={{ color: colors.primary, fontWeight: '900', fontSize: 16 }}>
              {isRolling ? '🎲 Rolling...' : `🎲 Roll Dice - R${betAmount}`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Game Rules */}
        <View style={[commonStyles.card, { margin: 20, marginTop: 0 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            📋 How to Play
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Minimum bet: R10
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Choose your bet amount and target number (1-99)
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Predict if the dice roll will be over or under your target
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Higher risk predictions have higher multipliers
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Win = Bet × Net Multiplier (30% commission already deducted)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
