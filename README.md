# 📚 StudyFlow — Organizador de Estudos

Aplicativo desenvolvido para auxiliar estudantes na organização de provas, trabalhos e tarefas acadêmicas, proporcionando uma rotina de estudos mais prática e organizada.

## Objetivo

O StudyFlow tem como objetivo facilitar o gerenciamento das atividades acadêmicas, permitindo que estudantes cadastrem e acompanhem seus compromissos em um único aplicativo.

## Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Git e GitHub

## Funcionalidades

- Cadastro de usuários com e-mail e senha.
- Login e logout utilizando Firebase Authentication.
- Tela inicial com acesso às funcionalidades do aplicativo.
- Cadastro de provas, trabalhos e tarefas.
- Definição de matéria, data de entrega e prioridade.
- Listagem de atividades cadastradas.
- Marcação de atividades como concluídas.
- Armazenamento das atividades no Cloud Firestore.
- Regras de segurança para separar as atividades por usuário.

## Como executar o projeto

**Pré-requisitos:** Node.js e npm instalados.

1. Clone o repositório.
2. Abra a pasta do projeto no VS Code.
3. Instale as dependências:

```bash
npm install
```

4. Inicie o aplicativo:

```bash
npx expo start
```

Para executar no navegador:

```bash
npx expo start --web
```

O aplicativo utiliza um projeto Firebase configurado no arquivo `firebaseConfig.ts`.

## Integrantes

| Nome | RM |
|---|---|
| Marina Tamagnini Magalhães | 561786 |
| Vitória Valentina Maglio | 563509 |
| João Pedro Bitencourt Goldoni | 564339 |

## Projeto acadêmico

Desenvolvido como atividade acadêmica do curso de Análise e Desenvolvimento de Sistemas da FIAP.