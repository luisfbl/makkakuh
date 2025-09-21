import { Component } from "@angular/core";

@Component({
  selector: "app-regras-massiva-page",
  standalone: false,
  templateUrl: "./regras-massiva-page.component.html",
  styleUrls: ["./regras-massiva-page.component.scss"],
})
export class RegrasMassivaPageComponent {
  regrasGerais = [
    {
      number: 1,
      text: "É permitido aos competidores utilizarem-se de quaisquer armas da sessão de <strong>armamento</strong>, salvo exceções específicas, combinados com <strong>armaduras</strong>, seguindo os <strong>limites de equipamentos do clã</strong>.",
    },
    {
      number: 2,
      text: "Atingir o pé, enquanto este estiver em contato com o solo ou a mão, enquanto esta estiver segurando espada ou escudo, não será considerado acerto. Uso de força excessiva não é permitido e é passível de advertência.",
    },
    {
      number: 3,
      text: "Atingir uma área cabeça, virilha, e seios (no caso de mulheres) é expressamente proibido e causa a expulsão imediata do competidor daquela partida.",
    },
    {
      number: 4,
      text: "Ao ser eliminado (morto), um competidor deve deixar o campo de batalha imediatamente pela rota mais curta, colocando suas armas acima da cabeça ou erguendo os braços em posição de rendição.",
    },
    {
      number: 5,
      text: "Ao ser eliminado (morto), o competidor não poderá se comunicar de forma alguma com os outros participantes da partida, exceto se necessário, para avisar que está eliminado.",
    },
    {
      number: 6,
      text: "É permitido atacar somente com as armas. Ataques corporais ou agarramentos serão punidos com a expulsão do jogador.",
    },
    {
      number: 7,
      text: "Cada mão segura somente UM equipamento (arma ou escudo). Flechas não contam para esse limite.",
    },
    {
      number: 8,
      text: "Não é permitido agarrar os equipamentos de seus oponentes, com exceção das flechas. É permitido agarrar pela haste as flechas depois de atiradas.",
    },
    {
      number: 9,
      text: "Escudos ou armaduras não causam dano, mesmo que tenham sido confeccionados para isso. Não é permitido atingir os adversários com escudos, porém é permitido usá-los para desarmes.",
    },
    {
      number: 10,
      text: "Não é permitido usar-se de investida / <strong>carga</strong>, sob pena de expulsão da partida.",
    },
    {
      number: 11,
      text: 'Dar múltiplos toques com a arma sem efetuar múltiplos golpes (recuar a arma, dar giro de quadril...) só pontua o primeiro acerto. Isso é chamado de "golpe metralhadona".',
    },
    {
      number: 12,
      text: "Atitudes antidesportivas (de má fé) são punidas com expulsão da competição e podem ter consequências quanto ao futuro do competidor nas atividades do Clã.",
    },
    {
      number: 13,
      text: "Acessórios de chapelaria com abas ou pontas não são recomendados, para evitar discussão sobre onde o golpe teria atingido.",
    },
    {
      number: 14,
      text: "Anunciar o local onde atingiu (cantar o golpe) é proibido e punido com advertência. Todas as discussões são terminantemente proibidas e todos os envolvidos são automaticamente expulsos. Qualquer discussão deverá ser resolvida após a partida.",
    },
    {
      number: 15,
      text: "Caso haja juízes, sua palavra é incontestável.",
    },
    {
      number: 16,
      text: 'Os jogos podem utilizar as regras de <strong class="hit-kill">Hit Kill</strong>, <strong class="dano-simples">Dano Simples</strong> ou <strong class="desmembramento">Desmembramento</strong>.',
    },
  ];

