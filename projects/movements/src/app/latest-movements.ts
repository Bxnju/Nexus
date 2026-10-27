import { Component, signal } from '@angular/core';
import { Account, CustomerMovementStrategy, AdminMovementStrategy, Movement, movements } from './movement-model';

@Component({
  selector: 'movements-latest',
  imports: [],
  template: `
    <article class="latest-card">
      <div class="latest-heading">
        <div><span class="tag">MOVEMENTS · LATEST 3</span><h3>Últimos movimientos</h3></div>
        <span class="portal-badge">{{ portal() === 'admin' ? 'OPERATIONS' : 'PERSONAL' }}</span>
      </div>
      <div class="latest-list">
        @for (item of items(); track item.label) {
          <div class="latest-item">
            <span class="movement-icon" [class]="item.tone">{{ item.icon }}</span>
            <div class="latest-info"><b>{{ item.label }}</b><small>{{ strategy().getPresentation().category(item) }} · {{ item.date }}</small></div>
            @if (strategy().getPresentation().showAmount) {
              <strong [class.income]="item.amount > 0">{{ formatCop(item.amount, true) }}</strong>
            } @else {
              <span class="audit-label">AUDITADO</span>
            }
          </div>
        }
      </div>
    </article>
  `,
  styles: [`
    :host{display:block;font-family:Inter,Segoe UI,sans-serif}.latest-card{padding:18px 20px;background:#fff;border:1px solid #e7ecf2;border-radius:12px}.latest-heading{display:flex;justify-content:space-between;align-items:start;border-bottom:1px solid #edf0f4;padding-bottom:12px}.tag{font-size:8px;letter-spacing:1.1px;color:#8192a5}.latest-heading h3{margin:6px 0 0;color:#1b2d42;font-size:16px}.portal-badge{font-size:8px;letter-spacing:.7px;color:#2b9a78;background:#e4f7ef;padding:5px 7px;border-radius:5px}.latest-list{padding-top:2px}.latest-item{display:flex;align-items:center;gap:10px;padding:11px 2px;border-bottom:1px solid #f0f2f5}.latest-item:last-child{border-bottom:0}.movement-icon{width:27px;height:27px;border-radius:8px;display:grid;place-items:center;font-size:12px;font-weight:700;background:#e3f7ef;color:#299a76}.movement-icon.orange{background:#fff0df;color:#bd8041}.movement-icon.purple{background:#f0eafb;color:#8c6ac0}.movement-icon.blue{background:#e7f0fb;color:#5a83b7}.latest-info{flex:1;min-width:0}.latest-info b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#2b3d52;font-size:10px}.latest-info small{display:block;margin-top:3px;color:#97a2ae;font-size:8px}.latest-item strong{font-size:10px;color:#526275}.latest-item strong.income{color:#299a76}.audit-label{color:#9275c2;font-size:8px;letter-spacing:.6px;background:#f1eafa;padding:5px;border-radius:4px}
  `],
})
export class LatestMovementsComponent {
  protected formatCop(value: number, showPositiveSign = false) {
    const sign = value < 0 ? '-' : showPositiveSign ? '+' : '';
    return `COP $${sign}${Math.abs(value).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
  }
  protected readonly portal = signal(new URLSearchParams(location.search).get('portal') === 'admin' ? 'admin' : 'customer');
  protected readonly account = signal<Account>({ id: 'acc-001', alias: 'Cuenta principal', owner: 'Andres Benjumea', balance: 52000000 });
  protected readonly items = signal<Movement[]>(movements['acc-001'].slice(0, 3));
  protected readonly strategy = signal(this.portal() === 'admin' ? new AdminMovementStrategy() : new CustomerMovementStrategy());

  constructor() {
    window.addEventListener('account-changed', event => {
      const account = (event as CustomEvent<Account>).detail;
      if (!account) return;
      this.account.set(account);
      this.items.set((movements[account.id] ?? movements['acc-001']).slice(0, 3));
    });
    window.addEventListener('portal-changed', event => {
      const portal = (event as CustomEvent<{ portal: 'admin' | 'customer' }>).detail?.portal;
      if (!portal) return;
      this.portal.set(portal);
      this.strategy.set(portal === 'admin' ? new AdminMovementStrategy() : new CustomerMovementStrategy());
    });
  }
}
