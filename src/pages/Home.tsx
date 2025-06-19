
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Target, BarChart3, Clock, CheckCircle, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';

interface HomeProps {
  onGetStarted: () => void;
}

const Home = ({ onGetStarted }: HomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#084d6e] rounded-xl flex items-center justify-center mr-3">
                <Brain className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-bold text-[#084d6e]">
                Mentor<span className="text-[#0a5a7a]">IA</span>
              </h1>
            </div>
            <Button
              onClick={onGetStarted}
              className="bg-[#084d6e] hover:bg-[#073f56] text-white px-6"
            >
              Entrar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="w-20 h-20 bg-[#084d6e] rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Brain className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-5xl font-bold text-[#084d6e] mb-6">
            Sua jornada rumo ao ENEM começa aqui
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            O MentorIA é sua plataforma inteligente de estudos para o ENEM. 
            Com diagnósticos personalizados, trilhas adaptativas e simulados realistas, 
            você terá tudo que precisa para alcançar sua aprovação.
          </p>
          <Button
            onClick={onGetStarted}
            className="bg-[#084d6e] hover:bg-[#073f56] text-white px-8 py-6 text-lg font-semibold rounded-xl"
            size="lg"
          >
            Comece Agora Gratuitamente
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-[#084d6e] text-center mb-12">
            Por que escolher o MentorIA?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#084d6e]/10 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#084d6e]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-[#084d6e]" />
                </div>
                <h4 className="text-xl font-semibold text-[#084d6e] mb-3">
                  Diagnóstico Inteligente
                </h4>
                <p className="text-gray-600">
                  Avalie seu nível atual e descubra exatamente onde focar seus estudos 
                  com nossa análise personalizada.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#084d6e]/10 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#084d6e]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[#084d6e]" />
                </div>
                <h4 className="text-xl font-semibold text-[#084d6e] mb-3">
                  Trilhas Personalizadas
                </h4>
                <p className="text-gray-600">
                  Estude seguindo um caminho otimizado para suas necessidades, 
                  com conteúdo adaptado ao seu ritmo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#084d6e]/10 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#084d6e]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-[#084d6e]" />
                </div>
                <h4 className="text-xl font-semibold text-[#084d6e] mb-3">
                  Acompanhamento Detalhado
                </h4>
                <p className="text-gray-600">
                  Monitore seu progresso em tempo real com gráficos e relatórios 
                  que mostram sua evolução.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#084d6e]/5 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-[#084d6e] mb-6">
                Tudo que você precisa em um só lugar
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#084d6e] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#084d6e] mb-1">Simulados Realistas</h4>
                    <p className="text-gray-600">Pratique com questões no formato do ENEM real</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#084d6e] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#084d6e] mb-1">Pausar e Continuar</h4>
                    <p className="text-gray-600">Estude no seu ritmo, pausando quando necessário</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#084d6e] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#084d6e] mb-1">Sistema de Metas</h4>
                    <p className="text-gray-600">Acompanhe conquistas e mantenha a motivação</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#084d6e] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#084d6e] mb-1">Análise por Tópico</h4>
                    <p className="text-gray-600">Veja seu rendimento detalhado em cada matéria</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#084d6e] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-[#084d6e] mb-2">
                  Resultados Comprovados
                </h4>
                <p className="text-gray-600 mb-6">
                  Estudantes que usam nossa plataforma têm 3x mais chances 
                  de atingir a nota desejada no ENEM.
                </p>
                <div className="flex justify-center gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-[#084d6e]">85%</div>
                    <div className="text-sm text-gray-600">Aprovação</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#084d6e]">+200</div>
                    <div className="text-sm text-gray-600">Pontos média</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#084d6e]">
        <div className="container mx-auto text-center max-w-4xl">
          <h3 className="text-3xl font-bold text-white mb-6">
            Pronto para começar sua preparação?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de estudantes que já estão se preparando 
            de forma inteligente para o ENEM.
          </p>
          <Button
            onClick={onGetStarted}
            className="bg-white hover:bg-gray-100 text-[#084d6e] px-8 py-6 text-lg font-semibold rounded-xl"
            size="lg"
          >
            <Clock className="w-5 h-5 mr-2" />
            Começar Agora - É Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-[#084d6e] rounded-lg flex items-center justify-center mr-2">
              <Brain className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-bold text-[#084d6e]">
              Mentor<span className="text-[#0a5a7a]">IA</span>
            </span>
          </div>
          <p className="text-gray-600">
            © 2024 MentorIA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
