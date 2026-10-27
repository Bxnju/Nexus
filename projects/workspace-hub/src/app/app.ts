import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, signal, Type } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

interface Account { id: string; alias: string; owner: string; balance: number; }
interface AccountEventDetail extends Account { source?: 'account-switcher' | 'workspace-hub'; }
const defaultAccount: Account = { id: 'acc-001', alias: 'Cuenta principal', owner: 'Andres Benjumea', balance: 52000000 };

@Component({
  selector: 'app-root',
  imports: [CommonModule, NgComponentOutlet],
  template: `
    <section class="hub">
      <div class="hero">
        <div><span class="eyebrow">NEXUS WORKSPACE <i>LIVE</i></span><h2>{{ view()==='movements' ? 'Actividad de la cuenta' : 'Tu panorama financiero' }}</h2><p>{{ view()==='movements' ? 'Cada movimiento, en contexto y con trazabilidad.' : 'Una vista clara de lo que está pasando con tu dinero.' }}</p></div>
        <div class="hero-actions"><span class="sync">● Sincronizado</span><button (click)="diagnostics.set(!diagnostics())">⚙ Diagnóstico</button></div>
      </div>
      <div class="account-bar"><div class="account-label"><span class="account-icon">◈</span><div><small>CUENTA SELECCIONADA</small><b>{{account().alias}}</b><span>{{account().id}} · {{account().owner}}</span></div></div><div class="balance"><small>SALDO DISPONIBLE</small><strong>{{formatCop(account().balance)}}</strong></div><div class="switcher">@if (accountSwitcherLoading()) { <span class="switcher-shimmer" aria-label="Cargando selector de cuenta"></span> } @else if (accountSwitcherComponent(); as switcher) { <ng-container *ngComponentOutlet="switcher"></ng-container> }</div></div>
      <div *ngIf="diagnostics()" class="diagnostics"><div><b>System health</b><span class="ok">● 6 services healthy</span></div><div><b>Contract</b><span>v1.0.0 · account-changed</span></div><div><b>Active remotes</b><span>AccountSwitcher · Investments · Documents · Movements</span></div></div>
      <ng-container *ngIf="view()==='movements'; else overview">
        <div class="section-title"><div><span class="eyebrow">TRANSACTION STREAM</span><h3>Movimientos recientes</h3></div><button class="filter">Últimos 30 días⌄</button></div>
        <div class="module-frame movement-frame">@if (viewLoading()) { <div class="mfe-skeleton movement-skeleton" aria-label="Cargando movimientos"><div class="skeleton-toolbar"><span></span><span></span></div><div class="skeleton-table"><i></i><i></i><i></i><i></i></div><b>Cargando movimientos</b><small>Conectando con el remote de actividad</small></div> } @else if (viewComponent(); as component) { <ng-container *ngComponentOutlet="component"></ng-container> }</div>
      </ng-container>
      <ng-template #overview>
        <ng-container *ngIf="view()==='overview'">
        <div class="section-title"><div><span class="eyebrow">FINANCIAL SNAPSHOT</span><h3>Resumen de tu cuenta</h3></div></div>
        <div class="module-frame summary-frame">@if (viewLoading()) { <div class="mfe-skeleton summary-skeleton" aria-label="Cargando resumen"><div class="skeleton-summary-head"><span></span><span></span></div><div class="skeleton-metrics"><i></i><i></i><i></i></div><div class="skeleton-chart"><span></span><span></span><span></span><span></span><span></span><span></span></div><b>Cargando resumen</b><small>Preparando la vista financiera</small></div> } @else if (viewComponent(); as component) { <ng-container *ngComponentOutlet="component"></ng-container> }</div>
        </ng-container>
      </ng-template>
      <ng-container *ngIf="view()==='documents'">
        <div class="section-title"><div><span class="eyebrow">DOCUMENT CENTER</span><h3>Tus documentos</h3></div></div>
        <div class="module-frame documents-frame">@if (viewLoading()) { <div class="mfe-skeleton documents-skeleton" aria-label="Cargando documentos"><div class="skeleton-docs-head"><span></span><span></span></div><div class="skeleton-docs"><i></i><i></i><i></i></div><b>Cargando documentos</b><small>Organizando tu centro documental</small></div> } @else if (viewComponent(); as component) { <ng-container *ngComponentOutlet="component"></ng-container> }</div>
      </ng-container>
      <ng-container *ngIf="view()==='investments'">
        <div class="section-title"><div><span class="eyebrow">INVESTMENT PORTFOLIO</span><h3>Tus inversiones</h3></div></div>
        <div class="module-frame investments-frame">@if (viewLoading()) { <div class="mfe-skeleton investments-skeleton" aria-label="Cargando inversiones"><div class="skeleton-investment-head"><span></span><span></span></div><div class="skeleton-investment-cards"><i></i><i></i><i></i></div><div class="skeleton-chart"><span></span><span></span><span></span><span></span><span></span></div><b>Cargando inversiones</b><small>Calculando el rendimiento de tu portafolio</small></div> } @else if (viewComponent(); as component) { <ng-container *ngComponentOutlet="component"></ng-container> }</div>
      </ng-container>
    </section>`,
  styles: [`
    :host{display:block;width:100%;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;color:#172436}.hub{width:100%;box-sizing:border-box;padding:28px 32px 46px;background:#fbfcfe}.hero{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:25px}.eyebrow{font-size:9px;letter-spacing:1.5px;color:#8090a4;font-weight:700}.eyebrow i{font-style:normal;color:#2aa77d;background:#e3f7ef;border-radius:4px;padding:3px 5px;margin-left:6px;font-size:8px}.hero h2{margin:7px 0 5px;font-size:26px;letter-spacing:-.7px;color:#142337}.hero p{margin:0;color:#8090a2;font-size:12px}.hero-actions{display:flex;align-items:center;gap:12px}.sync{color:#319a76;font-size:10px}.hero-actions button,.filter{border:1px solid #dce4ec;background:#fff;color:#637388;border-radius:8px;padding:9px 11px;font-size:10px;cursor:pointer}.account-bar{display:flex;align-items:center;background:#13243a;color:#fff;border-radius:13px;padding:17px 20px;min-height:66px;box-sizing:border-box;box-shadow:0 10px 24px #13243a1f}.account-label{display:flex;align-items:center;gap:12px;min-width:260px}.account-icon{width:34px;height:34px;border-radius:10px;background:#2e557a;display:grid;place-items:center;color:#71dbb6}.account-label small,.balance small{display:block;font-size:8px;letter-spacing:1px;color:#8ea4bd}.account-label b{display:block;font-size:14px;margin:3px 0}.account-label span:last-child{font-size:10px;color:#94a9c0}.balance{margin-left:auto;text-align:right;padding-right:25px;border-right:1px solid #344a64}.balance strong{display:block;font-size:21px;margin-top:4px;letter-spacing:-.5px}.switcher{width:190px;min-height:58px;margin-left:17px;display:flex;align-items:center}.switcher-shimmer{display:block;width:100%;height:38px;border-radius:8px;background:linear-gradient(90deg,#29425e 20%,#3b5875 40%,#29425e 60%);background-size:300% 100%;animation:hub-shimmer 1.1s linear infinite}.diagnostics{display:flex;gap:10px;margin:14px 0;padding:12px;background:#eef8f4;border:1px solid #d8efe5;border-radius:9px}.diagnostics>div{display:flex;flex-direction:column;gap:4px;padding:0 12px;border-right:1px solid #d5e9df;font-size:10px}.diagnostics>div:last-child{border:0}.diagnostics b{font-size:9px;text-transform:uppercase;letter-spacing:.8px;color:#6e8e80}.diagnostics span{color:#607c70}.diagnostics .ok{color:#29936d}.section-title{display:flex;justify-content:space-between;align-items:end;margin:0 0 12px}.section-title h3{margin:6px 0 0;font-size:17px;color:#1b2b40}.module{background:#fff;border:1px solid #e7ecf2;border-radius:13px;padding:17px 19px;position:relative;overflow:hidden}.full-module,.summary-module{display:block;width:100%;min-height:0;height:auto;box-sizing:border-box;border:1px solid #e7ecf2;border-radius:13px;background:#fff;overflow:hidden}.module-frame{width:100%;min-height:250px;box-sizing:border-box}.mfe-skeleton{width:100%;min-height:250px;box-sizing:border-box;border:1px solid #e7ecf2;border-radius:13px;background:#fff;padding:22px;display:flex;flex-direction:column;gap:10px;overflow:hidden}.mfe-skeleton>b{margin-top:auto;color:#61758b;font-size:11px;font-weight:600}.mfe-skeleton>small{color:#96a5b5;font-size:9px}.mfe-skeleton span,.mfe-skeleton i{display:block;background:linear-gradient(100deg,#e9eef4 25%,#fff 42%,#e9eef4 60%);background-size:300% 100%;animation:hub-shimmer 1.1s linear infinite}.skeleton-toolbar,.skeleton-summary-head,.skeleton-docs-head,.skeleton-investment-head{display:flex;justify-content:space-between;gap:18px}.skeleton-toolbar span{height:28px;width:34%;border-radius:7px}.skeleton-toolbar span:last-child{width:17%}.skeleton-table,.skeleton-docs,.skeleton-investment-cards,.skeleton-metrics{display:grid;gap:10px}.skeleton-table{margin-top:10px}.skeleton-table i{height:38px;border-radius:8px}.skeleton-summary-head span,.skeleton-docs-head span,.skeleton-investment-head span{height:18px;border-radius:6px;width:28%}.skeleton-summary-head span:last-child,.skeleton-docs-head span:last-child,.skeleton-investment-head span:last-child{width:16%}.skeleton-metrics,.skeleton-investment-cards{grid-template-columns:repeat(3,1fr);margin-top:16px}.skeleton-metrics i,.skeleton-investment-cards i{height:62px;border-radius:10px}.skeleton-chart{height:90px;display:flex;align-items:end;gap:8px;margin-top:16px;padding:10px 14px;border:1px solid #edf1f5;border-radius:10px}.skeleton-chart span{flex:1;height:35%;border-radius:4px}.skeleton-chart span:nth-child(2){height:54%}.skeleton-chart span:nth-child(3){height:42%}.skeleton-chart span:nth-child(4){height:72%}.skeleton-chart span:nth-child(5){height:60%}.skeleton-chart span:nth-child(6){height:82%}.skeleton-docs{grid-template-columns:repeat(3,1fr);margin-top:16px}.skeleton-docs i{height:96px;border-radius:10px}.summary-frame .mfe-skeleton{min-height:280px}.investments-frame .mfe-skeleton{min-height:300px}@keyframes hub-shimmer{from{background-position:100% 0}to{background-position:-100% 0}}.filter{font-size:10px}
  `]
})
export class App {
  protected formatCop(value: number) {
    return `${value < 0 ? '-' : ''}COP $${Math.abs(value).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
  }
  protected portal = new URLSearchParams(location.search).get('portal') === 'admin' ? 'admin' : 'customer';
  protected readonly view = signal(new URLSearchParams(location.search).get('view') ?? 'overview');
  protected readonly account = signal<Account>(defaultAccount);
  protected readonly diagnostics = signal(false);
  protected readonly accountSwitcherComponent = signal<Type<unknown> | null>(null);
  protected readonly viewComponent = signal<Type<unknown> | null>(null);
  protected readonly accountSwitcherLoading = signal(true);
  protected readonly viewLoading = signal(true);
  private accountRefreshTimer: ReturnType<typeof setTimeout> | undefined;
  constructor() {
    window.addEventListener('account-changed', event => {
      const detail = (event as CustomEvent<AccountEventDetail>).detail;
      if (detail?.source === 'workspace-hub') return;
      const account = detail;
      if (!account) return;
      this.account.set(account);
      if (this.viewComponent()) {
        this.viewLoading.set(true);
      }
      if (this.viewComponent()) {
        if (this.accountRefreshTimer) clearTimeout(this.accountRefreshTimer);
        this.accountRefreshTimer = setTimeout(() => {
          this.viewLoading.set(false);
          this.accountRefreshTimer = undefined;
          setTimeout(() => this.notifyRemoteContext(), 0);
        }, 1500);
      }
    });
    window.addEventListener('workspace-view-changed', event => {
      const view = (event as CustomEvent<string>).detail;
      if (!view || view === this.view()) return;
      this.view.set(view);
      this.loadView();
    });
    window.addEventListener('workspace-portal-changed', event => {
      const portal = (event as CustomEvent<'admin' | 'customer'>).detail;
      if (portal !== 'admin' && portal !== 'customer') return;
      this.portal = portal;
      setTimeout(() => window.dispatchEvent(new CustomEvent('portal-changed', { detail: { portal } })));
    });
    this.loadComponent('account-switcher', component => this.accountSwitcherComponent.set(component), this.accountSwitcherLoading);
    this.loadView();
    window.dispatchEvent(new CustomEvent('portal-changed', { detail: { portal: this.portal } }));
  }
  private loadView() {
    const remote = this.view() === 'overview' ? 'summary' : this.view();
    if (!['summary', 'movements', 'investments', 'documents'].includes(remote)) {
      this.viewComponent.set(null);
      this.viewLoading.set(false);
      return;
    }
    this.viewComponent.set(null);
    this.viewLoading.set(true);
    this.loadComponent(remote, component => {
      this.viewComponent.set(component);
      setTimeout(() => {
        this.notifyRemoteContext();
        window.dispatchEvent(new CustomEvent('portal-changed', { detail: { portal: this.portal } }));
      });
    }, this.viewLoading);
  }
  private notifyRemoteContext() {
    const detail = { ...this.account(), source: 'workspace-hub' as const };
    window.dispatchEvent(new CustomEvent('account-changed', { detail }));
    setTimeout(() => window.dispatchEvent(new CustomEvent('account-changed', { detail })), 50);
  }
  private loadComponent(remote: string, onLoaded: (component: Type<unknown>) => void, loading: ReturnType<typeof signal<boolean>>) {
    const remoteEntries: Record<string, string> = {
      'account-switcher': 'http://localhost:4203/remoteEntry.json',
      documents: 'http://localhost:4205/remoteEntry.json',
      investments: 'http://localhost:4204/remoteEntry.json',
      movements: 'http://localhost:4206/remoteEntry.json',
      summary: 'http://localhost:4207/remoteEntry.json',
    };
    const startedAt = performance.now();
    loadRemoteModule({ remoteName: remote, remoteEntry: remoteEntries[remote], exposedModule: './Component' })
      .then(module => {
        const remaining = Math.max(0, 1500 - (performance.now() - startedAt));
        setTimeout(() => {
          onLoaded(module.App ?? module.default);
          loading.set(false);
        }, remaining);
      })
      .catch(error => {
        loading.set(false);
        console.error(`No se pudo cargar ${remote}/Component`, error);
      });
  }
}
