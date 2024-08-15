import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

import Config from '../config/config';
const BASE_URL = Config.baseurl;
import images from '../images/images.js';
import theme from '../themes/theme'; 

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const ViewPurchaseOrders = ({ navigation }) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/purchase-orders`);
      setPurchaseOrders(response.data);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      Alert.alert("Error", "Failed to fetch purchase orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPurchaseOrders();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPurchaseOrders();
    }, [])
  );

  const handleLocationPress = (location) => {
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const renderOrderItem = ({ item }) => {
    const productsArray = Array.isArray(item.products) ? item.products : [];
    const productDetails = productsArray.map(product => (
      `${product.productName} (Quantity: ${product.quantity})`
    )).join(", ") || "N/A";

    return (
      <View style={styles.orderItem}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            navigation.navigate('EditPurchaseOrder', { order: item });
          }}
        >
          <Text style={styles.editButtonText}>✎</Text>
        </TouchableOpacity>
        <Text style={styles.customerId}>Customer ID: {item.customerId}</Text>
        <Text style={styles.customerName}>Customer Name: {item.customerName}</Text>
        <Text style={styles.orderText}>Products: {productDetails}</Text>
        <Text style={styles.orderText}>Order Date: {formatDate(item.orderDate)}</Text>
        <Text style={styles.orderText}>Expected Delivery Date: {formatDate(item.expectedDeliveryDate)}</Text>
        <Text style={styles.orderText}>Payment Method: {item.paymentMethod}</Text>
        <Text style={styles.orderText}>Special Instructions: {item.specialInstructions}</Text>
        <Text style={styles.orderText}>Billing Address: {item.billingAddress}</Text>
        <Text style={styles.orderText}>Shipping Address: {item.shippingAddress}</Text>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => handleLocationPress(item.location)}
        >
          <Text style={styles.mapButtonText}>View Location Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }

  const ListHeader = () => (
    <View style={styles.header}>
      <Image
        source={images.logo} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Purchase Orders</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={theme.gradients.lightBluePurple} // Apply gradient from theme
      style={styles.background}
    >
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={ListHeader}
          data={purchaseOrders}
          renderItem={renderOrderItem} // Ensure this is a function
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          {selectedLocation && (
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Location Details:</Text>
              <Text style={styles.modalText}>Latitude: {selectedLocation.latitude}</Text>
              <Text style={styles.modalText}>Longitude: {selectedLocation.longitude}</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          )}
        </View>
      </Modal>
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
  listContainer: {
    flexGrow: 1,
  },
  customerId:{
    fontSize: 16,
    color: "#4B0082",
  },
  customerName:{
    fontSize: 16,
    color: "#4B0082",
    marginVertical: 5,
  },
  orderItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#4B0082",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  orderText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  mapButton: {
    backgroundColor: "#4B0082",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  mapButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4B0082",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  modalContent: {
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    color: "#4B0082",
    marginVertical: 5,
  },
  editButton: {
    position: 'absolute',
    top: theme.spacing.small,
    right: theme.spacing.small,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.small,
    borderRadius: theme.border.radius,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ViewPurchaseOrders;
