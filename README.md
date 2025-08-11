# 🎨 MentorIA – Frontend

## Projeto desenvolvido para Disciplina de Engenharia de Software da Universidade Federal de Pernambuco.

Frontend da plataforma MentorIA, uma interface moderna e responsiva para o tutor digital inteligente que revoluciona a forma como estudantes se preparam para o ENEM e outros vestibulares.

### ✅ Este repositório corresponde *ao frontend.* O backend está disponível [aqui](https://github.com/Luanromancin/mentorIA-backend).

## 🎯 Objetivos e Funcionalidades

### Objetivos Principais
- Proporcionar uma experiência de usuário intuitiva e envolvente
- Facilitar o acesso às funcionalidades educacionais avançadas
- Criar uma interface responsiva e acessível
- Implementar gamificação visual para motivar o aprendizado

### Funcionalidades Principais
- 🔐 *Sistema de Autenticação* - Login/Registro com Supabase
- 🧠 *Teste de Nivelamento Interativo* - Interface para 26 questões
-    *Interface de Treinamento Dinâmico* - Questões adaptativas
-    *Dashboard de Estatísticas Visual* - Gráficos e métricas
- 🏆 *Sistema de Gamificação* - Progresso, conquistas e sequências
- 📱 *Design Responsivo* - Funciona em desktop, tablet e mobile
- 🎨 *UI/UX Moderna* - Componentes shadcn/ui + Tailwind CSS
- ⚡ *Performance Otimizada* - Lazy loading e cache inteligente

## 🏗️ Arquitetura e Estrutura

### Estrutura do Código
plaintext
src/
├── components/       # Componentes React reutilizáveis
│   ├── ui/          # Componentes base (shadcn/ui)
│   └── ...          # Componentes específicos da aplicação
├── contexts/        # Contextos React (Auth, etc.)
├── hooks/           # Custom hooks
├── lib/             # Serviços e utilitários
├── pages/           # Páginas da aplicação
├── integrations/    # Integrações externas (Supabase)
└── main.tsx         # Ponto de entrada


### Padrões Arquiteturais
- *Component-Based Architecture* - Componentes reutilizáveis
- *Context API* - Gerenciamento de estado global
- *Custom Hooks* - Lógica reutilizável
- *Service Layer* - Abstração de APIs
- *Responsive Design* - Mobile-first approach

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
|--------|-------------|
| *Framework* | React 18 + TypeScript |
| *Build Tool* | Vite |
| *Styling* | Tailwind CSS |
| *UI Components* | shadcn/ui + Radix UI |
| *State Management* | React Context + Custom Hooks |
| *HTTP Client* | Axios |
| *Routing* | React Router DOM |
| *Forms* | React Hook Form + Zod |
| *Charts* | Recharts |
| *Icons* | Lucide React |
| *Authentication* | Supabase Auth |

##    Guia de Instalação e Execução

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn
- Backend MentorIA rodando

### Instalação

1. *Clone o repositório:*
bash
git clone https://github.com/gabrielalimasotero/MentorIA-Frontend.git
cd MentorIA-Frontend


2. *Instale as dependências:*
bash
npm install


3. *Configure o ambiente:*
bash
cp env.example .env
# Edite o arquivo .env com suas configurações


4. *Configure as variáveis de ambiente:*
env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


5. *Inicie o servidor de desenvolvimento:*
bash
npm run dev


A aplicação estará disponível em: http://localhost:5173

### Scripts Disponíveis
bash
npm run dev           # Desenvolvimento com hot reload
npm run build         # Build para produção
npm run build:dev     # Build para desenvolvimento
npm run preview       # Preview da build
npm run lint          # Linting


## 🎨 Componentes Principais

### Autenticação
- *LoginPage* - Interface de login
- *AuthContext* - Gerenciamento de estado de autenticação
- *ProtectedRoute* - Proteção de rotas

### Teste de Nivelamento
- *LevelingTest* - Interface do teste de 26 questões
- *DiagnosticTest* - Teste diagnóstico
- *ResultsReview* - Revisão de resultados

### Treinamento
- *TrainingInterface* - Interface principal de treinamento
- *DynamicQuestions* - Questões adaptativas
- *SubjectTrails* - Trilhas de estudo por matéria

