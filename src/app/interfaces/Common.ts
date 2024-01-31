export interface IMenuNavigationItem {
  routerLink: string;
  header: string;
}
export interface INavigationItemNode {
  header: string;
  routerLink: string;
  icon: string;
  items?: IMenuNavigationItem[]
}

export interface INavigationSection {
  header: string;
  nodes: INavigationItemNode[]
}
