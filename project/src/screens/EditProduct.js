import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import Config from '../config/config';
const BASE_URL = Config.baseurl;
import theme from '../themes/theme'; 


const { width } = Dimensions.get("window");
const EditProduct = ({ route, navigation }) => {
  const { product, refreshProducts } = route.params;

  const [productName, setProductName] = useState(product.productName);
  const [description, setDescription] = useState(product.description);
  const [unitOfMeasurement, setUnitOfMeasurement] = useState(product.unitOfMeasurement);
  const [price, setPrice] = useState(product.price);
  const [currency, setCurrency] = useState(product.currency);
  const [productCategory, setProductCategory] = useState(product.productCategory);
  const [expiryDate, setExpiryDate] = useState(product.expiryDate);
  const [batchNumber, setBatchNumber] = useState(product.batchNumber);
  const [status, setStatus] = useState(product.status);
  const [discountAllowed, setDiscountAllowed] = useState(product.discountAllowed);

  const handleSave = async () => {
    try {
      const updatedProduct = {
        productName,
        description,
        unitOfMeasurement,
        price,
        currency,
        productCategory,
        expiryDate,
        batchNumber,
        status,
        discountAllowed,
      };

      console.log('Sending updated product data:', updatedProduct);

      const response = await axios.put(`${BASE_URL}/update-product/${product.id}`, updatedProduct);
      if (response.status === 200) {
        Alert.alert("Success", "Product updated successfully");
        refreshProducts();
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update product");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while updating the product");
    }
  };

  return (
    <LinearGradient
      colors={theme.gradients.lightBluePurple} // Apply gradient from theme
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Product</Text>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Unit of Measurement"
          value={unitOfMeasurement}
          onChangeText={setUnitOfMeasurement}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price.toString()}
          onChangeText={(text) => setPrice(Number(text))}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Currency"
          value={currency}
          onChangeText={setCurrency}
        />
        <TextInput
          style={styles.input}
          placeholder="Product Category"
          value={productCategory}
          onChangeText={setProductCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Expiry Date"
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Batch Number"
          value={batchNumber}
          onChangeText={setBatchNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Status"
          value={status}
          onChangeText={setStatus}
        />
        <TextInput
          style={styles.input}
          placeholder="Discount Allowed"
          value={discountAllowed.toString()}
          onChangeText={(text) => setDiscountAllowed(Number(text))}
          keyboardType="numeric"
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#4B0082",
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: '#4B0082',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditProduct;
