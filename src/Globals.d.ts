declare module "*.css" {
  const content: string;
  export default content;
}

declare module "*.sql" {
  const default_export_item: { default: string };
  const default_export: default_export_item[];
  export const filenames: string[];
  export default default_export;
}
