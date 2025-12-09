import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Account {
  id: string;
  type: 'Checking' | 'Savings' | 'Credit';
  name: string;
  balance: number;
  accountNumber: string; // Last 4 digits
  change?: number; // Daily change percentage
}

export interface LinkedAccount {
  id: string;
  institution: string;
  name: string;
  mask: string;
  type: 'External' | 'Brokerage';
  logo?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  merchant?: string;
  accountId?: string; // Link to specific account
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}