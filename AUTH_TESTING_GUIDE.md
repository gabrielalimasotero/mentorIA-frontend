# 🧪 Guia de Teste de Cenários de Erro de Autenticação - Frontend

## 📋 Visão Geral

Este guia descreve como testar todos os cenários de erro de autenticação implementados no frontend do MentorIA, baseado no arquivo `AUTH_TEST_SCENARIOS.md`.

## 🎯 Como Usar o Painel de Teste

### 1. Acesse o Painel
- O painel de teste aparece automaticamente no canto superior direito da página de login
- Disponível apenas em modo de desenvolvimento (`NODE_ENV === 'development'`)

### 2. Estrutura do Painel
- **Categorias**: Login, Registro, Validação, Proteção, Rede
- **Status**: Pendente, Aprovado, Falhou, Pulado
- **Controles**: Botões ✓, ✗, - para marcar resultados

### 3. Funcionalidades
- **Limpar**: Reset todos os testes para "Pendente"
- **Exportar**: Salva resultados em JSON
- **Instruções**: Detalhes de como executar cada teste
- **Resultado Esperado**: O que deve acontecer em cada cenário

## 🧪 Cenários de Teste Detalhados

### 📝 **Cenários de Login**

#### 1. Campos Vazios no Login
**Objetivo**: Verificar validação de campos obrigatórios
**Passos**:
1. Deixe o campo email vazio
2. Deixe o campo senha vazio
3. Clique em "Entrar"

**Resultado Esperado**: 
- Mensagens de erro específicas para cada campo
- Campos destacados em vermelho
- Formulário não é enviado

**Código Relacionado**: `LoginPage.tsx` linhas 15-17 (schema Zod)

#### 2. Email Inválido
**Objetivo**: Verificar validação de formato de email
**Passos**:
1. Digite "teste" no campo email
2. Digite qualquer senha
3. Clique em "Entrar"

**Resultado Esperado**: 
- Mensagem "Email inválido"
- Campo email destacado em vermelho

**Código Relacionado**: `LoginPage.tsx` linha 15 (validação Zod)

#### 3. Senha Muito Curta
**Objetivo**: Verificar validação de tamanho mínimo de senha
**Passos**:
1. Digite um email válido
2. Digite "123" no campo senha
3. Clique em "Entrar"

**Resultado Esperado**: 
- Mensagem "Senha deve ter pelo menos 6 caracteres"
- Campo senha destacado em vermelho

**Código Relacionado**: `LoginPage.tsx` linha 16 (validação Zod)

#### 4. Credenciais Inválidas
**Objetivo**: Verificar tratamento de erro do backend
**Passos**:
1. Digite "teste@inexistente.com"
2. Digite "senha123"
3. Clique em "Entrar"

**Resultado Esperado**: 
- Toast de erro "Senha incorreta. Por favor, verifique suas credenciais."
- Campos destacados em vermelho

**Código Relacionado**: `auth.ts` linha 18, `AuthContext.tsx` linha 158

#### 5. Estado de Loading
**Objetivo**: Verificar feedback visual durante requisição
**Passos**:
1. Digite credenciais válidas
2. Clique em "Entrar"
3. Observe o botão

**Resultado Esperado**: 
- Botão desabilitado
- Texto muda para "Entrando..."
- Spinner aparece no botão

**Código Relacionado**: `LoginPage.tsx` linhas 380-390

### 📝 **Cenários de Registro**

#### 1. Campos Vazios no Registro
**Objetivo**: Verificar validação de campos obrigatórios no registro
**Passos**:
1. Mude para "Cadastre-se"
2. Deixe campos vazios
3. Clique em "Criar conta"

**Resultado Esperado**: 
- Mensagens de erro para campos obrigatórios
- Campos destacados em vermelho

**Código Relacionado**: `LoginPage.tsx` linhas 19-26 (schema Zod)

#### 2. Email Duplicado
**Objetivo**: Verificar tratamento de email já existente
**Passos**:
1. Use um email já registrado
2. Preencha outros campos
3. Clique em "Criar conta"

**Resultado Esperado**: 
- Toast de erro sobre email já existente
- Mensagem específica do backend

