import {
  averageFunction,
  validateUrl,
  isLicenseCompatible,
  log,
} from "./generalFunctions";
import { Octokit } from "octokit";
import axios from "axios";

const secretKey: string = process.env.GITHUB;
const octokit = new Octokit({
  auth: secretKey,
});

const axios_instance = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${secretKey}`,
  },
});

export class repositoryClass {
  licenses: Promise<number>;
  busFactor: number = 0;
  CorrectNess: number = -1;
  responsiveMaintainer: number = -1;
  netScore: number = -1;
  rampUp: number = -1;
  commits: number = -1;
  pullRequest: number = -1;
  issuesClosed: number = -1;
  issuesOpen: number = -1;
  url: string;
  owner: string;
  repo: string;
  contributions: number = 0;
  numContributors: number = 0;

  constructor(repo: string, url: string, owner: string) {
    this.url = url;
    this.owner = owner;
    this.repo = repo;
    repositoryClass.all.push(this);
  }
  getlicense = async () => {
    this.licenses = isLicenseCompatible(this.owner, this.repo);
  };

  getRepoInfo = async (loglevel: number) => {
    try {
      let contributors = await octokit.request(
        `GET /repos/{owner}/{repo}/contributors`,
        {
          owner: this.owner,
          repo: this.repo,
        }
      );
      for (let contributor of contributors.data) {
        this.contributions = contributor.contributions + this.contributions;
        this.numContributors++; //total contributors
      }

      console.log(this.numContributors);
      let sum: number = 0;
      let raw_busfactor: number = 0;

      contributors.data.every((value, index, array) => {
        sum += value.contributions;
        if (sum <= this.contributions / 2) {
          return true;
        } else if (index == 0 && sum <= this.contributions / 2) {
          raw_busfactor = index + 1;
          return false;
        } else {
          raw_busfactor = index + 1;
          return false;
        }
      });
      this.busFactor = (raw_busfactor - 1) / (this.numContributors - 1);
      console.log(
        `Raw bus factor for ${this.url} is: ${raw_busfactor} and normalized busfactor is ${this.busFactor}`
      );
      this.netScore = this.busFactor; //  Remove this line before submission
      //From here on below is the code for Graphql
    } catch (error) {
      // set respective variables as default numbers
      console.log(error)
      log("", error, loglevel);
    }
  };
  printProperties(): any {
    //serialize.write({ hello: this.licenses });
  }

  free(): void {
    const i = repositoryClass.all.indexOf(this);
    repositoryClass.all.splice(i, 1);
    return;
  }
  static all = new Array(); // Array of each version of this class
}
