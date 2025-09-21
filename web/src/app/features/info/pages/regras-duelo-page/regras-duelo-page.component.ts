import { Component } from '@angular/core';

@Component({
  selector: 'app-regras-duelo-page',
  standalone: false,
  templateUrl: './regras-duelo-page.component.html',
  styleUrls: ['./regras-duelo-page.component.scss']
})
export class RegrasDueloPageComponent {
  regrasGerais = [
    {
      number: 1,
      text: 'Acertar uma área válida vale 1 (UM) ponto.'
    },
    {
      number: 2,
      text: 'Acertar uma área crítica vale 2 (DOIS) pontos.'
    },
    {
      number: 3,
      text: 'Desarmar o oponente vale 3 (TRÊS) pontos, independente do número de armas que o oponente perca em um golpe.'
    },
    {
      number: 4,
      text: 'Atingir o pé, enquanto este estiver em contato com o solo ou a mão, enquanto esta estiver segurando arma ou escudo, não valerá pontuação.'
    },
    {
      number: 5,
      text: 'Uso de força excessiva não é permitido e é passível de advertência.'
    },
    {
      number: 6,
      text: 'O round se encerra com 5 (CINCO) pontos.'
    },
    {
      number: 7,
      text: 'É proibido qualquer tipo de ataque que não seja executado com as armas. Também não é permitido utilizar as mãos para desviar ataques. Ambas as proibições são consideradas ações de má fé.'
    },
    {
      number: 8,
      text: 'Atingir uma área proibida sem intenção será considerado como infração e o jogador receberá uma advertência. Uma segunda advertência causará a expulsão do competidor.'
    },
    {
      number: 9,
      text: 'Atingir deliberadamente uma área proibida é punido com a expulsão do jogador daquela partida.'
    },
    {
      number: 10,
      text: 'Armas de ataque a distância e/ou manobras de arremesso são proibidas no duelos.'
    },
    {
      number: 11,
      text: 'Não é permitido atacar os adversários com escudos ou cabos de armas, porém é permitido usá-los para manobras de desarme.'
    },
    {
      number: 12,
      text: 'Não é permitido segurar ou agarrar o oponente ou seu equipamento.'
    },
    {
      number: 13,
      text: 'Ataques que atingem apenas a roupa não contam pontuação.'
    },
    {
      number: 14,
      text: 'Ataques que acertem de raspão contam pontuação normalmente.'
    },
    {
      number: 15,
      text: 'Ataques que atingem apenas a <strong>armadura</strong> não contam pontuação.'
    },
    {
      number: 16,
      text: 'O round para imediatamente após cada acerto.'
    },
    {
      number: 17,
      text: 'Não é permitido o uso de bonés ou qualquer acessório de chapelaria com abas ou pontas, para que não existam dúvidas sobre se o golpe teria ou não acertado a cabeça.'
    },
    {
      number: 18,
      text: 'Não é permitido utilizar armas que não estejam sendo seguradas ou embainhadas no início do combate e nem armas colocadas dentro de roupas (camiseta, calça, etc).'
    },
    {
      number: 19,
      text: 'Em caso de empate, considera-se o vencedor aquele que tiver o menor número de infrações.'
    },
    {
      number: 20,
      text: 'Atitudes antidesportivas (de má fé) são punidas com expulsão do duelo e podem ter consequências quanto ao futuro do competidor nas atividades do Clã.'
    },
    {
      number: 21,
      text: 'Caso um jogador se coloque em posição de risco (se movimentando de forma que um golpe em percurso, que antes não iria atingir um local proibido, passe a atingir um local proibido) ou desvie um golpe para uma região proibida (desvio indutivo), não há punição. Reincidir em posições de risco ou desvios indutivos pode causar infrações para quem as faz.'
    },
    {
      number: 22,
      text: 'Caso hajam juízes, sua palavra é incontestável.'
    }
  ];

  sistemaPontos = {
    areas: [
      { name: 'Áreas Válidas', points: 1, color: '#00ff00', description: 'Tronco, braços, pernas' },
      { name: 'Áreas Críticas', points: 2, color: '#00ffff', description: 'Cabeça (apenas topo e laterais)' },
      { name: 'Áreas Proibidas', points: 0, color: '#ff0000', description: 'Face, pescoço, virilha, seios' },
      { name: 'Inválidas', points: 0, color: '#cccccc', description: 'Mãos segurando armas, pés no chão' }
    ]
  };
}
