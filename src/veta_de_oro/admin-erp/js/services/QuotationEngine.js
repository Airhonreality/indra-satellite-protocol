import { Blueprint } from '../core/Blueprint.js';
import { MOCK_QUOTATION_DATA } from '../adapters/MockAdapter.js';

/**
 * INDRA QUOTATION ENGINE (Blueprint Edition)
 * Gestor oficial de propuestas técnicas.
 */
export class QuotationEngine extends Blueprint {
    constructor() {
        super('QUOTATION', JSON.parse(JSON.stringify(MOCK_QUOTATION_DATA)));
    }

    // --- ACCIONES DE ESCENARIO (VARIANTES) ---

    addVariant(name = "Nueva Variante") {
        const newVariant = {
            uuid: this.generateId('sc'),
            name: name,
            total: 0,
            spaces: []
        };
        this.state.scenarios.push(newVariant);
        this.state.activeScenario = newVariant.uuid;
        this.sync();
    }

    switchScenario(uuid) {
        if (this.state.scenarios.find(s => s.uuid === uuid)) {
            this.state.activeScenario = uuid;
            this.sync();
        }
    }

    // --- ACCIONES DE ESPACIO ---

    addSpace(label = "Nuevo Espacio") {
        const scenario = this.getActiveScenario();
        if (!scenario) return;

        scenario.spaces.push({
            uuid: this.generateId('sp'),
            etiqueta: label,
            subtotal: 0,
            viewMode: 'ENGINEERING',
            items: [],
            requirements: []
        });

        this.sync();
    }

    removeSpace(spaceUuid) {
        const scenario = this.getActiveScenario();
        scenario.spaces = scenario.spaces.filter(s => s.uuid !== spaceUuid);
        this.sync();
    }

    // --- ACCIONES DE LÍNEA TÉCNICA (ITEMS) ---

    addItem(spaceUuid, itemData = { nombre: "Nuevo Ítem", precio: 0, cantidad: 1 }) {
        const space = this.getSpace(spaceUuid);
        if (!space) return;

        space.items.push({
            uuid: this.generateId('it'),
            nombre: itemData.nombre,
            cantidad: itemData.cantidad,
            precio: itemData.precio,
            subtotal: itemData.precio * itemData.cantidad
        });

        this.calculateTotals();
        this.sync();
    }

    // --- CÁLCULOS DETERMINÍSTICOS ---

    calculateTotals() {
        this.state.scenarios.forEach(sc => {
            sc.total = sc.spaces.reduce((acc, sp) => {
                sp.subtotal = sp.items.reduce((sum, it) => sum + it.subtotal, 0);
                return acc + sp.subtotal;
            }, 0);
        });
    }

    // --- GETTERS ---

    getActiveScenario() {
        return this.state.scenarios.find(s => s.uuid === this.state.activeScenario) || this.state.scenarios[0];
    }

    getSpace(spaceUuid) {
        const scenario = this.getActiveScenario();
        return scenario.spaces.find(s => s.uuid === spaceUuid);
    }
}
