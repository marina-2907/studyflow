# 📚 StudyFlow — Organizador de Estudos

O **StudyFlow** é um aplicativo mobile desenvolvido para ajudar estudantes a organizar suas provas, trabalhos e tarefas acadêmicas de maneira simples e intuitiva.

O projeto foi desenvolvido utilizando **React Native, Expo, TypeScript e Firebase**, permitindo sua execução em dispositivos Android e iOS, além de oferecer suporte à versão web.

## 🎯 Objetivo

Facilitar o gerenciamento da rotina acadêmica, permitindo que os estudantes cadastrem, visualizem e acompanhem suas atividades em um único aplicativo.

## 📱 Funcionalidades

- Cadastro e login de usuários.
- Autenticação com Firebase Authentication.
- Tela inicial com navegação intuitiva.
- Cadastro de provas, trabalhos e tarefas.
- Definição de matéria, data de entrega e prioridade.
- Visualização das atividades cadastradas.
- Marcação de atividades como concluídas.
- Armazenamento de dados no Cloud Firestore.
- Separação das atividades por usuário autenticado.

## 🛠️ Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Git e GitHub

## 🚀 Como executar o aplicativo

### Pré-requisitos

- Node.js instalado no computador.
- npm instalado.
- Aplicativo **Expo Go** instalado no celular, caso utilize uma versão compatível com o SDK do projeto.
- Computador e celular conectados à mesma rede Wi-Fi.

### 1. Clonar o repositório

```bash
git clone https://github.com/marina-2907/studyflow.git
```

### 2. Acessar a pasta do projeto

```bash
cd studyflow
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar o aplicativo mobile

```bash
npx expo start
```

Após iniciar o Expo, será exibido um QR Code no terminal.

**Android:** abra o Expo Go e escaneie o QR Code.

**iPhone:** utilize a câmera para escanear o QR Code e abrir o aplicativo no Expo Go.

Caso o projeto utilize bibliotecas ou uma versão do SDK incompatíveis com o Expo Go instalado, será necessário utilizar uma development build compatível.

### 5. Executar no emulador Android

Com o Android Studio e um emulador configurado, execute:

```bash
npx expo start --android
```

### 6. Executar no navegador (opcional)

```bash
npx expo start --web
```

A versão web é uma alternativa de execução. O projeto foi desenvolvido com foco na experiência mobile.

## 👩‍💻 Integrantes

| Nome | RM |
|---|---|
| Marina Tamagnini Magalhães | 561786 |
| Vitória Valentina Maglio | 563509 |
| João Pedro Bitencourt Goldoni | 564339 |

**Instituição:** FIAP  
**Curso:** Análise e Desenvolvimento de Sistemas

## 🔥 Integração com Firebase

O aplicativo utiliza:

**Firebase Authentication:** responsável