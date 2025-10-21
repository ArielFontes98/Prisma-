export interface Adapter {
  id: string;
  name: string;
  read: boolean;
  write: boolean;
  description: string;
}

export const adapters: Record<string, Adapter> = {
  momo: {
    id: 'momo',
    name: 'Momo',
    read: true,
    write: true,
    description: 'Experimentation platform for A/B testing and feature flags',
  },
  quicksight: {
    id: 'quicksight',
    name: 'QuickSight',
    read: true,
    write: true,
    description: 'Business intelligence dashboards and visualizations',
  },
  databricks: {
    id: 'databricks',
    name: 'Databricks',
    read: true,
    write: true,
    description: 'Data lakehouse and analytics platform',
  },
  xp: {
    id: 'xp',
    name: 'XP',
    read: true,
    write: true,
    description: 'Investment platform integration',
  },
  kyb: {
    id: 'kyb',
    name: 'KYB',
    read: true,
    write: true,
    description: 'Know Your Business verification system',
  },
};

export function getActiveAdapters(): Adapter[] {
  return Object.values(adapters).filter(a => a.read || a.write);
}

export function isAdapterActive(adapterId: string, mode: 'read' | 'write'): boolean {
  const adapter = adapters[adapterId];
  return adapter ? adapter[mode] : false;
}

