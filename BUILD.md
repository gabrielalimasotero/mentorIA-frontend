
# Instruções de Build e Setup

Este documento fornece instruções passo a passo para configurar e executar o projeto **MentorIA Frontend** localmente.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados no seu sistema:

- **Node.js** (recomendado versão 18 ou superior)
- **pnpm** (versão 9.3.0 ou superior)
- **Git**

---

## Passos para Instalação

1. Clone o repositório:

```bash
git clone [https://github.com/gabrielalimasotero/mentorIA-frontend]
cd mentorIA-frontend
```

2. Instale as dependências utilizando o pnpm:

```bash
pnpm install
```

---

## Executando a Aplicação

### Modo Desenvolvimento

Para rodar a aplicação em modo desenvolvimento (com hot-reload):

```bash
pnpm dev
```

A aplicação estará disponível [http://localhost:3000](http://localhost:3000)

### Build de Produção

Para gerar um build de produção:

```bash
pnpm build
```

Para iniciar o servidor de produção:

```bash
pnpm start
```

---

## Scripts Disponíveis

- `pnpm dev` – Inicia o servidor de desenvolvimento
- `pnpm build` – Gera o build para produção
- `pnpm start` – Executa o servidor em modo produção
- `pnpm lint` – Executa o ESLint para checar a qualidade do código
- `pnpm format` – Verifica a formatação do código com o Prettier
- `pnpm format:write` – Corrige automaticamente problemas de formatação

---

## Configuração de Ambiente

O projeto utiliza **Next.js** e requer algumas variáveis de ambiente. Crie um arquivo chamado `.env.local` na raiz do projeto com as variáveis necessárias, por exemplo:

```env
# Adicione aqui as variáveis de ambiente necessárias
# Exemplo:
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Estrutura do Projeto

Diretórios principais e suas funções:

- `/app` – Rotas e páginas da aplicação (Next.js)
- `/components` – Componentes React reutilizáveis
- `/lib` – Funções utilitárias e lógica compartilhada
- `/public` – Arquivos estáticos (imagens, etc.)

---

## Problemas Comuns e Soluções

### Porta já em uso

Se a porta `3000` já estiver ocupada, você pode iniciar o servidor de desenvolvimento em outra porta:

```bash
pnpm dev -p 3001
```

### Problemas com Node Modules

Se ocorrerem problemas relacionados aos módulos Node, tente limpar o cache e reinstalar:

```bash
rm -rf node_modules
pnpm store prune
pnpm install
```

### Erros no Build

Se ocorrerem erros no processo de build:

1. Verifique se todas as dependências estão corretamente instaladas.
2. Limpe o cache do Next.js e tente novamente:

```bash
rm -rf .next
pnpm build
```

---

## Tecnologias Utilizadas

O projeto utiliza:

- **Next.js 14**
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **Clerk** (para autenticação)
- **Radix UI** (componentes de interface)

---

## Considerações de Performance

- O servidor de desenvolvimento pode levar alguns segundos para iniciar na primeira vez.
- O primeiro build pode ser mais demorado devido aos processos de otimização.
- Certifique-se de que o JavaScript está habilitado no navegador, já que esta é uma aplicação React.
