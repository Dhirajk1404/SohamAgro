import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import Config from '../config/config';
import images from '../images/images.js';
import theme from '../themes/theme'; 

const { width } = Dimensions.get("window");
const BASE_URL = Config.baseurl;

const CustomerMaster = ({ navigation, route }) => {
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pinNumber, setPinNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [landLineNumber, setLandLineNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [socialHandle, setSocialHandle] = useState("");
  const [shipToAddress, setShipToAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [Name, setAdminName] = useState("");

  useEffect(() => {
    if (route.params && route.params.Name) {
      setAdminName(route.params.Name);
    }
  }, [route.params]);

  const handleStoreCustomer = async () => {
    if (
      !customerId ||
      !name ||
      !address ||
      !city ||
      !state ||
      !country ||
      !pinNumber ||
      !mobileNumber ||
      !emailId
    ) {
      Alert.alert("Error", "All required fields must be filled");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/store-customer`,
        {
          customerId,
          name,
          address,
          city,
          state,
          country,
          pinNumber,
          mobileNumber,
          landLineNumber,
          emailId,
          socialHandle,
          shipToAddress,
          billingAddress,
          bankDetails,
          paymentTerms,
          gstNumber,
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Customer details stored successfully");
        clearFields();
      } else {
        Alert.alert("Error", "Failed to store customer details");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while storing customer details");
    }
  };

  const clearFields = () => {
    setCustomerId("");
    setName("");
    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setPinNumber("");
    setMobileNumber("");
    setLandLineNumber("");
    setEmailId("");
    setSocialHandle("");
    setShipToAddress("");
    setBillingAddress("");
    setBankDetails("");
    setPaymentTerms("");
    setGstNumber("");
  };

  return (
    <LinearGradient
      colors={theme.gradients.lightBluePurple} // Apply gradient from theme
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.header}>
          <Image
            source={images.logo} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.Name}>{Name}</Text>
        </View>
        <Text style={styles.title}>Customer Master</Text>
        <TextInput
          style={styles.input}
          placeholder="Customer ID *"
          value={customerId}
          onChangeText={setCustomerId}
        />
        <TextInput
          style={styles.input}
          placeholder="Name *"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Address *"
          value={address}
          onChangeText={setAddress}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="City *"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
            placeholder="State *"
            value={state}
            onChangeText={setState}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Country *"
            value={country}
            onChangeText={setCountry}
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
            placeholder="Pin Number *"
            value={pinNumber}
            onChangeText={setPinNumber}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Mobile Number *"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
            placeholder="Land Line Number"
            value={landLineNumber}
            onChangeText={setLandLineNumber}
            keyboardType="numeric"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email ID *"
          value={emailId}
          onChangeText={setEmailId}
          keyboardType="email-address"
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleStoreCustomer}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.viewCustomersButton]}
            onPress={() => navigation.navigate("ViewCustomers")}
          >
            <Text style={styles.buttonText}>View Customers</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const { width: windowWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  Name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B0082",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#4B0082",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: "#4B0082",
  },
  viewCustomersButton: {
    backgroundColor: "#FF6347",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CustomerMaster;
