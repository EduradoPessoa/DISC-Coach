import React from 'react';
import { LegalLayout } from './LegalLayout';

const TermsOfUse = () => {
  return (
    <LegalLayout title="Termos de Uso">
      <div className="space-y-6 text-slate-700">
        <p>Ao utilizar o <strong>DISC Coach Professional</strong>, você concorda com os presentes Termos de Uso.</p>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Objeto</h3>
            <p>O aplicativo oferece ferramentas de autoconhecimento, análise comportamental e apoio ao desenvolvimento pessoal e profissional, com base na metodologia DISC.</p>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Responsabilidades do usuário</h3>
            <p>O usuário compromete-se a:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Fornecer informações verdadeiras;</li>
                <li>Utilizar o aplicativo de forma ética e legal;</li>
                <li>Não utilizar o app para fins ilícitos ou abusivos.</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Limitações</h3>
            <p>O DISC Coach não substitui aconselhamento psicológico, terapêutico ou médico. As informações fornecidas têm caráter educacional e de desenvolvimento pessoal.</p>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">4. Planos e pagamentos</h3>
            <p>Os planos podem ser gratuitos ou pagos, com cobranças realizadas por parceiros externos. O cancelamento pode ser feito conforme as regras do plano contratado.</p>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">5. Propriedade intelectual</h3>
            <p>Todo o conteúdo do aplicativo é protegido por direitos autorais e pertence ao DISC Coach Professional.</p>
        </section>

        <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
            <p>© 2024 DISC COACH PROFESSIONAL. Todos os direitos reservados.</p>
            <p className="mt-1">Nenhum conteúdo deste aplicativo pode ser reproduzido, distribuído ou utilizado sem autorização prévia.</p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default TermsOfUse;