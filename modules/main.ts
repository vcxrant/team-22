// Main file

import * as fs from "fs";
import {
  log,
  retrieveFunction,
  retrieveFunctionLogFile,
  validateUrl,
} from "./generalFunctions";
import { repositoryClass } from "./classes";
const fetch = require("node-fetch");
require("dotenv").config();

const secretKey: any = retrieveFunction();
const [logFilePath, logLevel]: any = retrieveFunctionLogFile();

if (secretKey == undefined) {
  // What is the formal way to send here
  log("Error: Missing github token", "", logLevel);
  process.exitCode = 1;
}

if (logFilePath == undefined) {
  log("Error: Missing log file path", "", logLevel);
  process.exitCode = 1;
}
if (logLevel == undefined) {
  log("Error: Missing log file path", "", logLevel);
  process.exitCode = 1;
}

async function decomposeUrl(url: string): Promise<[string, string]> {
  return new Promise((resolve) => {
    if (
      url.startsWith("https://github.com/") ||
      url.startsWith("https://www.github.com/")
    ) {
      const parts = url.split("/");
      const org = parts[3];
      const repo = parts[4].split(".")[0];
      resolve([org, repo]);
    } else if (
      url.startsWith("https://www.npmjs.com/") ||
      url.startsWith("https://npmjs.com/")
    ) {
      const packageName = url.split("/").pop();
      const response = fetch(`https://registry.npmjs.org/${packageName}`);
      response
        .then((res) => res.json())
        .then((packageData) => {
          if (packageData.repository && packageData.repository.type == "git") {
            const repoUrl = packageData.repository.url;
            const parts = repoUrl.split("/");
            const org = parts[3];
            const repo = parts[4].split(".")[0];
            resolve([org, repo]);
          }
        });
    } else {
      log(
        `Error: ${url} is invalid. The URL must from github or npmjs`,
        "",
        logLevel
      );
    }
  });
}

export async function main(urlFile: string) {
  const fileContent = fs.readFileSync(urlFile, "utf-8");
  const urls: string[] = fileContent.split("\n");
  for (const url of urls) {
    if (validateUrl(url)) {
      const [owner, repository] = await decomposeUrl(url);
      let repo = new repositoryClass(repository, url, owner);
      await repo.classMain(logLevel);
    } else {
      // Fix the error log here
      log(`${url} is not a valid url`, "", logLevel);
    }
  }

  console.log("Logging all the repo classes I have");

  let repos = repositoryClass.all;

  // Sort the repository Class first
  repos.sort((repo, repo1) => {
    return repo.netScore - repo1.netScore;
  }); // Make sure to sort by netscore from now

  // Print ndJson format
  repos.forEach((value, index, array) => {
    console.log(`Printing at Index ${index}`);
    console.log({
      URL: value.url,
      NET_SCORE: value.netScore,
      RAMP_UP_SCORE: value.rampUp,
      CORRECTNESS_SCORE: value.CorrectNess,
      BUS_FACTOR_SCORE: value.busFactor,
      RESPONSIVE_MAINTAINER_SCORE: value.responsiveMaintainer,
      LICENSE_SCORE: value.licenses,
    });
    //value.free();
  });

  process.exitCode = 0;
}
