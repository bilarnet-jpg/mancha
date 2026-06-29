import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
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
import ReelsViewerScreen from '../screens/community/ReelsViewerScreen';
import MinhaHistoriaScreen from '../screens/historia/MinhaHistoriaScreen';
import { TimelineScreen, ParadesScreen, AchievementsScreen } from '../screens/historia/TimelineAndParadesScreens';
import { WrappedScreen, FutureLetterScreen } from '../screens/historia/WrappedAndLetterScreens';
import CardsScreen from '../screens/cards/CardsScreen';
import CreateCardScreen from '../screens/cards/CreateCardScreen';
import { CertificatesScreen, TributesScreen, MyCardsScreen } from '../screens/cards/CertificatesAndTributesScreens';
import SocioScreen from '../screens/socio/SocioScreen';
import { MemberCardScreen, PlansScreen, PremiumContentScreen, MemberHistoryScreen } from '../screens/socio/MemberCardAndPlansScreens';
import PixPaymentSocioScreen from '../screens/socio/PixPaymentSocioScreen';
import AvenidaScreen from '../screens/avenida/AvenidaScreen';
import SambaVideoScreen from '../screens/avenida/SambaVideoScreen';
import AlaShowScreen from '../screens/alashow/AlaShowScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminFinanceiro from '../screens/admin/AdminFinanceiro';
import AdminModeracao from '../screens/admin/AdminModeracao';
import AdminUsuarios from '../screens/admin/AdminUsuarios';
import AdminAlaShow from '../screens/admin/AdminAlaShow';
import AdminComunicados from '../screens/admin/AdminComunicados';
import AdminMemberships from '../screens/admin/AdminMemberships';
import AdminScanner from '../screens/admin/AdminScanner';
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
const SocioStack = createNativeStackNavigator();
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

// Cartões, Minha História e Avenida só existem aqui dentro do HomeStack —
// não devem ser duplicados em nenhum outro stack/tab para evitar
// ambiguidade de navegação ao usar a tab bar.
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
      <HomeStack.Screen name="Avenida" component={AvenidaScreen} />
      <HomeStack.Screen name="SambaVideo" component={SambaVideoScreen} />
      <HomeStack.Screen name="AlaShow" component={AlaShowScreen} />
      <HomeStack.Screen name="AdminDashboard" component={AdminDashboard} />
      <HomeStack.Screen name="AdminFinanceiro" component={AdminFinanceiro} />
      <HomeStack.Screen name="AdminModeracao" component={AdminModeracao} />
      <HomeStack.Screen name="AdminUsuarios" component={AdminUsuarios} />
      <HomeStack.Screen name="AdminAlaShow" component={AdminAlaShow} />
      <HomeStack.Screen name="AdminComunicados" component={AdminComunicados} />
      <HomeStack.Screen name="AdminScanner" component={AdminScanner} />
      <HomeStack.Screen name="AdminMemberships" component={AdminMemberships} />
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
      <CommunityStack.Screen
        name="ReelsViewer"
        component={ReelsViewerScreen}
        options={{ presentation: 'fullScreenModal', animation: 'fade' }}
      />
    </CommunityStack.Navigator>
  );
}

function SocioNavigator() {
  return (
    <SocioStack.Navigator screenOptions={{ headerShown: false }}>
      <SocioStack.Screen name="SocioMain" component={SocioScreen} />
      <SocioStack.Screen name="MemberCard" component={MemberCardScreen} />
      <SocioStack.Screen name="Plans" component={PlansScreen} />
      <SocioStack.Screen name="PremiumContent" component={PremiumContentScreen} />
      <SocioStack.Screen name="MemberHistory" component={MemberHistoryScreen} />
      <SocioStack.Screen name="PixPaymentSocio" component={PixPaymentSocioScreen} />
    </SocioStack.Navigator>
  );
}

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const LABELS: Record<string, string> = {
    HomeTab: 'Início', AgendaTab: 'Agenda',
    ManchaTab: 'Mancha', LojaTab: 'Loja', SocioTab: 'Sócio',
  };
  const EMOJIS: Record<string, string> = {
    HomeTab: '🏠', AgendaTab: '📅', LojaTab: '🛍️', SocioTab: '👑',
  };

  return (
    <View style={[styles.navWrap, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
      <BlurView intensity={45} tint="dark" style={[StyleSheet.absoluteFillObject, { borderRadius: Radius.full, overflow: 'hidden' }]} />
      <View style={styles.navTint} />
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const isCentral = route.name === 'ManchaTab';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isCentral) {
            return (
              <TouchableOpacity key={route.key} onPress={onPress} style={styles.centerWrap}>
                <Image source={require('../../assets/images/novo-logo.png')} style={styles.centerLogo} resizeMode="contain" />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem}>
              <Text style={[styles.iconEmoji, { opacity: isFocused ? 1 : 0.4 }]}>{EMOJIS[route.name] ?? '🏠'}</Text>
              <Text style={[styles.label, isFocused && styles.labelActive]}>{LABELS[route.name]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate('HomeTab', { screen: 'HomeMain' });
          },
        })}
      />
      <Tab.Screen name="AgendaTab" component={AgendaNavigator} />
      <Tab.Screen name="ManchaTab" component={CommunityNavigator} />
      <Tab.Screen name="LojaTab" component={StoreNavigator} />
      <Tab.Screen name="SocioTab" component={SocioNavigator} />
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
  navWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  navTint: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(13, 40, 24, 0.4)',
  },
  bar: { flexDirection: 'row', alignItems: 'center', paddingTop: 12, paddingHorizontal: 8 },
  tabItem: { flex: 1, alignItems: 'center', gap: 4 },
  iconEmoji: { fontSize: 19 },
  label: { fontSize: 10, color: 'rgba(255,255,255,0.45)' },
  labelActive: { color: Colors.primaryBright, fontWeight: '700' },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerLogo: {
    width: 72, height: 72,
    marginTop: -28,
  },
});
