import { NgComponentOutlet } from '@angular/common';
import { Component, signal, Type } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-root',
  imports: [NgComponentOutlet],
  template: `
    <main class="shell customer-shell">
      <aside class="sidebar">
        <div class="brand"><span class="brand-mark">N</span><div><b>NEXUS</b><small>Customer banking</small></div></div>
        <div class="profile"><div class="avatar">AB</div><div><b>Andres Benjumea</b><small>Cuenta personal</small></div><span class="online"></span></div>
        <nav>
          <span class="nav-label">Workspace</span>
          <button [class.active]="view()==='overview'" (click)="go('overview')"><span>⌂</span>Resumen <em>⌘1</em></button>
          <button [class.active]="view()==='movements'" (click)="go('movements')"><span>↗</span>Movimientos <em>⌘2</em></button>
          <button [class.active]="view()==='investments'" (click)="go('investments')"><span>◈</span>Inversiones</button>
          <button [class.active]="view()==='documents'" (click)="go('documents')"><span>▣</span>Documentos</button>
          <span class="nav-label separated">Gestión</span>
          <button (click)="go('settings')"><span>⚙</span>Preferencias</button>
        </nav>
        <div class="sidebar-bottom"><div class="secure">◉ <span>Conexión segura<br><b>Protegida por Nexus</b></span></div><a href="http://localhost:4201">Cambiar a Admin ↗</a></div>
      </aside>
      <section class="content">
        <header class="topbar"><div class="crumb">Workspace <span>/</span> {{ viewLabel() }}</div><div class="top-actions"><button class="icon-btn">⌕</button><button class="icon-btn">♧</button><div class="mini-avatar">AB</div></div></header>
        <div class="page">
          <div class="welcome"><div><span class="kicker">JUEVES, 22 OCTUBRE 2026</span><h1>Buenos días, Andres <span>✦</span></h1><p>Todo lo importante de tus finanzas, en un solo lugar.</p></div><button class="primary" (click)="go('movements')">Ver movimientos <span>↗</span></button></div>
          <div class="hub-frame">
            @if (hubComponent(); as hub) { <ng-container *ngComponentOutlet="hub"></ng-container> }
            @else { <div class="hub-loading">Cargando Workspace Hub...</div> }
          </div>
        </div>
      </section>
    </main>`,
  styles: [`
    :host{display:block;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;color:#182230;background:#f6f8fb;min-height:100vh}.shell{display:flex;min-height:100vh}.sidebar{width:244px;background:#111b2b;color:#d8e2ef;padding:25px 16px 20px;display:flex;flex-direction:column;box-sizing:border-box}.brand{display:flex;align-items:center;gap:10px;padding:0 10px 32px;color:#fff}.brand-mark{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,#56d6b0,#6f9bff);font-weight:900;font-size:19px}.brand b{display:block;letter-spacing:2px;font-size:14px}.brand small{display:block;color:#7f91a9;font-size:9px;margin-top:2px;letter-spacing:.4px}.profile{display:flex;align-items:center;gap:9px;padding:13px 10px;background:#1b293e;border:1px solid #2b3a50;border-radius:12px}.avatar,.mini-avatar{background:#e7b18b;color:#573b34;border-radius:50%;font-weight:800;display:grid;place-items:center}.avatar{width:30px;height:30px;font-size:10px}.profile b{font-size:12px;color:#fff;display:block}.profile small{font-size:10px;color:#7f91a9}.online{margin-left:auto;width:7px;height:7px;background:#55d7ab;border-radius:50%;box-shadow:0 0 0 3px #55d7ab22}nav{display:flex;flex-direction:column;gap:4px;margin-top:28px}.nav-label{padding:0 12px 9px;text-transform:uppercase;letter-spacing:1.2px;font-size:9px;color:#6f819a}.nav-label.separated{margin-top:25px}nav button{border:0;background:transparent;color:#8fa0b7;text-align:left;border-radius:9px;padding:11px 12px;font-size:12px;display:flex;align-items:center;gap:11px;cursor:pointer;transition:.2s}nav button span{font-size:17px;width:18px;text-align:center;color:#788ba4}nav button em{font-style:normal;font-size:9px;color:#596b83;margin-left:auto}nav button:hover,nav button.active{background:#2b4565;color:#fff}nav button.active{box-shadow:inset 3px 0 #63d8b4}nav button.active span{color:#63d8b4}.sidebar-bottom{margin-top:auto}.secure{font-size:11px;color:#6fe0bd;display:flex;gap:8px;line-height:1.35;padding:14px 9px;border-top:1px solid #27364a}.secure span{color:#71849d;font-size:9px}.secure b{color:#b8c8db;font-weight:500}.sidebar-bottom a{color:#758aa5;text-decoration:none;font-size:10px;padding:10px;display:block}.content{flex:1;min-width:0}.topbar{height:70px;background:#fff;border-bottom:1px solid #e7ecf2;display:flex;align-items:center;justify-content:space-between;padding:0 5%;box-sizing:border-box}.crumb{font-size:12px;color:#8290a2}.crumb span{padding:0 8px;color:#cad1da}.top-actions{display:flex;align-items:center;gap:12px}.icon-btn{border:0;background:#f3f6fa;color:#708095;border-radius:9px;width:32px;height:32px;font-size:18px}.mini-avatar{width:31px;height:31px;font-size:10px}.page{width:100%;max-width:none;box-sizing:border-box;margin:auto;padding:38px 5% 60px}.welcome{display:flex;justify-content:space-between;align-items:end;margin-bottom:27px}.kicker{font-size:10px;letter-spacing:1.4px;color:#8491a4}.welcome h1{font-size:31px;letter-spacing:-1.2px;margin:8px 0 4px;color:#142235}.welcome h1 span{color:#55cda9;font-size:24px}.welcome p{margin:0;color:#8190a1;font-size:13px}.primary{border:0;border-radius:10px;background:#1b9b7d;color:#fff;padding:12px 17px;font-weight:650;font-size:11px;box-shadow:0 8px 16px #1b9b7d2b;cursor:pointer}.primary span{padding-left:8px;font-size:15px}.hub-frame{width:100%;min-height:0}@keyframes portal-reveal{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  `]
})
export class App {
  protected readonly view = signal(new URLSearchParams(location.search).get('view') ?? 'overview');
  protected viewLabel() { return ({ overview: 'Resumen', movements: 'Movimientos', investments: 'Inversiones', documents: 'Documentos', settings: 'Preferencias' } as Record<string,string>)[this.view()] ?? 'Resumen'; }
  protected go(view: string) { this.view.set(view); history.pushState({}, '', `/?view=${view}`); window.dispatchEvent(new CustomEvent('workspace-view-changed', { detail: view })); }
  protected readonly hubComponent = signal<Type<unknown> | null>(null);
  constructor() {
    loadRemoteModule({ remoteName: 'workspace-hub', remoteEntry: 'http://localhost:4202/remoteEntry.json', exposedModule: './Component' })
      .then(remote => { this.hubComponent.set(remote.App ?? remote.default); setTimeout(() => window.dispatchEvent(new CustomEvent('workspace-portal-changed', { detail: 'customer' })), 250); })
      .catch(error => console.error('No se pudo cargar workspace-hub/Component', error));
  }
}
