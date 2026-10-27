export type PortalId = 'customer' | 'admin';
export type MfeId = 'account-switcher' | 'investments' | 'documents' | 'movements' | 'summary';

export interface PortalContext {
  portalId: PortalId;
  displayName: string;
}

export interface Account {
  id: string;
  alias: string;
  owner: string;
  balance: number;
}

export interface AccountChangedEvent {
  type: 'account-changed';
  account: Account;
  source: 'account-switcher';
  contractVersion: string;
}

export interface CommunicationContract {
  contractVersion: string;
  eventName: AccountChangedEvent['type'];
  payload: AccountChangedEvent;
}

export const CONTRACT_VERSION = '1.0.0';
