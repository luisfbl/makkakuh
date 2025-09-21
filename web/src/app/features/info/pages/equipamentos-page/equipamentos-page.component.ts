import { Component } from '@angular/core';

interface EquipmentLimit {
  name: string;
  points: number;
}

interface WeaponType {
  title: string;
  description: string;
  details?: string[];
}

interface ArmorPiece {
  name: string;
  description: string;
  special?: string;
  color: string;
}

@Component({
  selector: 'app-equipamentos-page',
  standalone: false,
  templateUrl: './equipamentos-page.component.html',
  styleUrls: ['./equipamentos-page.component.scss']
})
export class EquipamentosPageComponent {
  equipmentLimits: EquipmentLimit[] = [
    { name: 'Arma Curta (até 90 cm)', points: 1 },
    { name: 'Arma Longa (maior que 90 cm)', points: 3 },
    { name: 'Armadura (cada peça)', points: 1 },
    { name: 'Arco ou Besta', points: 2 },
    { name: 'Escudo', points: 2 }
  ];

  limitRules = [
    'Cada combatente possui 5 pontos de equipamento, sendo que no máximo até 4 podem ser gastos com armamento;',
    'Não é permitido acumular armaduras com escudo ou acumular mais de 2 peças de armadura;',
    'Cada combatente pode carregar consigo até no máximo uma arma de arremesso.'
  ];

  prohibitedMassiva = [
    'Utilizar ou carregar armas de outros guerreiros;',
    'Carregar mais de 1 (UMA) única arma de arremesso (curta ou longa);',
    'Trocar armas com outros combatentes durante o combate;',
    'Buscar flechas para os arqueiros (eles terão de buscar sozinhos).',
    'Colocar armas dentro de roupas (Camiseta, calça, etc).',
    'Iniciar a massiva com o armamento no chão.'
  ];

