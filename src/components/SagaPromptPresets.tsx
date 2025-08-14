
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, Scale, Search, FileCheck, Users, Clock, AlertTriangle } from "lucide-react";

interface PresetCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  presets: LegalPreset[];
}

interface LegalPreset {
  id: string;
  title: string;
  description: string;
  template: string;
  tags: string[];
  complexity: 'basic' | 'intermediate' | 'advanced';
}

const legalPresets: PresetCategory[] = [
  {
    id: "dossier",
    name: "Dossieranalyse",
    icon: FileText,
    description: "Feitensamenvatting en juridische vraagstelling",
    color: "text-blue-400 border-blue-400/50",
    presets: [
      {
        id: "facts-extract",
        title: "Feiten Extractie",
        description: "Systematische feitenverzameling uit documenten",
        complexity: "basic",
        tags: ["extractie", "feiten", "chronologie"],
        template: `# Feiten Extractie Opdracht

## Doel
Verzamel en structureer alle relevante feiten uit het dossier voor juridische analyse.

## Inputs
- Documenten: [specificeer bronnen]
- Tijdsperiode: [van/tot datum]
- Juridisch gebied: [contract/aansprakelijkheid/etc]

## Stappen
1. **Chronologische lezing**: Lees alle documenten in tijdsvolgorde
2. **Feiten categoriseren**: Deel op in relevante juridische categorieën
3. **Bronvermelding**: Noteer exacte documentreferenties per feit
4. **Inconsistenties markeren**: Signaleer tegenstrijdigheden tussen bronnen

## Output Vereisten
- Chronologische feitenlijst met bronvermelding
- Categorie-indeling per juridisch thema
- Overzicht van onduidelijkheden of tegenstrijdigheden
- Lijst van ontbrekende informatie

## Kwaliteitscheck
- Zijn alle documenten verwerkt?
- Is chronologie correct?
- Zijn bronnen traceerbaar?

## Menselijke Review
**STOP HIER** - Laat advocaat feitensamenvatting controleren voordat je verder gaat met juridische analyse.`
      },
      {
        id: "legal-questions",
        title: "Juridische Vraagformulering",
        description: "Transformeer feiten naar scherpe juridische vragen",
        complexity: "intermediate",
        tags: ["vraagstelling", "juridisch", "analyse"],
        template: `# Juridische Vraagformulering

## Doel
Formuleer heldere, beantwoordbare juridische vragen op basis van feitencomplex.

## Inputs
- Feitensamenvatting: [uit vorige stap]
- Rechtsgebied: [specificeer]
- Cliëntdoelstelling: [wat wil cliënt bereiken]

## Stappen
1. **Hoofdvraag identificeren**: Wat is de kernvraag?
2. **Deelvragen opstellen**: Welke juridische elementen moeten bewezen?
3. **Prioriteren**: Rangschik vragen naar impact op uitkomst
4. **Alternatieven bedenken**: Welke andere invalshoeken zijn mogelijk?

## Output Vereisten
- 1 hoofdvraag (kernprobleem)
- 3-5 deelvragen (bewijs/rechtselementen)
- Prioriteitsvolgorde met motivatie
- Alternatieve juridische invalshoeken

## Bias Check
- Zijn vragen neutraal geformuleerd?
- Suggereren ze geen gewenst antwoord?
- Dekken ze alle relevante juridische aspecten?

## Menselijke Goedkeuring
**REVIEW MOMENT** - Advocaat beoordeelt of vraagstelling compleet en strategisch juist is.`
      }
    ]
  },
  {
    id: "client-comm",
    name: "Cliëntcommunicatie",
    icon: MessageSquare,
    description: "FAQ, e-mailconcepten en gespreksvoorbereiding",
    color: "text-green-400 border-green-400/50",
    presets: [
      {
        id: "client-faq",
        title: "Cliënt FAQ Generator",
        description: "Anticipeer en beantwoord veelgestelde cliëntvragen",
        complexity: "basic",
        tags: ["FAQ", "uitleg", "communicatie"],
        template: `# Cliënt FAQ Generator

## Doel
Creëer heldere antwoorden op vragen die cliënt waarschijnlijk heeft over hun zaak.

## Inputs
- Zaaktype: [specificeer]
- Complexiteit: [eenvoudig/gemiddeld/complex]
- Cliëntprofiel: [particulier/bedrijf/ervaring met recht]

## Stappen
1. **Vragen brainstormen**: Welke vragen krijgen we altijd bij dit zaaktype?
2. **Cliëntperspectief**: Wat zou deze specifieke cliënt willen weten?
3. **Antwoorden formuleren**: Juridisch correct maar begrijpelijk
4. **Alternatieven bieden**: Geef opties waar mogelijk

## Output Vereisten
- 8-12 veelgestelde vragen
- Antwoorden in begrijpelijke taal (geen jargon)
- Verwijzingen naar vervolgstappen
- Disclaimer over maatwerk

## Taalcheck
- Zijn antwoorden in gewone taal?
- Vermijd juridisch jargon
- Geef concrete voorbeelden
- Bied altijd persoonlijk overleg aan

## Goedkeuring
**MENSELIJKE CHECK** - Advocaat controleert of antwoorden juridisch correct en compleet zijn.`
      },
      {
        id: "email-draft",
        title: "E-mail Concepten",
        description: "Professionele e-mailconcepten voor verschillende scenario's",
        complexity: "intermediate",
        tags: ["e-mail", "communicatie", "professional"],
        template: `# E-mail Concept Generator

## Doel
Stel professionele e-mailconcepten op voor verschillende cliëntinteracties.

## Inputs
- E-mailtype: [informatief/advies/opvolging/slecht nieuws]
- Ontvanger: [cliënt profiel]
- Boodschap: [kerninhoud]
- Urgentie: [hoog/normaal/laag]

## Stappen
1. **Toon bepalen**: Welke toon past bij situatie en cliënt?
2. **Structuur opzetten**: Opening, kern, vervolgstappen, afsluiting
3. **Juridische precisie**: Correcte terminologie zonder jargon
4. **Verwachtingen managen**: Duidelijk over tijdlijnen en vervolgstappen

## Output Vereisten
- Onderwerpregel (informatief, niet alarmerend)
- Begroeting (persoonlijk)
- Korte samenvatting vooraf
- Hoofdboodschap in begrijpelijke taal
- Concrete vervolgstappen
- Professionele afsluiting

## Kwaliteitsborging
- Is toon gepast voor boodschap?
- Zijn verwachtingen realistisch?
- Is vervolgactie duidelijk?
- Bevat het geen beloftes die niet nagekomen kunnen worden?

## Review Checkpoint
**ADVOCAAT CONTROLE** - Inhoudelijke en strategische review van concept voordat verstuurd wordt.`
      }
    ]
  },
  {
    id: "strategy",
    name: "Processtrategie",
    icon: Scale,
    description: "Opties, risico's en impactanalyse",
    color: "text-purple-400 border-purple-400/50",
    presets: [
      {
        id: "risk-analysis",
        title: "Risico & Impact Analyse",
        description: "Systematische beoordeling van juridische risico's",
        complexity: "advanced",
        tags: ["risico", "strategie", "impact"],
        template: `# Risico & Impact Analyse

## Doel
Beoordeel systematisch alle risico's en kansen in de zaak voor strategische besluitvorming.

## Inputs
- Juridische positie: [sterke/zwakke punten]
- Tegenpartij: [profiel en positie]
- Inzet: [financieel/reputatie/tijd]
- Cliëntdoelen: [primair en secundair]

## Stappen
1. **Scenario's uitwerken**: Best case, worst case, meest waarschijnlijk
2. **Risico's inventariseren**: Juridisch, financieel, reputatie, tijd
3. **Kansen identificeren**: Sterke punten, hefbomen, alternatieven
4. **Impact kwantificeren**: Concrete gevolgen per scenario

## Output Vereisten
- 3 realistische scenario's met kanspercentages
- Risicoregister met impact en waarschijnlijkheid
- Kansenkaart met exploitatiemogelijkheden
- Kosten-baten analyse per strategie-optie
- Tijdlijn met kritieke beslismomenten

## Objectiviteitscheck
- Zijn scenario's realistisch (niet te optimistisch)?
- Is tegenpartij eerlijk ingeschat?
- Zijn emotionele factoren meegenomen?
- Welke aannames kunnen verkeerd zijn?

## Strategische Review
**SENIOR ADVOCAAT REVIEW** - Laat ervaren collega de analyse controleren voordat cliënt geïnformeerd wordt.`
      }
    ]
  },
  {
    id: "research",
    name: "Bewijs & Onderzoek",
    icon: Search,
    description: "Documentanalyse en inconsistenties opsporen",
    color: "text-orange-400 border-orange-400/50",
    presets: [
      {
        id: "doc-analysis",
        title: "Document Consistentie Check",
        description: "Spoor inconsistenties en tegenstrijdigheden op",
        complexity: "intermediate",
        tags: ["analyse", "consistentie", "bewijsvoering"],
        template: `# Document Consistentie Analyse

## Doel
Identificeer inconsistenties, tegenstrijdigheden en zwakke punten in documentatie.

## Inputs
- Documentset: [specificeer alle relevante documenten]
- Vergelijkingscriteria: [data, bedragen, feiten, uitspraken]
- Zoekgebied: [welke inconsistenties zijn relevant]

## Stappen
1. **Cross-referentie matrix**: Vergelijk gelijksoortige claims tussen documenten
2. **Tijdlijn verificatie**: Check chronologische consistentie
3. **Cijfercontrole**: Vergelijk bedragen, data, percentages
4. **Toon & intentie**: Analyseer verschuivingen in stellingname

## Output Vereisten
- Matrix van inconsistenties met documentreferenties
- Categorie-indeling: kritiek/belangrijk/marginaal
- Impact assessment per inconsistentie
- Aanbevelingen voor vervolgonderzoek
- Lijst van ontbrekende documenten/informatie

## Verificatiestappen
- Zijn alle relevante documenten geanalyseerd?
- Is elk verschil correct geïnterpreteerd?
- Zijn alternatieven verklaringen overwogen?
- Welke inconsistenties zijn fataal voor de zaak?

## Expert Review
**BEWIJS SPECIALIST CONTROLE** - Laat ervaren litigator de bevindingen beoordelen op juridische waarde.`
      }
    ]
  },
  {
    id: "contracts",
    name: "Contract & Tekstreview",
    icon: FileCheck,
    description: "Helderheid, risico's en alternatieven",
    color: "text-red-400 border-red-400/50",
    presets: [
      {
        id: "contract-review",
        title: "Contract Risicoanalyse",
        description: "Systematische review van contractuele risico's",
        complexity: "advanced",
        tags: ["contract", "risico", "review"],
        template: `# Contract Risicoanalyse

## Doel
Identificeer alle juridische en commerciële risico's in contractuele documentatie.

## Inputs
- Contracttype: [specificeer]
- Partijen: [cliënt positie en tegenpartij profiel]
- Commerciële context: [deal waarde, marktomstandigheden]
- Cliënt prioriteiten: [bescherming/flexibiliteit/snelheid]

## Stappen
1. **Clausule inventory**: Catalogiseer alle bepalingen per categorie
2. **Risico mapping**: Identificeer risico's per clausule
3. **Alternatieve bewoordingen**: Stel verbeteringen voor
4. **Onderhandelingsstrategie**: Prioriteer wijzigingen

## Output Vereisten
- Risicoregister per contractclausule
- Voorgestelde wijzigingen met motivatie
- Onderhandelingsprioriteiten (must-have/nice-to-have)
- Alternatieve clausuleformuleringen
- Deal-breaker identificatie

## Kwaliteitscontrole
- Zijn alle standaard clausules gecontroleerd?
- Is commerciële impact meegewogen?
- Zijn jurisdiction-specifieke risico's geïdentificeerd?
- Welke onvoorziene scenario's zijn mogelijk?

## Senior Partner Review
**PARTNERSHIP GOEDKEURING** - Laat senior partner strategische implicaties beoordelen voordat cliëntadvies.`
      }
    ]
  }
];

interface SagaPromptPresetsProps {
  onSelectPreset: (preset: LegalPreset) => void;
}

const SagaPromptPresets = ({ onSelectPreset }: SagaPromptPresetsProps) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'text-green-400 border-green-400/50';
      case 'intermediate': return 'text-yellow-400 border-yellow-400/50';
      case 'advanced': return 'text-red-400 border-red-400/50';
      default: return 'text-blue-400 border-blue-400/50';
    }
  };

  return (
    <div className="space-y-6">
      {legalPresets.map((category) => {
        const IconComponent = category.icon;
        return (
          <Card key={category.id} className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-3">
                <IconComponent className="w-5 h-5" />
                {category.name}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {category.presets.map((preset) => (
                  <div key={preset.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{preset.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{preset.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getComplexityColor(preset.complexity)}`}
                        >
                          {preset.complexity}
                        </Badge>
                        <Button
                          onClick={() => onSelectPreset(preset)}
                          size="sm"
                          className="text-xs"
                        >
                          Gebruik
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {preset.tags.map((tag) => (
                        <Badge 
                          key={tag}
                          variant="outline" 
                          className="text-xs text-slate-400 border-slate-600"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SagaPromptPresets;
