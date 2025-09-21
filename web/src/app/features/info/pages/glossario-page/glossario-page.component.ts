import { Component } from "@angular/core";

interface GlossaryTerm {
  term: string;
  definition: string;
}

@Component({
  selector: "app-glossario-page",
  standalone: false,
  templateUrl: "./glossario-page.component.html",
  styleUrls: ["./glossario-page.component.scss"],
})
export class GlossarioPageComponent {
  glossaryTerms: GlossaryTerm[] = [
    {
      term: "Bengalar / Usar de Bengala",
      definition:
        "Apoiar a ponta (estoque) da arma no chão. Isso estraga a ponta da arma. NUNCA faça isso.",
    },
    {
      term: "Boffering",
      definition:
        "Modalidade de swordplay que utiliza equipamentos de cano e espuma possui mais rigidez quanto à segurança e força excessiva.",
    },
    {
      term: "Caçar javali",
      definition:
        "Quando uma pessoa erra um movimento e atinge uma lança ou outra arma de estocada. A carga / força da corrida é transferida para o impacto, mas o portador da arma normalmente não tem culpa, exceto se a posicionou de má fé (saiba mais).",
    },
    {
      term: "Campal",
      definition:
        "Sinônimo de batalha massiva. O termo já foi, erroneamente, sinônimo para swordplay.",
    },
    {
      term: "Cantar golpe",
      definition:
        "Falar, durante a massiva, onde um golpe teria atingido. Essa prática é, normalmente, proibida.",
    },
    {
      term: "Carga",
      definition:
        "Correr durante um combate e aplicar o peso do corpo em um golpe. Essa prática não é bem vista, podendo causar danos e ser considerada um excesso de força (saiba mais).",
    },
    {
      term: "Carniceiro",
      definition: "Outro nome para abatedouro.",
    },
    {
      term: "Chicote / arma-chicote",
      definition:
        "Arma mole, que permite movimentos de serpenteio (chicotear).",
    },
    {
      term: "Desmembramento",
      definition:
        "Modalidade de dano em massivas, onde que o membro do corpo que a arma atingiu não pode mais ser utilizado.",
    },
    {
      term: "Desvio indutivo",
      definition:
        "Quando o ato de desviar de um golpe (que não iria acertar local proibido) faz com que este golpe seja desviado para um local proibido (saiba mais).",
    },
    {
      term: "Duelo",
      definition:
        "Combate de um contra um, normalmente com armas em pé de igualdade (clique aqui e conheça mais).",
    },
    {
      term: "Ferreiro / Forjador",
      definition: "Pessoa que fabrica equipamentos de swordplay.",
    },
    {
      term: "Flanquear",
      definition:
        "Avançar por uma lateral de um alvo, sabendo que alguém avançará pela outra lateral.",
    },
    {
      term: "Forjar",
      definition: "Fabricar equipamentos de swordplay.",
    },
    {
      term: "Geladeira (ou porta de geladeira)",
      definition: "Escudo ridiculamente grande.",
    },
    {
      term: "HEMA",
      definition:
        "Esporte de simulação do combate medieval mais realista do que o Boffering ou Softcombat. Permitem o uso armas mais rígidas, armaduras de metal e golpes mais pesados.",
    },
    {
      term: "Hoplita",
      definition: "Guerreiro que combina escudo e lança.",
    },
    {
      term: "Highlander",
      definition:
        "Pessoa que não sai quando é atingida em golpes fatais, normalmente de má-fé, ou finge que os golpes que tomou foram de menor gravidade. Sinônimo de desonrado, trapaceiro.",
    },
    {
      term: "Imortal / Imorrível",
      definition: "Highlander.",
    },
    {
      term: "Ladinar",
      definition: "Ser furtivo e atacar pelas costas.",
    },
    {
      term: "LARP",
      definition:
        "Live Action Role Play. É uma modalidade de RPG onde os jogadores se caracterizam e interpretam seus personagens de forma física, ao invés de apenas imaginar suas cenas. Pode envolver swordplay para cenas de combate.",
    },
    {
      term: "Manopla",
      definition: "Peça de armadura que protege antebraço e mão.",
    },
    {
      term: "Massiva",
      definition:
        "Combate de um grupo contra outro (clique aqui e conheça alguns tipos).",
    },
    {
      term: "Material mágico",
      definition:
        "Outro nome para ethafoam, uma espuma de polietileno expandido. Usada no swordplay para forja.",
    },
    {
      term: "PI (pronúncia: pê-i)",
      definition:
        "Tipo de espuma para absorção de impacto, utilizada para forja.",
    },
    {
      term: "Postura de risco",
      definition:
        "Quando um atacante assume uma postura audaciosa, em que se coloca propositalmente em posições que receberá golpes proibidos, sem culpa a quem o atacar (saiba mais).",
    },
    {
      term: "Resvalo",
      definition:
        "Quando um golpe desliza (resvala) na arma, armadura ou escudo do oponente, atingindo uma razão proibida, armadura que o atacante tivesse tido culpa.",
    },
    {
      term: "Silver Tape",
      definition:
        "Fita de reparos domésticos, normalmente de cor prata. É muito utilizada para revestir a parte de contato dos equipamentos de boffering.",
    },
    {
      term: "Softcombat",
      definition:
        "Modalidade de swordplay um pouco mais pesada do que o Boffering. Permite maiores contatos, mais força e armas de outros materiais além da espuma.",
    },
    {
      term: "Taipar / Teipar / Taipagem",
      definition: "Passar fita Silver Tape em um equipamento.",
    },
    {
      term: "Tabardo",
      definition:
        "Traje medieval, utilizado como uniforme por grande parte dos clãs.",
    },
  ];

  filteredTerms: GlossaryTerm[] = [...this.glossaryTerms];
  searchTerm = "";

  filterTerms() {
    this.filteredTerms = this.glossaryTerms.filter(
      (item) =>
        item.term.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  trackByTerm(index: number, item: GlossaryTerm): string {
    return item.term;
  }
}
