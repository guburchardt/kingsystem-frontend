import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import rentalService from '../../services/rentalService';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export const RentalContractPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rental, setRental] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const contractRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        setLoading(true);
        const response = await rentalService.getRentalById(id!);
        setRental(response.rental);
        
        // Buscar parcelas de pagamento
        const paymentsResponse = await rentalService.getRentalPayments(id!);
        setPayments(paymentsResponse || []);
      } catch (err: any) {
        setError('Erro ao carregar dados da locação');
      } finally {
        setLoading(false);
      }
    };
    fetchRental();
  }, [id]);

  const handleExportPDF = () => {
    if (!contractRef.current) return;
    const opt = {
      margin:       0.5,
      filename:     `Contrato_Locacao_${id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(contractRef.current).save();
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Carregando...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!rental) return null;

  const contratoNumero = rental.id;
  const anoContrato = new Date(rental.event_date).getFullYear();
  const tipoEvento = rental.category || 'Evento';
  const valor = rental.total_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const dataEvento = rental.event_date ? new Date(rental.event_date).toLocaleDateString('pt-BR') : '';
  const horario = rental.start_time && rental.end_time ? `${rental.start_time.slice(0,5)} as ${rental.end_time.slice(0,5)}` : '';
  const veiculo = rental.vehicle_name || '';
  const lotacao = rental.lotacao || rental.vehicle_capacity || '';
  const contratante = rental.client_name || '';
  const telefone = rental.client_phone || '';
  const cpf = rental.client_cpf || '';
  const endereco = rental.client_address || '';
  const bairro = rental.client_neighborhood || '';
  const cidade = rental.client_city || '';
  const cep = rental.client_zip_code || '';
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  // Formatar informações de pagamento
  const formatarPagamentos = () => {
    if (!payments || payments.length === 0) {
      return `PAGAMENTO VIA ${rental.payment_method || 'A DEFINIR'} NO VALOR DE R$ ${valor} em ${dataEvento}`;
    }

    const totalParcelas = payments.length;
    const valorTotal = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const primeiraData = payments[0]?.due_date ? new Date(payments[0].due_date).toLocaleDateString('pt-BR') : dataEvento;
    const metodoPagamento = payments[0]?.method || rental.payment_method || 'A DEFINIR';

    if (totalParcelas === 1) {
      return `PAGAMENTO VIA ${metodoPagamento.toUpperCase()} NO VALOR DE R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} À VISTA em ${primeiraData}`;
    } else {
      return (
        <>
          PAGAMENTO VIA {metodoPagamento.toUpperCase()} NO VALOR TOTAL DE R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} PARCELADO EM {totalParcelas}X:
          <br />
          {payments.map((payment, index) => {
            const dataVencimento = new Date(payment.due_date).toLocaleDateString('pt-BR');
            const valorParcela = parseFloat(payment.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            return (
              <div key={payment.id || index} style={{ marginLeft: '20px' }}>
                {index + 1}ª parcela: R$ {valorParcela} - Vencimento: {dataVencimento}
              </div>
            );
          })}
        </>
      );
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '16px 0 8px 0' }}>
        <button onClick={handleExportPDF} style={{ padding: '8px 18px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>
          Exportar para PDF
        </button>
      </div>
      <div ref={contractRef} style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', padding: 32, fontFamily: 'system-ui, Arial, sans-serif', fontSize: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img src="/images/logo-king.png" alt="King Limousines" style={{ width: 140 }} />
          <div style={{ fontSize: 18 }}>Nº <b>{contratoNumero}</b>/{anoContrato}</div>
        </div>
        <div style={{ textAlign: 'center', margin: '16px 0 8px 0', fontSize: 18, fontWeight: 'bold' }}>
          Contrato de Locação de Limousine
        </div>
        <table style={{ width: '100%', marginBottom: 12 }}>
          <tbody>
            <tr>
              <td style={{ width: '50%' }}>Tipo do Evento: <b>{tipoEvento}</b></td>
              <td>Valor: <b>{valor}</b></td>
            </tr>
            <tr>
              <td>Data do Evento: <b>{dataEvento}</b></td>
              <td>Horário: <b>{horario}</b></td>
            </tr>
            <tr>
              <td>Veículo Contratado: <b>{veiculo}</b></td>
              <td>Lotação: <b>{lotacao}</b></td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginBottom: 12 }}>
          <b>O presente contrato de locação de veículo, de um lado King Limousines, CNPJ: 16.599.495/0001-57, estabelecida na Av. Ceará, 391 - São João, Porto Alegre - RS, CEP: 90470-001, denominada contratada; de outro lado, na qualidade de Contratante, comparece a pessoa de:</b><br />
          Contratante: <b>{contratante}</b> | Telefone: <b>{telefone}</b> | CPF: <b>{cpf}</b><br />
          Endereço: <b>{endereco}</b> - Bairro: <b>{bairro}</b> - Cidade: <b>{cidade}</b> - CEP: <b>{cep}</b>
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>A contratada declara haver recebido do contratante o valor no ato da assinatura deste contrato, como forma de pagamento {formatarPagamentos()}.</b>
          <br />Abaixo, seguem as regras referentes à utilização:<br />
          1- É proibido fumar ou utilizar qualquer substância ilícita no interior do veículo.<br />
          2- A conservação das partes internas do veículo é de inteira responsabilidade do(s) usuário (s).<br />
          3- Caso aconteça algum tipo de dano ou prejuízo decorrente de mau uso, o contratante ressarcirá no montante relativo ao dano.<br />
          4- Cada hora adicional custará R$ 1500,00 para Limousine Gigante e R$ 1.000,00 para as demais limousines. O período excedido será cobrado ao final do serviço, conforme acordado previamente com o contratante.<br />
          5- Em caso de desistência, o valor pago ficará em créditos para usar em outra locação.<br />
          6- Em caso de algum problema com o carro locado, O valor será devolvido integralmente ao contratante.<br />
          7- O contratante declara estar ciente das normas de utilização do(s) veículo(s), responsabiliza-se pelo cumprimento do acordo acima, bem como por orientar as pessoas que o estarão acompanhando durante a locação.<br />
          8- A reserva confirmada após identificação do pagamento.<br />
          9- A hora adicional pode ser contratado somente se não houver evento agendado.<br />
          10- O não pagamento até a data do vencimento acarreta multa por atraso de 10% + correção diária de 0,59%.<br />
          11- Menores de 14 anos deverão estar acompanhados dos pais ou responsáveis. Caso contrário deverão ser autorizados. Quando o passeio se der fora da região metropolitana, somente com autorização do juizado de menores se desacompanhados dos Pais.<br />
          12- É expressamente proibido o uso ou consumo de bebidas alcoólicas por menores de 18 anos.<br />
          13- É proibido estourar champanhe dentro do veículo.<br />
          14- Teto-solar: Pela legislação de trânsito, não é permitido a utilizaçào do teto solar com o veículo em movimento. O mesmo só poderá ser usado com o veículo estacionado para efeito de fotos e vídeos.<br />
          <br /><b>Esclarecimento e ciência aos clientes:</b><br />
          Considerando que os veículos locados estão sujeitos a sofrerem avarias durante o período da locação, desde já esclarecemos que qualquer pane ocorrida nos mesmos, acarretará a substituição por outro equivalente no prazo de 30(trinta) minutos, se a locação for na Capital, e de até 60 ( sessenta minutos) caso se dê em outra localidade da região metropolitana. Nos casos em que o deslocamento for acima de 100 (cem) quilômetros, serão oferecidas outras possibilidades de composição aos locatários.
        </div>
        <table style={{ width: '100%', marginTop: 40 }}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center', width: '50%' }}>
                <div>{contratante}<br />Contratante</div>
              </td>
              <td style={{ textAlign: 'center', width: '50%' }}>
                <div>Márcia Costa 952.098.080-68<br />Representante da Contratada</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: 'center', marginTop: 24, fontWeight: 'bold' }}>
          Porto Alegre, {dataHoje}
        </div>
      </div>
    </div>
  );
}; 