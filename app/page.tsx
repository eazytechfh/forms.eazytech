"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"

export default function ProspectForms() {
  const [isSubmittingDiretoria, setIsSubmittingDiretoria] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const handleDiretoriaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingDiretoria(true)

    const formData = new FormData(e.currentTarget)

    const data = {
      data: formData.get("data"),
      nomeContatoprincipal: formData.get("nomeContatoprincipal"),
      cliente: formData.get("cliente"),
      telefoneContato: formData.get("telefoneContato"),
      cnpj: formData.get("cnpj"),
      website: formData.get("website"),
      redesSociais: formData.get("redesSociais"),
      areaAtuacao: formData.get("areaAtuacao"),
      faturamentoAnual: formData.get("faturamentoAnual"),
      numeroFuncionarios: formData.get("numeroFuncionarios"),
      numeroFuncionariosComercial: formData.get("numeroFuncionariosComercial"),
      quantidadeClientesAtivos: formData.get("quantidadeClientesAtivos"),
      enderecoEmpresa: formData.get("enderecoEmpresa"),

      // Seção 1: Visão Estratégica e Objetivos
      marcosMoldaram: formData.get("marcosMoldaram"),
      proposito: formData.get("proposito"),
      objetivosComerciais: formData.get("objetivosComerciais"),
      sonhoFuturo: formData.get("sonhoFuturo"),
      principalDesafio: formData.get("principalDesafio"),

      // Seção 2: Mercado e Posicionamento
      perfilClienteIdeal: formData.get("perfilClienteIdeal"),
      principaisConcorrentes: formData.get("principaisConcorrentes"),
      diferencialReal: formData.get("diferencialReal"),
      tendenciasMercado: formData.get("tendenciasMercado"),
      buscadosclientesideais: formData.get("buscadosclientesideais"),

      // Seção 3: Processo de Aquisição e Venda
      canaisAquisicao: formData.get("canaisAquisicao"),
      jornadaCliente: formData.get("jornadaCliente"),
      processoEstruturado: formData.get("processoEstruturado"),
      monitoramentoSatisfacao: formData.get("monitoramentoSatisfacao"),
      etapadepercepcao: formData.get("etapadepercepcao"),

      // Seção 4: Equipe Comercial e Gestão
      composicaoEquipe: formData.get("composicaoEquipe"),
      kpisComerciais: formData.get("kpisComerciais"),
      incentivosMotivacao: formData.get("incentivosMotivacao"),
      buscaAprimoramento: formData.get("buscaAprimoramento"),

      // Seção 5: Tecnologia e Ferramentas
      possuiCRM: formData.get("possuiCRM"),
      qualCRM: formData.get("qualCRM"),
      outrasFerramentas: formData.get("outrasFerramentas"),
      funcionalidadesouFerramentas: formData.get("funcionalidadesouFerramentas"),

      // Seção 6: Desafios e Obstáculos
      maiorGargalo: formData.get("maiorGargalo"),
      testesRealizados: formData.get("testesRealizados"),
      impactoDireto: formData.get("impactoDireto"),
    }

    try {
      const response = await fetch(
        "https://eazytech-n8n.gsl3ku.easypanel.host/webhook/cc42a81b-dde0-4c76-8147-6545ab18c8e1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      )

      if (response.ok) {
        setShowSuccessDialog(true)
      } else {
        throw new Error("Erro ao enviar")
      }
    } catch (error) {
      alert("Erro ao enviar o formulário. Tente novamente.")
    } finally {
      setIsSubmittingDiretoria(false)
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
              Formulário Enviado com Sucesso!
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-lg pt-4">
              Suas informações foram recebidas corretamente. Em breve nossa equipe entrará em contato para dar
              continuidade ao processo.
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Formulário de Avaliação</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Preencha o formulário abaixo para avaliarmos suas necessidades e identificarmos oportunidades de melhoria em
            seu processo comercial.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                Briefing de Diagnóstico Comercial: Entrevista com a Diretoria
              </CardTitle>
              <CardDescription className="text-gray-300">
                Avaliação estratégica e operacional da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDiretoriaSubmit} className="space-y-8">
                {/* Informações Básicas */}
                <div className="bg-slate-700 p-6 rounded-lg space-y-4">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data" className="text-white">
                        Data *
                      </Label>
                      <Input
                        id="data"
                        name="data"
                        type="date"
                        required
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nomeContatoprincipal" className="text-white">
                        Nome do Contato principal (Cliente)*
                      </Label>
                      <Input
                        id="nomeContatoprincipal"
                        name="connomeContatoprincipalsultor"
                        required
                        className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                        placeholder="Nome do Contato Principal"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cliente" className="text-white">
                      Nome da Empresa (Razão Social) *
                    </Label>
                    <Input
                      id="cliente"
                      name="cliente"
                      required
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Nome da empresa"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefoneContato" className="text-white">
                        Telefone de contato *
                      </Label>
                      <Input
                        id="telefoneContato"
                        name="telefoneContato"
                        type="tel"
                        required
                        className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj" className="text-white">
                        CNPJ da empresa *
                      </Label>
                      <Input
                        id="cnpj"
                        name="cnpj"
                        required
                        className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                  </div>
                                                      <div className="space-y-2">
                    <Label htmlFor="enderecoEmpresa" className="text-white">
                      Endereço da Empresa *
                    </Label>
                    <Input
                      id="enderecoEmpresa"
                      name="enderecoEmpresa"
                      type="text"
                      required
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Ex: Rua Exemplo, 123 - Centro, Rio de Janeiro/RJ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="redesSociais" className="text-white">
                      Redes Sociais (Links principais, ex: LinkedIn/Instagram)
                    </Label>
                    <Input
                      id="redesSociais"
                      name="redesSociais"
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="https://linkedin.com/company/exemplo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="areaAtuacao" className="text-white">
                      Área de atuação *
                    </Label>
                    <Input
                      id="areaAtuacao"
                      name="areaAtuacao"
                      required
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Ex: Indústria Metalúrgica, SaaS B2B, Advocacia Empresarial"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faturamentoAnual" className="text-white">
                      Faturamento Anual Bruto *
                    </Label>
                    <Input
                      id="faturamentoAnual"
                      name="faturamentoAnual"
                      required
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Ex: R$ 5M/ano"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numeroFuncionarios" className="text-white">
                        Número de Funcionários (Total) *
                      </Label>
                      <Input
                        id="numeroFuncionarios"
                        name="numeroFuncionarios"
                        type="number"
                        required
                        className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                        placeholder="Ex: 45"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numeroFuncionariosComercial" className="text-white">
                        Número de Funcionários (Comercial) *
                      </Label>
                      <Input
                        id="numeroFuncionariosComercial"
                        name="numeroFuncionariosComercial"
                        type="number"
                        required
                        className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                        placeholder="Ex: 4"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantidadeClientesAtivos" className="text-white">
                      Quantos clientes a empresa possui atualmente? *
                    </Label>
                    <Input
                      id="quantidadeClientesAtivos"
                      name="quantidadeClientesAtivos"
                      type="number"
                      required
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Ex: 120 clientes ativos"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-white">
                      Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="https://www.exemplo.com.br"
                    />
                  </div>
                </div>

                {/* Seção 1: Visão Estratégica e Objetivos */}
                <div className="bg-slate-700 p-6 rounded-lg space-y-6">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Seção 1: Visão Estratégica e Objetivos</h3>
                  <p className="text-gray-300 text-sm italic">Foco: Para onde a empresa está indo.</p>

                  <div className="space-y-2">
                    <Label htmlFor="marcosMoldaram" className="text-white">
                      1.1. Quais os principais marcos que moldaram a história da sua empresa? Quais desafios ou
                      conquistas foram mais marcantes? *
                    </Label>
                    <Textarea
                      id="marcosMoldaram"
                      name="marcosMoldaram"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Descreva os principais marcos..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proposito" className="text-white">
                      1.2. Além do lucro, qual é o verdadeiro propósito desta empresa? O que mais te movimenta como
                      gestor(a)? *
                    </Label>
                    <Textarea
                      id="proposito"
                      name="proposito"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Descreva o propósito da empresa..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objetivosComerciais" className="text-white">
                      1.3. Quais são os principais objetivos comerciais para os próximos 6-12 meses? *
                    </Label>
                    <Textarea
                      id="objetivosComerciais"
                      name="objetivosComerciais"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Exemplo: Aumentar o faturamento em 30%, Conquistar 10 novos clientes no setor industrial..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sonhoFuturo" className="text-white">
                      1.4. Se pudesse sonhar alto, onde gostaria de ver a empresa em 2-3 anos? *
                    </Label>
                    <Textarea
                      id="sonhoFuturo"
                      name="sonhoFuturo"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Descreva sua visão de futuro..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="principalDesafio" className="text-white">
                      1.5. Considerando esses objetivos para os próximos 6-12 meses e sua visão para 2-3 anos, qual você identifica como o principal desafio ou obstáculo que a empresa precisa superar para alcançá-los? *
                    </Label>
                    <Textarea
                      id="principalDesafio"
                      name="principalDesafio"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Descreva o principal desafio ou obstáculo..."
                    />
                  </div>
                </div>

                {/* Seção 2: Mercado e Posicionamento */}
                <div className="bg-slate-700 p-6 rounded-lg space-y-6">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Seção 2: Mercado e Posicionamento</h3>
                  <p className="text-gray-300 text-sm italic">Foco: Onde a empresa compete e por que ela ganha.</p>

                  <div className="space-y-2">
                    <Label htmlFor="perfilClienteIdeal" className="text-white">
                      2.1. Descreva o Perfil de Cliente Ideal (ICP). Qual tipo de empresa traz mais resultado e é melhor
                      para trabalhar? *
                    </Label>
                    <Textarea
                      id="perfilClienteIdeal"
                      name="perfilClienteIdeal"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Exemplo: Indústrias de manufatura, acima de 100 funcionários, com dor em logística interna..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="principaisConcorrentes" className="text-white">
                      2.2. Quem são seus principais concorrentes (diretos e indiretos)? *
                    </Label>
                    <Textarea
                      id="principaisConcorrentes"
                      name="principaisConcorrentes"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Liste os principais concorrentes..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diferencialReal" className="text-white">
                      2.3. O que, na prática, faz um cliente escolher vocês em vez da concorrência? Qual é o seu real
                      diferencial? *
                    </Label>
                    <Textarea
                      id="diferencialReal"
                      name="diferencialReal"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Exemplo: Nosso suporte técnico é personalizado e resolve em 24h, não é um call center..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tendenciasMercado" className="text-white">
                      2.4. Quais tendências do seu mercado você avalia como uma grande ameaça ou uma grande
                      oportunidade? *
                    </Label>
                    <Textarea
                      id="tendenciasMercado"
                      name="tendenciasMercado"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Descreva as tendências do mercado..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buscadosclientesideais" className="text-white">
                      2.5. Como seus clientes ideais (ICP) tipicamente buscam e descobrem soluções como a sua? Quais canais ou fontes de informação eles mais utilizam para pesquisar e tomar decisões? *
                    </Label>
                    <Textarea
                      id="buscadosclientesideais"
                      name="buscadosclientesideais"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Descreva como geralmente seus clientes ideais buscam e descobrem soluções como a sua."
                    />
                  </div> 
                </div>

                {/* Seção 3: Processo de Aquisição e Venda */}
                <div className="bg-slate-700 p-6 rounded-lg space-y-6">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Seção 3: Processo de Aquisição e Venda</h3>
                  <p className="text-gray-300 text-sm italic">Foco: O "Como" - A jornada prática do cliente.</p>

                  <div className="space-y-2">
                    <Label htmlFor="canaisAquisicao" className="text-white">
                      3.1. De onde vêm os clientes hoje? Quais são os canais de aquisição mais potentes? *
                    </Label>
                    <Textarea
                      id="canaisAquisicao"
                      name="canaisAquisicao"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Exemplo: Indicações de clientes atuais (80%), Prospecção ativa (10%), Feiras do setor, Google Ads..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jornadaCliente" className="text-white">
                      3.2. Descreva a jornada do cliente, do primeiro contato ao pós-venda. Quais são as etapas-chave do
                      processo comercial? *
                    </Label>
                    <Textarea
                      id="jornadaCliente"
                      name="jornadaCliente"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Exemplo: 1. SDR prospecta. 2. Vendedor faz a visita/demo. 3. Envio da proposta técnica. 4. Negociação. 5. Onboarding/Implantação..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processoEstruturado" className="text-white">
                      3.3. O comercial segue algum processo estruturado (playbook, script, metodologia)? Como é a
                      integração com Marketing e Operações? *
                    </Label>
                    <Textarea
                      id="processoEstruturado"
                      name="processoEstruturado"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Descreva o processo estruturado..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monitoramentoSatisfacao" className="text-white">
                      3.4. Como vocês monitoram a satisfação do cliente e coletam feedbacks? *
                    </Label>
                    <Textarea
                      id="monitoramentoSatisfacao"
                      name="monitoramentoSatisfacao"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Descreva como monitoram a satisfação..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="etapadepercepcao" className="text-white">
                    3.5. Ao longo dessa jornada do cliente, em qual etapa você percebe que a empresa perde mais oportunidades ou que o processo se torna mais lento? Se possível, qual é a taxa de conversão aproximada entre as principais etapas? *
                    </Label>
                    <Textarea
                      id="etapadepercepcao"
                      name="etapadepercepcao"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="(Ex: lead para proposta, proposta para fechamento)"
                    />
                  </div>
                </div>

                {/* Seção 4: Equipe Comercial e Gestão */}
                <div className="bg-slate-700 p-6 rounded-lg space-y-6">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Seção 4: Equipe Comercial e Gestão</h3>
                  <p className="text-gray-300 text-sm italic">Foco: O "Quem" - As pessoas que executam o processo.</p>

                  <div className="space-y-2">
                    <Label htmlFor="composicaoEquipe" className="text-white">
                      4.1. Como é composta sua equipe comercial hoje? *
                    </Label>
                    <Textarea
                      id="composicaoEquipe"
                      name="composicaoEquipe"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Exemplo: 1 Gerente, 2 Vendedores (Field Sales), 1 SDR/Pré-vendas ou Eu (Sócio) e 1 Assistente que monta as propostas..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kpisComerciais" className="text-white">
                      4.2. Quais números-chave (KPIs) vocês usam para medir o sucesso comercial da equipe? *
                    </Label>
                    <Textarea
                      id="kpisComerciais"
                      name="kpisComerciais"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Exemplo: Nº de propostas enviadas, Taxa de conversão (Proposta > Venda), Custo de Aquisição de Cliente (CAC), Faturamento por vendedor..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="incentivosMotivacao" className="text-white">
                      4.3. Quais tipos de incentivos ou programas de motivação (comissão, bônus) vocês praticam? *
                    </Label>
                    <Textarea
                      id="incentivosMotivacao"
                      name="incentivosMotivacao"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Descreva os incentivos e programas de motivação..."
                    />
                  </div>

                                    <div className="space-y-2">
                    <Label htmlFor="buscaAprimoramento" className="text-white">
                      4.4. Considerando que a venda é muitas vezes conduzida por você ou por uma pessoa chave, e que o processo pode ser mais intuitivo, como vocês buscam aprimorar a forma de vender e apresentar o produto/serviço? Há alguma prática ou recurso que utilizam para aprender e evoluir nesse aspecto? *
                    </Label>
                    <Textarea
                      id="buscaAprimoramento"
                      name="buscaAprimoramento"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Descreva suas buscas de aprimoramento.."
                    />
                  </div>
                </div>

                {/* Seção 5: Tecnologia e Ferramentas (Tech Stack) */}
                <div className="bg-slate-700 p-6 rounded-lg space-y-6">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                    Seção 5: Tecnologia e Ferramentas (Tech Stack)
                  </h3>
                  <p className="text-gray-300 text-sm italic">Foco: As ferramentas que dão suporte à operação.</p>

                  <div className="space-y-4">
                    <Label className="text-white text-lg">5.1. Vocês utilizam sistema de CRM? *</Label>
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 text-white cursor-pointer">
                        <input type="radio" name="possuiCRM" value="Sim" className="mt-1" required />
                        <div className="space-y-2 flex-1">
                          <span>Sim, qual?</span>
                          <Input
                            name="qualCRM"
                            className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                            placeholder="Ex: Salesforce, Pipedrive, RD Station, Moskit"
                          />
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 text-white cursor-pointer">
                        <input type="radio" name="possuiCRM" value="Não, gerenciamos por planilhas ou outro método" />
                        <span>Não, gerenciamos por planilhas ou outro método</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outrasFerramentas" className="text-white">
                      5.2. Quais outras ferramentas e tecnologias são essenciais para a gestão e o comercial? *
                    </Label>
                    <Textarea
                      id="outrasFerramentas"
                      name="outrasFerramentas"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Exemplo: ERP (Totvs/SAP), Ferramenta de prospecção (Apollo/LinkedIn Sales Navigator), Planilhas, Sistema de BI (Power BI)..."
                    />
                  </div>

                   <div className="space-y-2">
                    <Label htmlFor="funcionalidadesouFerramentas" className="text-white">
                      5.3. Quais funcionalidades ou ferramentas vocês sentem falta para otimizar a gestão comercial, ou quais integrações entre as ferramentas atuais seriam importantes para a empresa? *
                    </Label>
                    <Textarea
                      id="funcionalidadesouFerramentas"
                      name="funcionalidadesouFerramentas"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="(ex: CRM com ERP, Bling, Asas, atendimento automatizado, agendamento automatizado, lembretes automatizados)."
                    />
                  </div>
                </div>

                {/* Seção 6: Desafios e Obstáculos */}
                <div className="bg-slate-700 p-6 rounded-lg space-y-6">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">Seção 6: Desafios e Obstáculos</h3>
                  <p className="text-gray-300 text-sm italic">Foco: Os problemas a serem resolvidos.</p>

                  <div className="space-y-2">
                    <Label htmlFor="maiorGargalo" className="text-white">
                      6.1. Qual é o maior gargalo ou frustração no processo comercial hoje? *
                    </Label>
                    <Textarea
                      id="maiorGargalo"
                      name="maiorGargalo"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Exemplo: O ciclo de vendas é muito longo, Os vendedores perdem tempo com burocracia, Perdemos muita venda por preço, Não conseguimos gerar leads qualificados suficientes..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testesRealizados" className="text-white">
                      6.2. O que já foi testado para solucionar esses gargalos? Deu algum resultado? *
                    </Label>
                    <Textarea
                      id="testesRealizados"
                      name="testesRealizados"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="Descreva as tentativas realizadas e seus resultados..."
                    />
                  </div>

                   <div className="space-y-2">
                    <Label htmlFor="impactoDireto" className="text-white">
                      6.3 . Qual o impacto direto ou indireto desses gargalos e frustrações nos resultados da empresa? *
                    </Label>
                    <Textarea
                      id="impactoDireto"
                      name="impactoDireto"
                      required
                      rows={4}
                      className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
                      placeholder="(Ex: perda de faturamento, aumento de custos, sobrecarga da equipe, insatisfação de clientes, etc.)"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingDiretoria}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-3 text-lg"
                >
                  {isSubmittingDiretoria ? "Enviando..." : "Enviar Formulário"}
                </Button>
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
