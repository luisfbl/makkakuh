import { Component } from "@angular/core";

@Component({
  selector: "app-leis-regras-page",
  standalone: false,
  templateUrl: "./leis-regras-page.component.html",
  styleUrls: ["./leis-regras-page.component.scss"],
})
export class LeisRegrasPageComponent {
  laws = [
    "Respeito e bom-humor são as bases do Clã. Nenhuma delas deverá ser perdida.",
    "É responsabilidade de cada membro manter seu equipamento dentro de nossas <strong>Regras de Segurança para Equipamentos</strong>. Armas fora do padrão e negligências na manutenção são inaceitáveis e passíveis de veto e punição.",
    "Para participar do Clã é preciso ter 12 anos ou mais. Membros entre 12 e 16 anos devem ser orientados por um membro maior de idade e autorizados por seus pais/responsáveis.",
    "Os membros do Clã devem ser sempre honestos, especialmente quando forem atingidos em combate.",
    "Todos são responsáveis pela segurança e integridade física do próximo e pela própria.",
    "Todas as atividades do Clã iniciam com nosso grito de guerra.",
    "Ninguém está livre de brincadeiras e momentos engraçados por aqui. A melhor maneira de lidar com isso é se acostumar e entrar na diversão também!",
    "Todos os membros têm a responsabilidade de preservar a reputação do Clã e nunca fazer nada que possa prejudicá-la.",
    "Todos os membros devem contribuir para a manutenção da estrutura do Clã da maneira que puderem.",
    "O Clã não busca lucrar financeiramente, mas pode levantar fundos para sua própria manutenção e aprimoramento.",
    "O Clã não possui associações de natureza política ou religiosa.",
    "O <strong>Conselho Primata Ancião</strong> é encarregado da administração do Clã. Grandes decisões são tomadas por meio de votação em assembleias, onde cada membro tem o direito de expressar sua opinião.",
    "É responsabilidade de todos os membros conhecer as regras do clã, e o não cumprimento delas pode resultar em punições.",
  ];
}
