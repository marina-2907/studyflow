
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  email?: string | null;
  onAtividades: () => void;
  onNovaAtividade: () => void;
  onSair: () => void;
};

export default function HomeScreen({
  email,
  onAtividades,
  onNovaAtividade,
  onSair,
}: Props) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.saudacao}>Olá, estudante!</Text>
          <Text style={styles.email}>{email || 'Bem-vinda!'}</Text>
        </View>

        <TouchableOpacity onPress={onSair}>
          <Ionicons
            name="log-out-outline"
            size={28}
            color="#7455D8"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Ionicons
          name="book-outline"
          size={36}
          color="#FFFFFF"
        />
        <Text style={styles.bannerTitulo}>
          Organize seus estudos
        </Text>
        <Text style={styles.bannerTexto}>
          Acompanhe suas provas, trabalhos e atividades.
        </Text>
      </View>

      <Text style={styles.titulo}>Meu painel</Text>

      <View style={styles.cards}>
        <View style={styles.card}>
          <Ionicons
            name="time-outline"
            size={30}
            color="#7455D8"
          />
          <Text style={styles.numero}>0</Text>
          <Text style={styles.cardTexto}>Pendentes</Text>
        </View>

        <View style={styles.card}>
          <Ionicons
            name="checkmark-circle-outline"
            size={30}
            color="#7455D8"
          />
          <Text style={styles.numero}>0</Text>
          <Text style={styles.cardTexto}>Concluídas</Text>
        </View>
      </View>

      <Text style={styles.titulo}>Acesso rápido</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={onNovaAtividade}
      >
        <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
        <Text style={styles.botaoTexto}>Nova atividade</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={onAtividades}
      >
        <Ionicons name="list-outline" size={24} color="#7455D8" />
        <Text style={styles.botaoSecundarioTexto}>
          Minhas atividades
        </Text>
      </TouchableOpacity>

      <View style={styles.dica}>
        <Ionicons name="bulb-outline" size={25} color="#7455D8" />
        <View style={{ flex: 1 }}>
          <Text style={styles.dicaTitulo}>Dica de estudos</Text>
          <Text style={styles.dicaTexto}>
            Organize suas tarefas por prazo e prioridade!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5FF',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 25,
  },
  saudacao: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#35215E',
  },
  email: {
    color: '#75688C',
    marginTop: 5,
  },
  banner: {
    backgroundColor: '#7455D8',
    padding: 25,
    borderRadius: 22,
    marginBottom: 30,
  },
  bannerTitulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },
  bannerTexto: {
    color: '#F0E9FF',
    marginTop: 8,
    lineHeight: 21,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#35215E',
    marginBottom: 16,
  },
  cards: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
  },
  numero: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#35215E',
    marginTop: 10,
  },
  cardTexto: {
    color: '#75688C',
    marginTop: 5,
  },
  botao: {
    backgroundColor: '#7455D8',
    padding: 17,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoSecundario: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 25,
  },
  botaoSecundarioTexto: {
    color: '#7455D8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dica: {
    backgroundColor: '#E9DFFF',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 50,
  },
  dicaTitulo: {
    fontWeight: 'bold',
    color: '#35215E',
  },
  dicaTexto: {
    color: '#75688C',
    marginTop: 5,
    lineHeight: 20,
  },
});