  modalidadesEspecificas = [
    {
      title: "BATALHA CAMPAL",
      description:
        "Essa é a modalidade mais simples e não exige um terreno específico.",
      rules: [
        "Dois times ou mais, que podem ser sorteados ou escolhidos.",
        "Essa modalidade pode ser realizada com eliminação por Hit Kill ou Desmembramento.",
        "Os times se enfrentam em campo aberto até não sobrar nenhum adversário de pé.",
        "Pode ser dado um tempo para que os times combinem suas estratégias (essa regra é opcional).",
      ],
    },
    {
      title: "FORMAÇÃO EM TRIO",
      description:
        "Para essa modalidade, o campo de batalha deve ser grande (preferencialmente mais de 300 m) e pode conter obstáculos e vegetação.",
      rules: [
        "Os times devem ter apenas 3 (três) integrantes. Não há limite para o número de times.",
        "Os times poderão ser formados por sorteio ou por escolhas pessoais.",
        "A eliminação pode ser por Desmembramento ou Hit Kill.",
        "Após formação dos trios, os grupos têm um tempo cronometrados para se afastarem e tomarem posição.",
        "Vence o trio com o último integrante vivo.",
        "Não é permitido alianças entre times.",
        "Eliminados devem deixar o campo ou ao menos a área de combate.",
      ],
    },
    {
      title: "CADA UM POR SI/FREE FOR ALL",
      description:
        "Qualquer tipo de campo cairá bem para essa modalidade. Campos pequenos e com obstáculos tornam a disputa interessante.",
      rules: [
        "Não há times nem máximo de jogadores.",
        "Todos os competidores iniciam em um círculo. Ao soar do sinal, estes devem eliminar todos os adversários.",
        "A eliminação será feita por Desmembramento.",
        "Alianças não são permitidas.",
        "Armas a distância não são permitidas.",
        "Vence o último vivo.",
      ],
    },
    {
      title: "JOGOS VORAZES",
      description:
        "Recomenda-se um campo de batalha com mais de 200 metros e obstáculos.",
      rules: [
        'Valem as regras de "Cada um por si" (Box ao lado), com as seguintes alterações:',
        "Os jogadores iniciam em um círculo, desarmados, com ao menos 20 metros de raio. Todas as armas devem ser espalhada em um círculo ao centro.",
        "Os jogadores caminham em círculo por um minuto, até o sinal ser dado. Então todos têm a liberdade então de avançarem para pegar as armas.",
        "A eliminação poderá ser por Hit Kill ou Desmembramento.",
        "Alianças não são proibidas.",
        "Armas a distância e de arremesso são permitidas.",
      ],
    },
    {
      title: "GENERAL",
      description:
        "Não há grandes preferências por terreno, mas obstáculos e locais para se esconder fazem o jogo mais interessante.",
      rules: [
        "Valem as regras de Batalha Campal, com as seguintes alterações:",
        "Limitado a dois times.",
        "Cada time deve escolher um General. A identidade de ambos os generais deve ser do conhecimento de ambos os times.",
        "O objetivo é eliminar o General adversário e proteger seu.",
        "O tempo para discutir estratégias é obrigatório.",
      ],
    },
    {
      title: "CURANDEIRO/HEALER",
      description: "Idem ao formato General.",
      rules: [
        'Valem as regras de "General" (Box ao lado), com as seguintes alterações:',
        "Ao invés de um General, cada grupo possui um Healer (Curandeiro).",
        "Quando um jogador é eliminado, este não poderá se mover do lugar, devendo se agachar e erguer sua arma.",
        "Caso o Healer toque no jogador ou em sua arma, o jogador voltará ao jogo.",
        "A eliminação se dá por Hit Kill.",
        "O Healer não pode ficar encostado em nenhum jogador, regenerando-o permanentemente.",
      ],
    },
    {
      title: "GENERAL OCULTO",
      description: "Idem ao formato General.",
      rules: [
        'Valem as regras de "General" (Box acima), com as seguintes alterações:',
        "A presença de um juiz é obrigatória.",
        "A identidade do General só será conhecida por sua equipe e pelo juiz.",
      ],
    },
    {
      title: "APOCALIPSE ZUMBI",
      description: "Recomenda-se um campo de batalha fechado e sem obstáculos.",
      rules: [
        'Não há times ou limite de jogadores, porém um em cada quatro jogadores inicia como um "zumbi".',
        "Forma-se um círculo com os zumbis ao centro.",
        "Quando um zumbi for eliminado, ele deve se aganhar e esperar 12 segundos. Então se levantar novamente.",
        "Quando um zumbi eliminar um jogador, esse deve se aganhar e levantar 12 segundos depois, agora como zumbi.",
        "Zumbis devem caminhar como se estivessem desmembrados de uma perna.",
        "Vence o último a ser transformado em zumbi.",
        "Eliminação por Hit Kill.",
      ],
    },
    {
      title: "ESTANDARTE",
      description:
        "Para essa modalidade, é ideal um campo de batalha grande, preferencialmente superior a 700 metros, com zonas de respawn nas extremidades.",
      rules: [
        "Apenas dois times. Cada um inicia com uma bandeira, que deve ser fixada em local visível e longe da zona de respawn.",
        "Essa modalidade é realizada com eliminação por Hit Kill.",
        "Cada time possui uma zona de respawn. Quando um jogador eliminado deve retornar a zona de respawn de seu time para retornar ao jogo.",
        "Vence o time que conseguir colocar as duas bandeiras juntas no ponto da bandeira.",
        "Um jogador eliminado não pode carregar bandeiras, devendo larga-las imediatamente.",
      ],
    },
    {
      title: "OVO DO DRAGÃO",
      description:
        "Essa modalidade é mais interessante se o time defensor possuir alguma forma de fortificação ou estiver no alto de uma colina.",
      rules: [
        'Apenas dois times. Um atacante e um defensor. O time defensor ficará com a base e recebe um objeto qualquer que será o "Ovo do Dragão".',
        "O time atacante vence caso consiga matar o time defensor ou destruir o ovo. O defensor vence eliminando o atacante. O ovo possui apenas um ponto de vida e não pode sair da base.",
        'Após 3 minutos, se o ovo não tiver sido destruído, o ovo deixa de existir e um jogador do time defensor passará a ser o "Dragão".',
        "O dragão tem 10 pontos de vida e é imune a desmembramento.",
      ],
    },
    {
      title: "TROLLBALL",
      description:
        "Para essa modalidade, recomenda-se um campo de formato similar.",
      rules: [
        "Mortes por One Hit Kill. Apenas dois times, que começam dispostos em fileiras.",
        'No centro do campo haverá uma trouxa de pano ou algum objeto que não role, chamado "Cabeça de Troll".',
        "A cabeça não pode ser arremessada, rebatida ou chutada, mas pode ser arrastada por pontas de armas ou carregada com as mãos.",
        "Um jogador eliminado não pode carregar a cabeça, devendo larga-la imediatamente.",
        "Vence o time que atravessar a bola pela trave do outro time.",
      ],
    },
    {
      title: "MALDITOS ARQUEIROS",
      description:
        "Para essa modalidade, recomenda-se que os arqueiros estejam em um ponto mais alto.",
      rules: [
        "Serão dois times, contendo cada um a mesma quantidade de arqueiros ou besteiros. As mortes serão por desmembramento.",
        'Há uma área, paralela ao campo, chamada "Zona dos Arqueiros".',
        "Os combatentes a distância não podem sair da Zona dos Arqueiros. Os guerreiros de infantaria não podem entrar nela.",
        "O time que perder seu último guerreiro de infantaria, perde o jogo.",
        "Os arqueiros não podem atacar uns aos outros, recuperar flechas ou impedir sua movimentação pela Zona.",
      ],
    },
  ];
}
