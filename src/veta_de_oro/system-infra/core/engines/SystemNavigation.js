/**
 * SystemNavigation.js — Navegación Axiomática Global (v2.0)
 * Inyecta un micro-header persistente y soporta filtrado por roles.
 * 
 * TODO: PENDIENTE INTEGRACIÓN CON SISTEMA DE AUTENTICACIÓN (INDRA AUTH)
 */
class SystemNavigation {
    constructor() {
        // MODO SILENCIOSO: Si se detecta el flag de embebido, no se inicializa el componente.
        if (window.location.search.includes('embed=true')) return;

        /**
         * ESTADO DEL USUARIO (MOCK INICIAL)
         * TODO: Este objeto debe ser alimentado por un AuthService o cargado
         * desde el localStorage tras el login.
         */
        this.userContext = {
            role: 'admin', // Posibles valores: 'admin', 'manager', 'operador', 'cliente'
            status: 'ONLINE',
            version: 'AXIOM_3.5',
            userName: 'Agente_Alpha' // Campo preparado para mostrar perfil
        };

        /**
         * MAPA DE RUTAS Y PERMISOS
         * La propiedad 'roles' define quién puede ver cada enlace.
         * Si el rol del usuario no está en la lista, el link no se renderiza.
         */
        this.config = [
            { id: 'erp', label: 'Dashboard', icon: 'layout', url: '/02-admin-erp/index.html', roles: ['admin', 'manager', 'operador'] },
            { id: 'proyecto', label: 'Proyectos', icon: 'briefcase', url: '/02-admin-erp/tools/proyectos/index.html', roles: ['admin', 'manager'] },
            { id: 'directorio', label: 'Entidades', icon: 'users', url: '/02-admin-erp/tools/entidades/index.html', roles: ['admin', 'manager'] },
            { id: 'catalogo', label: 'Catálogo', icon: 'package', url: '/02-admin-erp/tools/catalogo/index.html', roles: ['admin', 'manager'] },
            { id: 'produccion', label: 'Producción', icon: 'hammer', url: '/02-admin-erp/tools/produccion/index.html', roles: ['admin', 'manager'] },
            { id: 'desarrollo', label: 'Desarrollo', icon: 'wrench', url: '/02-admin-erp/tools/desarrollo/index.html', roles: ['admin', 'manager'] },
            { id: 'logs', label: 'Logs & Tareas', icon: 'list-todo', url: '/02-admin-erp/tools/logs/index.html', roles: ['admin', 'manager', 'operador'] },
            { id: 'kpis', label: 'KPIs', icon: 'bar-chart-3', url: '/02-admin-erp/tools/kpis/index.html', roles: ['admin'] },
            { id: 'financiero', label: 'Finanzas', icon: 'banknote', url: '/02-admin-erp/tools/financiero/index.html', roles: ['admin'] },
            { id: 'bridge', label: 'Indra Bridge', icon: 'zap', url: '/02-admin-erp/tools/bridge/index.html', roles: ['admin'] }
        ];

        this.baseUrl = this.calculateBase();
        this.init();
    }

    /**
     * Calcula la raíz del proyecto para evitar errores de rutas relativas
     * en diferentes profundidades de carpetas o dominios (GitHub Pages vs Local).
     */
    calculateBase() {
        const path = window.location.pathname;
        if (path.includes('/veta_de_oro/')) return '/veta_de_oro/';
        return '/';
    }

    async init() {
        // 1. Asegurar Lucide Icons (Carga asíncrona si no existe en el scope global)
        await this.ensureLucide();

        // 2. Crear Nodo Root en el DOM
        const navContainer = document.createElement('div');
        navContainer.id = 'system-navigation-root';
        
        // Lo insertamos al inicio del body para que no interfiera con el flujo del contenido
        document.body.prepend(navContainer); 

        // 3. Renderizar Componente
        this.render(navContainer);
    }

    /**
     * Verifica la existencia de Lucide y lo carga dinámicamente si es necesario.
     * Esto permite que cualquier módulo use el header sin preocuparse por dependencias.
     */
    async ensureLucide() {
        if (!window.lucide) {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/lucide@latest';
                script.onload = () => resolve();
                document.head.appendChild(script);
            });
        }
    }

    /**
     * Motor de Renderizado: Genera el HTML basado en permisos y aplica iconos.
     */
    render(container) {
        const currentPath = window.location.pathname;
        
        // FILTRADO DE SEGURIDAD (RBAC - Role Based Access Control)
        const allowedLinks = this.config.filter(item => 
            item.roles.includes(this.userContext.role)
        );

        container.innerHTML = `
            <div class="system-nav-bar">
                <!-- Branding Veta (Link a Home) -->
                <div class="system-nav-logo" onclick="window.location.href='${this.baseUrl}02-admin-erp/index.html'">
                    VETA.OS
                </div>
                
                <!-- Items de Navegación Dinámicos -->
                <nav class="system-nav-items">
                    ${allowedLinks.map(item => {
                        const fullUrl = this.baseUrl + item.url.replace(/^\//, '');
                        // Lógica de detección de página activa
                        const isActive = currentPath.includes(item.url.split('/').pop().replace('.html', ''));
                        return `
                            <a href="${fullUrl}" class="system-nav-item ${isActive ? 'active' : ''}" title="${item.label}">
                                <span class="system-nav-icon"><i data-lucide="${item.icon}"></i></span>
                                <span class="system-nav-label">${item.label}</span>
                            </a>
                        `;
                    }).join('')}
                </nav>

                <!-- Status de Sistema / Contexto de Usuario -->
                <div class="system-nav-status">
                    <div class="status-indicator">
                        <div class="status-dot"></div>
                        <span class="technical-data">${this.userContext.status}</span>
                    </div>
                    <div class="technical-data" style="opacity: 0.5;">${this.userContext.version}</div>
                </div>
            </div>
        `;

        // Generar iconos de Lucide tras inyectar el HTML
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

/**
 * Inicialización Automática
 * Se asegura de correr una sola vez ya sea por DOMContentLoaded o ejecución inmediata.
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SystemNavigation());
} else {
    new SystemNavigation();
}