**Código Relacionado**: `AuthContext.tsx` linha 158

#### 3. Senhas Não Coincidem
**Objetivo**: Verificar validação de confirmação de senha
**Passos**:
1. Digite "senha123" na senha
2. Digite "senha456" na confirmação
3. Clique em "Criar conta"

**Resultado Esperado**: 
- Mensagem "Senhas não coincidem"
- Campo de confirmação destacado em vermelho

**Código Relacionado**: `LoginPage.tsx` linhas 27-30 (validação Zod)

### 📝 **Cenários de Validação**

#### 1. Validação em Tempo Real
**Objetivo**: Verificar se validação acontece durante digitação
**Passos**:
1. Digite "teste" no campo email
2. Clique fora do campo (perde foco)
3. Observe se aparece erro

**Resultado Esperado**: 
- Erro aparece assim que o campo perde foco
- Validação em tempo real

**Código Relacionado**: React Hook Form + Zod resolver

### 📝 **Cenários de Proteção**

#### 1. Acesso Não Autorizado
**Objetivo**: Verificar proteção de rotas
**Passos**:
1. Limpe o localStorage (botão flutuante)
2. Tente acessar `/dashboard` diretamente na URL
3. Observe redirecionamento

**Resultado Esperado**: 
- Redirecionamento para página de login
- Mensagem "Faça login para continuar"

**Código Relacionado**: `ProtectedRoute.tsx`

### 📝 **Cenários de Rede**

#### 1. Erro de Rede
**Objetivo**: Verificar tratamento de erro de conexão
**Passos**:
1. Desconecte a internet
2. Tente fazer login
3. Reconecte a internet

**Resultado Esperado**: 
- Toast "Erro de conexão com o servidor. Por favor, tente novamente."
- Tratamento gracioso do erro

**Código Relacionado**: `auth.ts` linha 20

## 🔧 Ferramentas de Teste

### Botão de Limpar Cache
- **Localização**: Canto inferior direito da página
- **Função**: Limpa localStorage, sessionStorage e recarrega a página
- **Uso**: Para resetar estado entre testes

### Console do Navegador
- **Acesso**: F12 → Console
- **Logs**: Verificar logs de erro e debug
- **Network**: Verificar requisições HTTP

### DevTools
- **Application**: Verificar localStorage/sessionStorage
- **Network**: Monitorar requisições ao backend
- **Elements**: Inspecionar elementos da UI

## 📊 Métricas de Teste

### Cobertura de Cenários
- **Total**: 11 cenários implementados
- **Login**: 5 cenários
- **Registro**: 3 cenários
- **Validação**: 1 cenário
- **Proteção**: 1 cenário
- **Rede**: 1 cenário

### Status dos Testes
- **Aprovados**: Cenários que funcionam conforme esperado
- **Falharam**: Cenários que não funcionam
- **Pulados**: Cenários que não foram testados
- **Pendentes**: Cenários aguardando teste

## 🚀 Próximos Passos

### Cenários Futuros
- [ ] Teste de timeout de requisição
- [ ] Teste de rate limiting
- [ ] Teste de token expirado
- [ ] Teste de refresh token
- [ ] Teste de logout em múltiplas abas

### Melhorias
- [ ] Testes automatizados com Jest/Vitest
- [ ] Testes E2E com Playwright
- [ ] Relatórios de cobertura
- [ ] Integração com CI/CD

## 📝 Notas Importantes

### Ambiente de Teste
- Sempre teste em modo de desenvolvimento
- Use dados de teste, nunca dados reais
- Limpe cache entre testes quando necessário

### Dados de Teste
- Emails de teste: `teste@exemplo.com`, `usuario@teste.com`
- Senhas de teste: `senha123`, `teste456`
- Evite usar dados pessoais ou reais

### Backend
- Certifique-se de que o backend está rodando
- Verifique se as rotas de auth estão funcionando
- Monitore logs do backend durante testes

---

**Última atualização**: Dezembro 2024
**Versão**: 1.0.0
**Responsável**: Equipe de Desenvolvimento MentorIA
