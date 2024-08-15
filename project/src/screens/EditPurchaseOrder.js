import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Config from '../config/config';
const BASE_URL = Config.baseurl;
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../themes/theme';

const EditPurchaseOrder = ({ route, navigation }) => {
  const { order } = route.params || {};

  const [customerId, setCustomerId] = useState(order?.customerId || "");
  const [customerName, setCustomerName] = useState(order?.customerName || "");
  const [orderDate, setOrderDate] = useState(order?.orderDate || "");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(order?.expectedDeliveryDate || "");
  const [paymentMethod, setPaymentMethod] = useState(order?.paymentMethod || "");
  const [specialInstructions, setSpecialInstructions] = useState(order?.specialInstructions || "");
  const [billingAddress, setBillingAddress] = useState(order?.billingAddress || "");
  const [shippingAddress, setShippingAddress] = useState(order?.shippingAddress || "");
  const [products, setProducts] = useState(order?.products || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOrderDatePickerVisible, setOrderDatePickerVisibility] = useState(false);
  const [isDeliveryDatePickerVisible, setDeliveryDatePickerVisibility] = useState(false);

  const fetchProducts = async (query = "") => {
    try {
      const response = await axios.get(`${BASE_URL}/products?search=${query}`);
      setAvailableProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/edit-purchase-orders/${order.id}`, {
        customerId,
        customerName,
        orderDate,
        expectedDeliveryDate,
        paymentMethod,
        specialInstructions,
        billingAddress,
        shippingAddress,
        products,
      });
      Alert.alert("Success", "Order updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating order:", error);
      Alert.alert("Error", "Failed to update order");
    }
  };

  const addProductToOrder = (product) => {
    const existingProduct = products.find(p => p.productName === product.productName);
    if (existingProduct) {
      existingProduct.quantity = parseInt(existingProduct.quantity || "1");
      setProducts([...products]);
    } else {
      setProducts([...products, { ...product, quantity: "1" }]);
    }
    setModalVisible(false);
  };

  const removeProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const updateProductQuantity = (productId, quantity) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, quantity: parseInt(quantity, 10) || 1 } : product
    );
    setProducts(updatedProducts);
  };

  const handleConfirmOrderDate = (date) => {
    setOrderDate(date.toISOString().split('T')[0]);
    setOrderDatePickerVisibility(false);
  };

  const handleConfirmDeliveryDate = (date) => {
    setExpectedDeliveryDate(date.toISOString().split('T')[0]);
    setDeliveryDatePickerVisibility(false);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productText}>{item.productName || 'Unknown Product'}</Text>
      <View style={styles.quantityContainer}>
        <TextInput
          style={styles.quantityInput}
          value={item.quantity?.toString() || '1'}
          onChangeText={(text) => {
            const newQuantity = parseInt(text, 10);
            if (!isNaN(newQuantity) && newQuantity > 0) {
              updateProductQuantity(item.id, newQuantity.toString());
            }
          }}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={() => removeProduct(item.id)}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAvailableProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => addProductToOrder(item)}>
      <Text style={styles.productText}>{item.productName || 'Unknown Product'}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
    colors={theme.gradients.lightBluePurple}
    style={styles.background}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Edit Purchase Order</Text>
        <TextInput
          style={styles.input}
          value={customerId}
          onChangeText={setCustomerId}
          placeholder="Customer ID"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Customer Name"
        />
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id?.toString() || item.productName}
          style={styles.productList}
        />
        <TouchableOpacity style={styles.addProductButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addProductButtonText}>Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.input} onPress={() => setOrderDatePickerVisibility(true)}>
          <Text style={styles.dateText}>{orderDate || 'Order Date (YYYY-MM-DD)'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.input} onPress={() => setDeliveryDatePickerVisibility(true)}>
          <Text style={styles.dateText}>{expectedDeliveryDate || 'Expected Delivery Date (YYYY-MM-DD)'}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={paymentMethod}
          onChangeText={setPaymentMethod}
          placeholder="Payment Method"
        />
        <TextInput
          style={styles.input}
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          placeholder="Special Instructions"
        />
        <TextInput
          style={styles.input}
          value={billingAddress}
          onChangeText={setBillingAddress}
          placeholder="Billing Address"
        />
        <TextInput
          style={styles.input}
          value={shippingAddress}
          onChangeText={setShippingAddress}
          placeholder="Shipping Address"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Product</Text>
          <TextInput
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for products"
            onSubmitEditing={() => fetchProducts(searchQuery)}
          />
          <FlatList
            data={availableProducts}
            renderItem={renderAvailableProductItem}
            keyExtractor={(item) => item.id?.toString() || item.productName}
            style={styles.productListModal}
          />
          <TouchableOpacity style={styles.saveButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.saveButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isOrderDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmOrderDate}
        onCancel={() => setOrderDatePickerVisibility(false)}
      />

      <DateTimePickerModal
        isVisible={isDeliveryDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDeliveryDate}
        onCancel={() => setDeliveryDatePickerVisibility(false)}
      />
    </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  addProductButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  addProductButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productList: {
    maxHeight: 150,
  },
  productListModal: {
    maxHeight: 200,
  },
  productItem: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  productText: {
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quantityInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    width: 80,
    height: 40,
  },
  removeButtonText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default EditPurchaseOrder;
