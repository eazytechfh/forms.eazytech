"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"

export default function DiagnosticoContabilidade() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [formData, setFormData] = useState({
    // Seção 1: Identidade e Raízes
    nomeEscritorio: "",
    nomeConsultor: "",
    cnpj: "",
    telefone: "",
    siteLinkedin: "",
    redesSociais: "",
    principalAreaAtuacao: "",
    faturamentoAnual: "",
    numeroColaboradores: "",
    numeroColaboradorescomercial: "",
    numeroClientesAtivos: "",
    missaoEscritorio: "",
    marcoDesafio: "",

    // Seção 2: Estratégia e Objetivos
    objetivosComerciais: "",
    indicadoresDesempenho: "",
    diferenciacaoMercado: "",

    // Seção 3: Cliente Ideal
    segmentoNicho: "",
    porteRegime: "",
    principalDor: "",

    // Seção 4: Máquina de Vendas
    canaisAquisicao: "",
    jornadaVenda: "",
    responsavelVenda: "",
    estiloLideranca: "",

    // Seção 5: Desafios e Oportunidades
    gargalosDesafios: "",
    concorrentes: "",
    visaoFuturo: "",

    // Seção 6: Tecnologia
    ferramentasUtilizadas: "",
    utilizaCRM: "",
    qualCRM: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("https://eazytech-n8n.gsl3ku.easypanel.host/webhook/contabilidade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowSuccessDialog(true)
      } else {
        throw new Error("Erro ao enviar")
      }
    } catch (error) {
      alert("Erro ao enviar diagnóstico. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="flex h-20 w-full items-center justify-between px-4 md:px-6">
        <a
          href="https://www.prospectvendas.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <Image src="/logo.webp" alt="Prospect Vendas" width={200} height={60} className="h-12 w-auto" />
        </a>
      </header>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl text-green-400">
              <CheckCircle2 className="h-8 w-8" />
              Diagnóstico Enviado com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-lg pt-4">
              Suas informações foram recebidas corretamente. Em breve nossa equipe entrará em contato com a análise
              completa do seu escritório.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Diagnóstico Estratégico</h1>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed mb-4">
            Este formulário é o ponto de partida para a elaboração do seu Diagnóstico Estratégico de Análise do seu
            Processo Comercial. O objetivo deste levantamento é coletar informações-chave sobre sua estratégia, operação
            comercial e desafios atuais.
          </p>
          <p className="text-base text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Suas respostas são a matéria-prima para construirmos uma análise aprofundada que revelará os pontos fortes,
            gargalos e as principais oportunidades de crescimento para o seu negócio. O resultado final será um plano
            claro e acionável, projetado para otimizar seu desempenho e acelerar seus resultados.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Questionário de Diagnóstico</CardTitle>
              <CardDescription className="text-gray-300">
                Para garantir a precisão da nossa análise, pedimos que dedique tempo a este preenchimento. A qualidade
                do diagnóstico está diretamente ligada à profundidade das suas respostas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Seção 1: Identidade e Raízes do Escritório */}
                <div className="space-y-6">
                  <div className="border-b border-yellow-600 pb-2">
                    <h2 className="text-2xl font-bold text-yellow-400">Seção 1: Identidade e Raízes do Escritório</h2>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">1.1. Informações de Contato</h3>

                    <div className="space-y-2">
                      <Label htmlFor="nomeEscritorio" className="text-gray-300">
                        Nome do Escritório:
                      </Label>
                      <Input
                        id="nomeEscritorio"
                        value={formData.nomeEscritorio}
                        onChange={(e) => handleInputChange("nomeEscritorio", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nomeConsultor" className="text-gray-300">
                        Nome do Consultor:
                      </Label>
                      <Input
                        id="nomeConsultor"
                        value={formData.nomeConsultor}
                        onChange={(e) => handleInputChange("nomeConsultor", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cnpj" className="text-gray-300">
                        CNPJ:
                      </Label>
                      <Input
                        id="cnpj"
                        value={formData.cnpj}
                        onChange={(e) => handleInputChange("cnpj", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="text-gray-300">
                        Telefone Principal:
                      </Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange("telefone", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="siteLinkedin" className="text-gray-300">
                        Site e LinkedIn do Escritório:
                      </Label>
                      <Input
                        id="siteLinkedin"
                        value={formData.siteLinkedin}
                        onChange={(e) => handleInputChange("siteLinkedin", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Ex: www.meuescritorio.com.br / linkedin.com/company/meuescritorio"
                      />
                    </div>

                                        <div className="space-y-2">
                      <Label htmlFor="redesSociais" className="text-gray-300">
                        Redes Sociais (Links principais, ex: LinkedIn/Instagram):
                      </Label>
                      <Input
                        id="redesSociais"
                        value={formData.redesSociais}
                        onChange={(e) => handleInputChange("redesSociais", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Ex: www.meuescritorio.com.br / linkedin.com/company/meuescritorio"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">1.2. Raio-X do Negócio</h3>

                    <div className="space-y-2">
                      <Label htmlFor="principalAreaAtuacao" className="text-gray-300">
                        Principal Área de Atuação:
                      </Label>
                      <Input
                        id="principalAreaAtuacao"
                        value={formData.principalAreaAtuacao}
                        onChange={(e) => handleInputChange("principalAreaAtuacao", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Ex: Contabilidade para PMEs, BPO Financeiro, Nicho de saúde"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="faturamentoAnual" className="text-gray-300">
                        Faturamento Anual Bruto (último ano):
                      </Label>
                      <Input
                        id="faturamentoAnual"
                        value={formData.faturamentoAnual}
                        onChange={(e) => handleInputChange("faturamentoAnual", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Ex: R$ 1.200.000,00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numeroColaboradores" className="text-gray-300">
                        Número Total de Colaboradores:
                      </Label>
                      <Input
                        id="numeroColaboradores"
                        value={formData.numeroColaboradores}
                        onChange={(e) => handleInputChange("numeroColaboradores", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Ex: 12 no total, sendo 2 no comercial"
                        required
                      />
                    </div>

                                        <div className="space-y-2">
                      <Label htmlFor="numeroColaboradorescomercial" className="text-gray-300">
                        Número de Colaboradores (Comercial):
                      </Label>
                      <Input
                        id="numeroColaboradorescomercial"
                        value={formData.numeroColaboradorescomercial}
                        onChange={(e) => handleInputChange("numeroColaboradorescomercial", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Ex: 2 no comercial"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numeroClientesAtivos" className="text-gray-300">
                        Número de Clientes Ativos:
                      </Label>
                      <Input
                        id="numeroClientesAtivos"
                        value={formData.numeroClientesAtivos}
                        onChange={(e) => handleInputChange("numeroClientesAtivos", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Ex: 95 empresas na carteira"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">1.3. Propósito e Legado</h3>

                    <div className="space-y-2">
                      <Label htmlFor="missaoEscritorio" className="text-gray-300">
                        Além do compliance, qual é a missão do seu escritório?
                      </Label>
                      <Textarea
                        id="missaoEscritorio"
                        value={formData.missaoEscritorio}
                        onChange={(e) => handleInputChange("missaoEscritorio", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                        placeholder="Exemplo: Ser o braço direito estratégico do empresário, usando os números para gerar crescimento."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="marcoDesafio" className="text-gray-300">
                        Qual foi o marco ou desafio mais importante da sua história?
                      </Label>
                      <Textarea
                        id="marcoDesafio"
                        value={formData.marcoDesafio}
                        onChange={(e) => handleInputChange("marcoDesafio", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                        placeholder="Exemplo: A chegada da contabilidade online nos forçou a criar e vender serviços de maior valor, como o BPO."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 2: Estratégia, Objetivos e Métricas */}
                <div className="space-y-6">
                  <div className="border-b border-yellow-600 pb-2">
                    <h2 className="text-2xl font-bold text-yellow-400">
                      Seção 2: Estratégia, Objetivos e Métricas de Sucesso
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">
                      2.1. Objetivos de Curto Prazo (Próximos 6-12 meses)
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="objetivosComerciais" className="text-gray-300">
                        Quais são seus 3 principais objetivos comerciais?
                      </Label>
                      <Textarea
                        id="objetivosComerciais"
                        value={formData.objetivosComerciais}
                        onChange={(e) => handleInputChange("objetivosComerciais", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                        placeholder="Exemplo: 1. Aumentar o ticket médio em 20%; 2. Conquistar 15 novos clientes no nicho de clínicas; 3. Deixar de depender só de indicação."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">2.2. Indicadores de Desempenho (KPIs)</h3>

                    <div className="space-y-2">
                      <Label htmlFor="indicadoresDesempenho" className="text-gray-300">
                        Quais números você acompanha para medir o sucesso comercial?
                      </Label>
                      <Textarea
                        id="indicadoresDesempenho"
                        value={formData.indicadoresDesempenho}
                        onChange={(e) => handleInputChange("indicadoresDesempenho", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                        placeholder='Exemplo: "Nº de propostas enviadas por mês", "Taxa de conversão de indicação" e "Aumento do Faturamento Mensal (MRR)."'
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">2.3. Diferenciação no Mercado</h3>

                    <div className="space-y-2">
                      <Label htmlFor="diferenciacaoMercado" className="text-gray-300">
                        Por que um cliente deveria escolher seu escritório e não um mais barato?
                      </Label>
                      <Textarea
                        id="diferenciacaoMercado"
                        value={formData.diferenciacaoMercado}
                        onChange={(e) => handleInputChange("diferenciacaoMercado", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                        placeholder="Exemplo: Pelas nossas reuniões trimestrais de análise de resultados, que ajudam o cliente a tomar decisões."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 3: O Cliente Ideal */}
                <div className="space-y-6">
                  <div className="border-b border-yellow-600 pb-2">
                    <h2 className="text-2xl font-bold text-yellow-400">
                      Seção 3: O Cliente Ideal (ICP - Ideal Customer Profile)
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">3.1. Perfil do Cliente Ideal</h3>
                    <p className="text-gray-400">Descreva a empresa-cliente ideal para seu escritório:</p>

                    <div className="space-y-2">
                      <Label htmlFor="segmentoNicho" className="text-gray-300">
                        Segmento/Nicho:
                      </Label>
                      <Input
                        id="segmentoNicho"
                        value={formData.segmentoNicho}
                        onChange={(e) => handleInputChange("segmentoNicho", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Ex: Prestadores de serviço de TI, Clínicas médicas, E-commerces"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="porteRegime" className="text-gray-300">
                        Porte e Regime:
                      </Label>
                      <Input
                        id="porteRegime"
                        value={formData.porteRegime}
                        onChange={(e) => handleInputChange("porteRegime", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Ex: Simples Nacional, faturando acima de R$ 80 mil/mês"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="principalDor" className="text-gray-300">
                        Principal "Dor" que vocês resolvem:
                      </Label>
                      <Textarea
                        id="principalDor"
                        value={formData.principalDor}
                        onChange={(e) => handleInputChange("principalDor", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                        placeholder="Ex: Dono perdido no financeiro, Paga mais impostos do que deveria, Falta de organização para crescer"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 4: A Máquina de Vendas */}
                <div className="space-y-6">
                  <div className="border-b border-yellow-600 pb-2">
                    <h2 className="text-2xl font-bold text-yellow-400">
                      Seção 4: A Máquina de Vendas: Processo, Pessoas e Canais
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">4.1. Canais de Aquisição de Clientes</h3>

                    <div className="space-y-2">
                      <Label htmlFor="canaisAquisicao" className="text-gray-300">
                        De onde vem a maioria dos seus novos clientes?
                      </Label>
                      <Textarea
                        id="canaisAquisicao"
                        value={formData.canaisAquisicao}
                        onChange={(e) => handleInputChange("canaisAquisicao", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                        placeholder="Exemplo: 90% de indicação de clientes e parceiros (advogados, consultores)."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">4.2. Jornada de Venda (Passo a Passo)</h3>

                    <div className="space-y-2">
                      <Label htmlFor="jornadaVenda" className="text-gray-300">
                        Descreva as etapas, do contato inicial ao contrato assinado.
                      </Label>
                      <Textarea
                        id="jornadaVenda"
                        value={formData.jornadaVenda}
                        onChange={(e) => handleInputChange("jornadaVenda", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                        placeholder="Exemplo: 1. O indicado me liga. 2. Faço uma reunião. 3. Envio a proposta por e-mail. 4. Cobro uma ou duas vezes."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">4.3. Estrutura da Equipe Comercial</h3>

                    <div className="space-y-2">
                      <Label htmlFor="responsavelVenda" className="text-gray-300">
                        Quem é o responsável por vender no escritório hoje?
                      </Label>
                      <Textarea
                        id="responsavelVenda"
                        value={formData.responsavelVenda}
                        onChange={(e) => handleInputChange("responsavelVenda", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                        placeholder="Exemplo: Eu, o sócio-contador. Faço tudo, da prospecção ao fechamento."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">4.4. Estilo de Liderança e Motivação</h3>

                    <div className="space-y-2">
                      <Label htmlFor="estiloLideranca" className="text-gray-300">
                        Como você gerencia e motiva a área comercial (mesmo que seja só você)?
                      </Label>
                      <Textarea
                        id="estiloLideranca"
                        value={formData.estiloLideranca}
                        onChange={(e) => handleInputChange("estiloLideranca", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                        placeholder="Exemplo: Não temos um processo formal de metas ou comissão. A motivação é o crescimento do negócio."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 5: Desafios, Concorrência e Oportunidades */}
                <div className="space-y-6">
                  <div className="border-b border-yellow-600 pb-2">
                    <h2 className="text-2xl font-bold text-yellow-400">
                      Seção 5: Desafios, Concorrência e Oportunidades
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">5.1. Principais Gargalos e Dores Comerciais</h3>

                    <div className="space-y-2">
                      <Label htmlFor="gargalosDesafios" className="text-gray-300">
                        Qual é sua maior frustração ou desafio ao vender?
                      </Label>
                      <Textarea
                        id="gargalosDesafios"
                        value={formData.gargalosDesafios}
                        onChange={(e) => handleInputChange("gargalosDesafios", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                        placeholder="Exemplo: Não ter tempo para vender de forma estratégica ou Dificuldade de mostrar o valor de serviços consultivos."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">5.2. Concorrência</h3>

                    <div className="space-y-2">
                      <Label htmlFor="concorrentes" className="text-gray-300">
                        Quem são seus 2 principais tipos de concorrentes?
                      </Label>
                      <Textarea
                        id="concorrentes"
                        value={formData.concorrentes}
                        onChange={(e) => handleInputChange("concorrentes", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                        placeholder="Exemplo: 1. As contabilidades online de massa (ex: Contabilizei). 2. O contador tradicional do bairro."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">5.3. Visão de Futuro e Oportunidades</h3>

                    <div className="space-y-2">
                      <Label htmlFor="visaoFuturo" className="text-gray-300">
                        Qual seu grande sonho ou oportunidade para o escritório em 3 anos?
                      </Label>
                      <Textarea
                        id="visaoFuturo"
                        value={formData.visaoFuturo}
                        onChange={(e) => handleInputChange("visaoFuturo", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                        placeholder="Exemplo: Virar uma boutique de serviços financeiros, reconhecida como especialista em um nicho e poder escolher clientes."
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Seção 6: Tecnologia e Ferramentas */}
                <div className="space-y-6">
                  <div className="border-b border-yellow-600 pb-2">
                    <h2 className="text-2xl font-bold text-yellow-400">
                      Seção 6: Tecnologia e Ferramentas (Tech Stack)
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">6.1. Ferramentas Utilizadas</h3>

                    <div className="space-y-2">
                      <Label htmlFor="ferramentasUtilizadas" className="text-gray-300">
                        Quais sistemas e ferramentas são essenciais para sua operação?
                      </Label>
                      <Textarea
                        id="ferramentasUtilizadas"
                        value={formData.ferramentasUtilizadas}
                        onChange={(e) => handleInputChange("ferramentasUtilizadas", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                        placeholder="Exemplo: Sistema Domínio, G-Click, Asaas e planilhas de Excel para o CRM."
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-gray-300">
                        Seu escritório utiliza um sistema de CRM para gestão comercial?
                      </Label>
                      <RadioGroup
                        value={formData.utilizaCRM}
                        onValueChange={(value) => handleInputChange("utilizaCRM", value)}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Sim" id="crm-sim" className="border-gray-400 text-yellow-400" />
                          <Label htmlFor="crm-sim" className="text-gray-300 cursor-pointer">
                            Sim
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Não" id="crm-nao" className="border-gray-400 text-yellow-400" />
                          <Label htmlFor="crm-nao" className="text-gray-300 cursor-pointer">
                            Não, gerenciamos por planilhas ou outro método
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.utilizaCRM === "Sim" && (
                      <div className="space-y-2">
                        <Label htmlFor="qualCRM" className="text-gray-300">
                          Qual CRM?
                        </Label>
                        <Input
                          id="qualCRM"
                          value={formData.qualCRM}
                          onChange={(e) => handleInputChange("qualCRM", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Ex: RD Station, HubSpot, Pipedrive"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-lg"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Diagnóstico"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 Prospect Vendas. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
