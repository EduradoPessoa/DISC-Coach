import React from 'react';
import { LegalLayout } from './LegalLayout';

const CookiePolicy = () => {
  return (
    <LegalLayout title="Política de Cookies">
      <div className="space-y-6 text-slate-700">
        <p>Utilizamos cookies e tecnologias similares para:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Garantir o funcionamento adequado do aplicativo;</li>
            <li>Melhorar a experiência do usuário;</li>
            <li>Analisar métricas de uso e desempenho.</li>
        </ul>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tipos de cookies:</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Essenciais:</strong> necessários para o funcionamento do app;</li>
                <li><strong>Funcionais:</strong> melhoram a navegação e personalização;</li>
                <li><strong>Analíticos:</strong> ajudam a entender como o app é utilizado.</li>
            </ul>
        </section>

        <p>O usuário pode gerenciar ou desativar cookies nas configurações do navegador, ciente de que isso pode afetar algumas funcionalidades.</p>

        <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
            <p>© 2024 DISC COACH PROFESSIONAL. Todos os direitos reservados.</p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default CookiePolicy;