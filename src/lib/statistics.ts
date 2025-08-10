import { api } from './api';

// Interfaces para as estatísticas
export interface UserStatistics {
    general: {
        total_questions: number;
        total_correct: number;
        overall_accuracy: number;
    };
    by_topic: Array<{
        topic_name: string;
        questions_answered: number;
        correct_answers: number;
        accuracy_percentage: number;
    }>;
    by_competency: Array<{
        subtopic_name: string;
        questions_answered: number;
        correct_answers: number;
        accuracy_percentage: number;
    }>;
}

export interface CompetencyStatistics {
    questions_answered: number;
    correct_answers: number;
    accuracy_percentage: number;
}

export interface TopicStatistics {
    questions_answered: number;
    correct_answers: number;
    accuracy_percentage: number;
}

export interface CompetencyRanking {
    subtopic_name: string;
    questions_answered: number;
    correct_answers: number;
    accuracy_percentage: number;
}

export interface WeakCompetencies {
    threshold: number;
    competencies: CompetencyRanking[];
}

export interface QuestionAnswer {
    questionId: string;
    subtopicName: string;
    topicName: string;
    isCorrect: boolean;
}

// Classe para gerenciar as APIs de estatísticas
export class StatisticsService {
    /**
     * Registra uma resposta do usuário
     */
    static async recordAnswer(answer: QuestionAnswer): Promise<void> {
        try {
            const response = await api.post('/statistics/record-answer', answer);
            return response.data;
        } catch (error) {
            console.error('Erro ao registrar resposta:', error);
            throw error;
        }
    }

    /**
     * Obtém estatísticas completas do usuário
     */
    static async getUserStatistics(): Promise<UserStatistics> {
        try {
            const response = await api.get('/statistics/user');
            return response.data.data;
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            throw error;
        }
    }

    /**
     * Obtém estatísticas por competência específica
     */
    static async getCompetencyStatistics(subtopicName: string): Promise<CompetencyStatistics | null> {
        try {
            const response = await api.get(`/statistics/competency/${encodeURIComponent(subtopicName)}`);
            return response.data.data;
        } catch (error) {
            console.error('Erro ao obter estatísticas da competência:', error);
            throw error;
        }
    }

    /**
     * Obtém estatísticas por tópico específico
     */
    static async getTopicStatistics(topicName: string): Promise<TopicStatistics | null> {
        try {
            const response = await api.get(`/statistics/topic/${encodeURIComponent(topicName)}`);
            return response.data.data;
        } catch (error) {
            console.error('Erro ao obter estatísticas do tópico:', error);
            throw error;
        }
    }

    /**
     * Obtém ranking de competências do usuário
     */
    static async getCompetencyRanking(): Promise<CompetencyRanking[]> {
        try {
            const response = await api.get('/statistics/ranking');
            return response.data.data;
        } catch (error) {
            console.error('Erro ao obter ranking de competências:', error);
            throw error;
        }
    }

    /**
     * Obtém competências que precisam de mais atenção
     */
    static async getWeakCompetencies(threshold: number = 70): Promise<WeakCompetencies> {
        try {
            const response = await api.get(`/statistics/weak-competencies?threshold=${threshold}`);
            return response.data.data;
        } catch (error) {
            console.error('Erro ao obter competências fracas:', error);
            throw error;
        }
    }

    /**
     * Obtém estatísticas formatadas para exibição
     */
    static formatStatistics(statistics: UserStatistics) {
        return {
            general: {
                totalQuestions: statistics.general.total_questions,
                totalCorrect: statistics.general.total_correct,
                overallAccuracy: statistics.general.overall_accuracy,
                formattedAccuracy: `${statistics.general.overall_accuracy.toFixed(1)}%`
            },
            byTopic: statistics.by_topic.map(topic => ({
                name: topic.topic_name,
                questionsAnswered: topic.questions_answered,
                correctAnswers: topic.correct_answers,
                accuracy: topic.accuracy_percentage,
                formattedAccuracy: `${topic.accuracy_percentage.toFixed(1)}%`
            })),
            byCompetency: statistics.by_competency.map(comp => ({
                name: comp.subtopic_name,
                questionsAnswered: comp.questions_answered,
                correctAnswers: comp.correct_answers,
                accuracy: comp.accuracy_percentage,
                formattedAccuracy: `${comp.accuracy_percentage.toFixed(1)}%`
            }))
        };
    }

    /**
     * Calcula o nível de domínio baseado na acurácia
     */
    static getMasteryLevel(accuracy: number): 'beginner' | 'intermediate' | 'advanced' {
        if (accuracy >= 80) return 'advanced';
        if (accuracy >= 60) return 'intermediate';
        return 'beginner';
    }

    /**
     * Obtém cor baseada no nível de domínio
     */
    static getMasteryColor(accuracy: number): string {
        const level = this.getMasteryLevel(accuracy);
        switch (level) {
            case 'advanced':
                return 'text-green-600';
            case 'intermediate':
                return 'text-yellow-600';
            case 'beginner':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    }

    /**
     * Obtém ícone baseado no nível de domínio
     */
    static getMasteryIcon(accuracy: number): string {
        const level = this.getMasteryLevel(accuracy);
        switch (level) {
            case 'advanced':
                return '🎯';
            case 'intermediate':
                return '📈';
            case 'beginner':
                return '📚';
            default:
                return '❓';
        }
    }
} 