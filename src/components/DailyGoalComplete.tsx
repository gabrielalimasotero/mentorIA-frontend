
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Target, TrendingUp } from 'lucide-react';

interface DailyGoalCompleteProps {
  onContinue: () => void;
  onFinish: () => void;
}

const DailyGoalComplete = ({ onContinue, onFinish }: DailyGoalCompleteProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-yellow-800 mb-2">
            🎉 Parabéns!
          </CardTitle>
          <p className="text-lg text-yellow-700">
            Você concluiu sua meta diária de 20 questões!
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-yellow-200">
              <div className="w-10 h-10 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-800">20</div>
              <div className="text-sm text-yellow-600">Questões</div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm border border-yellow-200">
              <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-800">+50</div>
              <div className="text-sm text-green-600">XP Ganho</div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm border border-yellow-200">
              <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-800">+1</div>
              <div className="text-sm text-blue-600">Sequência</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Continue evoluindo! 📚
            </h3>
            <p className="text-gray-600 mb-4">
              Consistência é a chave para o sucesso no ENEM. Que tal fazer mais 20 questões 
              para acelerar ainda mais seu aprendizado?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onContinue}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            >
              <Target className="w-4 h-4 mr-2" />
              Fazer Mais 20 Questões
            </Button>
            <Button 
              onClick={onFinish}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3"
            >
              Finalizar Por Hoje
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Dica do dia</h4>
            <p className="text-sm text-blue-700">
              Estudar um pouco todos os dias é mais eficaz que longas sessões esporádicas. 
              Mantenha sua sequência de estudos!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyGoalComplete;
