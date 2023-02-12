import {
  averageFunction,
  validateUrl,
  isLicenseCompatible,
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
  busFactor: number;
  CorrectNess: number;
  responsiveMaintainer: number;
  netScore: number;
  rampUp: number;
  packageName: string;
  commits: number;
  pullRequest: number;
  issuesClosed: number;
  issuesOpen: number;
  url: string;
  owner: string;
  repo: string;
  contributions: number;
  numContributors: number;

  constructor(repo: string, url: string, owner: string) {
    this.url = url;
    this.owner = owner;
    this.repo = repo;
    this.contributions = 0;
    repositoryClass.all.push(this);
  }
  getlicense = async () => {
    this.licenses = isLicenseCompatible(this.owner, this.repo);
  };
  getRepoInfo = async () => {
    let contributors = await octokit.request(
      `GET /repos/{owner}/{repo}/contributors`,
      {
        owner: this.owner,
        repo: this.repo,
        //anon: "1"
      }
    );

    contributors.data.forEach((value, index, array) => {
      this.contributions = value.contributions + this.contributions;
      this.numContributors = index; //total contributors
    });

    this.numContributors++;

    let sum = 0;
    let raw_busfactor = 0;

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
    console.log(`Raw bus factor for ${this.url} is: ${raw_busfactor}`);
    this.busFactor = (raw_busfactor - 1) / (this.numContributors - 1);
    //console.log(this.busFactor);

    //From here on below is the code for Graphql
  };
  printProperties(): any {
    //serialize.write({ hello: this.licenses });
  }

  /* destroy = function() {
    var all = this.constructor.all;
    if (all.indexOf(this) !== -1) {
      all.splice(all.indexOf(this), 1);
    }
    delete this
  }   */

  free() {
    let i = repositoryClass.all.indexOf(this);
    repositoryClass.all.splice(i, 1);
  }
  static all = new Array(); // Array of each version of this class
}
