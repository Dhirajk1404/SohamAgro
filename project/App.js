import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminScreen from './src/screens/AdminScreen';
import UserScreen from './src/screens/UserScreen';
import AdminLogin from './src/screens/AdminLogin';
import UserLogin from './src/screens/UserLogin';
import SignupScreen from './src/screens/SignupScreen';
import ProductMaster from './src/screens/ProductMaster';
import CustomerMaster from './src/screens/CustomerMaster';
import PurchaseOrder from './src/screens/PurchaseOrder';
import UserMaintenance from './src/screens/UserMaintenance';
import ViewCustomers from './src/screens/ViewCustomers';
import ViewProducts from './src/screens/ViewProducts';
import ViewPurchaseOrders from './src/screens/ViewPurchaseOrders';
import EditPurchaseOrder from './src/screens/EditPurchaseOrder';
import EditCustomer from './src/screens/EditCustomer';
import EditProduct from './src/screens/EditProduct';
import EditUser from './src/screens/EditUser';
import Reports from './src/screens/Reports';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AdminLogin" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AdminLogin" component={AdminLogin} />
          <Stack.Screen name="UserLogin" component={UserLogin} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="AdminScreen" component={AdminScreen} />
          <Stack.Screen name="UserScreen" component={UserScreen} />
          <Stack.Screen name="ProductMaster" component={ProductMaster} />
          <Stack.Screen name="CustomerMaster" component={CustomerMaster} />
          <Stack.Screen name="PurchaseOrder" component={PurchaseOrder} />
          <Stack.Screen name="ViewCustomers" component={ViewCustomers} />
          <Stack.Screen name="ViewProducts" component={ViewProducts} />
          <Stack.Screen name="ViewPurchaseOrders" component={ViewPurchaseOrders} />
          <Stack.Screen name="UserMaintenance" component={UserMaintenance} />
          <Stack.Screen name="EditPurchaseOrder" component={EditPurchaseOrder} />
          <Stack.Screen name="EditCustomer" component={EditCustomer} />
          <Stack.Screen name="EditProduct" component={EditProduct} />
          <Stack.Screen name="EditUser" component={EditUser} />
          <Stack.Screen name="Reports" component={Reports} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
