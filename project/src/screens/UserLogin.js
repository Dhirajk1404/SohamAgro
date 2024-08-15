import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Config from '../config/config';
const BASE_URL = Config.baseurl;
import images from '../images/images.js';
import theme from '../themes/theme'; 
import { LinearGradient } from 'expo-linear-gradient';
const  UserLogin = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedPassword = await AsyncStorage.getItem("userPassword");

        if (storedUserId && storedPassword) {
          const response = await axios.post(`${BASE_URL}/user-login`, {
            user_id: storedUserId,
            password: storedPassword,
          });

          if (response.status === 200) {
            navigation.navigate("UserScreen", {
              Name: response.data.Name,
            });
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log("Error reading login status from AsyncStorage: ", error);
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const handleLogin = async () => {
    console.log("Login button pressed");
    try {
      const response = await axios.post(`${BASE_URL}/user-login`, {
        user_id: userId,
        password,
      });

      console.log("Response received: ", response.data);

      if (response.status === 200) {
        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("userPassword", password);
        Alert.alert("Login Successful", response.data.message, [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("UserScreen", {
                Name: response.data.Name,
              });
            },
          },
        ]);
      } else {
        Alert.alert("Login Failed", "Invalid credentials");
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error.response) {
        Alert.alert("Login Failed", error.response.data.message);
      } else {
        Alert.alert("Login Failed", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust offset for iOS
  >
    <LinearGradient
      colors={theme.gradients.lightBluePurple}
      style={styles.backgroundGradient} // Style for LinearGradient
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={images.logo} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.greenValleyText}>Green Vally</Text>
          </View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <View style={styles.formContainer}>
            <Text style={styles.title}>User Login</Text>
            <TextInput
              style={styles.input}
              placeholder="User ID"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 20,
    left: 20,
  },
  logo: {
    width: windowWidth * 0.2,
    height: windowWidth * 0.2,
    borderRadius: (windowWidth * 0.2) / 2,
  },
  greenValleyText: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#4B0082",
  },
  welcomeText: {
    fontSize: 40,
    marginBottom: 5,
    color: "#4B0082",
    textAlign: "center",
    marginTop: 100,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  loginButton: {
    backgroundColor: "#4B0082",
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default UserLogin;
