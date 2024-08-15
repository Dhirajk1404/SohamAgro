import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo

import Config from '../config/config';
const BASE_URL = Config.baseurl;
import images from '../images/images.js';
import theme from '../themes/theme'; 

const ViewCustomers = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true); // Track network status
  const isFocused = useIsFocused();

  useEffect(() => {
    // Network connection listener
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    if (isFocused) {
      fetchCustomers();
    }

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [isFocused]);

  const fetchCustomers = async () => {
    setLoading(true);
    if (!isConnected) {
      Alert.alert("No Internet Connection", "Please check your network settings.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this customer?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            if (!isConnected) {
              Alert.alert("No Internet Connection", "Please check your network settings.");
              return;
            }
            try {
              const response = await axios.delete(`${BASE_URL}/delete-customers/${customerId}`);
              if (response.status === 200) {
                Alert.alert("Success", "Customer deleted successfully");
                setCustomers(customers.filter(customer => customer.customerId !== customerId));
              } else {
                Alert.alert("Error", "Failed to delete customer");
              }
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "An error occurred while deleting customer");
            }
          }
        }
      ]
    );
  };

  const renderCustomerItem = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditCustomer', { customer: item })}
      >
        <Text style={styles.editButtonText}>✎</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteCustomer(item.customerId)}
      >
        <Text style={styles.deleteButtonText}>🗑</Text>
      </TouchableOpacity>
      <Text style={styles.productId}>Customer ID: {item.customerId}</Text>
      <Text style={styles.productName}>Name: {item.name}</Text>
      <Text style={styles.productDescription}>Address: {item.address}</Text>
      <Text style={styles.productDetails}>City: {item.city}</Text>
      <Text style={styles.productDetails}>State: {item.state}</Text>
      <Text style={styles.productDetails}>Country: {item.country}</Text>
      <Text style={styles.productDetails}>Pin Number: {item.pinNumber}</Text>
      <Text style={styles.productDetails}>Mobile Number: {item.mobileNumber}</Text>
      <Text style={styles.productDetails}>Email ID: {item.emailId}</Text>
      <Text style={styles.productDetails}>Social Handle: {item.socialHandle}</Text>
      <Text style={styles.productDetails}>Ship To Address: {item.shipToAddress}</Text>
      <Text style={styles.productDetails}>Billing Address: {item.billingAddress}</Text>
      <Text style={styles.productDetails}>Bank Details: {item.bankDetails}</Text>
      <Text style={styles.productDetails}>Payment Terms: {item.paymentTerms}</Text>
      <Text style={styles.productDetails}>GST Number: {item.gstNumber}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={theme.gradients.lightBluePurple} // Apply gradient from theme
      style={styles.backgroundGradient} // Style for LinearGradient
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={images.logo} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Customers</Text>
        </View>
        <FlatList
          data={customers}
          renderItem={renderCustomerItem}
          keyExtractor={(item) => item.customerId.toString()}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
    borderRadius: 50,
  },
  title: {
    fontSize: 20,
    color: "#4B0082",
    fontWeight: "bold",
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4B0082",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  productId: {
    fontSize: 16,
    color: "#4B0082",
  },
  productName: {
    fontSize: 16,
    color: "#4B0082",
    marginVertical: 5,
  },
  productDescription: {
    fontSize: 14,
    color: "#333",
    marginVertical: 5,
  },
  productDetails: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  button: {
    backgroundColor: "#4B0082",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 50,
    backgroundColor: "#4B0082",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: "#FF0000",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ViewCustomers;
