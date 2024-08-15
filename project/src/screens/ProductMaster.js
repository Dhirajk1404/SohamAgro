import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import Config from '../config/config';
import images from '../images/images.js';
import theme from '../themes/theme';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker'; // Ensure Picker is imported

const { width } = Dimensions.get("window");
const BASE_URL = Config.baseurl;

const ProductMaster = ({ navigation, route }) => {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [unitOfMeasurement, setUnitOfMeasurement] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [status, setStatus] = useState("Active");
  const [discountAllowed, setDiscountAllowed] = useState("No");
  const [Name, setAdminName] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (route.params && route.params.Name) {
      setAdminName(route.params.Name);
    }
  }, [route.params]);

  const handleStoreProduct = async () => {
    if (
      !productId ||
      !productName ||
      !description ||
      !unitOfMeasurement ||
      !price ||
      !currency ||
      !productCategory
    ) {
      Alert.alert("Error", "All required fields must be filled");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/store-product`,
        {
          productId,
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
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Product details stored successfully");
        clearFields();
      } else {
        Alert.alert("Error", "Failed to store product details");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while storing product details");
    }
  };

  const clearFields = () => {
    setProductId("");
    setProductName("");
    setDescription("");
    setUnitOfMeasurement("");
    setPrice("");
    setCurrency("");
    setProductCategory("");
    setExpiryDate("");
    setBatchNumber("");
    setStatus("Active");
    setDiscountAllowed("No");
  };

  const handleConfirmDate = (date) => {
    setExpiryDate(date.toDateString());
    setDatePickerVisibility(false);
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
        <Text style={styles.title}>Product Master</Text>
        <TextInput
          style={styles.input}
          placeholder="Product ID *"
          value={productId}
          onChangeText={setProductId}
        />
        <TextInput
          style={styles.input}
          placeholder="Product Name *"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description *"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Unit of Measurement *"
          value={unitOfMeasurement}
          onChangeText={setUnitOfMeasurement}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.priceInput]}
            placeholder="Price *"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.currencyInput]}
            placeholder="Currency *"
            value={currency}
            onChangeText={setCurrency}
          />
        </View>
        <TextInput
          style={[styles.input, styles.productCategoryInput]}
          placeholder="Product Category *"
          value={productCategory}
          onChangeText={setProductCategory}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.batchNumberInput]}
            placeholder="Batch Number"
            value={batchNumber}
            onChangeText={setBatchNumber}
          />
          <TouchableOpacity
            style={[styles.input, styles.datePickerButton]}
            onPress={() => setDatePickerVisibility(true)}
          >
            <Text style={styles.dateText}>{expiryDate || "Expiry Date"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Active" value="Active" />
            <Picker.Item label="Inactive" value="Inactive" />
          </Picker>
        </View>
        <Text style={styles.label}>Discount Allowed</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={discountAllowed}
            onValueChange={(itemValue) => setDiscountAllowed(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleStoreProduct}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.viewProductsButton]}
            onPress={() => navigation.navigate("ViewProducts")}
          >
            <Text style={styles.buttonText}>View Products</Text>
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
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
    paddingHorizontal: 10,
    // Removed border styles
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  Name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B0082",
  },
  title: {
    fontSize: 20,
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
    marginBottom: 12,
    flexWrap: "wrap",
  },
  priceInput: {
    flex: 1,
    marginRight: 8,
  },
  currencyInput: {
    flex: 1,
  },
  productCategoryInput: {
    marginBottom: 12,
  },
  batchNumberInput: {
    padding: 6,
    flex: 1,
    marginRight: 8,
  },
  datePickerButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#4B0082",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#4B0082",
  },
  pickerContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
  },
  picker: {
    height: 40,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: "#4B0082",
  },
  viewProductsButton: {
    backgroundColor: "#4B0082",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ProductMaster;
