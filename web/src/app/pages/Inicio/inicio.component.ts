import { Component } from '@angular/core';
import {RouterModule } from '@angular/router';
import {CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {
  carrouselImages = [
    'assets/img1.png'
  ];

  eventsDeMentira = [
  {
    "id": 1,
    "title": "Treino de Páscoa",
    "description": "Treinamento especial em comemoração à Páscoa.",
    "date": "2025-04-26T16:00:00",
    "place": "Local a definir",
    "maxParticipants": null,
    "recurrence": "Anual",
    "subscriptions": []
  },
  {
    "id": 2,
    "title": "Treino Externo Unitins",
    "description": "Treinamento externo na Universidade Estadual do Tocantins (UNITINS).",
    "date": "2025-04-30T20:00:00",
    "place": "UNITINS - Universidade Estadual do Tocantins polo Graciosa",
    "maxParticipants": null,
    "recurrence": "Unico",
    "subscriptions": []
  },
  {
    "id": 3,
    "title": "LARP",
    "description": "Live Action Role-Playing com dinâmicas e encenações.",
    "date": "2025-05-18T14:00:00",
    "place": "UFT - Universidade Federal do Tocantins",
    "maxParticipants": 30,
    "recurrence": "Semestral",
    "subscriptions": []
  },
  {
    "id": 4,
    "title": "GeekCon SESC",
    "description": "Participação do Makka-kuh na Convenção Geek organizada pelo SESC.",
    "date": "2025-05-24T08:00:00",
    "place": "SESC-TO",
    "maxParticipants": 15,
    "recurrence": "Unico",
    "subscriptions": []
  },
  {
    "id": 5,
    "title": "GeekCon SESC - Dia 2",
    "description": "Segundo dia da GeekCon com participação contínua do Makka-kuh.",
    "date": "2025-05-25T08:00:00",
    "place": "SESC-TO",
    "maxParticipants": 300,
    "recurrence": "Unico",
    "subscriptions": []
  },
  {
    "id": 6,
    "title": "Treino Externo Festival Místico",
    "description": "Treinamento especial durante o Festival Terapêutico e Místico.",
    "date": "2025-05-31T08:00:00",
    "place": "Clube Bertaville",
    "maxParticipants": 5,
    "recurrence": "Unico",
    "subscriptions": []
  },
  {
    "id": 7,
    "title": "Doação de Sangue",
    "description": "Ação solidária de doação de sangue promovida pelo makka-kuh.",
    "date": "2025-06-06T08:00:00",
    "place": "Hemocentro ou local parceiro",
    "maxParticipants": null,
    "recurrence": "Semestral",
    "subscriptions": []
  },
  {
    "id": 8,
    "title": "Makkuadrilha",
    "description": "Festa junina com quadrilha temática organizada pelo makka-kuh.",
    "date": "2025-06-14T18:00:00",
    "place": "Local a definir",
    "maxParticipants": null,
    "recurrence": "Anual",
    "subscriptions": []
  }
]
}
