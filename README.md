### 🚀 MentorIA – Frontend

## Projeto desenvolvido para Disciplina de Engenharia de Software da Universidade Federal de Pernambuco.

Frontend da plataforma MentorIA, um tutor digital que identifica suas dificuldades, gera trilhas de treino personalizadas e te guia até o domínio completo das competências para ENEM, podendo ser expandido para trilhas diferentes como ITA, IME, concursos e aprendizados variados, como computação.

Nossa demonstração almeja fazer uma prova de conceito a partir das questões de matemática do enem.

## ✅ Este repositório corresponde **ao frontend.** O backend está disponível [aqui](https://github.com/luanromancin/mentorIA-Backend).
## ✅ Build [aqui](https://github.com/gabrielalimasotero/mentorIA-frontend/blob/main/BUILD.md)
## ✅ Contributing [aqui](https://github.com/gabrielalimasotero/mentorIA-frontend/blob/main/CONTRIBUTING.md)

---

## 📄 Descrição Geral

A proposta é transformar a forma como estudantes identificam seus pontos fortes e fracos, utilizando tecnologia, IA e gamificação para acelerar seu progresso.

## 🎯 Funcionalidades Principais Almejadas

- 📊 Dashboard de desempenho
- 🧠 Teste diagnóstico com análise de domínio
- 🎯 Trilhas inteligentes de estudo
- 🔄 Revisão inteligente baseada na curva do esquecimento
- 🔐 Sistema de autenticação e perfis
- 📱 Design responsivo e acessível
- 🏆 Gamificação com XP, conquistas e rankings
- 🚀  ⁠Aplica revisão inteligente (spaced repetition) para retenção eficiente.

---

## 🗂️ Estrutura do Código

```plaintext
├── app/                # Rotas e páginas (App Router Next.js)
├── components/         # Componentes reutilizáveis
├── lib/                # Hooks, funções auxiliares e integrações
├── public/             # Arquivos públicos (imagens, favicon, etc.)
├── styles/             # Estilos globais e temas
├── types/              # Tipagens TypeScript
├── .env.example        # Template de variáveis de ambiente
├── README.md           # Documentação principal
├── BUILD.md            # Guia de execução local e deploy
├── CONTRIBUTING.md     # Guia para contribuição no projeto
└── package.json        # Dependências e scripts
```

## 🏗️ Stack de Tecnologias

| Camada       | Tecnologias                              |
|----------------|-------------------------------------------|
| *Frontend*  | Next.js + React + TypeScript + TailwindCSS + shadcn/ui |
| *Backend*   | Node.js + Express + Prisma + TypeScript  |
| *Banco*     | PostgreSQL (Hospedado na nuvem — Railway ou Neon) |
| *Infraestrutura* | Railway (Backend + DB) + Vercel (Frontend) ou outro |
| *Gestão*    | GitHub Projects (Kanban e gestão ágil)   |

---
🧩 Issues Iniciais

| Issue | Título                                | Labels                      |
| ----- | ------------------------------------- | --------------------------- |
| #1    | Setup do Prisma + Banco no Railway    | `good first issue`, `setup` |
| #2    | Criação de rota de autenticação OAuth | `backend`, `auth`           |
| #3    | Integração com API Gemini para trilha | `intelligence`, `api`       |
| #4    | Estrutura inicial de testes unitários | `testing`, `infra`          |

### Issues
- [Lista de Issues](https://github.com/Luanromancin/mentorIA-backend/issues)
- [Good First Issues](https://github.com/Luanromancin/mentorIA-backend/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first
+issue%22)

## 📚 Recursos Importantes

- [Documentação da API](docs/api.md)
- [Workspace do Projeto](https://github.com/orgs/mentorIA/projects/1)
- [Ferramenta de Revisão de Código](https://github.com/Luanromancin/mentorIA-backend/pulls)
- [Rastreador de Problemas](https://github.com/Luanromancin/mentorIA-backend/issues)

## 🔗 Links Úteis

- [MockUp e PitchDeck](https://mentor-ia-learn.lovable.app/)
- [Documentação de Prompts](https://docs.google.com/document/d/1vQBVSXb1nNO8Fk_R4xubxmScVkbGHsDdypeyhnjqInc/edit?
usp=sharing)

## 👥 Equipe

- Antonio Gabriel - [GitHub](https://github.com/gabrielclemnt)
- Gabriela Lima Sotero - [GitHub](https://github.com/gabrielalimasotero)
- Luan Romancini - [GitHub](https://github.com/Luanromancin)
- Wilton Sales - [GitHub](https://github.com/WilSales)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

