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
import StoreScreen from '../screens/store/StoreScreen';
import ProductDetailScreen from '../screens/store/product/ProductDetailScreen';
import CartScreen from '../screens/store/cart/CartScreen';
import { StorePixPaymentScreen, OrderSuccessScreen, MyOrdersScreen } from '../screens/store/orders/StoreOrderScreens';
import CommunityScreen from '../screens/community/CommunityScreen';
import { PostDetailScreen, SubmitPostScreen, RankingScreen } from '../screens/community/PostScreens';
import MinhaHistoriaScreen from '../screens/historia/MinhaHistoriaScreen';
import { TimelineScreen, ParadesScreen, AchievementsScreen } from '../screens/historia/TimelineAndParadesScreens';
import { WrappedScreen, FutureLetterScreen } from '../screens/historia/WrappedAndLetterScreens';
import CardsScreen from '../screens/cards/CardsScreen';
import CreateCardScreen from '../screens/cards/CreateCardScreen';
import { CertificatesScreen, TributesScreen, MyCardsScreen } from '../screens/cards/CertificatesAndTributesScreens';
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
const StoreStack = createNativeStackNavigator();
const CommunityStack = createNativeStackNavigator();
const CardsStack = createNativeStackNavigator();
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
      <HomeStack.Screen name="MyOrders" component={MyOrdersScreen} />
      <HomeStack.Screen name="MinhaHistoria" component={MinhaHistoriaScreen} />
      <HomeStack.Screen name="Timeline" component={TimelineScreen} />
      <HomeStack.Screen name="Parades" component={ParadesScreen} />
      <HomeStack.Screen name="Achievements" component={AchievementsScreen} />
      <HomeStack.Screen name="Wrapped" component={WrappedScreen} />
      <HomeStack.Screen name="FutureLetter" component={FutureLetterScreen} />
      <HomeStack.Screen name="CardsMain" component={CardsScreen} />
      <HomeStack.Screen name="CreateCard" component={CreateCardScreen} />
      <HomeStack.Screen name="MyCards" component={MyCardsScreen} />
      <HomeStack.Screen name="Certificates" component={CertificatesScreen} />
      <HomeStack.Screen name="Tributes" component={TributesScreen} />
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

function StoreNavigator() {
  return (
    <StoreStack.Navigator screenOptions={{ headerShown: false }}>
      <StoreStack.Screen name="StoreMain" component={StoreScreen} />
      <StoreStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <StoreStack.Screen name="Cart" component={CartScreen} />
      <StoreStack.Screen name="StorePixPayment" component={StorePixPaymentScreen} />
      <StoreStack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <StoreStack.Screen name="MyOrders" component={MyOrdersScreen} />
    </StoreStack.Navigator>
  );
}

function CommunityNavigator() {
  return (
    <CommunityStack.Navigator screenOptions={{ headerShown: false }}>
      <CommunityStack.Screen name="CommunityMain" component={CommunityScreen} />
      <CommunityStack.Screen name="PostDetail" component={PostDetailScreen} />
      <CommunityStack.Screen name="SubmitPost" component={SubmitPostScreen} />
      <CommunityStack.Screen name="Ranking" component={RankingScreen} />
    </CommunityStack.Navigator>
  );
}

function CardsNavigator() {
  return (
    <CardsStack.Navigator screenOptions={{ headerShown: false }}>
      <CardsStack.Screen name="CardsMain" component={CardsScreen} />
      <CardsStack.Screen name="CreateCard" component={CreateCardScreen} />
      <CardsStack.Screen name="MyCards" component={MyCardsScreen} />
      <CardsStack.Screen name="Certificates" component={CertificatesScreen} />
      <CardsStack.Screen name="Tributes" component={TributesScreen} />
    </CardsStack.Navigator>
  );
}

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const LABELS: Record<string, string> = {
    HomeTab: 'Início', AgendaTab: 'Agenda',
    ManchaTab: 'Mancha', LojaTab: 'Loja', CardsTab: 'Cartões',
  };
  const EMOJIS: Record<string, string> = {
    HomeTab: '🏠', AgendaTab: '📅', LojaTab: '🛍️', CardsTab: '💌',
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
      <Tab.Screen name="AgendaTab" component={AgendaNavigator} />
      <Tab.Screen name="ManchaTab" component={CommunityNavigator} />
      <Tab.Screen name="LojaTab" component={StoreNavigator} />
      <Tab.Screen name="CardsTab" component={CardsNavigator} />
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
