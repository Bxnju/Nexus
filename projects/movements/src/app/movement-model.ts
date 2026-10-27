export interface Account {
  id: string;
  alias: string;
  owner: string;
  balance: number;
}

export interface Movement {
  date: string;
  label: string;
  category: string;
  amount: number;
  icon: string;
  tone: string;
}

export interface MovementPresentation {
  title: string;
  subtitle: string;
  category: (movement: Movement) => string;
  showAmount: boolean;
  showDate: boolean;
}

export interface MovementPresentationStrategy {
  getPresentation(): MovementPresentation;
}

export class CustomerMovementStrategy implements MovementPresentationStrategy {
  getPresentation(): MovementPresentation {
    return {
      title: 'Actividad reciente',
      subtitle: 'Movimientos de',
      category: movement => movement.category,
      showAmount: true,
      showDate: true,
    };
  }
}

export class AdminMovementStrategy implements MovementPresentationStrategy {
  getPresentation(): MovementPresentation {
    return {
      title: 'Actividad operativa',
      subtitle: 'Auditoría de',
      category: movement => `Operación · ${movement.category}`,
      showAmount: false,
      showDate: true,
    };
  }
}

export const movements: Record<string, Movement[]> = {
  'acc-001': [
    { date: 'Hoy, 09:42', label: 'Nómina Nexus Labs', category: 'Ingreso · Recurrente', amount: 3250000, icon: '↗', tone: 'green' },
    { date: 'Ayer, 18:20', label: 'Blue Bottle Coffee', category: 'Alimentación', amount: -38000, icon: '☕', tone: 'orange' },
    { date: '18 Oct, 14:10', label: 'Transferencia a inversiones', category: 'Ahorro', amount: -780000, icon: '◈', tone: 'purple' },
    { date: '16 Oct, 11:32', label: 'Suscripción Workspace', category: 'Servicios', amount: -96000, icon: '▣', tone: 'blue' },
  ],
  'acc-002': [
    { date: 'Hoy, 08:15', label: 'Aportación automática', category: 'Ahorro · Recurrente', amount: 1200000, icon: '↗', tone: 'green' },
    { date: '17 Oct, 16:03', label: 'Traspaso desde principal', category: 'Transferencia', amount: 780, icon: '⇄', tone: 'blue' },
    { date: '12 Oct, 09:20', label: 'Intereses de ahorro', category: 'Rendimiento', amount: 42180, icon: '✦', tone: 'purple' },
  ],
  'acc-003': [
    { date: 'Ayer, 12:02', label: 'Pago proveedor creativo', category: 'Operación', amount: -1250000, icon: '↘', tone: 'orange' },
    { date: '15 Oct, 10:45', label: 'Ingreso proyecto Atlas', category: 'Ingreso', amount: 2800000, icon: '↗', tone: 'green' },
    { date: '08 Oct, 18:21', label: 'Licencia de software', category: 'Servicios', amount: -392000, icon: '▣', tone: 'blue' },
  ],
};
