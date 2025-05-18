import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {Event} from "../../../../model/event.model";

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class HomePageComponent {
    eventsDeMentira: Event[] = [
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
        }
    ];
}