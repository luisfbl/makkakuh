import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './core/auth/services/auth.service';

interface NavItem {
    key: string;
    label: string;
    route?: string;
    subItems?: { label: string; route: string }[];
}

interface FooterSection {
    title: string;
    links: { label: string; route?: string }[];
}

@Component({
    selector: 'app-root',
    standalone: false,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'Makkakuh';
    mobileMenuOpen = false;
    dropdowns: { [key: string]: boolean } = {};

    private dropdownTimers: { [key: string]: any } = {};
    private boundDocumentClick = this.onDocumentClick.bind(this);
    private boundWindowResize = this.onWindowResize.bind(this);

    navItems: NavItem[] = [
        {
            key: 'quemSomos',
            label: 'Quem Somos?',
            route: '/quem-somos',
            subItems: [
                {label: 'Leis do Clã', route: '/leis-do-cla'},
                {label: 'Organização do Clã', route: '/organizacao-do-cla'},
                {label: 'Hierarquia e Patentes', route: '/hierarquia-patentes'},
                {label: 'Nossa História', route: '/nossa-historia'},
                {label: 'Comitê Feminino', route: '/comite-feminino'}
            ]
        },
        {
            key: 'swordplay',
            label: 'O que é swordplay?',
            route: '/swordplay',
            subItems: [
                {label: 'Regras de Duelo', route: '/regras-de-duelo'},
                {label: 'Regras de Massiva', route: '/regras-de-massiva'},
                {label: 'Equipamentos', route: '/equipamentos'},
                {label: 'Glossário do Swordplay', route: '/glossario'}
            ]
        },
        {
            key: 'larp',
            label: 'O que é LARP?',
            route: '/larp'
        },
        {
            key: 'mais',
            label: 'Mais',
            subItems: [
                {label: 'Mural da Glória', route: '/mural-da-gloria'},
                {label: 'Perguntas Frequentes', route: '/perguntas-frequentes'},
                {label: 'Ações Sociais', route: '/acoes-sociais'},
                {label: 'Galeria', route: '/galeria'}
            ]
        }
    ];

    footerSections: FooterSection[] = [
        {
            title: 'Links Rápidos',
            links: [
                {label: 'Quem Somos', route: '/quem-somos'},
                {label: 'Mural da Glória', route: '/mural-da-gloria'},
                {label: 'FAQ', route: '/PerguntasFrequentes'},
                {label: 'Ações Sociais', route: '/acoes-sociais'}
            ]
        },
        {
            title: 'Esporte',
            links: [
                {label: 'Swordplay Boffering'},
                {label: 'LARP'},
                {label: 'Regras'},
                {label: 'Equipamentos'}
            ]
        }
    ];

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        this.navItems.forEach(item => {
            this.dropdowns[item.key] = false;
        });
    }

    ngOnInit() {
        document.addEventListener('click', this.boundDocumentClick);
        window.addEventListener('resize', this.boundWindowResize);
        
        // Initialize authentication status on app startup
        this.authService.verifyAuthentication().subscribe({
            next: (user) => {
                if (user) {
                    console.log('User authenticated on startup:', user.name);
                } else {
                    console.log('No authenticated user found on startup');
                }
            },
            error: (error) => {
                console.log('Authentication check failed on startup:', error.status);
            }
        });
    }

    ngOnDestroy() {
        document.removeEventListener('click', this.boundDocumentClick);
        window.removeEventListener('resize', this.boundWindowResize);
        document.body.style.overflow = '';
        Object.values(this.dropdownTimers).forEach(timer => {
            if (timer) clearTimeout(timer);
        });
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        if (!this.mobileMenuOpen) this.closeAllDropdowns();
        document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.mobileMenuOpen = false;
        this.closeAllDropdowns();
        document.body.style.overflow = '';
    }

    handleDropdownClick(dropdown: string, route: string | undefined, event: Event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.isMobile()) {
            this.toggleDropdown(dropdown);
        } else if (route) {
            this.router.navigate([route]);
        }
    }

    toggleDropdown(dropdown: string) {
        if (this.isMobile()) {
            this.closeOtherDropdowns(dropdown);
            this.dropdowns[dropdown] = !this.dropdowns[dropdown];
        }
    }

    navigateAndClose(route: string) {
        this.router.navigate([route]);
        this.closeMobileMenu();
    }

    private isMobile(): boolean {
        return window.innerWidth <= 1340;
    }

    private closeOtherDropdowns(except?: string) {
        Object.keys(this.dropdowns).forEach(key => {
            if (key !== except) this.dropdowns[key] = false;
        });
    }

    private closeAllDropdowns() {
        Object.keys(this.dropdowns).forEach(key => {
            this.dropdowns[key] = false;
        });
    }

    private onDocumentClick(event: Event) {
        const target = event.target as Element;
        if (!target.closest('.nav-dropdown')) {
            this.closeAllDropdowns();
        }
    }

    private onWindowResize() {
        if (window.innerWidth > 1340) {
            this.closeMobileMenu();
        }
    }
}