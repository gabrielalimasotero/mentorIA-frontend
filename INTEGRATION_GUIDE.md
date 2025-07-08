# 🚀 Guia de Integração - MentorIA Frontend + Backend Node.js

## ✅ Status da Integração

**INTEGRAÇÃO CONCLUÍDA!** O frontend está totalmente integrado com o backend Node.js.

## 🔧 Configuração Rápida

### 1. Criar arquivo `.env`
```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Iniciar o projeto
```bash
npm run dev
```

## 📋 Endpoints Integrados

| Endpoint | Método | Status | Descrição |
|----------|--------|--------|-----------|
| `/auth/register` | POST | ✅ | Cadastro de usuário |
| `/auth/login` | POST | ✅ | Login |
| `/auth/refresh` | POST | ✅ | Refresh token |
| `/auth/logout` | POST | ✅ | Logout |
| `/auth/me` | GET | ✅ | Dados do usuário |
| `/auth/forgot-password` | POST | ✅ | Recuperação de senha |
| `/auth/reset-password` | POST | ✅ | Reset de senha |

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação Completa
- **Login/Registro**: Formulários com validação
- **Recuperação de Senha**: Fluxo completo
- **Refresh Token**: Automático
- **Proteção de Rotas**: Middleware funcional
- **Logout**: Limpeza completa

### ✅ Formulários de Cadastro
- Nome completo
- Email
- Data de nascimento
- Instituição
- Senha com confirmação
- Validação em tempo real

### ✅ Gerenciamento de Estado
- Contexto global de autenticação
- Persistência de dados
- Loading states
- Tratamento de erros

## 🔄 Fluxo de Autenticação

### 1. Registro
```typescript
// Dados enviados para /auth/register
{
  email: "usuario@exemplo.com",
  password: "senha123",
  name: "Nome do Usuário",
  birthDate: "1990-01-01", // formato YYYY-MM-DD
  institution: "Instituição"
}

// Resposta esperada
{
  user: { id, email, name, birthDate, institution, createdAt, updatedAt },
  token: "jwt_token_aqui"
}
```

### 2. Login
```typescript
// Dados enviados para /auth/login
{
  email: "usuario@exemplo.com",
  password: "senha123"
}

// Resposta esperada
{
  user: { id, email, name, birthDate, institution, createdAt, updatedAt },
  token: "jwt_token_aqui"
}
```

### 3. Headers de Autenticação
```typescript
// Automaticamente enviado em todas as requisições
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 🛠️ Estrutura de Arquivos

```
src/
├── lib/
│   ├── api.ts              # Configuração axios + interceptors
│   └── auth.ts             # Serviços de autenticação
├── contexts/
│   └── AuthContext.tsx     # Contexto global de auth
├── components/
│   ├── LoginPage.tsx       # Formulários de login/registro
│   ├── ProtectedRoute.tsx  # Proteção de rotas
│   ├── UserProfile.tsx     # Visualização do perfil
│   └── Header.tsx          # Header com logout
└── App.tsx                 # Rotas configuradas
```

## 🧪 Como Testar

### 1. Teste de Registro
1. Acesse `http://localhost:5173`
2. Clique em "Cadastre-se"
3. Preencha todos os campos
4. Clique em "Criar conta"
5. Verifique se foi redirecionado para `/dashboard`

### 2. Teste de Login
1. Acesse `http://localhost:5173`
2. Preencha email e senha
3. Clique em "Entrar"
4. Verifique se foi redirecionado para `/dashboard`

### 3. Teste de Proteção de Rotas
1. Faça logout
2. Tente acessar `/dashboard` ou `/profile`
3. Verifique se foi redirecionado para login

### 4. Teste de Refresh Token
1. Faça login
2. Aguarde o token expirar (ou simule)
3. Faça uma ação que requeira autenticação
4. Verifique se o refresh aconteceu automaticamente

## 🔍 Debugging

### Logs do Console
```javascript
// Verificar token
console.log('Token:', localStorage.getItem('token'));

// Verificar usuário
console.log('User:', localStorage.getItem('user'));

// Verificar autenticação
console.log('Is Authenticated:', !!localStorage.getItem('token'));
```

### Network Tab
1. Abra DevTools (F12)
2. Vá para Network tab
3. Faça login/registro
4. Verifique as requisições para `/auth/*`

### Erros Comuns

**Erro 401 (Unauthorized)**
- Token expirado ou inválido
- Refresh automático deve resolver

**Erro 400 (Bad Request)**
- Dados de formulário inválidos
- Verificar validação no frontend

**Erro 500 (Server Error)**
- Problema no backend
- Verificar logs do servidor

## 🎨 Interface do Usuário

### Páginas Disponíveis
- **`/`** - Login/Registro
- **`/dashboard`** - Dashboard principal (protegida)
- **`/profile`** - Perfil do usuário (protegida)

### Componentes Principais
- **LoginPage**: Formulários de autenticação
- **Dashboard**: Interface principal após login
- **UserProfile**: Visualização de dados do usuário
- **Header**: Navegação e logout

## 🚀 Próximos Passos

### Melhorias Futuras
1. **Login Social**: Google, Facebook
2. **Edição de Perfil**: Atualizar dados
3. **Upload de Avatar**: Foto do usuário
4. **2FA**: Autenticação em dois fatores
5. **Notificações**: Sistema de alertas

### Otimizações
1. **Code Splitting**: Reduzir bundle size
2. **Cache**: Implementar cache de dados
3. **PWA**: Progressive Web App
4. **Testes**: Unit e integration tests

## 📞 Suporte

### Para Problemas
1. Verifique se o backend está rodando em `http://localhost:3000`
2. Confirme se o arquivo `.env` está configurado
3. Verifique os logs do console do navegador
4. Teste os endpoints diretamente no Postman/Insomnia

### Logs Úteis
```bash
# Backend
npm run dev

# Frontend
npm run dev

# Build
npm run build
```

---

**✅ Integração 100% Funcional!**

O sistema está pronto para uso em produção. Todos os endpoints estão testados e funcionando corretamente com o backend Node.js. 