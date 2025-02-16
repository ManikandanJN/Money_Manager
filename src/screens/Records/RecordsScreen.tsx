import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Animated
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { deleteTransaction } from '../../Redux/transactionSlice';
import CalendarModal from './CalendarModal';

const RecordsScreen = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.transaction.expenses);
  const incomes = useSelector((state) => state.transaction.incomes);

  // Filter expenses based on search query
  const filteredExpenses = expenses.filter(expense => 
    expense.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.amount?.toString().includes(searchQuery)
  );

  const expensesAmount = filteredExpenses.filter(item => item.type === "expense");
  const incomeAmount = filteredExpenses.filter(item => item.type === "income");
  
  const totalExpense = expensesAmount.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = incomeAmount.reduce((sum, item) => sum + item.amount, 0);
  const deleteItem = (rowKey) => {
    dispatch(deleteTransaction(rowKey));
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.toLocaleString("en-US", { month: "short" }); // "Jan", "Feb", etc.
const day = currentDate.toLocaleString("en-US", { weekday: "long" }); // "Monday", "Tuesday", etc.
const date = currentDate.getDate(); // 1, 2, ..., 31
const month = currentDate.toLocaleString("en-US", { month: "short" }); 

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
  
  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
      {renderIcon(item.icon, item.iconType)}
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={[styles.amountText, { color: item.type ==="expense" ? '#FF4C4C' : '#fff' }]}>
        { item.type ==="expense" ?  '-'+item.amount :  item.amount}
      </Text>
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => deleteItem(data.item.id)}
      >
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.cancelButton]}
        onPress={() => rowMap[data.item.id]?.closeRow()}
      >
        <Text style={styles.actionText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" />

      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.topHeader}>
            <TouchableOpacity>
              <Feather name="menu" size={25} color="#fff" />
            </TouchableOpacity>
            
            {isSearchVisible ? (
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search transactions..."
                  placeholderTextColor="#8E8E93"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                <TouchableOpacity onPress={toggleSearch}>
                  <Feather name="x" size={25} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.headerTitle}>Money Tracker</Text>
                <View style={styles.headerRight}>
                  <TouchableOpacity style={{ marginRight: 10 }} onPress={toggleSearch}>
                    <Feather name="search" size={25} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Feather name="calendar" size={25} color="#fff" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
            <Text style={styles.yearText}>{currentYear}</Text>
              <TouchableOpacity style={styles.monthContainer}>
              <Text style={styles.monthText}>{currentMonth}</Text>
                <Feather name="chevron-down" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Expenses</Text>
              <Text style={styles.statValue}>{totalExpense}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={styles.statValue}>{totalIncome}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Balance</Text>
              <Text style={styles.statValue}>{totalIncome - totalExpense}</Text>
            </View>
          </View>
        </View>

        {/* Date & Summary Section */}
        {filteredExpenses.length > 0 && (
        <View style={styles.header}>
        <Text style={styles.dateText}>{`${date} ${month}`}</Text>
        <Text style={styles.dayText}>{day}</Text>
        <View style={styles.expenseIncome}>
          <Text style={styles.summaryText}>{'Expenses : ' + totalExpense}</Text>
          <Text style={styles.summaryText}> {'Income : ' + totalIncome}</Text>
        </View>
      </View>
        )}

        {/* Swipeable List */}
        {filteredExpenses.length > 0 ? (
          <SwipeListView
            data={filteredExpenses.slice().reverse()}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-160}
            disableRightSwipe={true}
            stopRightSwipe={-160}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="insert-chart" size={55} color={'gray'} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No matching transactions' : 'No records'}
            </Text>
          </View>
        )}
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C1E'
  },
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },

  headerContainer: {
    backgroundColor: '#1C1C1E',
    paddingBottom: 12
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 5
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    color: '#FFFFFF',
    fontSize: 16
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333333'
  },
  statItem: {
    flex: 1,
    alignItems: 'flex-start'
  },
  yearText: {
    color: '#FFFFFF',
    fontSize: 15
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  monthText: {
    color: '#FFFFFF',
    fontSize: 15,
    marginRight: 4
  },
  statLabel: {
    color: '#8E8E93',
    fontSize: 14
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500'
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#333',
    borderBottomWidth: 0.5
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  dayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  expenseIncome: {
    flexDirection: 'row',
    gap: 12
  },
  summaryText: {
    color: '#fff',
    fontSize: 14
  },
  listContainer: {
    paddingBottom: 20
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#000000',
    borderBottomColor: '#333',
    borderBottomWidth: 0.5
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  categoryName: {
    color: '#fff',
    fontSize: 16,
    flex: 1
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600'
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#1C1C1E',
    paddingRight: 10
  },
  actionButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  deleteButton: {
    backgroundColor: 'red'
  },
  cancelButton: {
    backgroundColor: 'gray'
  },
  actionText: {
    color: '#fff',
    fontWeight: '600'
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#666666',
    fontSize: 15,
    marginTop: 8
  },
});

export default RecordsScreen;
