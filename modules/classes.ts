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
        if (sum <= (this.contributions / 2)) {
          return true;
        } else if (index == 0 && sum <= (this.contributions / 2)) {
          raw_busfactor = index + 1;
          return false;
        } else {
          raw_busfactor = index + 1;
          return false;
        }
      });

      console.log(raw_busfactor);

      this.busFactor = (raw_busfactor - 1) / (this.numContributors - 1);
      console.log(this.busFactor)

      //From here on below is the code for Graphql

  };
  printProperties() {
    Promise.resolve(
      console.log(
        this.licenses,
        this.busFactor,
        this.url,
        this.owner,
        this.repo,
        this.contributions,
        this.numContributors
      )
    );
  }
}
