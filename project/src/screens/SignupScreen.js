import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";

import Config from '../config/config';
const BASE_URL = Config.baseurl;
import images from '../images/images.js';
import theme from '../themes/theme'; 
const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/signup`, {
        name,
        email,
        password,
      });
      Alert.alert("Signup Successful", response.data);
      navigation.navigate("Login"); // Navigate to Login screen after successful signup
    } catch (error) {
      Alert.alert("Signup Failed", "Failed to signup");
    }
  };

  return (
    <ImageBackground
      source={images.background} 
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={images.logo} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.greenValleyText}>Green Valley</Text>
          </View>
          <Text style={styles.title}>Signup</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 60, // Adjust size as needed
    height: 60, // Adjust size as needed
    borderRadius: 30, // Half of the width/height to make it circular
    marginBottom: 10,
    overflow: 'hidden',
  },
  greenValleyText: {
    fontSize: 24,
    color: "#4B0082", // Adjust as needed
  },
  title: {
    fontSize: 30,
    marginBottom: 16,
    color: "white", // Ensure text is visible on background
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    backgroundColor: "white", // Ensure input is visible on background
  },
  button: {
    backgroundColor: "#4B0082", // Matching button color with theme
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginVertical: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default SignupScreen;
