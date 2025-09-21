import { Component } from '@angular/core';

interface FAQ {
  question: string;
  answer: string;
  links?: { text: string, route: string }[];
}

@Component({
  selector: 'app-faq-page',
  standalone: false,
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss']
})
export class FaqPageComponent {
  faqs: FAQ[] = [
    {
      question: 'O QUE É ESSE JOGO DE ESPADINHAS? POSSO PARTICIPAR?',
      answer: 'Esse é o Swordplay Boffering, um esporte amador que simula combate medieval de forma segura. Nosso grupo permite a participação de qualquer pessoa com 12 anos ou mais. Saiba mais sobre swordplay <link>aqui</link> e sobre o clã <link>aqui</link>.',
      links: [
        { text: 'aqui', route: '/info/glossario' },
        { text: 'aqui', route: '/quem-somos' }
      ]
    },
    {
      question: 'É DE GRAÇA?',
      answer: 'Ninguém paga nada para se filiar ao clã ou mesmo para fazer um treino de teste. Após o 3º mês, passamos a cobrar a taxa de manutenção de R$ 7,00 (SETE REAIS) mensais para manutenção de nossas atividades.'
    },
    {
      question: 'TENHO QUE TER ARMA PRA ENTRAR?',
      answer: 'O clã possui um arsenal de equipamentos comunitários para os treinos, que serão emprestados para aqueles que estão começando. Claro que, com o tempo, ensinaremos você sobre como confeccionar o seu próprio equipamento.'
    },
    {
      question: 'COMO SÃO OS TREINOS?',
      answer: 'Iniciamos com aquecimento coletivo, puxado pelo nosso Oficial Tático. Em seguida iniciamos treinos específicos para cada modalidade de armamento, que são variáveis. Os membros mais antigos auxiliam os mais novos. Por fim, temos a sessão de combates coletivos (massivas), seguido por alongamento e avisos. Normalmente fazemos muitas brincadeiras, mas sem perder o foco principal da atividade.'
    },
    {
      question: 'COMO É FAZER PARTE DO MAKKA-KUH?',
      answer: 'Primeiramente, queremos ressaltar que somos mais do que apenas um grupo - somos uma comunidade unida, onde todos são bem-vindos e onde o bom humor é essencial. Aqui, adoramos uma zoeira, nos divertir e criar laços como uma verdadeira família. Nosso papo é diversificado: desde conversas sobre filmes e séries até trocas de ideias sobre histórias fantásticas e animações. Estamos sempre buscando novas formas de nos conectar e de trazer novidades para o grupo.'
    },
    {
      question: 'O CLÃ TEM ALGUMA IDEOLOGIA POLÍTICA OU RELIGIOSA?',
      answer: 'O Clã é um espaço neutro em relação a crenças religiosas e políticas. Cada membro é livre para seguir suas próprias convicções e se afiliar a outras instituições, se assim desejar. Nossa ideologia se fundamenta no respeito mútuo, na criatividade, na honra e na irmandade que cultivamos por meio do esporte. Estes valores são essenciais para nós e transcendem qualquer credos ou ideologias. Unimos forças lado a lado, celebrando a vida, pois é assim que cada um de nós, como guerreiros, escolhe viver.'
    }
  ];

  expandedIndex: number | null = null;

  toggleExpanded(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  processAnswer(answer: string, links?: { text: string, route: string }[]): string {
    if (!links) return answer;

    let processedAnswer = answer;
    links.forEach(link => {
      processedAnswer = processedAnswer.replace(
        `<link>${link.text}</link>`,
        `<a href="${link.route}" class="faq-link">${link.text}</a>`
      );
    });

    return processedAnswer;
  }
}
