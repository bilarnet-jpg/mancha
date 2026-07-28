import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { Colors, Spacing, Radius } from '../theme';

function Btn({ title, onPress, loading = false }: any) {
  return (
    <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.85} style={{ borderRadius: Radius.lg, overflow: 'hidden' }}>
      <LinearGradient colors={Colors.gradientPrimary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btn}>
        {loading ? <ActivityIndicator color={Colors.textInverse} /> : <Text style={styles.btnText}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function LoginScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => { clearError(); }, []);

  return (
    <LinearGradient colors={['#050505', '#0a1a0a', '#050505']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]} keyboardShouldPersistTaps="handled">
          <View style={styles.logoArea}>
            <View style={styles.logoRing}>
              <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.appName}>MANCHA CARNAVAL</Text>
            <Text style={styles.appSub}>Plataforma Oficial · Mancha Verde</Text>
          </View>

          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.sub}>Acesse sua conta da comunidade</Text>

          {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

          <Text style={styles.label}>E-mail</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="seu@email.com" placeholderTextColor={Colors.textMuted} style={styles.input} keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.label}>Senha</Text>
          <View style={{ position: 'relative', justifyContent: 'center' }}>
            <TextInput value={password} onChangeText={setPassword} placeholder="Digite sua senha" placeholderTextColor={Colors.textMuted} style={[styles.input, { paddingRight: 48 }]} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14 }}>
              <Text style={{ fontSize: 16 }}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-end', marginBottom: Spacing.base }}>
            <Text style={{ color: Colors.primary, fontSize: 13 }}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <Btn title="Entrar na Mancha" loading={isLoading} onPress={() => login(email, password)} />

          <View style={styles.divRow}>
            <View style={styles.divLine} /><Text style={styles.divText}>ou</Text><View style={styles.divLine} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.outlineBtn}>
            <Text style={styles.outlineBtnText}>Criar conta gratuita</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

export function RegisterScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  useEffect(() => { clearError(); }, []);

  const handleRegister = async () => {
    const result = await register(email, password, name);
    if (result && result.needsEmailConfirmation) {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <LinearGradient colors={['#050505', '#0a1a0a', '#050505']} style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Image source={require('../../assets/images/novo-logo.png')} style={{ width: 100, height: 100, marginBottom: 20 }} resizeMode="contain" />
          <Text style={{ fontSize: 22, color: '#fff', fontWeight: '800', textAlign: 'center', marginBottom: 12 }}>Verifique seu email!</Text>
          <Text style={{ fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 30 }}>
            Enviamos um link de confirmação para {'\n'}<Text style={{ color: Colors.primary, fontWeight: '700' }}>{email}</Text>.{'\n\n'}
            Clique no link para ativar sua conta e depois volte para fazer login.
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ paddingVertical: 14, paddingHorizontal: 28, borderRadius: 50, borderWidth: 1, borderColor: Colors.primary }}>
            <Text style={{ color: Colors.primary, fontWeight: '700' }}>Ir para o Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#050505', '#0a1a0a', '#050505']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.xl }}>
            <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
          </TouchableOpacity>

          <View style={styles.logoArea}>
            <View style={styles.logoRing}>
              <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
          </View>

          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.sub}>Junte-se à Mancha Carnaval</Text>

          {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

          <Text style={styles.label}>Nome completo</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Como quer ser chamado(a)" placeholderTextColor={Colors.textMuted} style={styles.input} autoCapitalize="words" />

          <Text style={styles.label}>E-mail</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="seu@email.com" placeholderTextColor={Colors.textMuted} style={styles.input} keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.label}>Senha</Text>
          <View style={{ position: 'relative', justifyContent: 'center' }}>
            <TextInput value={password} onChangeText={setPassword} placeholder="Mínimo 6 caracteres" placeholderTextColor={Colors.textMuted} style={[styles.input, { paddingRight: 48 }]} secureTextEntry={!showPasswordRegister} />
            <TouchableOpacity onPress={() => setShowPasswordRegister(!showPasswordRegister)} style={{ position: 'absolute', right: 14 }}>
              <Text style={{ fontSize: 16 }}>{showPasswordRegister ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: Spacing.sm }}>
            <Btn title="Criar minha conta" loading={isLoading} onPress={handleRegister} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ alignItems: 'center', marginTop: Spacing.xl }}>
            <Text style={{ fontSize: 14, color: Colors.textSecondary }}>Já tem conta? <Text style={{ color: Colors.primary }}>Entrar</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

export function ForgotPasswordScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { resetPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <LinearGradient colors={['#050505', '#0a1a0a', '#050505']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: Spacing.xl }}>
          <Text style={{ color: Colors.primary, fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
        {!sent ? (
          <>
            <Text style={styles.title}>Recuperar senha</Text>
            <Text style={styles.sub}>Enviaremos um link para seu e-mail.</Text>
            <Text style={styles.label}>E-mail</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="seu@email.com" placeholderTextColor={Colors.textMuted} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
            <View style={{ marginTop: Spacing.sm }}>
              <Btn title="Enviar link" loading={isLoading} onPress={async () => { await resetPassword(email); setSent(true); }} />
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 60, gap: 16 }}>
            <Text style={{ fontSize: 64 }}>✅</Text>
            <Text style={styles.title}>E-mail enviado!</Text>
            <Text style={[styles.sub, { textAlign: 'center' }]}>Verifique sua caixa de entrada.</Text>
            <Btn title="Voltar para o login" onPress={() => navigation.navigate('Login')} />
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: 60, flexGrow: 1 },
  logoArea: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoRing: { width: 130, height: 130, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logo: { width: 130, height: 130 },
  appName: { fontSize: 20, color: Colors.textPrimary, letterSpacing: 3, textAlign: 'center', fontWeight: '700' },
  appSub: { fontSize: 11, color: Colors.textMuted, letterSpacing: 2, marginTop: 4 },
  title: { fontSize: 26, color: Colors.textPrimary, marginBottom: 6, fontWeight: '700' },
  sub: { fontSize: 13, color: Colors.textSecondary, marginBottom: Spacing.xl },
  errorBox: { backgroundColor: 'rgba(255,77,79,0.12)', borderWidth: 1, borderColor: 'rgba(255,77,79,0.4)', borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.base },
  errorText: { fontSize: 13, color: Colors.error },
  label: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, height: 52, paddingHorizontal: Spacing.base, fontSize: 15, color: Colors.textPrimary, marginBottom: Spacing.md },
  btn: { height: 52, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 15, color: Colors.textInverse, fontWeight: '700' },
  divRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginVertical: Spacing.base },
  divLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  divText: { fontSize: 13, color: Colors.textMuted },
  outlineBtn: { height: 52, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.primary, borderRadius: Radius.lg },
  outlineBtnText: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
  bonusBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,215,0,0.08)', borderWidth: 1, borderColor: Colors.goldBorder, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.xl },
});
