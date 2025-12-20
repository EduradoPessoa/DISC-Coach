import React from 'react';
import { LegalLayout } from './LegalLayout';

const TermsLGPD = () => {
  return (
    <LegalLayout title="Termos LGPD (Lei Geral de Proteção de Dados)">
      <div className="space-y-6 text-slate-700">
        <p>O <strong>DISC Coach Professional</strong> está em conformidade com a LGPD (Lei nº 13.709/2018) e trata os dados pessoais com base nos seguintes princípios:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Finalidade;</li>
            <li>Necessidade;</li>
            <li>Transparência;</li>
            <li>Segurança;</li>
            <li>Livre acesso.</li>
        </ul>
        
        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Base legal do tratamento:</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Consentimento do titular;</li>
                <li>Execução de contrato;</li>
                <li>Cumprimento de obrigação legal.</li>
            </ul>
        </section>
        
        <p>O usuário pode exercer seus direitos previstos na LGPD entrando em contato pelos canais oficiais da plataforma.</p>

        <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
            <p>© 2024 DISC COACH PROFESSIONAL. Todos os direitos reservados.</p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default TermsLGPD;