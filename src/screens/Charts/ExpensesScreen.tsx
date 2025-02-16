import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ExpensesScreen = () => {
  const [viewType, setViewType] = useState('Month');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState('expense');
  const transactions = useSelector((state) => state.transaction.expenses);

  // Filter transactions based on selected type
  const filteredTransactions = transactions.filter(item =>
    selectedType.toLowerCase() === item.type
  );

  // Calculate total amount
  const totalAmount = filteredTransactions.reduce((sum, item) => sum + item.amount, 0);

  // Generate chart data
  const chartData = filteredTransactions.map(item => ({
    name: item.name,
    percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0,
    amount: item.amount,
    icon: item.icon,
    iconType: item.iconType,
    color: item.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  }));

  const renderIcon = (icon, iconType, size = 30, color = "#666") => {
    switch (iconType) {
      case "Ionicons":
        return <Ionicons name={icon} size={size} color={color} />;
      case "FontAwesome":
        return <FontAwesome name={icon} size={size} color={color} />;
      default:
        return null;
    }
  };

  const lineData = {
    labels: filteredTransactions.map(item => item.name),
    datasets: [{
      data: filteredTransactions.map(item => item.amount),
      color: () => `#007AFF`,
      strokeWidth: 2,
    }],
  };


  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseHeader}>
        <View style={styles.categoryWrapper}>
          <View style={[styles.iconContainer]}>
            {renderIcon(item.icon, item.iconType)}
          </View>
          <Text style={styles.categoryText}>
            {item.name} {item.percentage.toFixed(2)}%
          </Text>
        </View>
        <Text style={styles.amountText}>₹{item.amount}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
      </View>
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: '#000' }}>
      <SafeAreaView style={styles.container}>
        {/* Header with Dropdown */}
        <TouchableOpacity
          style={styles.header}
          onPress={() => setShowDropdown(true)}
        >
          <Text style={styles.headerTitle}>{selectedType} ▼</Text>
        </TouchableOpacity>

        {/* Dropdown Modal */}
        <Modal
          visible={showDropdown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDropdown(false)}
          >
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedType('expense');
                  setShowDropdown(false);
                }}
              >
                <Text style={[styles.dropdownText, selectedType === 'expense' && styles.selectedDropdownText]}>
                  Expenses
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedType('income');
                  setShowDropdown(false);
                }}
              >
                <Text style={[styles.dropdownText, selectedType === 'income' && styles.selectedDropdownText]}>
                  Income
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Toggle Buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewType === 'Month' && styles.activeToggle]}
            onPress={() => setViewType('Month')}
          >
            <Text style={[styles.toggleText, viewType === 'Month' && styles.activeToggleText]}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewType === 'Year' && styles.activeToggle]}
            onPress={() => setViewType('Year')}
          >
            <Text style={[styles.toggleText, viewType === 'Year' && styles.activeToggleText]}>Year</Text>
          </TouchableOpacity>
        </View>

        {/* Pie Chart */}
        {chartData.length > 0 && (
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData.map(item => ({
                name: item.name,
                population: parseFloat(item.percentage.toFixed(2)),
                color: item.color,
                legendFontColor: '#FFFFFF',
                legendFontSize: 14,
              }))}
              width={screenWidth * 0.85}
              height={screenHeight * 0.3}
              chartConfig={{
                backgroundColor: '#000',
                backgroundGradientFrom: '#000',
                backgroundGradientTo: '#000',
                color: () => `#FFFFFF`,
              }}
              accessor={'population'}
              backgroundColor={'transparent'}
              paddingLeft={'20'}
              absolute
            />
            <Text style={styles.totalAmount}>₹{totalAmount}</Text>
          </View>
        )}

        {chartData.length > 0 && (
          <View style={styles.chartContainer}>
            <LineChart
              data={lineData}
              width={screenWidth * 0.85}
              height={220}
              chartConfig={{
                backgroundColor: '#000',
                backgroundGradientFrom: '#1A1A1A',
                backgroundGradientTo: '#000',
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              bezier
              style={{ borderRadius: 8, marginVertical: 20 }}
            />
          </View>
        )}
        {/* Transaction List */}
        {chartData.length > 0 && (
          <FlatList
            data={chartData}
            keyExtractor={(item) => item.name}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
        {chartData.length === 0 && (
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyContainer}>
              <MaterialIcons name="insert-chart" size={55} color={'gray'} />
              <Text style={styles.emptyText}>No records</Text>
            </View>
          </View>
        )}


      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight - 200, // Adjust based on header/footer height
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666666',
    fontSize: 15,
    marginTop: 8
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  dropdownContainer: {
    backgroundColor: '#1A1A1A',
    marginTop: 60,
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedDropdownText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    marginHorizontal: 20,
    padding: 2,
    height: 36,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#FFFFFF',
  },
  toggleText: {
    color: '#808080',
    fontWeight: '500',
    fontSize: 15,
  },
  activeToggleText: {
    color: '#000000',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  totalAmount: {
    position: 'absolute',
    top: '45%',
    left: "28%",
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 20,
  },
  expenseItem: {
    marginBottom: 24,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  amountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});

export default ExpensesScreen;