  weaponTypes: WeaponType[] = [
    {
      title: 'Espadas',
      description: 'É a arma mais tradicional do swordplay. A lâmina pode ser reta ou curva e o uso de bainha é opcional.',
      details: [
        'O uso de guarda também é opcional, mas recomendado. A guarda deve ser feita de um material macio (que não cause dano em caso de contato). O lado da lâmina, que não é usado para contato, pode ter apenas 2 cm de espuma.',
        'O tamanho varia de pouco mais de 40 cm até versões imensas, como os glaives europeias ou katanas.'
      ]
    },
    {
      title: 'Escudos',
      description: 'Pode ser feitos de EVA, papelão ou material similar (madeira, metal e outros materiais rígidos demais são proibidos). O tamanho pode variar entre o broquel (20 cm) e o targu (1,5 m), com centenas de possibilidades de formatos.',
      details: [
        'A borda deve estar revestida por um material capaz de absorver o impacto, como EVA de espuma de flutuador de piscina ou espuma de ar condicionado. Escudos nunca são usados para atacar, nem podem possuir lâminas e não podem possuir apoios de chão, sendo feitos para serem exclusivamente carregados. Também não podem possuir partes móveis.'
      ]
    },
    {
      title: 'Lanças',
      description: 'É uma arma de haste (regras gerais no topo) e ponta, feita para estocadas, podendo ser manuseada com uma ou duas mãos. A haste pode ser utilizada para defesa, mas nunca para ataque. Recomenda-se cuidado ao direcionar a ponta, por se tratar de uma arma de estocadas, até mesmo ultrapassando, se possível os limites mínimos de espuma na ponta.',
      details: [
        'Lanças curtas (até 15 m de comprimento) podem ser utilizadas a cavalo e arremessadas em guerras, desde que seus cabos sejam completamente revestidos.'
      ]
    },
    {
      title: 'Adagas',
      description: 'Usada para combate em curta distância, a adaga pode ser confeccionada apenas de espuma ou feita do modo comum de lâminas. Adagas não podem ultrapassar 40 cm, ou serão consideradas espadas.',
      details: [
        'Adagas de arremesso devem ser feitas de EVA ou emborrachado similar, não podendo conter núcleo de cano de PVC, mas é possível que seu núcleo seja feito de fibra de vidro.',
        'A lâmina deve ser revestida de espuma, conforme a regra de arremesso (box do topo).'
      ]
    },
    {
      title: 'Machados',
      description: 'Machados são considerados armas de haste e são feitos principalmente para golpes giratórios (leia as regras gerais no topo). Não recomenda-se o uso de conectores de cano, pois a arma irá ter vida útil muito curta assim.',
      details: [
        'Normalmente faz-se a folha da lâmina com EVA, adicionando depois a espuma. Recomenda-se utilizar uma quantidade maior de espuma, para reduzir o impacto dessa arma.',
        'Machados de até 40 cm (machadinhas) podem ser arremessados, desde que estejam de acordo com as regras de arremesso. Estes não possuem cano.'
      ]
    },
    {
      title: 'Arcos e Flechas',
      description: 'O arco nunca é uma arma de ataque corpo-a-corpo. Pode ser feito de cano de PVC com linha encerada ou similar. A tensão do arco não pode ultrapassar 20 libras de potência. Não é permitido arco composto ou com roldanas.',
      details: [
        'As flechas deverão ser feitas de madeira ou outro material leve, com pontas acolchoadas com um revestimento de EVA ou similar e fita, seguido por uma camada de espuma de 5 cm de espuma. A "cabeça" deve ter no mínimo 5 cm de diâmetro. É obrigatório inserir algo que separe a madeira da haste, como uma moeda ou tampa de garrafa pet. Hastes de bambum devem ter os nós lixados, para não machucar. Flechas danificadas devem ser descartadas, por segurança.'
      ]
    },
    {
      title: 'Maças',
      description: 'Essa arma pode ser feita para uma ou duas mãos. A área de dano, chamada de "cabeça", pode (mas não é obrigatório) ser reforçada com espuma de alta densidade ou EVA, mas é obrigatório que seja completamente revestida com uma camada de 4 cm de espuma de baixa densidade (flutuador de piscina ou PI).',
      details: [
        'Caso a cabeça seja feita em formato de cone, a base do cone deverá respeitar o limite de espuma de 4 cm.',
        'Cravos são estéticos e opcionais, mas devem ser grossos o bastante para não penetrar uma cavidade ocu'
      ]
    },
    {
      title: 'Manguais',
      description: 'Composta de cabo, cabeça e corrente. A cabeça é a única área que pontua e deve ser feita de espuma de baixa densidade, podendo possuir um núcleo de material não-rígido, como um nó de corda ou EVA. Cravos (spikes) de espuma de baixa densidade são opcionais. A corrente é feita de corda ou fio, que deve ser revestida de material anti-abrasivo, com em elos encapados com fita e deve haver espaço para que a corda atinja o oponente.',
      details: [
        'Recomenda-se que a corda deve atravessar o cabo em ao menos dois pontos de furo, garantindo que não se desconecte. O tamanho da corrente e da cabeça podem variar, mas recomenda-se 20-45 cm de corrente e cabeça de 20 cm, embora não há regra que proíba maiores tamanhos.'
      ]
    },
    {
      title: 'Bestas',
      description: 'A besta, ou arco em cruz, pode ser feito de madeira, fibra de vidro ou pvc, com corda de nylon ou linha encerada trançada.',
      details: [
        'Peças como arruelas, parafusos e outras partes de material duro deverão obrigatoriamente estar revestidas de EVA ou revestimento similar. O gatilho não pode ser excessivamente sensível, ou irá disparar enquanto o jogador se movimenta.',
        'As flechas (que para a besta são chamadas de "virotes") devem seguir as mesmas especificações de segurança da sessão Arco e Flecha. A tensão máxima é de 20 libras.'
      ]
    },
    {
      title: 'Martelos',
      description: 'Também chamado de malho, essa arma acaba por ser bem mais pesada que a média, por isso suas especificações de segurança são reforçadas.',
      details: [
        'Recomenda-se que a cabeça seja feita somente de EVA e recoberta espuma. Caso se ferrete insista em utilizar um cano em "T" como base (não recomendado), toda a cabeça deverá ser recoberta com ao menos 5 cm de espuma. Cravos e decorações são opcionais. O cabo deverá ser bem revestido, como em todas as armas de haste.',
        'A cabeça do martelo não pode ter menos de 10 cm.'
      ]
    },
    {
      title: 'Alabardas',
      description: 'A alabarda é uma mistura de lança e machado, podendo ser usada para corte, normalmente pelos dois lados da folha de lâmina, e perfuração pela ponta.',
      details: [
        'A folha de lâmina segue o padrão do machado, a ponta será conforme à regra de lança. O cabo segue a regra de hastes.',
        'Alabardas não poderão ser arremessadas, independente do tamanho.'
      ]
    },
    {
      title: 'Bastões Marciais',
      description: 'O bastão é uma arma de haste com duas pontas, feito para combate frontal ou giratório. As extremidades são as únicas áreas de dano, e devem ser fabricadas conforme as regras. O meio deve ser acolchoado conforme a regras de cabos e hastes, não podendo ser utilizado para ataques, mas servindo para bloqueios.',
      details: [
        'Nota: O formato final não irá lembrar um bastão de verdade, parecendo muito mais um cotonete gigante. O estilo de luta não será exatamente igual ao da arma real. Lembre-se que swordplay é um esporte e que segurança está acima de tudo.'
      ]
    }
  ];

