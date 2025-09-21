import { Component } from "@angular/core";

interface Cargo {
  title: string;
  subtitle: string;
  name: string;
  description: string;
  responsibilities: string;
  currentOccupant: string;
}

@Component({
  selector: "app-organizacao-page",
  standalone: false,
  templateUrl: "./organizacao-page.component.html",
  styleUrls: ["./organizacao-page.component.scss"],
})
export class OrganizacaoPageComponent {
  cargos: Cargo[] = [
    {
      title: '"Líder do Clã"',
      subtitle: "Shogun",
      name: "Shogun",
      description:
        "O principal responsável que grandes decisões sejam tomadas, pela assembleia, uma série de responsabilidades oriundas dos membros e orienta dispostos.",
      responsibilities:
        "Decidir sobre questões urgentes sem consultar a Assembleia e Primata de questões dos outros Quix são seus dois principais deveres. E também administrar sobre os outros membros que não conseguem se entender nas decisões de questões.",
      currentOccupant: "",
    },
    {
      title: '"Vice-Líder do Clã"',
      subtitle: "1º Conselheiro",
      name: "1º Conselheiro",
      description:
        "O 1º Conselheiro é aquele que estará no local do clã quando o Shogun não estiver presente. Em outros momentos, o conselheiro será o responsável por relatos tanto dos demais pois ajuda o primata a documentos e eventos internos.",
      responsibilities:
        "Organizar substituir e representar o clã em encontros externos. Coletar importantes relatórios de cada ação, representar o Shogun sempre que este estiver ausente.",
      currentOccupant: "",
    },
    {
      title: '"A Voz da Cachoeira"',
      subtitle: "Arauto",
      name: "Arauto",
      description:
        "O Arauto é aquele autorizado a falar pelo clã em qualquer situação que seja necessário e porta-voz. Sua principal função é ser o Makka-Kuh, organizada do clã para coletar e promulgar listas. Também gerencia redes, o site e o Mural da Glória.",
      responsibilities:
        "Falar em nome do clã e gerenciar as redes sociais. Fazer Impressa. Gerenciar visibilidade as Primácias e responsabilidades que são e conhecimento de seus pares ou por outros cargos.",
      currentOccupant: "",
    },
    {
      title: '"O Senhor da Festa"',
      subtitle: "Mestre de Festivais",
      name: "Mestre de Festivais",
      description:
        "Responsável pela organização logística de eventos externos do Makka-Kuh, sejam eles encontros com outros grupos, como feiras e participações em eventos onde conhecemos, etc. O Arauto cuida da parte de eventos mais é o mestre Local da Festa que procura.",
      responsibilities:
        "Organizar suprimentos, para eventos externos e encontros. Organizar participações para conhecimentos eventos encontros e eventos e responsabilizar do Makka-Kuh como representante externo.",
      currentOccupant: "",
    },
    {
      title: '"Principal Forjador e Guardião das Armas"',
      subtitle: "Mestre do Arsenal",
      name: "Mestre do Arsenal",
      description:
        "Normalmente ocupado por um membro mais experiente que tem poder de ganhar a segurança e o acesso ao equipamento do clã. É a voz mais respeitada na área de equipamentos do clã como manutenção, assim como orientação na utilização do armamento.",
      responsibilities:
        "Inspecionar equipamentos dos membros. Orientar na manutenção e criação de armas de boffer. Auxiliar e membro novos nos equipamentos arsenais do clã.",
      currentOccupant: "",
    },
    {
      title: '"Treinador Físico e Estratégico"',
      subtitle: "Oficial Tático",
      name: "Oficial Tático",
      description:
        "O Makka-Kuh é um time de guerreiros que precisa estar sempre bem treinado com segurança, disciplina, empenho e bom humor. O Oficial Tático cuida da parte mais estratégica e psicológica, garantindo que estaremos sempre bem treinados e em forma.",
      responsibilities:
        "Orientar os treinamentos. criar exercícios físicos e estratégias. Controlar o desenvolvimento e progresso de cada membro.",
      currentOccupant: "",
    },
    {
      title: '"Dama da Moeda"',
      subtitle: "Senescal",
      name: "Senescal",
      description:
        "Responsável por gerenciar a logística do dia-a-dia interna do clã (Agendamento) logística. Cele é focada em gerir cobranças do treino, organizar eventos das necessidades e trabalhar junto ao clã. É forma de super-herói.",
      responsibilities:
        "Coletar importâncias mensalidades e organizar eventos. Manter organização e agenda do clã. Procurar formas de arrecadação (anguajai ou clã. Prestar contas e relatórios.",
      currentOccupant: "",
    },
  ];

  conselhoDeFuncoes = [
    "Elaborar treinos, independente de serem específicos ou coletivos.",
    "Decidir, criar, avaliar e aplicar os testes de progressão da patente do clã.",
    "Dar atenção especial às necessidades e deficiências específicas dos membros durante o treino.",
  ];
}
