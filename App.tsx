
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';

import { auth, db } from './firebaseConfig';
import { addDoc, collection, onSnapshot, query, updateDoc, doc, where, serverTimestamp } from 'firebase/firestore';
import AtividadesScreen, { type AtividadeSalva } from './screens/AtividadesScreen';
import NovaAtividadeScreen from './screens/NovaAtividadeScreen';
import DetalhesAtividadeScreen from './screens/DetalhesAtividadeScreen';

export default function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [cadastro, setCadastro] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [erro, setErro] = useState('');
  const [telaAtual, setTelaAtual] = useState<'home' | 'atividades' | 'novaAtividade' | 'detalhes'>('home');
  const [atividades, setAtividades] = useState<AtividadeSalva[]>([]);
  const [atividadeSelecionadaId, setAtividadeSelecionadaId] = useState<string | null>(null);
  const [carregandoAtividades, setCarregandoAtividades] = useState(false);
  const [erroAtividades, setErroAtividades] = useState('');

  useEffect(() => {
    const cancelar = onAuthStateChanged(
      auth,
      (user) => {
        setUsuario(user);
        setCarregando(false);
      },
      (error) => {
        console.log('Erro de autenticação:', error);
        setErro('Erro ao verificar a sessão.');
        setCarregando(false);
      }
    );

    return cancelar;
  }, []);

  useEffect(() => {
    if (!usuario) {
      setAtividades([]);
      setErroAtividades('');
      return;
    }
    setCarregandoAtividades(true);
    const consulta = query(collection(db, 'atividades'), where('usuarioId', '==', usuario.uid));
    const cancelar = onSnapshot(consulta, (resultado) => {
      setAtividades(resultado.docs.map((item) => ({
        id: item.id,
        titulo: item.data().titulo || '',
        materia: item.data().materia || '',
        tipo: item.data().tipo || 'Tarefa',
        dataEntrega: item.data().dataEntrega || '',
        prioridade: item.data().prioridade || 'Média',
        descricao: item.data().descricao || '',
        concluida: item.data().concluida === true,
      })));
      setCarregandoAtividades(false);
      setErroAtividades('');
    }, (error) => {
      console.error('Erro ao listar atividades:', error);
      setErroAtividades('Não foi possível carregar as atividades. Confira a conexão e as regras do Firestore.');
      setCarregandoAtividades(false);
    });
    return cancelar;
  }, [usuario?.uid]);

  async function alternarConclusao(atividade: AtividadeSalva) {
    try {
      await updateDoc(doc(db, 'atividades', atividade.id), { concluida: !atividade.concluida });
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a atividade.');
    }
  }

  function alternarCadastro() {
    setCadastro((anterior) => !anterior);
    setSenha('');
    setConfirmarSenha('');
    setNome('');
    setErro('');
  }

  function traduzirErroFirebase(codigo: string) {
    switch (codigo) {
      case 'auth/email-already-in-use':
        return 'Este e-mail já está cadastrado. Faça login.';

      case 'auth/invalid-email':
        return 'Digite um e-mail válido.';

      case 'auth/weak-password':
        return 'Sua senha é muito fraca.';

      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'E-mail ou senha incorretos.';

      case 'auth/network-request-failed':
        return 'Verifique sua conexão com a internet.';

      case 'auth/operation-not-allowed':
        return 'O cadastro por e-mail não está habilitado no Firebase.';

      case 'auth/too-many-requests':
        return 'Muitas tentativas. Aguarde alguns minutos.';

      default:
        return `Erro ao autenticar: ${codigo || 'desconhecido'}`;
    }
  }

  async function autenticar() {
    setErro('');

    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      setErro('Digite um e-mail válido.');
      return;
    }

    if (cadastro && !nome.trim()) {
      setErro('Digite seu nome completo.');
      return;
    }

    if (cadastro && senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (cadastro && senha !== confirmarSenha) {
      setErro('As senhas não são iguais.');
      return;
    }

    setEnviando(true);

    try {
      if (cadastro) {
        const credencial = await createUserWithEmailAndPassword(
          auth,
          emailLimpo,
          senha
        );
        await updateProfile(credencial.user, { displayName: nome.trim() });
        setUsuario({ ...credencial.user } as User);
      } else {
        await signInWithEmailAndPassword(
          auth,
          emailLimpo,
          senha
        );
      }

      setSenha('');
      setConfirmarSenha('');
      setNome('');
    } catch (error: any) {
      console.log(
        'Erro Firebase:',
        error?.code,
        error?.message
      );

      setErro(
        traduzirErroFirebase(error?.code || '')
      );
    } finally {
      setEnviando(false);
    }
  }

  async function sair() {
    try {
      await signOut(auth);

      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setNome('');
      setCadastro(false);
      setTelaAtual('home');
      setErro('');
    } catch (error) {
      console.log('Erro ao sair:', error);
      Alert.alert(
        'Erro',
        'Não foi possível sair da conta.'
      );
    }
  }

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
        />

        <Text style={styles.loadingText}>
          Carregando StudyFlow...
        </Text>
      </View>
    );
  }

  if (usuario) {
    if (telaAtual === 'novaAtividade') {
      return (
        <NovaAtividadeScreen
          onVoltar={() => setTelaAtual('atividades')}
          onSalvar={async (atividade) => {
            await addDoc(collection(db, 'atividades'), {
              ...atividade,
              usuarioId: usuario.uid,
              concluida: false,
              criadoEm: serverTimestamp(),
            });
            setTelaAtual('atividades');
          }}
        />
      );
    }

    if (telaAtual === 'detalhes') {
      const selecionada = atividades.find((item) => item.id === atividadeSelecionadaId);
      if (selecionada) {
        return (
          <DetalhesAtividadeScreen
            atividade={selecionada}
            onVoltar={() => setTelaAtual('atividades')}
            onAlternarConclusao={alternarConclusao}
          />
        );
      }
    }

    if (telaAtual === 'atividades') {
      return (
        <AtividadesScreen
          onVoltar={() => setTelaAtual('home')}
          onNovaAtividade={() => setTelaAtual('novaAtividade')}
          onVerDetalhes={(atividade) => { setAtividadeSelecionadaId(atividade.id); setTelaAtual('detalhes'); }}
          atividades={atividades}
          carregando={carregandoAtividades}
          erro={erroAtividades}
          onAlternarConclusao={alternarConclusao}
        />
      );
    }

    return (
      <ScrollView style={styles.home} contentContainerStyle={styles.homeContent}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F7FD" />

        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Ionicons name="layers-outline" size={23} color="#FFFFFF" />
            </View>
            <Text style={styles.homeTitle}>Study<Text style={styles.brandAccent}>Flow</Text></Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={sair} accessibilityLabel="Sair da conta">
            <Ionicons name="person-outline" size={21} color="#7353D8" />
          </TouchableOpacity>
        </View>

        <Text style={styles.eyebrow}>SEU ESPAÇO DE ESTUDOS</Text>
        <Text style={styles.welcome}>Olá, {usuario.displayName?.trim().split(/\s+/)[0] || 'estudante'}! 👋</Text>
        <Text style={styles.homeSubtitle}>Seu dia fica mais leve quando tudo está organizado.</Text>

        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles-outline" size={14} color="#EDE5FF" />
            <Text style={styles.heroBadgeText}>FOCO NO QUE IMPORTA</Text>
          </View>
          <Text style={styles.heroTitle}>Um passo de cada vez.{"\n"}Você consegue!</Text>
          <Text style={styles.heroSubtitle}>Planeje suas entregas e avance com tranquilidade.</Text>
          <TouchableOpacity style={styles.heroButton} onPress={() => setTelaAtual('novaAtividade')}>
            <Ionicons name="add-circle-outline" size={21} color="#5C3EB8" />
            <Text style={styles.heroButtonText}>Criar nova atividade</Text>
            <Ionicons name="arrow-forward" size={18} color="#5C3EB8" />
          </TouchableOpacity>
          <Ionicons name="school-outline" size={106} color="#947FE0" style={styles.heroDecoration} />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Meu planejamento</Text>
          <Text style={styles.sectionTag}>STUDYFLOW</Text>
        </View>

        <TouchableOpacity style={styles.featureCard} onPress={() => setTelaAtual('atividades')}>
          <View style={styles.featureIcon}>
            <Ionicons name="calendar-outline" size={27} color="#7353D8" />
          </View>
          <View style={styles.featureBody}>
            <Text style={styles.featureTitle}>Minhas atividades</Text>
            <Text style={styles.featureDescription}>Veja suas provas, tarefas e trabalhos em um só lugar.</Text>
          </View>
          <Ionicons name="chevron-forward" size={21} color="#9D92B9" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard} onPress={() => setTelaAtual('novaAtividade')}>
          <View style={[styles.featureIcon, styles.featureIconPink]}>
            <Ionicons name="create-outline" size={27} color="#CF65A0" />
          </View>
          <View style={styles.featureBody}>
            <Text style={styles.featureTitle}>Adicionar atividade</Text>
            <Text style={styles.featureDescription}>Anote um novo compromisso acadêmico.</Text>
          </View>
          <Ionicons name="chevron-forward" size={21} color="#9D92B9" />
        </TouchableOpacity>

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}><Ionicons name="bulb-outline" size={24} color="#B07B2E" /></View>
          <View style={styles.featureBody}>
            <Text style={styles.tipTitle}>Dica para hoje</Text>
            <Text style={styles.tipText}>Comece pela tarefa mais importante e faça pequenas pausas para manter o foco.</Text>
          </View>
        </View>

        <View style={styles.accountRow}>
          <Ionicons name="shield-checkmark-outline" size={17} color="#7C70A0" />
          <Text style={styles.accountText} numberOfLines={1}>{usuario.email}</Text>
        </View>
        <TouchableOpacity style={styles.signoutButton} onPress={sair}>
          <Ionicons name="log-out-outline" size={18} color="#7056BA" />
          <Text style={styles.signoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="#7455D8"
        />

        <View style={styles.logoContainer}>
          <Ionicons
            name="book-outline"
            size={75}
            color="#FFFFFF"
          />

          <Text style={styles.title}>
            StudyFlow
          </Text>

          <Text style={styles.subtitle}>
            Seus estudos organizados em um só lugar.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {cadastro
              ? 'Criar minha conta'
              : 'Entrar na minha conta'}
          </Text>

          {cadastro && (
            <>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome completo"
                placeholderTextColor="#999"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                editable={!enviando}
              />
            </>
          )}

          <Text style={styles.label}>
            E-mail
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!enviando}
          />

          <Text style={styles.label}>
            Senha
          </Text>

          <View style={styles.senhaContainer}>
            <TextInput
              style={styles.senhaInput}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
              editable={!enviando}
            />

            <TouchableOpacity
              onPress={() =>
                setMostrarSenha(!mostrarSenha)
              }
            >
              <Ionicons
                name={
                  mostrarSenha
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={22}
                color="#7455D8"
              />
            </TouchableOpacity>
          </View>

          {cadastro && (
            <>
              <Text style={styles.label}>
                Confirmar senha
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Digite a senha novamente"
                placeholderTextColor="#999"
                secureTextEntry={!mostrarSenha}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                editable={!enviando}
              />
            </>
          )}

          {erro !== '' && (
            <View style={styles.erroContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#B42318"
              />

              <Text style={styles.erroTexto}>
                {erro}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={autenticar}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {cadastro
                  ? 'Criar conta'
                  : 'Entrar'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={alternarCadastro}
            disabled={enviando}
          >
            <Text style={styles.register}>
              {cadastro
                ? 'Já tem uma conta? Entrar'
                : 'Não tem uma conta? Cadastre-se'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    backgroundColor: '#7455D8',
    justifyContent: 'center',
    padding: 30,
  },

  loading: {
    flex: 1,
    backgroundColor: '#7455D8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#FFFFFF',
    marginTop: 15,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
  },

  subtitle: {
    fontSize: 15,
    color: '#F0E9FF',
    textAlign: 'center',
    marginTop: 10,
  },

  form: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 25,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#35215E',
    marginBottom: 25,
    textAlign: 'center',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#35215E',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#F5F2FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 15,
    color: '#35215E',
  },

  senhaContainer: {
    backgroundColor: '#F5F2FA',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  senhaInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: '#35215E',
  },

  button: {
    backgroundColor: '#7455D8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  linkContainer: {
    paddingVertical: 16,
  },

  register: {
    textAlign: 'center',
    color: '#7455D8',
    fontWeight: '600',
  },

  erroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF0EF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  erroTexto: {
    flex: 1,
    color: '#B42318',
    fontSize: 13,
  },

  home: { flex: 1, backgroundColor: '#F8F7FD' },
  homeContent: { paddingHorizontal: 22, paddingTop: Platform.OS === 'web' ? 28 : 58, paddingBottom: 45, width: '100%', maxWidth: 720, alignSelf: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandIcon: { backgroundColor: '#7455D8', width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  homeTitle: { fontSize: 25, fontWeight: '800', color: '#30244D', letterSpacing: -0.8 },
  brandAccent: { color: '#7455D8' },
  avatar: { width: 43, height: 43, borderRadius: 22, backgroundColor: '#EDE7FF', alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 11, color: '#8B79B6', fontWeight: '800', letterSpacing: 1.6, marginBottom: 10 },
  welcome: { fontSize: 29, fontWeight: '800', color: '#30244D', letterSpacing: -0.8 },
  homeSubtitle: { fontSize: 15, color: '#827993', lineHeight: 22, marginTop: 9, marginBottom: 26 },
  heroCard: { backgroundColor: '#7455D8', borderRadius: 26, padding: 24, overflow: 'hidden', marginBottom: 29, position: 'relative' },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 19 },
  heroBadgeText: { fontSize: 10, color: '#F0E9FF', fontWeight: '800', letterSpacing: 1.2 },
  heroTitle: { fontSize: 25, fontWeight: '800', lineHeight: 32, color: '#FFFFFF', maxWidth: 320, zIndex: 1 },
  heroSubtitle: { fontSize: 13, color: '#E7DFFF', lineHeight: 19, marginTop: 10, maxWidth: 260, marginBottom: 22, zIndex: 1 },
  heroButton: { backgroundColor: '#FFFFFF', borderRadius: 13, paddingHorizontal: 14, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', gap: 9, alignSelf: 'flex-start', zIndex: 1 },
  heroButtonText: { fontSize: 13, color: '#5C3EB8', fontWeight: '800' },
  heroDecoration: { position: 'absolute', right: -12, top: 34, opacity: 0.28 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: '#35264F' },
  sectionTag: { color: '#A094C3', fontSize: 10, letterSpacing: 1.2, fontWeight: '800' },
  featureCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 19, marginBottom: 12, borderWidth: 1, borderColor: '#F0ECF7' },
  featureIcon: { backgroundColor: '#F0EBFF', width: 53, height: 53, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  featureIconPink: { backgroundColor: '#FFF0F8' },
  featureBody: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '800', color: '#37284E', marginBottom: 5 },
  featureDescription: { fontSize: 12, color: '#8B829C', lineHeight: 18 },
  tipCard: { flexDirection: 'row', gap: 14, padding: 17, borderRadius: 18, backgroundColor: '#FFF8E9', marginTop: 12, marginBottom: 22 },
  tipIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#FFEDC7', alignItems: 'center', justifyContent: 'center' },
  tipTitle: { fontSize: 14, fontWeight: '800', color: '#7A5625', marginBottom: 5 },
  tipText: { fontSize: 12, lineHeight: 19, color: '#907D61' },
  accountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 10 },
  accountText: { fontSize: 12, color: '#8B829C', maxWidth: '85%' },
  signoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, padding: 12 },
  signoutText: { color: '#7056BA', fontSize: 13, fontWeight: '700' },
});
