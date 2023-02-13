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

async function decomposeUrl(
  url: string,
  logLevel: number
): Promise<[string, string]> {
  try {
    if (
      url.startsWith("https://github.com/") ||
      url.startsWith("https://www.github.com/")
    ) {
      const parts = url.split("/");
      const org = parts[3];
      const repo = parts[4].split(".")[0];
      return [org, repo];
    } else if (
      url.startsWith("https://www.npmjs.com/") ||
      url.startsWith("https://npmjs.com/")
    ) {
      const packageName = url.split("/").pop();
      let response = await fetch(`https://registry.npmjs.org/${packageName}`);
      let packageData = await response.json();
      if (packageData.repository && packageData.repository.type == "git") {
        const repoUrl = packageData.repository.url;
        const parts = repoUrl.split("/");
        const org = parts[3];
        const repo = parts[4].split(".")[0];
        return [org, repo];
      }
    } else {
      log(
        `Error: ${url} is invalid. The URL must from ndjsonObject.free(); github or npmjs`,
        "",
        logLevel
      );
    }
  } catch (error) {
    log(
      `An error occured when parsing information about ${url}`,
      error,
      logLevel
    );
  }
}

export async function main(urlFile: string) {
  const secretKey: any = retrieveFunction();
  const [logFilePath, logLevel]: any = retrieveFunctionLogFile();

  if (logFilePath == undefined) {
    log(
      "Error: Missing log file path",
      "Error: Missing log file path",
      1
    );
    process.exit(1);
  }
  if (secretKey == undefined) {
    log(
      "Error: Missing github token",
      "Error: Missing github token",
      logLevel
    );
    process.exit(1);
  }

  const fileContent = fs.readFileSync(urlFile, "utf-8");
  const urls: string[] = fileContent.split("\n");
  for (const url of urls) {
    if (validateUrl(url)) {
      const [owner, repository] = await decomposeUrl(url, parseInt(logLevel));
      let repo = new repositoryClass(repository, url, owner);
      await repo.classMain(logLevel);
    } else {
      // Fix the error log here
      log(`${url} is not a valid url`, "", logLevel);
    }
  }

  let repos = repositoryClass.all;

  // Sort the repository Class first
  repos.sort((repo, repo1) => {
    return repo1.netScore - repo.netScore;
  });

  repos.forEach((value, index, array) => {
    console.log(
      JSON.stringify({
        URL: value.url,
        NET_SCORE: value.netScore,
        RAMP_UP_SCORE: value.rampUp,
        CORRECTNESS_SCORE: value.CorrectNess,
        BUS_FACTOR_SCORE: value.busFactor,
        RESPONSIVE_MAINTAINER_SCORE: value.responsiveMaintainer,
        LICENSE_SCORE: value.licenses,
      })
    );
  });
}
