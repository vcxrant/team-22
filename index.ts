import { Octokit } from "octokit";
require("dotenv").config();

/* try {
  
  console.log(secretKey);
} catch (e) {
  console.log(e);
} */

const secretKey: string = process.env.GITHUB;
const octokit = new Octokit({
  auth: secretKey,
});
console.log(secretKey);

const averageFunction = (
  totalContributors: number,
  totalContributions: number
): number => {
  return totalContributions / totalContributors;
};

const validateUrl = (url: string) => {
  if (
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
      url
    )
  ) {
    return true;
  } else {
    return false;
  }
};

/* 
License comparison to be done on another day
*/
class repositoryClass {
  licenses: string;
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

  getRepoInfo = async () => {
    if (validateUrl(this.url)) {
      let vart = await octokit.request(`GET /repos/{owner}/{repo}/license`, {
        owner: this.owner,
        repo: this.repo,
      });
      this.licenses = vart.data.license.name; // fix if license does not exist
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
        console.log(array);
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
      console.log(this.busFactor);
    } else {
      // error handling for failing the validation stage
    }
  };
  printProperties() {
    Promise.resolve(
      console.log(
        this.licenses,
        this.busFactor,
        this.CorrectNess,
        this.responsiveMaintainer,
        this.netScore,
        this.rampUp,
        this.packageName,
        this.commits,
        this.pullRequest,
        this.issuesClosed,
        this.issuesOpen,
        this.url,
        this.owner,
        this.repo,
        this.contributions,
        this.numContributors
      )
    );
  }
}

let repo = new repositoryClass(
  "axios",
  "https://github.com/axios/axios",
  "axios"
);
console.log(repo.printProperties());
repo.getRepoInfo();
console.log(repo.printProperties());



const customAlgo = () => {};

//getRepoInfo("https://api.coindesk.com/v1/bpi/currentprice.json");
