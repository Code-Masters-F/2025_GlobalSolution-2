# ⭐ FocusWave -- Aplicativo de Foco com IA, Pomodoro e Músicas Binaurais

O **FocusWave** é um aplicativo web que combina **IA**, **músicas
binaurais**, **Pomodoro**, **pausa/retomada** e **histórico de músicas**
para ajudar no foco, produtividade, estudo, relaxamento e sono.

## 🎯 Objetivo

Ajudar pessoas com dificuldade de foco, ansiedade, estresse, ou
ambientes com distrações usando sugestões personalizadas geradas pelo
sistema.

## 🚀 Funcionalidades do MVP

-   Chat de sugestões de música via IA\
-   Pomodoro + descanso\
-   Pausar e retomar o timer\
-   Histórico das músicas ouvidas\
-   Login e cadastro (opcional)

## 🏗️ Arquitetura do Projeto

    root/
    ├── backend/       → API REST em Java puro
    ├── frontend/      → HTML, CSS, JS
    └── docs/          → Documentação

## ⚙️ Como Rodar o Projeto Localmente

### 1. Clonar

    git clone https://github.com/seu-usuario/focuswave.git
    cd focuswave

### 2. Back-end (Java puro)

Criar arquivo `backend/config.properties`:

    db.url=jdbc:mysql://localhost:3306/focuswave
    db.user=root
    db.pass=senha
    server.port=8080

Compilar:

    cd backend
    javac -cp .:libs/mysql-connector.jar src/**/*.java -d out

Executar:

    cd out
    java server.Main

### 3. Front-end

    cd frontend
    npx live-server

Ou abrir `index.html`.

## 🔌 Endpoints

-   POST /chat/suggestions\
-   GET /history\
-   POST /auth/register\
-   POST /auth/login\
-   POST /auth/logout

## 🧭 Roadmap

-   [x] Chat IA\
-   [x] Pomodoro\
-   [x] Pausar/Retomar\
-   [x] Trocar música\
-   [ ] Login/Cadastro\
-   [ ] Persistência no banco\
-   [ ] UI final\
-   [ ] IA real (GPT/Gemini)

## 🤝 Como Contribuir

1.  Fork\
2.  Branch\
3.  Commit\
4.  Pull Request

## 📝 Licença

MIT License
