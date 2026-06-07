import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '../screens/AuthScreens';
import HomeScreen from '../screens/HomeScreen';
import EventsScreen from '../screens/events/EventsScreen';
import EventDetailScreen from '../screens/events/EventDetailScreen';
import PixPaymentScreen from '../screens/tickets/PixPaymentScreen';
import TicketSuccessScreen from '../screens/tickets/TicketSuccessScreen';
import MyTicketsScreen from '../screens/tickets/MyTicketsScreen';
import { Colors, Radius } from '../theme';

const Placeholder = ({ name }: { name: string }) => (
  <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 36, marginBottom: 12 }}>🚧</Text>
    <Text style={{ fontSize: 16, color: Colors.textPrimary, fontWeight: '600' }}>{name}</Text>
    <Text style={{ fontSize: 13, color: Colors.textMuted, marginTop: 6 }}>Em breve</Text>
  </View>
);

const AuthStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const AgendaStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="MyTickets" component={MyTicketsScreen} />
    </HomeStack.Navigator>
  );
}

function AgendaNavigator() {
  return (
    <AgendaStack.Navigator screenOptions={{ headerShown: false }}>
      <AgendaStack.Screen name="EventsList" component={EventsScreen} />
      <AgendaStack.Screen name="EventDetail" component={EventDetailScreen} />
      <AgendaStack.Screen name="PixPayment" component={PixPaymentScreen} />
      <AgendaStack.Screen name="TicketSuccess" component={TicketSuccessScreen} />
      <AgendaStack.Screen name="MyTickets" component={MyTicketsScreen} />
    </AgendaStack.Navigator>
  );
}

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const LABELS: Record<string, string> = {
    HomeTab: 'Início', SambasTab: 'Sambas',
    ManchaTab: 'Mancha', AgendaTab: 'Agenda', PerfilTab: 'Perfil',
  };
  const EMOJIS: Record<string, string> = {
    HomeTab: '🏠', SambasTab: '🎵', AgendaTab: '📅', PerfilTab: '👤',
  };

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 4 }]}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const isCentral = route.name === 'ManchaTab';
        const onPress = () => navigation.navigate(route.name);

        if (isCentral) {
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.centerWrap}>
              <View style={[styles.centerBtn, { borderColor: isFocused ? Colors.primary : Colors.border }]}>
                <Image source={require('../../assets/images/logo.png')} style={styles.centerLogo} resizeMode="contain" />
              </View>
              <Text style={[styles.label, isFocused && styles.labelActive]}>Mancha</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem}>
            <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
              <Text style={{ fontSize: 20 }}>{EMOJIS[route.name] ?? '🏠'}</Text>
            </View>
            <Text style={[styles.label, isFocused && styles.labelActive]}>{LABELS[route.name]}</Text>
            {isFocused && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeNavigator} />
      <Tab.Screen name="SambasTab" component={() => <Placeholder name="Sambas-Enredo" />} />
      <Tab.Screen name="ManchaTab" component={() => <Placeholder name="Comunidade" />} />
      <Tab.Screen name="AgendaTab" component={AgendaNavigator} />
      <Tab.Screen name="PerfilTab" component={() => <Placeholder name="Perfil" />} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated } = useAuthStore();
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {isAuthenticated
          ? <RootStack.Screen name="Main" component={MainNavigator} />
          : <RootStack.Screen name="Auth" component={AuthNavigator} />
        }
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#0E0E0E', borderTopWidth: 1, borderTopColor: '#1A1A1A', paddingTop: 10, paddingHorizontal: 4, alignItems: 'flex-start' },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: 'rgba(0,255,133,0.12)' },
  label: { fontSize: 10, color: '#505050' },
  labelActive: { color: Colors.primary, fontWeight: '600' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  centerWrap: { flex: 1, alignItems: 'center', gap: 3, marginTop: -16 },
  centerBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#0d3d1a', borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  centerLogo: { width: 34, height: 34 },
});
