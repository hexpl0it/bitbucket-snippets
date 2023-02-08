export interface Link {
  href: string;
  name?: string;
}

export interface Patch {
  href: string;
}

export interface Links {
  self: Link;
  html: Link;
  commits?: Link;
  comments?: Link;
  watchers?: Link;
  diff?: Link;
  clone?: Link[];
  patch?: Patch;
}

export interface Owner {
  display_name: string;
  links: Links;
  type: string;
  uuid: string;
  username: string;
}

export interface Workspace {
  type: string;
  uuid: string;
  name: string;
  slug: string;
  links: Links;
}

export interface Value {
  links: Links;
  id: string;
  title: string;
  created_on: Date;
  updated_on: Date;
  owner: Owner;
  workspace: Workspace;
  is_private: boolean;
}

export interface SnippetListRootObject {
  values: Value[];
  pagelen: number;
}

export interface SnippetDetailRootObject {
  links: Links;
  type: string;
  id: string;
  title: string;
  scm: string;
  created_on: Date;
  updated_on: Date;
  owner: Owner;
  workspace: Workspace;
  is_private: boolean;
  files: any;
}

export interface FileObject {
    name: string;
    links: Links;
}