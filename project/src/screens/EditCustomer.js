import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import Config from '../config/config';
import theme from '../themes/theme'; 

const { width } = Dimensions.get("window");
const BASE_URL = Config.baseurl;

const EditCustomer = ({ route, navigation }) => {
  const { customer } = route.params;

  const [customerId, setCustomerId] = useState(customer.customerId);
  const [name, setName] = useState(customer.name);
  const [address, setAddress] = useState(customer.address);
  const [city, setCity] = useState(customer.city);
  const [state, setState] = useState(customer.state);
  const [country, setCountry] = useState(customer.country);
  const [pinNumber, setPinNumber] = useState(customer.pinNumber);
  const [mobileNumber, setMobileNumber] = useState(customer.mobileNumber);
  const [emailId, setEmailId] = useState(customer.emailId);
  const [socialHandle, setSocialHandle] = useState(customer.socialHandle);
  const [shipToAddress, setShipToAddress] = useState(customer.shipToAddress);
  const [billingAddress, setBillingAddress] = useState(customer.billingAddress);
  const [bankDetails, setBankDetails] = useState(customer.bankDetails);
  const [paymentTerms, setPaymentTerms] = useState(customer.paymentTerms);
  const [gstNumber, setGstNumber] = useState(customer.gstNumber);

  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/edit-customer/${customerId}`, {
        name,
        address,
        city,
        state,
        country,
        pinNumber,
        mobileNumber,
        emailId,
        socialHandle,
        shipToAddress,
        billingAddress,
        bankDetails,
        paymentTerms,
        gstNumber,
      });

      Alert.alert("Success", "Customer updated successfully");
      navigation.goBack(); // Navigate back to the ViewCustomers screen
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update customer");
    }
  };

  return (
    <LinearGradient
      colors={theme.gradients.lightBluePurple} // Apply gradient from theme
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Customer</Text>
        <TextInput
          style={styles.input}
          placeholder="Customer ID"
          value={customerId.toString()}
          onChangeText={setCustomerId}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          value={state}
          onChangeText={setState}
        />
        <TextInput
          style={styles.input}
          placeholder="Country"
          value={country}
          onChangeText={setCountry}
        />
        <TextInput
          style={styles.input}
          placeholder="Pin Number"
          value={pinNumber}
          onChangeText={setPinNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Email ID"
          value={emailId}
          onChangeText={setEmailId}
        />
        <TextInput
          style={styles.input}
          placeholder="Social Handle"
          value={socialHandle}
          onChangeText={setSocialHandle}
        />
        <TextInput
          style={styles.input}
          placeholder="Ship To Address"
          value={shipToAddress}
          onChangeText={setShipToAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Billing Address"
          value={billingAddress}
          onChangeText={setBillingAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Bank Details"
          value={bankDetails}
          onChangeText={setBankDetails}
        />
        <TextInput
          style={styles.input}
          placeholder="Payment Terms"
          value={paymentTerms}
          onChangeText={setPaymentTerms}
        />
        <TextInput
          style={styles.input}
          placeholder="GST Number"
          value={gstNumber}
          onChangeText={setGstNumber}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4B0082",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default EditCustomer;
