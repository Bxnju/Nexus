import { NgComponentOutlet, NgIf } from '@angular/common';
import { Component, signal, Type } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

interface Account { id: string; alias: string; owner: string; balance: number; }

@Component({
  selector: 'app-root',
  imports: [NgComponentOutlet, NgIf],
  template: `<article><div class="heading"><div><span class="tag">FINANCIAL SNAPSHOT · {{account().id}}</span><h3>Resumen de {{account().alias}}</h3><p>Tu situación financiera, actualizada para esta cuenta.</p></div><span class="period">OCTUBRE 2026</span></div><div class="hero-metric"><div><small>PATRIMONIO TOTAL</small><strong>{{formatCop(account().balance * 1.42)}}</strong><span class="up">↗ 4.2% <em>crecimiento trimestral</em></span></div><div class="sparkline"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><div class="stats"><div><span class="icon green">↗</span><small>INGRESOS</small><b>{{formatCop(account().balance * .19)}}</b><em>+12.8% vs. anterior</em></div><div><span class="icon purple">◈</span><small>INVERTIDO</small><b>{{formatCop(account().balance * .73)}}</b><em>8.42% rendimiento</em></div><div><span class="icon orange">⌁</span><small>GASTOS</small><b>{{formatCop(account().balance * .067)}}</b><em>Dentro del presupuesto</em></div></div><div class="insights"><div><span class="tag">HEALTH SCORE</span><b>Excelente</b><p>Tu balance entre ahorro e inversión es saludable.</p><div class="bar"><i></i></div></div><div><span class="tag">PRÓXIMO OBJETIVO</span><b>Fondo de emergencia</b><p>78% completado · faltan {{formatCop(account().balance * .12)}}</p><div class="bar purple-bar"><i></i></div></div></div><div class="latest-module"><div class="latest-title"><span class="tag">MOVEMENTS REMOTE · {{portal() === 'admin' ? 'OPERATIONS' : 'PERSONAL'}}</span><span>Independiente</span></div><div class="latest-loading" [class.loaded]="latestLoaded()"><span>Sincronizando movimientos...</span></div><ng-container *ngIf="latestComponent(); else latestError"><ng-container *ngComponentOutlet="latestComponent()"></ng-container></ng-container><ng-template #latestError><span class="latest-error">No se pudo cargar el módulo de movimientos.</span></ng-template></div></article>`,
  styles: [`:host{display:block;width:100%;font-family:Inter,Segoe UI,sans-serif}article{width:100%;box-sizing:border-box;padding:24px 26px;background:#fff;border:1px solid #e7ecf2;border-radius:13px}.heading{display:flex;justify-content:space-between;align-items:start}.tag{font-size:9px;letter-spacing:1.2px;color:#7e91a5}.heading h3{margin:7px 0 4px;font-size:20px;color:#182a40}.heading p{margin:0;color:#8b98a6;font-size:11px}.period{font-size:8px;color:#8999a9;background:#f3f6f8;border-radius:5px;padding:6px 8px}.hero-metric{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(120deg,#122a43,#1e405e);border-radius:11px;padding:20px 23px;margin:20px 0 14px;color:#fff}.hero-metric small{display:block;font-size:8px;letter-spacing:1px;color:#9fb4c9}.hero-metric strong{display:block;font-size:29px;margin:7px 0}.up{font-size:10px;color:#71dcba}.up em{font-style:normal;color:#a8bdca;margin-left:4px}.sparkline{height:58px;width:185px;display:flex;align-items:end;gap:7px;border-bottom:1px solid #62829a}.sparkline i{display:block;width:10px;background:linear-gradient(#6bdfbd,#2f987f);border-radius:4px 4px 0 0}.sparkline i:nth-child(1){height:32%}.sparkline i:nth-child(2){height:45%}.sparkline i:nth-child(3){height:39%}.sparkline i:nth-child(4){height:58%}.sparkline i:nth-child(5){height:52%}.sparkline i:nth-child(6){height:70%}.sparkline i:nth-child(7){height:64%}.sparkline i:nth-child(8){height:82%}.sparkline i:nth-child(9){height:76%}.sparkline i:nth-child(10){height:100%}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.stats>div{position:relative;border:1px solid #edf0f4;border-radius:9px;padding:14px 13px}.stats small{display:block;color:#8797a7;font-size:8px;letter-spacing:1px}.stats b{display:block;color:#1c2d41;font-size:16px;margin:7px 0 4px}.stats em{font-style:normal;color:#2c9b78;font-size:9px}.icon{position:absolute;right:12px;top:12px;width:23px;height:23px;border-radius:6px;display:grid;place-items:center}.icon.green{background:#e3f7ef;color:#299a76}.icon.purple{background:#f0eafb;color:#8c6ac0}.icon.orange{background:#fff0df;color:#bd8041}.insights{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}.insights>div{background:#f8fafc;border-radius:9px;padding:14px}.insights b{display:block;margin:8px 0 4px;color:#283a4f;font-size:12px}.insights p{margin:0 0 10px;color:#8b98a6;font-size:10px}.bar{height:5px;background:#dcefe7;border-radius:5px}.bar i{display:block;width:92%;height:100%;background:#4bc29b;border-radius:5px}.purple-bar{background:#ebe4f7}.purple-bar i{background:#9e7bc9;width:78%}.latest-module{position:relative;margin-top:14px;border-top:1px solid #edf0f4;padding-top:13px;min-height:190px}.latest-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:7px}.latest-title>span:last-child{font-size:8px;color:#8d70bd;background:#f2ebfa;padding:5px 7px;border-radius:5px}.latest-loading{position:absolute;z-index:1;inset:39px 0 0;background:linear-gradient(110deg,#f5f8fb 25%,#eaf0f5 37%,#f5f8fb 63%);background-size:400% 100%;animation:summary-shimmer 1.3s infinite;border-radius:8px;display:grid;place-items:center;color:#8392a2;font-size:10px;transition:opacity .3s}.latest-loading.loaded{opacity:0;pointer-events:none}.latest-error{display:block;padding:28px;text-align:center;color:#bd6d6d;font-size:10px}@keyframes summary-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`]
})
export class App {
  protected formatCop(value: number) {
    return `${value < 0 ? '-' : ''}COP $${Math.abs(value).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
  }
  protected readonly portal = signal(new URLSearchParams(location.search).get('portal') === 'admin' ? 'admin' : 'customer');
  protected readonly latestLoaded = signal(false);
  protected readonly latestComponent = signal<Type<unknown> | null>(null);
  protected readonly account = signal<Account>({ id: 'acc-001', alias: 'Cuenta principal', owner: 'Andres Benjumea', balance: 52000000 });
  constructor() {
    window.addEventListener('account-changed', event => {
      const account = (event as CustomEvent<Account>).detail;
      if (account) this.account.set(account);
    });
    window.addEventListener('portal-changed', event => {
      const portal = (event as CustomEvent<{ portal: 'admin' | 'customer' }>).detail?.portal;
      if (portal) this.portal.set(portal);
    });
  }
  protected loadLatestMovements() {
    loadRemoteModule({
      remoteEntry: 'http://localhost:4206/remoteEntry.json',
      remoteName: 'movements',
      exposedModule: './LatestMovements',
    })
      .then(remote => {
        this.latestComponent.set(remote.LatestMovementsComponent);
        this.latestLoaded.set(true);
        setTimeout(() => window.dispatchEvent(new CustomEvent('account-changed', { detail: this.account() })), 0);
      })
      .catch(error => console.error('No se pudo cargar movements/LatestMovements', error));
  }
  ngOnInit() { this.loadLatestMovements(); }
}
