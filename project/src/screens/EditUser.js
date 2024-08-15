import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import Config from '../config/config';
import theme from '../themes/theme';

const BASE_URL = Config.baseurl;

const EditUser = ({ route, navigation }) => {
  const { user, refreshUsers } = route.params;
  const [name, setName] = useState(user.name);
  const [user_id, setId] = useState(user.user_id);
  const [emailid, setEmailid] = useState(user.emailid);
  const [mobile_no, setMobileNo] = useState(user.mobile_no);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  const handleUpdateUser = async () => {
    if (!name || !user_id || !emailid || !mobile_no || !status) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/update-user/${user_id}`,
        { name, emailid, mobile_no, role, status }
      );

      if (response.status === 200) {
        Alert.alert("Success", "User updated successfully");
        refreshUsers();
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update user");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while updating the user");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <LinearGradient
        colors={theme.gradients.lightBluePurple}
        style={styles.backgroundGradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Edit User</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="ID"
              value={user_id}
              onChangeText={setId}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Email ID"
              value={emailid}
              onChangeText={setEmailid}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile No"
              value={mobile_no}
              onChangeText={setMobileNo}
            />
            <TextInput
              style={styles.input}
              placeholder="Role"
              value={role}
              onChangeText={setRole}
            />
            <TextInput
              style={styles.input}
              placeholder="Status"
              value={status}
              onChangeText={setStatus}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleUpdateUser}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#4B0082",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  submitButton: {
    backgroundColor: "#4B0082",
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default EditUser;
