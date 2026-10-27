import { PercentPipe } from '@angular/common';
import { Component, signal } from '@angular/core';

interface Account { id: string; alias: string; owner: string; balance: number; }

@Component({
  selector: 'app-root',
  imports: [PercentPipe],
  template: `
    <article>
      <header class="heading"><div><span class="eyebrow">INVESTMENT PORTFOLIO · {{ account().id }}</span><h2>{{ account().alias }}</h2><p>Una lectura clara de cómo está creciendo tu dinero.</p></div><span class="status">● ACTUALIZADO</span></header>
      <section class="hero"><div><small>VALOR DE LA CARTERA</small><strong>{{ formatCop(invested()) }}</strong><span class="gain">↗ {{ returnRate() | percent:'1.2-2' }} rendimiento acumulado</span></div><div class="hero-chart">@for (height of chartHeights; track $index) { <i [style.height.%]="height"></i> }</div></section>
      <section class="metrics"><div><small>RENDIMIENTO ANUAL</small><b class="positive">{{ formatCop(annualReturn(), true) }}</b><span>+8.42% vs. periodo anterior</span></div><div><small>APORTADO</small><b>{{ formatCop(contributed()) }}</b><span>Capital acumulado</span></div><div><small>PLUSVALÍA</small><b class="positive">{{ formatCop(profit()) }}</b><span>Sobre el capital aportado</span></div></section>
      <section class="content-grid"><div class="card allocation"><div class="card-title"><div><span class="eyebrow">ASSET MIX</span><h3>Distribución de la cartera</h3></div><span class="ring">{{ allocation().equity }}%</span></div><div class="allocation-row"><span><i class="dot green"></i>Renta variable</span><b>{{ allocation().equity }}%</b><div class="bar"><i class="green-bar" [style.width.%]="allocation().equity"></i></div></div><div class="allocation-row"><span><i class="dot purple"></i>Renta fija</span><b>{{ allocation().fixed }}%</b><div class="bar"><i class="purple-bar" [style.width.%]="allocation().fixed"></i></div></div><div class="allocation-row"><span><i class="dot orange"></i>Liquidez</span><b>{{ allocation().cash }}%</b><div class="bar"><i class="orange-bar" [style.width.%]="allocation().cash"></i></div></div></div><div class="card goals"><div class="card-title"><div><span class="eyebrow">GOAL TRACKER</span><h3>Objetivos de inversión</h3></div><span class="target">78%</span></div><p>Fondo de emergencia</p><div class="goal-bar"><i></i></div><small>{{ formatCop(goalRemaining()) }} para alcanzar tu objetivo</small><div class="goal-row"><span>Horizonte</span><b>18 meses</b></div><div class="goal-row"><span>Aportación mensual</span><b>{{ formatCop(monthlyContribution()) }}</b></div></div></section>
      <section class="card positions"><div class="card-title"><div><span class="eyebrow">TOP POSITIONS</span><h3>Posiciones destacadas</h3></div><span class="muted">Diversificación saludable</span></div><div class="position"><span class="position-icon green">N</span><div><b>Nexus Global Equity</b><small>Renta variable global</small></div><strong>{{ formatCop(positionValue(.46)) }}</strong><span class="positive">+10.2%</span></div><div class="position"><span class="position-icon purple">B</span><div><b>Blue Bond Sustainable</b><small>Bonos corporativos</small></div><strong>{{ formatCop(positionValue(.31)) }}</strong><span class="positive">+5.8%</span></div><div class="position"><span class="position-icon orange">€</span><div><b>Reserva de liquidez</b><small>Disponible</small></div><strong>{{ formatCop(positionValue(.23)) }}</strong><span class="muted">Estable</span></div></section>
    </article>
  `,
  styles: [`
    :host{display:block;font:14px Inter,Segoe UI,sans-serif;color:#203147}article{padding:26px;background:#fff;border:1px solid #e7ecf2;border-radius:14px}.heading,.card-title{display:flex;justify-content:space-between;align-items:flex-start}.eyebrow{font-size:10px;letter-spacing:1.3px;color:#8092a5;font-weight:700}.heading h2{margin:8px 0 4px;font-size:23px;color:#17283d}.heading p{margin:0;color:#8a99a8;font-size:12px}.status{font-size:9px;color:#299b76;background:#e4f7ef;padding:7px 9px;border-radius:6px;letter-spacing:.7px}.hero{display:flex;justify-content:space-between;align-items:center;margin:22px 0 15px;padding:24px 26px;color:#fff;border-radius:13px;background:linear-gradient(120deg,#112940,#24604f);box-shadow:0 12px 25px #123b3520}.hero small{display:block;color:#a6c5c6;font-size:9px;letter-spacing:1px}.hero strong{display:block;font-size:32px;margin:7px 0}.gain{font-size:11px;color:#8ce0bb}.hero-chart{height:75px;width:210px;display:flex;align-items:end;gap:8px;border-bottom:1px solid #8cc9b166}.hero-chart i{display:block;flex:1;background:linear-gradient(#8ce0bb,#328e79);border-radius:5px 5px 0 0}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.metrics>div{padding:16px;border:1px solid #edf0f4;border-radius:10px}.metrics small{display:block;color:#8191a2;font-size:9px;letter-spacing:1px}.metrics b{display:block;font-size:18px;margin:8px 0 4px}.metrics span{color:#8f9daa;font-size:10px}.positive{color:#299b76}.content-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:12px;margin-top:12px}.card{padding:18px;border:1px solid #e7ecf2;border-radius:12px;background:#fff}.card h3{margin:6px 0 0;font-size:15px}.ring,.target{font-size:12px;color:#299b76;background:#e4f7ef;padding:7px;border-radius:7px;font-weight:700}.allocation-row{display:grid;grid-template-columns:1fr auto;gap:7px;margin-top:17px;font-size:11px}.allocation-row span{color:#526579}.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:7px}.dot.green,.green-bar{background:#45bf98}.dot.purple,.purple-bar{background:#9e7bc9}.dot.orange,.orange-bar{background:#d59a57}.bar,.goal-bar{grid-column:1 / -1;height:6px;background:#edf2f3;border-radius:6px}.bar i,.goal-bar i{display:block;height:100%;border-radius:6px}.goals p{font-size:12px;color:#536579;margin:22px 0 8px}.goal-bar{background:#e8e2f5}.goal-bar i{width:78%;background:#9e7bc9}.goals>small{display:block;color:#8d99a6;font-size:10px;margin-top:8px}.goal-row{display:flex;justify-content:space-between;border-top:1px solid #edf0f4;padding-top:10px;margin-top:12px;color:#8d99a6;font-size:10px}.goal-row b{color:#33465b}.positions{margin-top:12px}.muted{color:#94a0ac;font-size:10px}.position{display:flex;align-items:center;gap:10px;padding:14px 0;border-top:1px solid #edf0f4}.position>div{flex:1}.position b{display:block;font-size:11px}.position small{display:block;color:#93a0ad;font-size:10px;margin-top:3px}.position strong{font-size:12px}.position-icon{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;font-weight:800}.position-icon.green{background:#e1f7ee;color:#299b76}.position-icon.purple{background:#f0eafb;color:#8e70c1}.position-icon.orange{background:#fff0df;color:#bd8041}
  `],
})
export class App {
  protected formatCop(value: number, showPositiveSign = false) {
    const sign = value < 0 ? '-' : showPositiveSign ? '+' : '';
    return `COP $${sign}${Math.abs(value).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
  }
  protected readonly account = signal<Account>({ id: 'acc-001', alias: 'Cuenta principal', owner: 'Andres Benjumea', balance: 52000000 });
  protected readonly chartHeights = [38, 48, 42, 62, 56, 73, 68, 87, 78, 100];
  protected invested() { return this.account().balance * .73; }
  protected contributed() { return this.invested() / 1.0842; }
  protected profit() { return this.invested() - this.contributed(); }
  protected annualReturn() { return this.invested() * .0842; }
  protected returnRate() { return .0842; }
  protected goalRemaining() { return this.account().balance * .12; }
  protected monthlyContribution() { return this.account().balance * .025; }
  protected positionValue(weight: number) { return this.invested() * weight; }
  protected allocation() { return { equity: 58, fixed: 29, cash: 13 }; }
  constructor() {
    window.addEventListener('account-changed', event => { const account = (event as CustomEvent<Account>).detail; if (account) this.account.set(account); });
  }
}
