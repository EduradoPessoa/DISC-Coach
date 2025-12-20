import React from 'react';
import { LegalLayout } from './LegalLayout';

const PrivacyPolicy = () => {
  return (
    <LegalLayout title="Política de Privacidade">
      <div className="space-y-6 text-slate-700">
        <p>A sua privacidade é importante para nós. Esta Política de Privacidade descreve como o <strong>DISC Coach Professional</strong> coleta, utiliza, armazena e protege os dados pessoais dos usuários.</p>
        
        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Coleta de informações</h3>
            <p>Coletamos apenas as informações necessárias para o funcionamento do aplicativo, tais como:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Dados de cadastro (nome, e-mail, telefone);</li>
                <li>Informações de perfil comportamental (DISC);</li>
                <li>Dados de uso da plataforma;</li>
                <li>Informações de pagamento (processadas por parceiros de pagamento, como a AbacatePay).</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Uso das informações</h3>
            <p>Os dados são utilizados para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Permitir o acesso e uso do aplicativo;</li>
                <li>Personalizar a experiência do usuário;</li>
                <li>Gerar relatórios e análises comportamentais;</li>
                <li>Enviar comunicações relacionadas ao uso do app;</li>
                <li>Cumprir obrigações legais.</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Compartilhamento de dados</h3>
            <p>Não vendemos nem comercializamos dados pessoais. O compartilhamento ocorre apenas:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Com parceiros essenciais para a operação do serviço;</li>
                <li>Quando exigido por lei ou autoridade competente;</li>
                <li>Mediante consentimento explícito do usuário.</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">4. Segurança</h3>
            <p>Adotamos medidas técnicas e organizacionais para proteger os dados contra acesso não autorizado, perda ou uso indevido.</p>
        </section>

        <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">5. Direitos do usuário</h3>
            <p>O usuário pode solicitar, a qualquer momento:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Acesso, correção ou exclusão de seus dados;</li>
                <li>Revogação do consentimento;</li>
                <li>Portabilidade das informações.</li>
            </ul>
        </section>

        <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
            <p>© 2024 DISC COACH PROFESSIONAL. Todos os direitos reservados.</p>
        </div>
      </div>
    </LegalLayout>
  );
};

export default PrivacyPolicy;