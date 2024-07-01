export interface TableColumn {
  header: string;
  field: string;
  type: 'text' | 'link' | 'image' | 'checkbox';
  urlField?: string;
}

export const TABLE_COLUMNS: TableColumn[] = [
  { header: 'ID', field: 'id', type: 'text' },
  { header: 'Avatar', field: 'avatar_url', type: 'image' },
  { header: 'Login', field: 'login', type: 'text' },
  { header: 'Profile', field: 'html_url', type: 'link', urlField: 'html_url' },
  { header: 'Node ID', field: 'node_id', type: 'text' },
  { header: 'Type', field: 'type', type: 'text' },
  { header: 'Site Admin', field: 'site_admin', type: 'checkbox' }
];
