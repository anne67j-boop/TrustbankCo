import { Transaction, User, Account, LinkedAccount } from './types';

export const CURRENT_USER: User = {
  id: 'u_123',
  name: 'Howard R. Woods',
  email: 'howard.woods@trustbank.com',
  avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc_1',
    type: 'Checking',
    name: 'Private Client Checking',
    balance: 8500000.00,
    accountNumber: '4452',
    change: 1.2
  },
  {
    id: 'acc_2',
    type: 'Savings',
    name: 'Trust Heritage Holdings',
    balance: 387587677.00,
    accountNumber: '9921',
    change: 0.05
  },
  {
    id: 'acc_3',
    type: 'Credit',
    name: 'Palladium Reserve Card',
    balance: -4240.50,
    accountNumber: '8832',
    change: 0
  }
];

export const MOCK_LINKED_ACCOUNTS: LinkedAccount[] = [
  { id: 'ext_1', institution: 'Chase', name: 'Chase Platinum Checking', mask: '8829', type: 'External' },
  { id: 'ext_2', institution: 'Fidelity', name: 'Brokerage Individual', mask: '1102', type: 'Brokerage' },
  { id: 'ext_3', institution: 'Bank of America', name: 'Advantage Savings', mask: '3341', type: 'External' }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: 'Oct 25', description: 'Gulfstream Aerospace', amount: 12500.00, type: 'debit', category: 'Travel', merchant: 'Gulfstream', accountId: 'acc_1' },
  { id: 't2', date: 'Oct 24', description: 'Dividend Payout - Trust Fund', amount: 450000.00, type: 'credit', category: 'Income', merchant: 'Trust Fund A', accountId: 'acc_2' },
  { id: 't3', date: 'Oct 23', description: 'Ritz-Carlton Hotel', amount: 3450.20, type: 'debit', category: 'Travel', merchant: 'Ritz-Carlton', accountId: 'acc_3' },
  { id: 't4', date: 'Oct 22', description: 'Sotheby\'s Auction', amount: 125000.00, type: 'debit', category: 'Shopping', merchant: 'Sotheby\'s', accountId: 'acc_1' },
  { id: 't5', date: 'Oct 21', description: 'Bloomberg Terminal', amount: 2000.00, type: 'debit', category: 'Business', merchant: 'Bloomberg', accountId: 'acc_1' },
  { id: 't6', date: 'Oct 20', description: 'Private Club Dues', amount: 5000.00, type: 'debit', category: 'Entertainment', merchant: 'The Club', accountId: 'acc_3' },
  { id: 't7', date: 'Oct 19', description: 'Venture Capital Distribution', amount: 1200000.00, type: 'credit', category: 'Income', merchant: 'VC Fund IV', accountId: 'acc_2' },
  { id: 't8', date: 'Oct 18', description: 'Luxury Motors Service', amount: 1800.00, type: 'debit', category: 'Transport', merchant: 'Luxury Motors', accountId: 'acc_3' },
];

export const SPENDING_DATA = [
  { name: 'Travel', value: 45000 },
  { name: 'Business', value: 30000 },
  { name: 'Shopping', value: 125000 },
  { name: 'Ent.', value: 15000 },
  { name: 'Charity', value: 10000 },
];