### Estatísticas
- *StatisticsPage* - Dashboard completo de estatísticas
- *EnhancedDiagnosticResults* - Resultados detalhados
- *PersonalizedLearningPaths* - Trilhas personalizadas

### UI/UX
- *Header* - Cabeçalho da aplicação
- *Dashboard* - Dashboard principal
- *OptimizedLoading* - Componentes de loading
- *DailyGoalComplete* - Conquistas diárias

##    Design System

### Cores
- *Primary*: Blue (#3B82F6)
- *Success*: Green (#10B981)
- *Warning*: Orange (#F59E0B)
- *Error*: Red (#EF4444)
- *Neutral*: Gray (#6B7280)

### Tipografia
- *Font Family*: Inter
- *Weights*: 400, 500, 600, 700
- *Sizes*: 12px, 14px, 16px, 18px, 20px, 24px, 32px

### Componentes Base
- *Button* - Botões com variantes
- *Card* - Cards informativos
- *Input* - Campos de entrada
- *Modal* - Modais e diálogos
- *Progress* - Barras de progresso
- *Badge* - Badges e tags

## 🔧 Configuração e Personalização

### Tema
typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}


### Variáveis de Ambiente
env
# API
VITE_API_URL=http://localhost:3000/api

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true


## 📊 Integração com Backend

### Autenticação
typescript
// Exemplo de login
const { login } = useAuth();
await login({ email, password });


### Questões Dinâmicas
typescript
// Carregar sessão de questões
const session = await dynamicQuestionsService.getSession(20);


### Estatísticas
typescript
// Obter estatísticas do usuário
const stats = await StatisticsService.getUserStatistics();


## 🧪 Testes

### Executar Testes
bash
npm run test          # Testes unitários
npm run test:e2e      # Testes end-to-end
npm run test:coverage # Com cobertura


### Estrutura de Testes
- *Unitários*: Componentes e hooks
- *Integração*: Fluxos de autenticação
- *E2E*: Fluxos completos do usuário

## 🚀 Deploy

### Build para Produção
bash
npm run build


### Deploy no Vercel
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Deploy no Netlify
1. Conecte o repositório ao Netlify
2. Configure o build command: npm run build
3. Configure o publish directory: dist

## 📱 Responsividade

### Breakpoints
- *Mobile*: < 768px
- *Tablet*: 768px - 1024px
- *Desktop*: > 1024px

### Componentes Responsivos
- *Grid System* - Flexbox e CSS Grid
- *Typography* - Escala responsiva
- *Spacing* - Sistema de espaçamento adaptativo

## 🎯 Performance

### Otimizações
- *Code Splitting* - Lazy loading de componentes
- *Image Optimization* - Otimização automática
- *Bundle Analysis* - Análise de tamanho do bundle
- *Caching* - Cache inteligente de dados

### Métricas
- *Lighthouse Score*: > 90
- *First Contentful Paint*: < 1.5s
- *Largest Contentful Paint*: < 2.5s

##    Como Contribuir

1. *Fork* o repositório
2. *Crie uma branch*: git checkout -b feature/nova-funcionalidade
3. *Faça commit*: git commit -m 'feat: adiciona nova funcionalidade'
4. *Envie a branch*: git push origin feature/nova-funcionalidade
5. *Crie um Pull Request*

### Padrões de Código
- *ESLint* para linting
- *Prettier* para formatação
- *TypeScript* para tipagem
- *Conventional Commits* para commits

## 📚 Documentação

### Componentes
- [shadcn/ui](https://ui.shadcn.com/) - Documentação dos componentes
- [Radix UI](https://www.radix-ui.com/) - Primitivos acessíveis
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

### Recursos
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🔗 Links Úteis

- [Design System](https://ui.shadcn.com/)
- [Color Palette](https://coolors.co/)
- [Icon Library](https://lucide.dev/)
- [MockUp Lovable](https://enem-inteligente-trilhas.lovable.app)

## 👥 Equipe

- *Antonio Gabriel* - [GitHub](https://github.com/gabrielclemnt)
- *Gabriela Lima Sotero* - [GitHub](https://github.com/gabrielalimasotero)
- *Luan Romancini* - [GitHub](https://github.com/Luanromancin)
- *Wilton Sales* - [GitHub](https://github.com/WilSales)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

*MentorIA Frontend* - Interface moderna para educação inteligente.
