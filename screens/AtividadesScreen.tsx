import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type AtividadeSalva = {
  id: string;
  titulo: string;
  materia: string;
  tipo: 'Prova' | 'Trabalho' | 'Tarefa';
  dataEntrega: string;
  prioridade: 'Baixa' | 'Média' | 'Alta';
  descricao: string;
  concluida: boolean;
};

type Props = {
  onVoltar: () => void;
  onNovaAtividade: () => void;
  atividades: AtividadeSalva[];
  carregando?: boolean;
  erro?: string;
  onAlternarConclusao: (atividade: AtividadeSalva) => Promise<void>;
};

function dataOrdenacao(valor: string): number {
  const [dia, mes, ano] = valor.split('/').map(Number);
  return new Date(ano, mes - 1, dia).getTime() || 0;
}

export default function AtividadesScreen({
  onVoltar, onNovaAtividade, atividades, carregando = false, erro = '', onAlternarConclusao,
}: Props) {
  const pendentes = atividades.filter((a) => !a.concluida).length;
  const ordenadas = [...atividades].sort((a, b) =>
    Number(a.concluida) - Number(b.concluida) || dataOrdenacao(a.dataEntrega) - dataOrdenacao(b.dataEntrega)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar} accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={25} color="#7455D8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Atividades</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <View style={styles.iconBox}><Ionicons name="calendar-outline" size={25} color="#7455D8" /></View>
          <Text style={styles.introTitle}>Organize sua rotina</Text>
          <Text style={styles.introText}>Acompanhe suas provas, trabalhos e tarefas em um só lugar.</Text>
        </View>
        <View style={styles.headingRow}>
          <Text style={styles.sectionTitle}>Suas atividades</Text>
          <Text style={styles.count}>{pendentes} pendente{pendentes === 1 ? '' : 's'}</Text>
        </View>
        {carregando ? (
          <ActivityIndicator color="#7455D8" size="large" style={{ marginTop: 45 }} />
        ) : erro ? (
          <View style={styles.empty}><Text style={styles.error}>{erro}</Text></View>
        ) : ordenadas.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={50} color="#B7A5EB" />
            <Text style={styles.emptyTitle}>Nenhuma atividade cadastrada</Text>
            <Text style={styles.emptyText}>Toque em Nova atividade para começar a organizar seus estudos.</Text>
          </View>
        ) : ordenadas.map((atividade) => (
          <View key={atividade.id} style={[styles.task, atividade.concluida && styles.completed]}>
            <View style={styles.taskTop}>
              <View style={styles.typeBadge}><Text style={styles.typeText}>{atividade.tipo}</Text></View>
              <Text style={[styles.priority, atividade.prioridade === 'Alta' && styles.highPriority]}>
                {atividade.prioridade === 'Alta' ? '● ' : ''}{atividade.prioridade}
              </Text>
            </View>
            <Text style={[styles.taskTitle, atividade.concluida && styles.strike]}>{atividade.titulo}</Text>
            <Text style={styles.subject}>{atividade.materia}</Text>
            {atividade.descricao ? <Text style={styles.description}>{atividade.descricao}</Text> : null}
            <View style={styles.taskBottom}>
              <View style={styles.dateRow}>
                <Ionicons name="time-outline" size={17} color="#75688C" />
                <Text style={styles.dateText}>{atividade.dataEntrega}</Text>
              </View>
              <TouchableOpacity
                style={[styles.completeButton, atividade.concluida && styles.undoButton]}
                onPress={() => onAlternarConclusao(atividade)}
              >
                <Ionicons name={atividade.concluida ? 'refresh-outline' : 'checkmark-circle-outline'} size={17} color="#FFFFFF" />
                <Text style={styles.completeText}>{atividade.concluida ? 'Reabrir' : 'Concluir'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={onNovaAtividade}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addText}>Nova atividade</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F5FF', paddingTop: 36 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 22, paddingBottom: 22 },
  headerTitle: { fontSize: 23, fontWeight: 'bold', color: '#302052' },
  content: { paddingHorizontal: 16, paddingBottom: 30, flexGrow: 1 },
  intro: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 22, marginBottom: 26 },
  iconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F2EDFF', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  introTitle: { fontSize: 19, fontWeight: 'bold', color: '#302052', marginBottom: 6 },
  introText: { fontSize: 14, lineHeight: 21, color: '#75688C' },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#302052' },
  count: { color: '#7455D8', fontSize: 13, fontWeight: '600' },
  empty: { backgroundColor: '#FFFFFF', padding: 36, borderRadius: 20, alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#302052', textAlign: 'center' },
  emptyText: { fontSize: 13, color: '#75688C', textAlign: 'center', lineHeight: 20 },
  error: { color: '#B42318', textAlign: 'center' },
  task: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: '#EEEAF8' },
  completed: { opacity: 0.7 },
  taskTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  typeBadge: { backgroundColor: '#F2EDFF', paddingHorizontal: 11, paddingVertical: 5, borderRadius: 10 },
  typeText: { color: '#7455D8', fontWeight: '700', fontSize: 12 },
  priority: { color: '#75688C', fontSize: 12, fontWeight: '600' },
  highPriority: { color: '#C24157' },
  taskTitle: { color: '#302052', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  strike: { textDecorationLine: 'line-through' },
  subject: { color: '#7455D8', fontSize: 14, fontWeight: '600' },
  description: { color: '#75688C', fontSize: 13, lineHeight: 19, marginTop: 10 },
  taskBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { color: '#75688C', fontSize: 13 },
  completeButton: { backgroundColor: '#7455D8', borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 5 },
  undoButton: { backgroundColor: '#8E85A5' },
  completeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  addButton: { backgroundColor: '#7455D8', borderRadius: 14, margin: 12, padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  addText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