  armorPieces: ArmorPiece[] = [
    {
      name: 'OMBREIRA E GUARDA-BRAÇO',
      description: 'Peça ou conjunto de peças que protege desde a junta do ombro até o cotovelo, sendo usada em movimentos para bloquear golpes contra o tórax.',
      color: '#FFD700'
    },
    {
      name: 'ELMO',
      description: 'Protege a cabeça e possivelmente o pescoço contra impactos e contra o sol. Esse item é recomendado, principalmente para escudeiros. O uso do elmo não libera os golpes na cabeça, que continuam proibidos.',
      special: 'Elmos não contam para acúmulo de equipamentos',
      color: '#C0C0C0'
    },
    {
      name: 'BRAÇADEIRA',
      description: 'Protege do cotovelo até o pulso, podendo ser utilizada para bloqueios como "varridas". Pode incluir a área do cotovelo, opcionalmente.',
      color: '#FF69B4'
    },
    {
      name: 'GUARDA-CORAÇÃO',
      description: 'Essa proteção de origem greco-romana, normalmente fixa por faixas, é a única peça de armadura que poderá ser fixada no tórax, bloqueando apenas um lado do peito do guerreiro. Não é permitido o uso de duas placas desse tipo.',
      color: '#87CEEB'
    },
    {
      name: 'MANOPLA PUNCH',
      description: 'Essa peça protege as costas da mão até a altura do pulso. Com ela é permitido efetuar tapas com as costas da mão ou socos com a finalidade de bloquear ataques. Essa peça não protege a palma da mão, não permitindo de nenhuma forma segurar a arma do adversário.',
      color: '#90EE90'
    },
    {
      name: 'PERNEIRA',
      description: 'Protege a região da coxa, indo da virilha até logo acima do joelho, podendo (opcional) conter uma proteção para a virilha (soqueira), sem contar como equipamento adicional.',
      color: '#FFB6C1'
    },
    {
      name: 'GREVA / CANALEIRA',
      description: 'Peça que protege a canela. Podem ir do joelho ao calcanhar.',
      color: '#FA8072'
    }
  ];

  securityRules = [
    {
      title: 'Áreas de Dano',
      content: '(normalmente, mas nem sempre, chamadas de "lâminas") devem ter um mínimo de 2,5 cm de espuma (em cada lado) e 5 cm nas pontas. Armas de EVA devem ser planejadas com alguma forma de amortecimento do impacto por cima do EVA (recomenda-se espuma). Devem ser revestidas de fita (Silver Tape).'
    },
    {
      title: 'A espuma',
      content: 'poderá ser de flutuador de piscina, PI ou similar e deverá ser colada no cano com cola de sapateiro ou cola de contato. Não'
    },
    {
      title: 'Por questão de segurança, o Cano',
      content: 'jamais pode estar exposto em nenhuma parte da arma, mesmo no cabo da arma, devendo ser recoberto com material anti-deslizante e é extremamente recomendado que seja feito de forma a amortecer impactos.'
    },
    {
      title: 'Hastes de armas',
      content: 'devem ser, obrigatoriamente, cobertas com espuma, EVA, borracha ou similar, de forma de reduzir o dano em caso de possível impacto. Em armas de estocada (lanças, tridentes...), esse revestimento deve ser feito em 1/3 da haste, na região mais próxima à lâmina. Em armas de corte (machados, foices...), esse revestimento deve ser feito em 1/2 da área da haste.'
    },
    {
      title: 'A ponta do cabo',
      content: 'deve ser protegida por material anti-impacto. O ideal é uma esfera de espuma, EVA, borracha, ou similar, fixada com cola e fita, chamada de Pomo, com espessura mínima de 1 cm.'
    },
    {
      title: 'Armas de Arremesso',
      content: 'devem, obrigatoriamente, ser fabricadas de material que não cause dano ao impacto em nenhuma parte como EVA ou material mágico. Elas não podem possuir cano interno, mas é permitido que tenham núcleos de fibra de vidro recoberto de EVA. Essas armas não podem ultrapassar 40 cm, exceto por lanças curtas (dardos ou azagaias), que podem chegar até 1,5 m. A região de contato deve ser revestida de espuma como uma lâmina comum.'
    }
  ];
}
