import { Component, signal } from '@angular/core';
import { Account, AdminMovementStrategy, CustomerMovementStrategy, Movement, movements } from './movement-model';
import { LatestMovementsComponent } from './latest-movements';

@Component({
  selector: 'app-root',
  imports: [LatestMovementsComponent],
  template: `
    @if (latestMode()) {
      <movements-latest />
    } @else {
      <article>
        <div class="summary"><div><span class="tag">MOVEMENTS · {{ account().id }}</span><h3>{{ presentation().title }}</h3><p>{{ presentation().subtitle }} <b>{{ account().alias }}</b></p></div><div class="summary-total"><small>{{ portal() === 'admin' ? 'OPERACIONES DEL PERIODO' : 'BALANCE DEL PERIODO' }}</small><strong>{{ formatCop(periodTotal()) }}</strong><span>Últimos 30 días</span></div></div>
        <div class="toolbar"><button class="active">Todos <b>{{ items().length }}</b></button><button>Ingresos</button><button>Gastos</button><span class="spacer"></span><button>⇅ Ordenar</button><button>↓ Exportar</button></div>
        <div class="list">@for (item of items(); track item.label) {<div class="movement"><span class="movement-icon" [class]="item.tone">{{ item.icon }}</span><div class="movement-info"><b>{{ item.label }}</b><small>{{ presentation().category(item) }} · {{ item.date }}</small></div>@if (presentation().showAmount) {<strong [class.income]="item.amount > 0">{{ formatCop(item.amount, true) }}</strong>} @else {<span class="audit-label">AUDITADO</span>}</div>}</div>
        <div class="footnote">{{ portal() === 'admin' ? 'Vista administrativa · importes protegidos por política de operaciones' : 'Mostrando datos locales de demostración · última sincronización hace 2 min' }}</div>
      </article>
    }
  `,
  styles: [`
    :host{display:block;font-family:Inter,Segoe UI,sans-serif}article{padding:22px;background:#fff;border-radius:13px}.summary{display:flex;justify-content:space-between;align-items:start;border-bottom:1px solid #edf0f4;padding-bottom:20px}.tag{font-size:9px;letter-spacing:1.2px;color:#7990a5}.summary h3{margin:7px 0 4px;color:#182a40;font-size:20px}.summary p{margin:0;color:#8b98a6;font-size:11px}.summary p b{color:#3e5064}.summary-total{text-align:right}.summary-total small{display:block;font-size:8px;letter-spacing:1px;color:#8a99a8}.summary-total strong{display:block;color:#1a2b40;font-size:22px;margin:5px 0}.summary-total span{font-size:9px;color:#9aa6b3}.toolbar{display:flex;gap:6px;padding:15px 0;border-bottom:1px solid #edf0f4}.toolbar button{border:1px solid #e8edf2;background:#fff;border-radius:6px;padding:7px 10px;color:#7b8998;font-size:9px;cursor:pointer}.toolbar button.active{background:#1f9b7d;color:#fff;border-color:#1f9b7d}.spacer{flex:1}.list{padding:4px 0}.movement{display:flex;align-items:center;gap:12px;padding:15px 5px;border-bottom:1px solid #f0f2f5}.movement-icon{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;font-weight:700;background:#e3f7ef;color:#299a76}.movement-icon.orange{background:#fff0df;color:#bd8041}.movement-icon.purple{background:#f0eafb;color:#8c6ac0}.movement-icon.blue{background:#e7f0fb;color:#5a83b7}.movement-info{flex:1}.movement-info b{display:block;color:#27384d;font-size:11px}.movement-info small{display:block;color:#97a2ae;font-size:9px;margin-top:4px}.movement>strong{font-size:12px;color:#526275}.movement>strong.income{color:#299a76}.audit-label{color:#9275c2;font-size:8px;letter-spacing:.6px;background:#f1eafa;padding:5px;border-radius:4px}.footnote{text-align:center;color:#abb4be;font-size:9px;padding:17px 0 0}
  `],
})
export class App {
  protected formatCop(value: number, showPositiveSign = false) {
    const sign = value < 0 ? '-' : showPositiveSign ? '+' : '';
    return `COP $${sign}${Math.abs(value).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
  }
  protected readonly portal = signal(new URLSearchParams(location.search).get('portal') === 'admin' ? 'admin' : 'customer');
  protected readonly latestMode = signal(new URLSearchParams(location.search).get('mode') === 'latest');
  protected readonly account = signal<Account>({ id: 'acc-001', alias: 'Cuenta principal', owner: 'Andres Benjumea', balance: 52000000 });
  protected readonly items = signal<Movement[]>(movements['acc-001']);
  protected readonly strategy = signal(this.portal() === 'admin' ? new AdminMovementStrategy() : new CustomerMovementStrategy());
  protected readonly presentation = signal(this.strategy().getPresentation());
  protected periodTotal() { return this.items().reduce((total, item) => total + item.amount, 0); }

  constructor() {
    window.addEventListener('account-changed', event => {
      const account = (event as CustomEvent<Account>).detail;
      if (!account) return;
      this.account.set(account);
      this.items.set(movements[account.id] ?? movements['acc-001']);
    });
    window.addEventListener('portal-changed', event => {
      const portal = (event as CustomEvent<{ portal: 'admin' | 'customer' }>).detail?.portal;
      if (!portal) return;
      this.portal.set(portal);
      this.strategy.set(portal === 'admin' ? new AdminMovementStrategy() : new CustomerMovementStrategy());
      this.presentation.set(this.strategy().getPresentation());
    });
  }
}
