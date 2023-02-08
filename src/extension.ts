import path = require("path");
import * as vscode from "vscode";
import { BBSnippetsDataProvider } from "./BBSnippetsDataProvider";
import { getSnippetFileContent } from "./apihelper";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;
  const snippetsDataProvider = new BBSnippetsDataProvider(rootPath);
  vscode.window.registerTreeDataProvider(
    "bb-snippets-explorer",
    snippetsDataProvider
  );

  let cmdOpenSnippet = vscode.commands.registerCommand(
    "bb-snippets.viewInVisualizer",
    async (itemCtx) => {
      var setting = vscode.Uri.parse(
        "untitled:" + path.basename(itemCtx.selfUrl)
      );
      vscode.workspace.openTextDocument(setting).then((doc) => {
        vscode.window.showTextDocument(doc, 1, false).then((editor) => {
          vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: `Apro ${itemCtx.label}...`,
              cancellable: false,
            },
            async () => {
              var content = await getSnippetFileContent(itemCtx.selfUrl);
              editor.edit(async (builder) => {
                builder.insert(new vscode.Position(0, 0), content);
              });
            }
          );
        });
      });
    }
  );
  let cmdOpenSnippetOnBrowser = vscode.commands.registerCommand(
    "bb-snippets.viewInBrowser",
    (itemCtx) => {
      vscode.env.openExternal(vscode.Uri.parse(itemCtx.htmlUrl));
    }
  );
  context.subscriptions.push(cmdOpenSnippet, cmdOpenSnippetOnBrowser);
}

// This method is called when your extension is deactivated
export function deactivate() {}
