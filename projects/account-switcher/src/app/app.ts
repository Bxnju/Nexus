import { Component, signal } from '@angular/core';
import { Account, CONTRACT_VERSION } from '../../../../shared/contracts/src';

const accounts: Account[] = [
  { id: 'acc-001', alias: 'Cuenta principal', owner: 'Andres Benjumea', balance: 52000000 },
  { id: 'acc-002', alias: 'Cuenta ahorro', owner: 'Andres Benjumea', balance: 168000000 },
  { id: 'acc-003', alias: 'Cuenta proyecto', owner: 'Andres Benjumea', balance: 38500000 }
];
@Component({ selector: 'app-root', template: `<article><span class="tag">CUENTA ACTIVA</span><select [value]="selected().id" (change)="select($any($event.target).value)">@for (account of accounts; track account.id) {<option [value]="account.id">{{account.alias}}</option>}</select></article>`, styles: [`:host{display:block;font-family:Inter,Segoe UI,sans-serif}article{padding:5px} .tag{display:block;font-size:8px;letter-spacing:1px;color:#8fa4bd;margin-bottom:5px}select{display:block;width:185px;box-sizing:border-box;padding:8px 9px;border:1px solid #3b5570;border-radius:7px;background:#203852;color:#fff;font-size:10px;outline:none}`] })
export class App {
  protected readonly accounts = accounts;
  protected readonly selected = signal(accounts[0]);
  select(id: string) { const account = accounts.find(item => item.id === id) ?? accounts[0]; this.selected.set(account); window.dispatchEvent(new CustomEvent('account-changed', { detail: account })); }
}
