import * as vscode from "vscode";
import { ThemeIcon } from "vscode";
import { listSnippets, getSnippetDetail } from "./apihelper";
import { FileObject } from "./apimodels/SnippetModels";
import * as path from "path";

export class BBSnippetsDataProvider
  implements vscode.TreeDataProvider<BaseTreeItem>
{
  constructor(private workspaceRoot: string | undefined) {}

  getTreeItem(element: Snippet): vscode.TreeItem {
    return element;
  }

  getChildren(element?: BaseTreeItem): Thenable<BaseTreeItem[]> {
    if (!this.workspaceRoot) {
      return Promise.resolve([]);
    }

    if (element) {
      return new Promise(async (res) => {
        var details = await getSnippetDetail((<Snippet>element).selfUrl!);

        var files = Object.keys(details.files).map(function (key) {
          return <FileObject>{ ...details.files[key], name: key };
        });

        res(
          files.map(
            (f) => new File(f.name, f.links.self.href, f.links.html.href)
          )
        );
      });
    } else {
      return new Promise(async (res) => {
        res(
          (await listSnippets()).values.map(
            (v) =>
              new Snippet(
                v.title,
                v.links.self.href,
                v.links.html.href,
                vscode.TreeItemCollapsibleState.Collapsed
              )
          )
        );
      });
    }
  }
}

export class BaseTreeItem extends vscode.TreeItem {}

export class Snippet extends BaseTreeItem {
  constructor(
    public readonly label: string,
    public selfUrl: string,
    public htmlUrl: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.selfUrl = selfUrl;
    this.htmlUrl = htmlUrl;
  }

  contextValue = "snippet";
}

export class File extends BaseTreeItem {
  constructor(
    public readonly label: string,
    public selfUrl: string,
    public htmlUrl: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.tooltip = `${this.label}`;
    this.selfUrl = selfUrl;
    this.htmlUrl = htmlUrl;
    this.resourceUri = vscode.Uri.parse("_" + path.extname(selfUrl));
  }

  contextValue = "file";
  iconPath = ThemeIcon.File;

  command = {
    command: "bb-snippets.viewInVisualizer",
    title: "Open Call",
    arguments: [this],
  };
}
