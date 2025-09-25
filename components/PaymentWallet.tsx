
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface PaymentWalletProps {
  balance: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

export default function PaymentWallet({ balance, onDeposit, onWithdraw }: PaymentWalletProps) {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [amount, setAmount] = useState('');

  const paymentMethods = [
    { 
      id: 'card', 
      name: 'Credit/Debit Card', 
      icon: '💳', 
      fee: '2.5%',
      description: 'Visa, Mastercard, American Express'
    },
    { 
      id: 'etf', 
      name: 'ETF Transfer', 
      icon: '🏦', 
      fee: '1.0%',
      description: 'Electronic Funds Transfer'
    },
    { 
      id: 'ewallet', 
      name: 'E-Wallet', 
      icon: '📱', 
      fee: '1.5%',
      description: 'PayPal, Skrill, Neteller'
    },
    { 
      id: 'bank', 
      name: 'Bank Transfer', 
      icon: '🏛️', 
      fee: '0.5%',
      description: 'Direct bank transfer'
    },
  ];

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount < 10) {
      Alert.alert('Invalid Amount', 'Minimum deposit is R10. Please enter a valid amount.');
      return;
    }

    const method = paymentMethods.find(m => m.id === selectedMethod);
    const fee = depositAmount * (parseFloat(method!.fee) / 100);
    const totalAmount = depositAmount + fee;
    
    Alert.alert(
      'Deposit Confirmation',
      `Deposit: R${depositAmount.toFixed(2)}\nFee (${method!.fee}): R${fee.toFixed(2)}\nTotal: R${totalAmount.toFixed(2)}\n\nMethod: ${method!.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            onDeposit(depositAmount);
            setAmount('');
            Alert.alert('Success', `Deposited R${depositAmount.toFixed(2)} successfully!\n\nFunds are available immediately.`);
          }
        }
      ]
    );
  };

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 10) {
      Alert.alert('Invalid Amount', 'Minimum withdrawal is R10. Please enter a valid amount.');
      return;
    }

    if (withdrawAmount > balance) {
      Alert.alert('Insufficient Balance', 'You don\'t have enough funds to withdraw this amount.');
      return;
    }

    const method = paymentMethods.find(m => m.id === selectedMethod);
    const fee = withdrawAmount * (parseFloat(method!.fee) / 100);
    const netAmount = withdrawAmount - fee;
    
    Alert.alert(
      'Withdrawal Confirmation',
      `Withdrawal: R${withdrawAmount.toFixed(2)}\nFee (${method!.fee}): R${fee.toFixed(2)}\nYou receive: R${netAmount.toFixed(2)}\n\nMethod: ${method!.name}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            onWithdraw(withdrawAmount);
            setAmount('');
            Alert.alert('Success', `Withdrawal of R${withdrawAmount.toFixed(2)} initiated!\n\nFunds will be available in 1-3 business days.`);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
          💰 Mzansikasino Wallet
        </Text>
        
        {/* Balance Display */}
        <View style={[commonStyles.card, { marginBottom: 20, alignItems: 'center' }]}>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            Available Balance
          </Text>
          <Text style={{ color: colors.gold, fontSize: 36, fontWeight: '900' }}>
            R{balance.toFixed(2)}
          </Text>
          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginTop: 4 }]}>
            South African Rand
          </Text>
        </View>

        {/* Payment Method Selection */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[commonStyles.text, { marginBottom: 12 }]}>
            Select Payment Method
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    commonStyles.card,
                    { 
                      minWidth: 140,
                      alignItems: 'center',
                      backgroundColor: selectedMethod === method.id ? colors.accent : colors.card,
                      borderColor: selectedMethod === method.id ? colors.gold : colors.border
                    }
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <Text style={{ fontSize: 28, marginBottom: 8 }}>
                    {method.icon}
                  </Text>
                  <Text style={[commonStyles.text, { fontSize: 12, fontWeight: '700', textAlign: 'center' }]}>
                    {method.name}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { fontSize: 10, textAlign: 'center', marginBottom: 4 }]}>
                    {method.description}
                  </Text>
                  <View style={[commonStyles.commissionBadge, { backgroundColor: colors.green }]}>
                    <Text style={[commonStyles.commissionText, { fontSize: 10 }]}>
                      Fee: {method.fee}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Amount Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[commonStyles.text, { marginBottom: 12 }]}>
            Amount (ZAR)
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
                  fontWeight: '700',
                  fontSize: 14
                }}>
                  R{quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount Input */}
          <View style={{
            backgroundColor: colors.backgroundAlt,
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16
          }}>
            <Text 
              style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}
              onPress={() => {
                // In a real app, this would be a TextInput
                const customAmount = prompt('Enter custom amount (minimum R10):');
                if (customAmount && parseFloat(customAmount) >= 10) {
                  setAmount(customAmount);
                }
              }}
            >
              {amount ? `R${amount}` : 'Enter custom amount (min R10)...'}
            </Text>
          </View>

          {/* Fee Calculation */}
          {amount && (
            <View style={[commonStyles.card, { marginBottom: 16 }]}>
              <View style={[commonStyles.row, { marginBottom: 4 }]}>
                <Text style={commonStyles.textSecondary}>Amount:</Text>
                <Text style={{ color: colors.text, fontWeight: '600' }}>R{parseFloat(amount).toFixed(2)}</Text>
              </View>
              <View style={[commonStyles.row, { marginBottom: 4 }]}>
                <Text style={commonStyles.textSecondary}>Fee ({paymentMethods.find(m => m.id === selectedMethod)?.fee}):</Text>
                <Text style={{ color: colors.commission, fontWeight: '600' }}>
                  R{(parseFloat(amount) * (parseFloat(paymentMethods.find(m => m.id === selectedMethod)?.fee || '0') / 100)).toFixed(2)}
                </Text>
              </View>
              <View style={[commonStyles.row, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 4 }]}>
                <Text style={[commonStyles.text, { fontWeight: '700' }]}>Total:</Text>
                <Text style={{ color: colors.gold, fontWeight: '700', fontSize: 16 }}>
                  R{(parseFloat(amount) + (parseFloat(amount) * (parseFloat(paymentMethods.find(m => m.id === selectedMethod)?.fee || '0') / 100))).toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            style={[buttonStyles.gold, { width: '100%' }]}
            onPress={handleDeposit}
          >
            <Text style={{ color: colors.primary, fontWeight: '900', fontSize: 16 }}>
              💳 Deposit R{amount || '0'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[buttonStyles.purple, { width: '100%' }]}
            onPress={handleWithdraw}
          >
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>
              💸 Withdraw R{amount || '0'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Commission Notice */}
        <View style={[commonStyles.card, { marginTop: 20, backgroundColor: colors.commission }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12, color: colors.text }]}>
            🏆 House Rules
          </Text>
          <Text style={[commonStyles.text, { color: colors.text, fontWeight: '600' }]}>
            • 30% commission on all winnings
          </Text>
          <Text style={[commonStyles.textSecondary, { color: colors.text, opacity: 0.9 }]}>
            This is how Mzansikasino stays profitable and provides you with the best gaming experience!
          </Text>
        </View>

        {/* Payment Info */}
        <View style={[commonStyles.card, { marginTop: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            💎 Payment Information
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Instant deposits for all payment methods
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Withdrawals processed within 1-3 business days
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • Minimum deposit/withdrawal: R10
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • 24/7 customer support available
          </Text>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            • All transactions secured with bank-level encryption
          </Text>
        </View>

        {/* Recent Transactions */}
        <View style={[commonStyles.card, { marginTop: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
            📊 Recent Transactions
          </Text>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>Card Deposit</Text>
            <Text style={{ color: colors.green, fontWeight: '600' }}>+R500.00</Text>
          </View>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>Chess Win (after 30% commission)</Text>
            <Text style={{ color: colors.green, fontWeight: '600' }}>+R140.00</Text>
          </View>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>Dice Game Loss</Text>
            <Text style={{ color: colors.red, fontWeight: '600' }}>-R50.00</Text>
          </View>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Text style={commonStyles.textSecondary}>Ludo Win (after 30% commission)</Text>
            <Text style={{ color: colors.green, fontWeight: '600' }}>+R70.00</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
