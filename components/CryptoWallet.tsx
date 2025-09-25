
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface CryptoWalletProps {
  balance: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

export default function CryptoWallet({ balance, onDeposit, onWithdraw }: CryptoWalletProps) {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');

  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', rate: 45000 },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', rate: 3000 },
    { symbol: 'BNB', name: 'Binance Coin', icon: 'BNB', rate: 300 },
    { symbol: 'ADA', name: 'Cardano', icon: 'ADA', rate: 0.5 },
  ];

  const quickAmounts = [50, 100, 250, 500, 1000];

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to deposit.');
      return;
    }

    const crypto = cryptos.find(c => c.symbol === selectedCrypto);
    const cryptoAmount = (depositAmount / crypto!.rate).toFixed(8);
    
    Alert.alert(
      'Deposit Confirmation',
      `Deposit $${depositAmount} (${cryptoAmount} ${selectedCrypto})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            onDeposit(depositAmount);
            setAmount('');
            Alert.alert('Success', `Deposited $${depositAmount} successfully!`);
          }
        }
      ]
    );
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to withdraw.');
      return;
    }

    if (withdrawAmount > balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough funds to withdraw this amount.');
      return;
    }

    const crypto = cryptos.find(c => c.symbol === selectedCrypto);
    const cryptoAmount = (withdrawAmount / crypto!.rate).toFixed(8);
    
    Alert.alert(
      'Withdrawal Confirmation',
      `Withdraw $${withdrawAmount} (${cryptoAmount} ${selectedCrypto})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            onWithdraw(withdrawAmount);
            setAmount('');
            Alert.alert('Success', `Withdrawal of $${withdrawAmount} initiated!`);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
          Crypto Wallet
        </Text>
        
        {/* Balance Display */}
        <View style={[commonStyles.card, { marginBottom: 20, alignItems: 'center' }]}>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            Total Balance
          </Text>
          <Text style={{ color: colors.gold, fontSize: 32, fontWeight: '700' }}>
            ${balance.toFixed(2)}
          </Text>
        </View>

        {/* Cryptocurrency Selection */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[commonStyles.text, { marginBottom: 12 }]}>
            Select Cryptocurrency
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {cryptos.map((crypto) => (
                <TouchableOpacity
                  key={crypto.symbol}
                  style={[
                    commonStyles.card,
                    { 
                      minWidth: 120,
                      alignItems: 'center',
                      backgroundColor: selectedCrypto === crypto.symbol ? colors.accent : colors.card,
                      borderColor: selectedCrypto === crypto.symbol ? colors.gold : colors.border
                    }
                  ]}
                  onPress={() => setSelectedCrypto(crypto.symbol)}
                >
                  <Text style={{ fontSize: 24, marginBottom: 8 }}>
                    {crypto.icon}
                  </Text>
                  <Text style={[commonStyles.text, { fontSize: 14, fontWeight: '600' }]}>
                    {crypto.symbol}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
                    ${crypto.rate.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Amount Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[commonStyles.text, { marginBottom: 12 }]}>
            Amount (USD)
          </Text>
          
          {/* Quick Amount Buttons */}
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: 8, 
            marginBottom: 12 
          }}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[
                  buttonStyles.secondary,
                  { 
                    paddingHorizontal: 12, 
                    paddingVertical: 6,
                    backgroundColor: amount === quickAmount.toString() ? colors.gold : colors.backgroundAlt,
                    borderColor: amount === quickAmount.toString() ? colors.gold : colors.border
                  }
                ]}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={{ 
                  color: amount === quickAmount.toString() ? colors.primary : colors.text,
                  fontWeight: '600',
                  fontSize: 14
                }}>
                  ${quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount Input */}
          <View style={{
            backgroundColor: colors.backgroundAlt,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16
          }}>
            <Text 
              style={{ color: colors.text, fontSize: 16 }}
              onPress={() => {
                // In a real app, this would be a TextInput
                const customAmount = prompt('Enter custom amount:');
                if (customAmount) setAmount(customAmount);
              }}
            >
              {amount || 'Enter custom amount...'}
            </Text>
          </View>

          {/* Crypto Equivalent */}
          {amount && (
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                ≈ {((parseFloat(amount) || 0) / cryptos.find(c => c.symbol === selectedCrypto)!.rate).toFixed(8)} {selectedCrypto}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            style={[buttonStyles.gold, { width: '100%' }]}
            onPress={handleDeposit}
          >
            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>
              Deposit ${amount || '0'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.secondary, { width: '100%' }]}
            onPress={handleWithdraw}
          >
            <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>
              Withdraw ${amount || '0'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Wallet Info */}
        <View style={[commonStyles.card, { marginTop: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            Wallet Information
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Instant deposits and withdrawals
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Low transaction fees (0.1%)
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Secure cold storage
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • 24/7 customer support
          </Text>
        </View>

        {/* Recent Transactions */}
        <View style={[commonStyles.card, { marginTop: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            Recent Transactions
          </Text>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>Deposit (BTC)</Text>
            <Text style={{ color: colors.green }}>+$250.00</Text>
          </View>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>Chess Bet Win</Text>
            <Text style={{ color: colors.green }}>+$85.50</Text>
          </View>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>Dice Game</Text>
            <Text style={{ color: colors.red }}>-$25.00</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
