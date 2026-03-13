// src/screens/LoginScreen.tsx
// Example usage of the useLogin hook in a React Native screen.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLogin } from '../hooks/useLogin';
import type { LoginRequest } from '../api/types';
import { getErrorMessage } from '../utils/errorHandler';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    mutate: login,
    isPending,
    error,
  } = useLogin();

  const handleSubmit = () => {
    const payload: LoginRequest = { email, password };
    login(payload, {
      onSuccess: data => {
        // Example: navigate to main app, store user, etc.
        console.log('Logged in user:', data.user);
      },
    });
  };

  const errorMessage = error ? getErrorMessage(error) : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <View style={styles.buttonContainer}>
        {isPending ? (
          <ActivityIndicator />
        ) : (
          <Button title="Login" onPress={handleSubmit} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 12,
  },
  error: {
    color: '#d32f2f',
    marginBottom: 8,
  },
});

export default LoginScreen;

