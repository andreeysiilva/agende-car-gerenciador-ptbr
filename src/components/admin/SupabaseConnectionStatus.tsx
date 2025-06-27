
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Database, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionTest {
  name: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  icon: React.ReactNode;
}

export function SupabaseConnectionStatus() {
  const [tests, setTests] = useState<ConnectionTest[]>([
    {
      name: 'Conexão Básica',
      status: 'loading',
      message: 'Testando...',
      icon: <Database className="h-4 w-4" />
    },
    {
      name: 'Tabela Agendamentos',
      status: 'loading',
      message: 'Verificando...',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      name: 'Autenticação',
      status: 'loading',
      message: 'Verificando...',
      icon: <Users className="h-4 w-4" />
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    
    // Resetar todos os testes
    setTests(prev => prev.map(test => ({ ...test, status: 'loading', message: 'Testando...' })));

    const newTests: ConnectionTest[] = [];

    // Teste 1: Conexão básica
    try {
      const { data, error } = await supabase.from('agendamentos').select('count').limit(1);
      
      if (error) {
        newTests.push({
          name: 'Conexão Básica',
          status: 'error',
          message: `Erro: ${error.message}`,
          icon: <Database className="h-4 w-4" />
        });
      } else {
        newTests.push({
          name: 'Conexão Básica',
          status: 'success',
          message: 'Conectado com sucesso',
          icon: <Database className="h-4 w-4" />
        });
      }
    } catch (error) {
      newTests.push({
        name: 'Conexão Básica',
        status: 'error',
        message: `Erro de rede: ${error instanceof Error ? error.message : 'Desconhecido'}`,
        icon: <Database className="h-4 w-4" />
      });
    }

    // Teste 2: Tabela de agendamentos
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('id, nome_cliente, data_agendamento')
        .limit(5);

      if (error) {
        newTests.push({
          name: 'Tabela Agendamentos',
          status: 'error',
          message: `Erro na consulta: ${error.message}`,
          icon: <Calendar className="h-4 w-4" />
        });
      } else {
        newTests.push({
          name: 'Tabela Agendamentos',
          status: 'success',
          message: `${data?.length || 0} registros encontrados`,
          icon: <Calendar className="h-4 w-4" />
        });
      }
    } catch (error) {
      newTests.push({
        name: 'Tabela Agendamentos',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`,
        icon: <Calendar className="h-4 w-4" />
      });
    }

    // Teste 3: Autenticação
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        newTests.push({
          name: 'Autenticação',
          status: 'error',
          message: `Erro de auth: ${error.message}`,
          icon: <Users className="h-4 w-4" />
        });
      } else {
        newTests.push({
          name: 'Autenticação',
          status: 'success',
          message: session ? 'Usuário autenticado' : 'Sem autenticação (OK para teste)',
          icon: <Users className="h-4 w-4" />
        });
      }
    } catch (error) {
      newTests.push({
        name: 'Autenticação',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`,
        icon: <Users className="h-4 w-4" />
      });
    }

    setTests(newTests);
    setIsLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusBadge = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Sucesso</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Erro</Badge>;
      case 'loading':
        return <Badge className="bg-yellow-100 text-yellow-800"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Testando</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status da Integração Supabase
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runTests}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Testar Novamente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {test.icon}
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-gray-600">{test.message}</div>
                </div>
              </div>
              {getStatusBadge(test.status)}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Informações da Conexão</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>URL:</strong> https://lztntncrgenyvkotfgig.supabase.co</p>
            <p><strong>Projeto:</strong> lztntncrgenyvkotfgig</p>
            <p><strong>Status:</strong> {tests.every(t => t.status === 'success') ? 'Todas as verificações passaram' : 'Algumas verificações falharam'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
