import { Component } from "@angular/core";

interface Patente {
  name: string;
  level: number;
  timeRequired: string;
  requirements: string[];
  objectives: string[];
  duties: string[];
  symbol: string | null;
  color: string;
  hasRank?: boolean;
}

@Component({
  selector: "app-hierarquia-page",
  standalone: false,
  templateUrl: "./hierarquia-page.component.html",
  styleUrls: ["./hierarquia-page.component.scss"],
})
export class HierarquiaPageComponent {
  patentes: Patente[] = [
    {
      name: "GAIJIN",
      level: 0,
      timeRequired: "Não aplicável",
      requirements: ["Ser novato no Swordplay"],
      objectives: ["Não possui"],
      duties: ["Assistir as atividades até obter sua primeira patente"],
      color: "#8B4513",
      hasRank: false,
      symbol: null,
    },
    {
      name: "KOSHO",
      level: 1,
      timeRequired: "3 treinos",
      requirements: [
        "Ser instruído por um Samurai do clã",
        "Demonstrar conhecimento básico de Swordplay",
        "Demonstrar conhecimento nas regras do clã",
      ],
      objectives: [
        "Aprender sobre combates, forja e armamento",
        "Despertar determinação do clã nos jovens colegas",
        "Participar do clã da melhor maneira possível",
      ],
      duties: [
        "Cuidar das manobras do clã nas redes sociais",
        "Estar permanentemente apto a terceiro nível de treino",
      ],
      color: "#228B22",
      hasRank: false,
      symbol: null,
    },
    {
      name: "BUSHI",
      level: 1,
      timeRequired: "1 meses de treinos",
      requirements: [
        "Demonstrar conhecimento básico em técnicas de equipamentos",
        "Ter ao menos uma arma de sua criação ou posse em funcionamento",
        "Demonstrar respeito pelos métodos e características do clã",
      ],
      objectives: [
        "Conquistar determinação nas técnicas de combate",
        "Aperfeiçoar suas habilidades de forja",
        "Cuidar de seus equipamentos",
      ],
      duties: [
        "Cuidar das manobras do clã nas redes sociais",
        "+ Todas as obrigações de patentes anteriores",
      ],
      symbol: "assets/bushi.png",
      color: "#32CD32",
    },
    {
      name: "TOZAMA",
      level: 2,
      timeRequired: "8 meses desde a última promoção",
      requirements: [
        "Conhecer todas as técnicas básicas dentro sobre os equipamentos",
        "Compreender questões importantes sobre o clã da assembleia e seus funcionamentos",
        "Conhecer sobre a história do clã e a importância do respeito",
      ],
      objectives: [
        "Conduzir instruções no Mural da Glória",
        "Expressar total direito de membro do Makka-Kuh",
        "Auxiliar o Primata Ancião em tarefas básicas",
      ],
      duties: [
        "Ajudar novos graduandos com instruções",
        "+ Todas as obrigações de patentes anteriores",
      ],
      symbol: "assets/tozama.png",
      color: "#FFB6C1",
    },
    {
      name: "JOZAI",
      level: 3,
      timeRequired: "12 meses desde a última promoção",
      requirements: [
        "Ter ao menos 2 meses de experiência moderadas com uma popularidade de equipamentos",
        "Demonstrar total confiança em técnicas básicas de equipamentos e uso em massivas",
        "Demonstrar capacidade de liderar seus equipamentos",
      ],
      objectives: [
        "Ser um treinador eficiente e educador",
        "Colaborar para membros em técnicas de dureza",
      ],
      duties: [
        "Conduzir treinamentos",
        "Organizar ou auxiliar a organização de eventos para colegas de treino",
        "Prestar auxílio ao clã, quando solicitado pelo Conselho do Primata Ancião",
        "+ Todas as obrigações de patentes anteriores",
      ],
      symbol: "assets/jozai.png",
      color: "#9370DB",
    },
    {
      name: "SHINPAN",
      level: 4,
      timeRequired: "18 meses desde a última promoção",
      requirements: [
        "Ter ao menos 6 meses demonstrando moderação com uma popularidade de equipamentos",
        "Apresentar bom nível em liderados em duelos",
        "Demonstrar capacidade de liderar e auxiliar jovens do clã",
      ],
      objectives: [
        "Participar ativamente das decisões importantes do clã",
        "Auxiliar na coordenação de treinos e jovens",
      ],
      duties: [
        "Posições importantes para com o clã em todos os quesitos",
        "+ Todas as obrigações de patentes anteriores",
      ],
      symbol: "assets/shinpan.png",
      color: "#FFD700",
    },
    {
      name: "DAI-SHINPAN",
      level: 5,
      timeRequired: "3 a 5 anos",
      requirements: [
        "Os Shinpan e acima são supremos membros honorários apenas",
        "Destinados pessoas de destaque pela sua responsabilidade nos treinamentos",
      ],
      objectives: ["Liderar o clã com responsabilidade e sabedoria"],
      duties: [
        "Coordenar grandes operações do clã",
        "Orientar membros em questões importantes",
        "+ Todas as obrigações de patentes anteriores",
      ],
      symbol: "assets/dai-shinpan.png",
      color: "#FF4500",
    },
  ];

  equipmentRequirements = [
    "ARMA BRANCA (ESPADA)",
    "ARMA DE CABO LONGO (MANGUAL)",
    "ARMA DE ARREMESSO (DARDOS)",
    "ARMA DE BLOCO (ESCUDO)",
    "VESTUÁRIO (CAMISA E CALÇA)",
    "TABELAS (BRACEL, MANOPLAS, GREVAS, etc.)",
  ];

  equipmentNotes = [
    "Atenção: assim é que os clãs no corpo e as outras tipos são caracterizados",
    "lembrando também os que é específico para a graduação da respectiva patente é obrigatório.",
    "O resultado dessa graduação para a sua progressão depende exclusivamente de",
    "seu comprometimento com a essência do treino.",
  ];

  advancementNotes = [
    "Não esqueça de verificar suas capacidades regularmente",
    "É importante participar consistentemente dos treinos",
    "A progressão depende tanto do tempo quanto do comprometimento",
    "Membros mais experientes estão sempre dispostos a ajudar",
  ];

  exceptionRule =
    "Ref: carta especial e extensões por outras leis não sejam aplicáveis em alguns mais casos relativos aos estudos do local específicos das etapas dos outros objetivos.";
}
