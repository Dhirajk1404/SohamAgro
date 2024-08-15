import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import images from '../images/images.js';
import theme from '../themes/theme'; // Import the theme

const AdminScreen = ({ navigation, route }) => {
  console.log("Route params:", route.params);
  const { Name } = route.params || {};

  const [loginTime, setLoginTime] = useState(null);

  // Function to format the current time as HH:MM
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}`;
  };

  useEffect(() => {
    // Set the login time when the component mounts or adminName changes
    if (Name) {
      const currentTime = getCurrentTime();
      setLoginTime(currentTime);
    }
  }, [Name]);

  const handleUserMaintenance = () => {
    navigation.navigate("UserMaintenance", { Name });
  };

  const handleCustomer = () => {
    navigation.navigate("CustomerMaster", { Name });
  };

  const handleProductMaster = () => {
    navigation.navigate("ProductMaster", { Name });
  };

  const handlePurchaseOrder = () => {
    navigation.navigate("PurchaseOrder", { Name });
  };

  const handleReports = () => {
    navigation.navigate("Reports", { Name });
  };

  const handleLogout = async () => {
    try {
      // Clear authentication state or token if applicable
      console.log("Logging out...");

      await AsyncStorage.removeItem("userEmail");
      await AsyncStorage.removeItem("userPassword");

      // Navigate to Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminLogin' }],
      });
    } catch (error) {
      console.error("Error during logout: ", error);
      Alert.alert("Logout Failed", "An error occurred while logging out.");
    }
  };

  const { width } = Dimensions.get("window");

  return (
    <LinearGradient
    colors={theme.gradients.lightBluePurple}  // Use gradient from theme
      style={styles.backgroundGradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            source={images.logo} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.companyName}>Green Vally</Text>
        </View>
        <View style={styles.adminBox}>
          <View style={styles.adminDetailsContainer}>
            <Image
              source={images.person} 
              style={styles.adminPhoto}
              resizeMode="cover"
            />
            <View style={styles.adminDetails}>
              <Text style={[styles.adminText, { fontSize: width * 0.04 }]}>
                {Name}
              </Text>
              <Text style={[styles.adminText, { fontSize: width * 0.03 }]}>
                Login Time: {loginTime}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.option}
              onPress={handleUserMaintenance}
            >
              <Image
                source={images.usermai} 
                style={styles.optionImage}
                resizeMode="contain"
              />
              <Text style={[styles.optionText, { fontSize: width * 0.03 }]}>
                User Maintenance
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={handleCustomer}>
              <Image
                source={images.customer} 
                style={styles.optionImage}
                resizeMode="contain"
              />
              <Text style={[styles.optionText, { fontSize: width * 0.03 }]}>
                Customer Master
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={handleProductMaster}
            >
              <Image
                source={images.product} 
                style={styles.optionImage}
                resizeMode="contain"
              />
              <Text style={[styles.optionText, { fontSize: width * 0.03 }]}>
                Product Master
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.option}
              onPress={handlePurchaseOrder}
            >
              <Image
                source={images.purchase} 
                style={styles.optionImage}
                resizeMode="contain"
              />
              <Text style={[styles.optionText, { fontSize: width * 0.03 }]}>
                Purchase Order
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={handleReports}>
              <Image
                source={images.report} 
                style={styles.optionImage}
                resizeMode="contain"
              />
              <Text style={[styles.optionText, { fontSize: width * 0.03 }]}>
                Reports
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
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
    flexGrow: 1,
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutContainer: {
    position: "absolute",
    bottom: 15,
    right: 20,
  },
  logoutButton: {
    backgroundColor: "#4B0082",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25, // Make the logo circular
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B0082", // Dark purple color
  },
  adminBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  adminDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: 10,
  },
  adminPhoto: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 50, // Make the admin photo circular
  },
  adminDetails: {
    flex: 1,
  },
  adminText: {
    marginBottom: 2,
    color: "#4B0082", // Dark purple color
  },
  optionsContainer: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  option: {
    alignItems: "center",
    width: "30%",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 8,
    marginBottom: 10,
  },
  optionImage: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  optionText: {
    marginTop: 8,
    textAlign: "center",
    color: "#6A0D91", // Dark purple color
  },
});

export default AdminScreen;
