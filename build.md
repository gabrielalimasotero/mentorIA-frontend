## Guia de Configuração e Execução Local - Frontend

    Este documento fornece instruções detalhadas sobre como configurar e executar o projeto frontend localmente.

## 🚀 Como Rodar o Projeto Rapidamente
    Para configurar e rodar o projeto em sua máquina local para fins de desenvolvimento, siga estes passos essenciais na pasta do projeto:

        Instale as dependências:
        ```bash
        npm install
        ```

        Inicie o servidor de desenvolvimento:
        ```bash
        npm run dev
        ```

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14.x ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)
- Um editor de código de sua preferência (recomendamos VSCode)

Um editor de código de sua preferência (recomendamos VSCode)

## 🔧 Configuração do Ambiente

1. Clone o repositório para sua máquina local:
   ```bash
   git clone [https://github.com/Luanromancin/mentorIA-backend]
   cd mentorIA-backend
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie os seguintes arquivos na raiz do projeto:
     - `.env` para ambiente de desenvolvimento
     - `.env.test` para ambiente de testes
  Você pode usar o arquivo .env.example e env.test.example como um template para saber quais variáveis são necessárias.

As credenciais para o banco de dados e outros serviços não estão incluídas no repositório por questões de segurança. Para obtê-las, por favor, entre em contato com Luan Romancin via e-mail: [lorl@cin.ufpe.com].



Configure as variáveis de ambiente:

O projeto precisa da URL do backend para funcionar.

Crie um arquivo chamado .env na raiz do projeto.

Copie o conteúdo do arquivo env.example para o novo arquivo .env.

Preencha a variável VITE_API_URL com o endereço do seu backend.

Scripts Disponíveis
O projeto inclui os seguintes scripts npm:

npm run dev: Inicia o servidor de desenvolvimento com hot-reload.

npm run build: Compila o projeto para o ambiente de produção, gerando arquivos otimizados na pasta dist/.

npm run preview: Inicia um servidor estático para visualizar a build de produção.

npm run lint: Executa a análise de lint para encontrar e corrigir problemas de formatação.

📚 Tecnologias Utilizadas
Este projeto foi construído com as seguintes tecnologias:

Vite: Ferramenta de build para um desenvolvimento rápido.

React: Biblioteca para construção de interfaces.

TypeScript: Linguagem para tipagem de código.

Tailwind CSS: Framework CSS utility-first para estilização.

Shadcn/ui: Biblioteca de componentes UI para React.
