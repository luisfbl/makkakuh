import { Component } from '@angular/core';

@Component({
  selector: 'app-comite-feminino-page',
  standalone: false,
  templateUrl: './comite-feminino-page.component.html',
  styleUrls: ['./comite-feminino-page.component.scss']
})
export class ComiteFemininoPageComponent {
  liderancaInfo = {
    lider: 'Kamy "Blabla"',
    viceLider: 'Kaisdelly "A Brava"'
  };

  funcoes = [
    'Apurar denúncias e coibir possíveis casos de assédio ou discriminação contra mulheres do clã;',
    'Organizar atividades exclusivas para o público feminino do clã, como treinos específicos e ensaios fotográficos;',
    'Executar atividades para atrair mais mulheres para o nosso esporte;',
    'Garantir um clima de amizade e companheirismo entre as garotas do Makka-Kuh;',
    'Deixar bem claro que nós somos capazes de derrotar qualquer macho, principalmente os que pensam o contrário.'
  ];
}
