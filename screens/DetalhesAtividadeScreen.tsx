import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AtividadeSalva } from './AtividadesScreen';

type Props = {
  atividade: AtividadeSalva;
  onVoltar: () => void;
  onAlternarConclusao: (atividade: AtividadeSalva) => Promise<void>;
};

export default function DetalhesAtividadeScreen({ atividade, onVoltar, onAlternarConclusao }: Props) {
  const [salvando, setSalvando] = React.useState(false);
  async function alternar() {
    if (salvando) return;
    setSalvando(true);
    try { await onAlternarConclusao(atividade); }
    finally { setSalvando(false); }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar} accessibilityLabel="Voltar para atividades">
          <Ionicons name="arrow-back" size={25} color="#7455D8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da atividade</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.iconBox}><Ionicons name="book-outline" size={27} color="#7455D8" /></View>
            <Text style={styles.priority}>{atividade.prioridade}</Text>
          </View>
          <Text style={styles.title}>{atividade.titulo}</Text>
          <Text style={styles.subtitle}>{atividade.concluida ? 'Concluída' : 'Pendente'}</Text>
          <View style={styles.divider} />
          <Info icon="school-outline" label="Matéria" value={atividade.materia} />
          <Info icon="document-text-outline" label="Tipo" value={atividade.tipo} />
          <Info icon="calendar-outline" label="Data de entrega" value={atividade.dataEntrega} />
          <Info icon="flag-outline" label="Prioridade" value={atividade.prioridade} />
          <Info icon="reader-outline" label="Descrição" value={atividade.descricao?.trim() || 'Nenhuma descrição informada.'} />
        </View>
        <TouchableOpacity style={[styles.button, salvando && styles.disabled]} onPress={alternar} disabled={salvando}>
          <Ionicons name={atividade.concluida ? 'refresh-outline' : 'checkmark-circle-outline'} size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>{salvando ? 'Salvando...' : atividade.concluida ? 'Reabrir atividade' : 'Marcar como concluída'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
function Info({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }) {
  return <View style={styles.infoRow}>
    <Ionicons name={icon} size={21} color="#7455D8" />
    <View style={styles.infoText}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5FF', paddingTop: 36 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 15, paddingHorizontal: 22, paddingBottom: 22 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#302052' },
  content: { paddingHorizontal: 18, paddingBottom: 35 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 23, borderWidth: 1, borderColor: '#EEEAF8' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  iconBox: { backgroundColor: '#F2EDFF', width: 52, height: 52, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  priority: { backgroundColor: '#F2EDFF', color: '#7455D8', paddingHorizontal: 13, paddingVertical: 7, borderRadius: 12, fontWeight: '700' },
  title: { color: '#302052', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#7455D8', fontSize: 14, marginTop: 7, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#EEEAF8', marginVertical: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 13, marginBottom: 23 },
  infoText: { flex: 1 },
  infoLabel: { color: '#827993', fontSize: 12, marginBottom: 5 },
  infoValue: { color: '#302052', fontSize: 16, fontWeight: '600', lineHeight: 23 },
  button: { backgroundColor: '#7455D8', borderRadius: 14, padding: 17, marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});
