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

/* 
License comparison to be done on another day
*/
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
        this.numContributors = index;
      });

      this.numContributors++;

      const averageContributionrepo: number = averageFunction(
        this.numContributors,
        this.contributions
      );

      let sum = 0;

      contributors.data.every((value, index, array) => {
        sum += value.contributions;
        //console.log(array);
        if (sum <= averageContributionrepo) {
          return true;
        } else if (index == 0 && sum <= averageContributionrepo) {
          this.busFactor = index + 1;
          return false;
        } else {
          this.busFactor = index + 1;
          return false;
        }
      });

      //console.log(this.busFactor);

      //From here on below is the code that I added (Daniyal Fazal)

      const query = `query 
        {
          repository(owner: this.owner, name: this.repo) 
          {
            name
            description
            stargazers 
            {
              totalCount
            }
          }
        };`;

      /* axios_instance
        .post("/graphql", {
          query,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => console.error(error)); */

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
