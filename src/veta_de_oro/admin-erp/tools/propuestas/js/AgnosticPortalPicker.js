/*
 * AgnosticPortalPicker.js — Componente de UI Desacoplado 100%
 * Utiliza Portal Rendering para asegurar visibilidad absoluta.
 */
export class AgnosticPortalPicker {
  constructor({ container, placeholder, dataSource, filterKey, onSelect, initialValue = '' }) {
    this.container = (typeof container === 'string') ? document.getElementById(container) : container;
    this.placeholder = placeholder;
    this.data = dataSource || [];
    this.filterKey = filterKey;
    this.onSelect = onSelect;
    this.initialValue = initialValue;
    this.activeFilters = new Set();
    this.categories = [...new Set(this.data.map(i => i[this.filterKey]).filter(Boolean))];
    
    this.dom = {};
    this.isOpen = false;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="smart-picker-anchor" style="position: relative; width: 100%;">
        <input type="text" class="v-input-clean picker-search" value="${this.initialValue}" placeholder="${this.placeholder}">
      </div>
    `;
    this.dom.input = this.container.querySelector('.picker-search');
    this.dom.portal = document.createElement('div');
    this.dom.portal.className = 'picker-portal-layer';
    document.body.appendChild(this.dom.portal);
    this.bind();
  }

  bind() {
    this.dom.input.addEventListener('focus', () => this.open());
    this.dom.input.addEventListener('input', () => this.refreshPortal());
    document.addEventListener('mousedown', (e) => {
        if (!this.dom.input.contains(e.target) && !this.dom.portal.contains(e.target)) {
            this.close();
        }
    });
    window.addEventListener('scroll', () => this.isOpen && this.updateGeometry(), true);
    window.addEventListener('resize', () => this.isOpen && this.updateGeometry());
  }

  updateGeometry() {
      const rect = this.dom.input.getBoundingClientRect();
      this.dom.portal.style.top = `${rect.bottom + window.scrollY + 5}px`;
      this.dom.portal.style.left = `${rect.left + window.scrollX}px`;
      this.dom.portal.style.width = `${rect.width}px`;
  }

  open() { this.isOpen = true; this.dom.portal.classList.add('active'); this.updateGeometry(); this.refreshPortal(); }
  close() { this.isOpen = false; this.dom.portal.classList.remove('active'); }

  refreshPortal() {
    const txt = this.dom.input.value.toLowerCase();
    let htmlHeader = this.categories.length > 0 ? `<div class="picker-filter-area">` + 
        this.categories.map(cat => `<div class="filter-pill-frame ${this.activeFilters.has(cat) ? 'active' : ''}" data-cat="${cat}">${cat}</div>`).join('') 
    + `</div>` : '';

    const results = this.data.filter(item => {
        const mTxt = (item.nombre || item.descripcion || '').toLowerCase().includes(txt);
        const mCat = this.activeFilters.size === 0 || this.activeFilters.has(item[this.filterKey]);
        return mTxt && mCat;
    });

    let htmlResults = `<div class="picker-results-area">` + 
        results.map(item => `
            <div class="picker-item" data-id="${item.sku || item.id}">
                <div><div style="font-weight:600;">${item.nombre||item.descripcion}</div><small>${item[this.filterKey]||''}</small></div>
                <span class="item-meta">$ ${Math.round(item.precio_unitario||0).toLocaleString()}</span>
            </div>
        `).join('')
    + `</div>`;

    this.dom.portal.innerHTML = htmlHeader + htmlResults;
    this.dom.portal.querySelectorAll('.filter-pill-frame').forEach(p => p.onclick = (e) => {
        e.stopPropagation();
        const c = p.dataset.cat;
        if(this.activeFilters.has(c)) this.activeFilters.delete(c); else this.activeFilters.add(c);
        this.refreshPortal();
    });
    this.dom.portal.querySelectorAll('.picker-item').forEach(el => {
        el.onclick = (e) => {
            e.stopPropagation();
            const id = el.dataset.id;
            const item = results.find(i => (i.sku || i.id) == id);
            this.dom.input.value = item.nombre || item.descripcion;
            this.onSelect(item);
            this.close();
        };
    });
  }

  destroy() { if(this.dom.portal && this.dom.portal.parentNode) { this.dom.portal.parentNode.removeChild(this.dom.portal); } }
}
