import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AtividadeSalva } from './AtividadesScreen';

type Props = {
  atividades: AtividadeSalva[];
  onVoltar: () => void;
  onVerDetalhes: (atividade: AtividadeSalva) => void;
  onAlternarFavorito: (atividade: AtividadeSalva) => Promise<void>;
  carregando?: boolean;
  erro?: string;
};

export default function FavoritosScreen({ atividades, onVoltar, onVerDetalhes, onAlternarFavorito, carregando = false, erro = '' }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar} accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={25} color="#7455D8" />
        </TouchableOpacity>
        <Text style={styles.title}>Meus favoritos</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Suas atividades mais importantes, em um só lugar.</Text>
        {carregando ? <ActivityIndicator size="large" color="#7455D8" /> :
          erro ? <Text style={styles.empty}>{erro}</Text> :
          atividades.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="heart-outline" size={48} color="#CF65A0" />
              <Text style={styles.empty}>Você ainda não favoritou nenhuma atividade.</Text>
            </View>
          ) : atividades.map((atividade) => (
            <View key={atividade.id} style={styles.card}>
              <View style={styles.top}>
                <Text style={styles.badge}>{atividade.tipo} · {atividade.prioridade}</Text>
                <TouchableOpacity onPress={() => onAlternarFavorito(atividade)} accessibilityLabel="Remover dos favoritos">
                  <Ionicons name="heart" size={25} color="#CF65A0" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => onVerDetalhes(atividade)}>
                <Text style={styles.taskTitle}>{atividade.titulo}</Text>
                <Text style={styles.info}>{atividade.materia} · Entrega: {atividade.dataEntrega}</Text>
                <Text style={styles.link}>Ver detalhes →</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5FF', paddingTop: 36 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 22, paddingBottom: 20 },
  title: { fontSize: 23, color: '#302052', fontWeight: 'bold' },
  content: { padding: 18, paddingBottom: 36 },
  subtitle: { fontSize: 14, color: '#75688C', marginBottom: 24 },
  emptyCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 35, alignItems: 'center', gap: 15 },
  empty: { textAlign: 'center', color: '#75688C', lineHeight: 22 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, marginBottom: 14, borderColor: '#EEEAF8', borderWidth: 1 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { color: '#7455D8', fontSize: 12, fontWeight: '700' },
  taskTitle: { color: '#302052', fontWeight: 'bold', fontSize: 18, marginTop: 12 },
  info: { color: '#75688C', marginTop: 7, fontSize: 13 },
  link: { color: '#7455D8', fontWeight: '700', marginTop: 14 },
});
