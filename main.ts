// Main file
//#!/usr/bin/env node

import { execSync } from "child_process";
import * as fs from "fs";
import {
  log,
  retrieveFunction,
  retrieveFunctionLogFile,
  validateUrl,
} from "./modules/generalFunctions";
import { repositoryClass } from "./modules/classes";
const fetch = require('node-fetch');
require("dotenv").config();

const secretKey: any = retrieveFunction();
const logFilePath: any = retrieveFunctionLogFile();

if (secretKey == undefined) {
  log("Error: Missing github token");
  process.exit(1);
}

if (logFilePath == undefined) {
  log("Error: Missing log file path");
  process.exit(1);
}

async function checkIfFilePath(input: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.stat(input, (error, stats) => {
      if (error) {
        log(`${input} is not a valid file path`);
        resolve(false);
      } else {
        resolve(stats.isFile());
      }
    });
  });
}

async function decomposeUrl(url: string): Promise<[string, string]> {
  return new Promise((resolve) => {
    if (url.startsWith("https://github.com/") || url.startsWith("https://www.github.com/")) {
        const parts = url.split("/");
        const org = parts[3];
        const repo = parts[4].split(".")[0];
        resolve([org, repo]);
    } else if (url.startsWith("https://www.npmjs.com/") || url.startsWith("https://npmjs.com/")) {
        const packageName = url.split("/").pop();
        const response = fetch(`https://registry.npmjs.org/${packageName}`);
        response.then((res) => res.json())
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
      log(`Error: ${url} is invalid. The URL must from github or npmjs`);
    }
  });
}

async function main() {

  if (process.argv.length != 3) {
    console.error("Error: Incorrect number of arguments");
    log("Error: Incorrect number of arguments");
    process.exit(1);
  }

  const action = process.argv[2];
  if (action == "build") {
    try {
      // this is wrong
      execSync("npm install", { stdio: "inherit" });
    } catch (error) {
      log(`Error: ${error}`);
    }
  } else if (action == "install") {
    try {
      execSync("npm run build", { stdio: "inherit" });
    } catch (error) {
      log(`Error: ${error}`);
    }
  } else if (action == "test") {
    console.log("All tests run");
  } else if (await checkIfFilePath(action)) {
    const fileContent = fs.readFileSync(action, "utf-8");
    const urls = fileContent.split("\n");
    
    // work here
    if (validateUrl(urls[0])) {
      const [random1, random2] = await decomposeUrl(urls[0]);
      let repo = new repositoryClass(random2, urls[0], random1);
      repo.getlicense();
      repo.getRepoInfo();
      //setTimeout(() => {}, 1000);
      console.log(repo.printProperties());
    } else {
      //error message for invalid url
    }
    /* for (const url of urls) {
      const [org, repo] = await decomposeUrl(url);
      console.log(`Organization: ${org}, Repository: ${repo}`);
    } */
  } else {
    console.log("Error: Incorrect input arguments");
  }
}

main();
