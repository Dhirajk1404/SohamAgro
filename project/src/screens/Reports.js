import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ReportsScreen = () => {
  return (
    <LinearGradient
      colors={['#B3CDE0', '#E0A8E0', '#DAB6F0']} // Gradient colors
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.text}>Reports Screen</Text>
        {/* Add more content here */}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold', // Optional: To make the text bold
  },
});

export default ReportsScreen;
