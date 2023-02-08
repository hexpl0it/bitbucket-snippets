const netrc = require("netrc");
var request = require("request");
import {
  SnippetDetailRootObject,
  SnippetListRootObject,
} from "./apimodels/SnippetModels";
import * as vscode from "vscode";

export function getBasicAuthToken(): string {
  const creds = getCredentials();
  return Buffer.from(`${creds.login}:${creds.password}`).toString("base64");
}

export function getCredentials(): NetRcCredentials {
  var myNetrc = netrc();
  return <NetRcCredentials>myNetrc["api.bitbucket.org"];
}

export function listSnippets(): Thenable<SnippetListRootObject> {
  let query = "";
  const config = vscode.workspace.getConfiguration("bbsnippets");
  if (config.role === "workspace") {
    query = "/" + config.workspace_name;
  } else {
    query = "?role=" + config.role;
  }

  return new Promise((res, rej) => {
    var options = {
      method: "GET",
      url: "https://api.bitbucket.org/2.0/snippets" + query,
      headers: {
        Authorization: "Basic " + getBasicAuthToken(),
      },
    };
    request(options, function (error: any, response: any) {
      if (error) rej(error);
      var respobject = <SnippetListRootObject>JSON.parse(response.body);

      res(<SnippetListRootObject>JSON.parse(response.body));
    });
  });
}

export function getSnippetDetail(
  url: string
): Thenable<SnippetDetailRootObject> {
  return new Promise((res, rej) => {
    var options = {
      method: "GET",
      url: url,
      headers: {
        Authorization: "Basic " + getBasicAuthToken(),
      },
    };
    request(options, function (error: any, response: any) {
      if (error) rej(error);

      res(<SnippetDetailRootObject>JSON.parse(response.body));
    });
  });
}

export function getSnippetFileContent(url: string): Thenable<string> {
  return new Promise((res, rej) => {
    var options = {
      method: "GET",
      url: url,
      headers: {
        Authorization: "Basic " + getBasicAuthToken(),
      },
    };
    request(options, function (error: any, response: any) {
      if (error) rej(error);

      res(response.body);
    });
  });
}

class NetRcCredentials {
  login: string;
  password: string;

  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }
}
