# Configuração do Sistema de Autenticação - MentorIA

## 📋 Visão Geral

Este documento descreve como configurar e usar o novo sistema de autenticação implementado no MentorIA Frontend.

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação Completa
- **Login/Registro**: Formulários com validação robusta
- **Recuperação de Senha**: Fluxo completo de reset
- **Proteção de Rotas**: Middleware de autenticação
- **Refresh Token**: Renovação automática de tokens
- **Logout**: Limpeza completa de dados

### ✅ Gerenciamento de Perfil
- **Edição de Dados**: Nome e meta diária
- **Upload de Avatar**: Com validação de arquivo
- **Persistência**: Dados salvos no backend

### ✅ UX/UI Melhorada
- **Loading States**: Indicadores de carregamento
- **Error Handling**: Tratamento de erros com toast
- **Validação**: Formulários com Zod
- **Responsivo**: Design adaptável

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Social Login (opcional - para implementação futura)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id

# Environment
NODE_ENV=development
```

### 2. Estrutura da API Backend

O frontend espera que o backend tenha os seguintes endpoints:

#### Autenticação
- `POST /auth/login` - Login do usuário
- `POST /auth/register` - Registro de novo usuário
- `POST /auth/logout` - Logout do usuário
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Recuperação de senha
- `POST /auth/reset-password` - Reset de senha
- `GET /auth/me` - Dados do usuário atual

#### Perfil
- `PUT /auth/profile` - Atualizar perfil
- `POST /auth/avatar` - Upload de avatar

### 3. Estrutura de Resposta Esperada

```typescript
// Resposta de sucesso
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "dailyGoal": number,
      "avatar": "string (opcional)",
      "createdAt": "string",
      "updatedAt": "string"
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
}

// Resposta de erro
{
  "success": false,
  "message": "Mensagem de erro",
  "error": "Detalhes do erro"
}
```

### 4. Headers de Autenticação

O frontend envia automaticamente o token no header:
```
Authorization: Bearer <access_token>
```

## 📁 Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── lib/
│   ├── api.ts                   # Configuração do axios
│   └── auth.ts                  # Serviços de autenticação
├── components/
│   ├── LoginPage.tsx            # Página de login/registro
│   ├── ProtectedRoute.tsx       # Proteção de rotas
│   ├── UserProfile.tsx          # Gerenciamento de perfil
│   └── Header.tsx               # Header atualizado
└── App.tsx                      # Rotas configuradas
```

## 🔄 Fluxo de Autenticação

### 1. Login
1. Usuário preenche formulário
2. Validação com Zod
3. Chamada para `/auth/login`
4. Tokens salvos no localStorage
5. Redirecionamento para `/dashboard`

### 2. Registro
1. Usuário preenche formulário com meta diária
2. Validação com Zod
3. Chamada para `/auth/register`
4. Tokens salvos no localStorage
5. Redirecionamento para `/dashboard`

### 3. Refresh Token
1. Interceptor detecta erro 401
2. Tenta renovar com refresh token
3. Se sucesso: repete requisição original
4. Se falha: logout e redireciona para login

### 4. Proteção de Rotas
1. Verifica se há token válido
2. Se não: redireciona para login
3. Se sim: renderiza componente

## 🎯 Próximos Passos

### Login Social (Futuro)
1. Configurar OAuth providers (Google, Facebook)
2. Implementar endpoints de login social no backend
3. Adicionar botões funcionais no frontend

### Melhorias de Segurança
1. Implementar 2FA (opcional)
2. Adicionar verificação de email
3. Implementar rate limiting no frontend

### Funcionalidades Avançadas
1. Histórico de login
2. Sessões ativas
3. Logout em todos os dispositivos

## 🐛 Troubleshooting

### Erro de CORS
Certifique-se de que o backend está configurado para aceitar requisições do frontend.

### Token Inválido
Verifique se o backend está retornando tokens no formato correto.

### Upload de Avatar
Certifique-se de que o endpoint `/auth/avatar` aceita `multipart/form-data`.

## 📞 Suporte

Para dúvidas ou problemas, consulte:
1. Logs do console do navegador
2. Network tab do DevTools
3. Logs do backend

---

**Nota**: Este sistema foi projetado para ser escalável e fácil de manter. Todas as funcionalidades seguem as melhores práticas de desenvolvimento React e TypeScript. 