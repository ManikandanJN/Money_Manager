import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Icon name="user-circle" size={80} color="#ccc" />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>Sign In</Text>
          <Text style={styles.profileSubtitle}>Sign in, more exciting!</Text>
        </View>
      </View>

      {/* Menu Options */}
      <ScrollView>
        <View style={styles.menuContainer}>
          {/* Premium Member */}
          <TouchableOpacity style={styles.premiumContainer}>
            <Ionicons name="crown-outline" size={22} color="gold" />
            <Text style={styles.premiumText}>Premium Member</Text>
            <MaterialIcon name="keyboard-arrow-right" size={24} color="gray" style={styles.arrowIcon} />
          </TouchableOpacity>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                {item.iconType === "Ionicons" ? (
                  <Ionicons name={item.icon} size={22} color="#FFD700" />
                ) : (
                  <Icon name={item.icon} size={22} color="#FFD700" />
                )}
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <MaterialIcon name="keyboard-arrow-right" size={24} color="gray" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Menu Items Data
const menuItems = [
  { title: "Recommend to friends", icon: "thumbs-up", iconType: "FontAwesome" },
  { title: "Rate the app", icon: "star", iconType: "FontAwesome" },
  { title: "Block Ads", icon: "ban", iconType: "FontAwesome" },
  { title: "Garden", icon: "leaf", iconType: "FontAwesome" },
  { title: "Settings", icon: "settings-outline", iconType: "Ionicons" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 30,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  profileTextContainer: {
    marginLeft: 15,
  },
  profileName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileSubtitle: {
    color: "#aaa",
    fontSize: 14,
  },
  menuContainer: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 15,
    borderRadius: 12,
    paddingVertical: 10,
  },
  premiumContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  premiumText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
  arrowIcon: {
    marginLeft: "auto",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 15,
  },
});

export default ProfileScreen;
