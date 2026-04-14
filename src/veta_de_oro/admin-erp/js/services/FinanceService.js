import { indraBus } from '../core/IndraEventBus.js';
import IndraBridge from '../core/IndraBridge.js';
import { MOCK_FINANCE } from '../adapters/MockAdapter.js';

/**
 * INDRA FINANCE SERVICE (CASCARÓN VACÍO)
 * LOGIC_GAS: Saldo = BD09.Total - SUM(BD08.Abonos)
 */
class FinanceService {
    constructor() {
        this.fData = { total: 0, abonos: 0, saldo: 0 };
        indraBus.on('QUOTATION_UPDATED', () => this.syncFromIndra());
    }

    async syncFromIndra() {
        const USE_MOCK = true;

        this.fData = USE_MOCK
            ? MOCK_FINANCE
            : await IndraBridge.invoke('GET_FINANCIAL_SNAPSHOT', { projectId: 'CURRENT' });

        indraBus.emit('FINANCE_UPDATED', this.fData);
    }

    async validatePaymentHito() {
        if (this.fData.abonos > 0) {
            indraBus.emit('HITO_DISPARADO', { hito: 'ABONADO', timestamp: Date.now() });
        }
    }
}

export const financeService = new FinanceService();
