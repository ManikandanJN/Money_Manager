import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch } from "react-redux";
import { addExpense, addIncome } from "../../Redux/transactionSlice";

const ExpenseList = [
  { name: "Shopping", icon: "cart-outline", iconType: "FontAwesome" },
  { name: "Food", icon: "fast-food-outline", iconType: "FontAwesome" },
  { name: "Phone", icon: "call-outline", iconType: "FontAwesome" },
  { name: "Entertainment", icon: "tv-outline", iconType: "FontAwesome" },
  { name: "Education", icon: "school-outline", iconType: "FontAwesome" },
  { name: "Beauty", icon: "paint-brush", iconType: "FontAwesome" },
  { name: "Sports", icon: "soccer-ball-o", iconType: "FontAwesome" },
  { name: "Social", icon: "users", iconType: "FontAwesome" },
  { name: "Transportation", icon: "bus", iconType: "FontAwesome" },
  { name: "Clothing", icon: "tshirt", iconType: "FontAwesome" },
  { name: "Car", icon: "car-outline", iconType: "FontAwesome" },
  { name: "Alcohol", icon: "beer", iconType: "FontAwesome" },
  { name: "Cigarettes", icon: "smoking", iconType: "FontAwesome" },
  { name: "Electronics", icon: "mobile", iconType: "FontAwesome" },
  { name: "Travel", icon: "plane", iconType: "FontAwesome" },
];

const IncomeList = [
  { name: "Salary", icon: "briefcase-outline", iconType: "FontAwesome" },
  { name: "Freelance", icon: "laptop", iconType: "FontAwesome" },
  { name: "Investments", icon: "line-chart", iconType: "FontAwesome" },
  { name: "Gifts", icon: "gift", iconType: "FontAwesome" },
  { name: "Donations", icon: "heart", iconType: "FontAwesome" },
  { name: "Lottery", icon: "money", iconType: "FontAwesome" },
  { name: "Rental Income", icon: "home-outline", iconType: "FontAwesome" },
  { name: "Business", icon: "building", iconType: "FontAwesome" },
];

const MoneyManagerScreen = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Expense");
  const [showNumberInput, setShowNumberInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState("");

  const getList = () => (activeTab === "Expense" ? ExpenseList : IncomeList);

  const renderIcon = (icon, iconType, size = 35, color = "#666") => {
    switch (iconType) {
      case "Ionicons":
        return <Ionicons name={icon} size={size} color={color} />;
      case "FontAwesome":
        return <FontAwesome name={icon} size={size} color={color} />;
      default:
        return null;
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setShowNumberInput(true);
  };

  const handleAmountSubmit = () => {
    if (!selectedCategory || !amount) return;
  
    const data = {
      id: Date.now().toString(),
      ...selectedCategory,
      amount: parseFloat(amount),
      type: activeTab.toLowerCase(), // "expense" or "income"
    };
  
    // if (activeTab === "Expense") {
      dispatch(addExpense(data));
    // } else if (activeTab === "Income") {
      // dispatch(addIncome(data));
    // }
  
    // Reset inputs
    setShowNumberInput(false);
    setAmount("");
    setSelectedCategory(null);
    onClose()
  };
  

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add</Text>
          <View style={{ width: 70 }} />
        </View>

        <View style={styles.tabContainer}>
          {["Expense", "Income"].map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={getList()}
          keyExtractor={(item) => item.name}
          numColumns={4}
          
          contentContainerStyle={styles.gridContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
              {renderIcon(item.icon, item.iconType)}
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <Modal visible={showNumberInput} transparent={true} animationType="slide">
          <View style={styles.numberInputContainer}>
            <View style={styles.numberInputContent}>
              <Text style={styles.numberInputTitle}>Enter amount for {selectedCategory?.name}</Text>
              <TextInput
                style={styles.numberInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#666"
                autoFocus
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowNumberInput(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleAmountSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cancelText: {
    color: "white",
    fontSize: 16,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#222",
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "white",
    borderRadius: 8,
  },
  tabText: {
    color: "gray",
    fontSize: 16,
  },
  activeTabText: {
    color: "black",
    fontWeight: "bold",
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  categoryItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 20,
  },
  categoryText: {
    color: "gray",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  numberInputContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  numberInputContent: {
    backgroundColor: "#222",
    width: "80%",
    borderRadius: 10,
    padding: 20,
  },
  numberInputTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  numberInput: {
    backgroundColor: "#333",
    color: "white",
    fontSize: 24,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#444",
  },
  submitButton: {
    
    backgroundColor: "#FFD700",
  },
  buttonText: {
    color: "#000000",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MoneyManagerScreen;