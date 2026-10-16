
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type DadosAtividade = {
  titulo: string;
  materia: string;
  tipo: 'Prova' | 'Trabalho' | 'Tarefa';
  dataEntrega: string;
  prioridade: 'Baixa' | 'Média' | 'Alta';
  descricao: string;
};

type Props = {
  onVoltar: () => void;
  onSalvar: (atividade: DadosAtividade) => Promise<void>;
};

export default function NovaAtividadeScreen({
  onVoltar,
  onSalvar,
}: Props) {
  const [titulo, setTitulo] = useState('');
  const [materia, setMateria] = useState('');
  const [tipo, setTipo] = useState<DadosAtividade['tipo']>('Tarefa');
  const [dataEntrega, setDataEntrega] = useState('');
  const [prioridade, setPrioridade] =
    useState<DadosAtividade['prioridade']>('Média');
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  async function salvar() {
    setErro('');

    if (!titulo.trim() || !materia.trim() || !dataEntrega.trim()) {
      setErro('Preencha o título, a matéria e a data de entrega.');
      return;
    }

    const partes = dataEntrega.split('/');
    if (partes.length !== 3) {
      setErro('Digite a data no formato DD/MM/AAAA.');
      return;
    }

    const [dia, mes, ano] = partes.map(Number);
    const data = new Date(ano, mes - 1, dia);

    if (
      !Number.isInteger(dia) ||
      !Number.isInteger(mes) ||
      !Number.isInteger(ano) ||
      ano < 2000 ||
      data.getFullYear() !== ano ||
      data.getMonth() !== mes - 1 ||
      data.getDate() !== dia
    ) {
      setErro('Digite uma data válida no formato DD/MM/AAAA.');
      return;
    }

    setSalvando(true);

    try {
      await onSalvar({
        titulo: titulo.trim(),
        materia: materia.trim(),
        tipo,
        dataEntrega,
        prioridade,
        descricao: descricao.trim(),
      });
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
      setErro('Não foi possível salvar a atividade. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onVoltar}>
          <Ionicons
            name="arrow-back"
            size={26}
            color="#7455D8"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Nova Atividade</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Vamos organizar seus estudos?</Text>
        <Text style={styles.subtitle}>
          Cadastre uma prova, trabalho ou tarefa.
        </Text>

        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Entregar trabalho de Java"
          placeholderTextColor="#999"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Matéria *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Desenvolvimento Java"
          placeholderTextColor="#999"
          value={materia}
          onChangeText={setMateria}
        />

        <Text style={styles.label}>Tipo de atividade</Text>
        <View style={styles.options}>
          {(['Prova', 'Trabalho', 'Tarefa'] as const).map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                tipo === item && styles.optionSelected,
              ]}
              onPress={() => setTipo(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  tipo === item && styles.optionTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Data de entrega *</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#999"
          keyboardType="numbers-and-punctuation"
          value={dataEntrega}
          onChangeText={setDataEntrega}
          maxLength={10}
        />

        <Text style={styles.label}>Prioridade</Text>
        <View style={styles.options}>
          {(['Baixa', 'Média', 'Alta'] as const).map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                prioridade === item && styles.optionSelected,
              ]}
              onPress={() => setPrioridade(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  prioridade === item && styles.optionTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Descrição (opcional)</Text>
        <TextInput
          style={[styles.input, styles.description]}
          placeholder="Adicione detalhes sobre a atividade..."
          placeholderTextColor="#999"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          textAlignVertical="top"
        />

        {erro !== '' && (
          <Text style={styles.error}>{erro}</Text>
        )}

        <TouchableOpacity
          style={[
            styles.saveButton,
            salvando && styles.disabled,
          ]}
          onPress={salvar}
          disabled={salvando}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={23}
            color="#FFFFFF"
          />
          <Text style={styles.saveText}>
            {salvando ? 'Salvando...' : 'Salvar atividade'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5FF',
    paddingTop: Platform.OS === 'web' ? 25 : 55,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#35215E',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#35215E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#75688C',
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#35215E',
    marginBottom: 9,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: '#35215E',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#EBE5F5',
  },
  options: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D7C9F4',
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#7455D8',
    borderColor: '#7455D8',
  },
  optionText: {
    color: '#7455D8',
    fontWeight: '600',
    fontSize: 13,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  description: {
    height: 110,
  },
  error: {
    color: '#B42318',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#7455D8',
    borderRadius: 14,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});
