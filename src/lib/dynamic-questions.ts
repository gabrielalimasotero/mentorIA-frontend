import { api } from './api';

// Tipos para questões dinâmicas
export interface DynamicQuestion {
  id: string;
  title: string;
  year: number;
  questionIndex: number;
  language: string;
  field: string;
  problemStatement: string;
  files: any[];
  topicName?: string;
  subtopicName?: string;
  explanation?: string;
  alternatives: Array<{
    id: string;
    letter: string;
    text: string;
    file?: string;
    isCorrect: boolean;
  }>;
  competencyLevel: number;
}

export interface UserCompetency {
  id: string;
  profileId: string;
  competencyId: string;
  level: number;
  lastEvaluatedAt?: string;
  competency?: {
    id: string;
    code: string;
    name: string;
    description?: string;
  };
}

export interface SubmitAnswerRequest {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  competencyName: string;
}

// Serviço para questões dinâmicas
export const dynamicQuestionsService = {
  // Buscar sessão completa (competências + questões)
  async getSession(maxQuestions?: number): Promise<{
    userCompetencies: any[];
    questions: DynamicQuestion[];
    sessionId: string;
  }> {
    try {
      console.log('🚀 Iniciando carregamento de sessão...');
      const params = maxQuestions ? { maxQuestions } : {};
      
      const response = await api.get('/questions/session', { params });
      console.log('✅ Sessão carregada:', response.data);
      
      if (response.data.msgCode === 'success') {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || 'Erro ao carregar sessão');
      }
    } catch (error: any) {
      console.error('❌ Erro ao carregar sessão:', error);
      throw new Error(error.response?.data?.msg || 'Erro ao carregar sessão');
    }
  },

  // Buscar questões dinâmicas (método legado)
  async getDynamicQuestions(maxQuestions?: number): Promise<DynamicQuestion[]> {
    try {
      console.log('🚀 Iniciando busca de questões dinâmicas...');
      const params = maxQuestions ? { maxQuestions } : {};
      console.log('📋 Parâmetros:', params);
      
      // Verificar cache primeiro
      const cacheKey = `questions_${maxQuestions || 20}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.log('📦 Usando questões do cache');
        return JSON.parse(cached);
      }
      
      console.log('🌐 Fazendo requisição para o backend...');
      const response = await api.get('/questions/dynamic', { params });
      console.log('✅ Resposta recebida:', response.data);
      
      if (response.data.success) {
        console.log(`📚 ${response.data.data.length} questões carregadas com sucesso`);
        // Salvar no cache por 1 hora
        localStorage.setItem(cacheKey, JSON.stringify(response.data.data));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar questões');
      }
    } catch (error: any) {
      console.error('❌ Erro ao buscar questões dinâmicas:', error);
      console.error('📊 Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        timeout: error.code === 'ECONNABORTED'
      });
      
      // Se der timeout, tentar usar cache antigo
      if (error.code === 'ECONNABORTED') {
        console.log('⏰ Timeout detectado, tentando usar cache...');
        const cacheKey = `questions_${maxQuestions || 20}`;
        const cached = localStorage.getItem(cacheKey);
        const timestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        
        if (cached && timestamp) {
          const age = Date.now() - parseInt(timestamp);
          if (age < 3600000) { // 1 hora
            console.log('📦 Usando cache antigo devido ao timeout');
            return JSON.parse(cached);
          }
        }
      }
      
      // Fallback para dados mock se tudo falhar
      console.log('🔄 Usando dados mock como fallback');
      return this.getMockQuestions(maxQuestions || 20);
    }
  },

  // Dados mock para fallback
  getMockQuestions(count: number): DynamicQuestion[] {
    const mockQuestions: DynamicQuestion[] = [
      {
        id: "2020-167",
        title: "ENEM 2020- Questão 167",
        year: 2020,
        questionIndex: 167,
        language: "pt-br",
        field: "matematica",
        problemStatement: "O quadro representa os gastos mensais, em real, de uma família com internet, mensalidade escolar e mesada do filho. No início do ano, a internet e a mensalidade escolar tiveram acréscimos, respectivamente, de 20% e 10%. Necessitando manter o valor da despesa mensal total com os itens citados, a família reduzirá a mesada do filho. Qual será a porcentagem da redução da mesada?",
        files: ["b97cd861-19d3-4103-8332-c96d5cdc6bf0.png"],
        topicName: "Porcentagem",
        subtopicName: "Acréscimo e Desconto Percentual",
        explanation: "O gasto inicial é 120 + 700 + 400 = 1220. Com os acréscimos, internet passa para 120 * 1,20 = 144 e a mensalidade para 700 * 1,10 = 770, totalizando 144 + 770 = 914. A nova mesada será 1220 - 914 = 306. A redução foi de 400 - 306 = 94, que corresponde a (94/400) * 100% = 23,5%. Resposta: 23,5.",
        alternatives: [
          { id: "1", letter: "A", text: "15,0", file: null, isCorrect: false },
          { id: "2", letter: "B", text: "23,5", file: null, isCorrect: true },
          { id: "3", letter: "C", text: "30,0", file: null, isCorrect: false },
          { id: "4", letter: "D", text: "70,0", file: null, isCorrect: false },
          { id: "5", letter: "E", text: "76,5", file: null, isCorrect: false }
        ],
        competencyLevel: 0
      },
      {
        id: "2022-139",
        title: "ENEM 2022- Questão 139",
        year: 2022,
        questionIndex: 139,
        language: "pt-br",
        field: "matematica",
        problemStatement: "Um casal está reformando a cozinha de casa e decidiu comprar um refrigerador novo. Observando a planta da nova cozinha, desenhada na escala de 1: 50, notaram que o espaço destinado ao refrigerador tinha 3,8 cm de altura e 1,6 cm de largura. Eles sabem que os fabricantes de refrigeradores indicam que, para um bom funcionamento e fácil manejo na limpeza, esses eletrodomésticos devem ser colocados em espaços que permitam uma distância de, pelo menos, 10 cm de outros móveis ou paredes, tanto na parte superior quanto nas laterais. O casal comprou um refrigerador que caberia no local a ele destinado na nova cozinha, seguindo as instruções do fabricante. Esse refrigerador tem altura e largura máximas, em metro, respectivamente, iguais a",
        files: [],
        topicName: "Escala",
        subtopicName: "Aplicação de escalas em situações-problema",
        explanation: "A escala é 1:50, então cada 1 cm no desenho equivale a 50 cm na realidade. Altura real: 3,8 cm * 50 = 190 cm = 1,90 m. Largura real: 1,6 cm * 50 = 80 cm = 0,80 m. Considerando os 10 cm de folga de cada lado (20 cm no total), o refrigerador pode ter no máximo 1,90 m de altura e 0,80 m de largura.",
        alternatives: [
          { id: "6", letter: "A", text: "1,80 e 0,60.", file: null, isCorrect: true },
          { id: "7", letter: "B", text: "1,80 e 0,70.", file: null, isCorrect: false },
          { id: "8", letter: "C", text: "1,90 e 0,80.", file: null, isCorrect: false },
          { id: "9", letter: "D", text: "2,00 e 0,90.", file: null, isCorrect: false },
          { id: "10", letter: "E", text: "2,00 e 1,00.", file: null, isCorrect: false }
        ],
        competencyLevel: 0
      }
    ];
    
    return mockQuestions.slice(0, count);
  },

  // Finalizar sessão e atualizar competências
  async completeSession(answers: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
    competencyName: string;
  }>): Promise<void> {
    try {
      console.log('🏁 Finalizando sessão com', answers.length, 'respostas');
      const response = await api.post('/questions/session/complete', { answers });
      
      if (response.data.msgCode !== 'success') {
        throw new Error(response.data.msg || 'Erro ao finalizar sessão');
      }
      console.log('✅ Sessão finalizada com sucesso');
    } catch (error: any) {
      console.error('❌ Erro ao finalizar sessão:', error);
      throw new Error(error.response?.data?.msg || 'Erro ao finalizar sessão');
    }
  },

  // Submeter resposta (método legado)
  async submitAnswer(data: SubmitAnswerRequest): Promise<void> {
    try {
      const response = await api.post('/questions/answer', data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Erro ao submeter resposta');
      }
    } catch (error: any) {
      console.error('Erro ao submeter resposta:', error);
      throw new Error(error.response?.data?.message || 'Erro ao submeter resposta');
    }
  },

  // Pré-carregar dados do usuário após login
  async preloadUserData(): Promise<void> {
    try {
      console.log('🚀 Iniciando pré-carregamento de dados do usuário...');
      const response = await api.post('/questions/preload');
      
      if (response.data.msgCode === 'success') {
        console.log('✅ Pré-carregamento concluído:', response.data.data);
      } else {
        throw new Error(response.data.msg || 'Erro no pré-carregamento');
      }
    } catch (error: any) {
      console.error('❌ Erro no pré-carregamento:', error);
      // Não falhar o login se o pré-carregamento falhar
      console.log('⚠️ Pré-carregamento falhou, mas login continuará');
    }
  },

  // Buscar competências do usuário
  async getUserCompetencies(): Promise<UserCompetency[]> {
    try {
      const response = await api.get('/questions/competencies/user');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar competências');
      }
    } catch (error: any) {
      console.error('Erro ao buscar competências:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar competências');
    }
  }
}; 