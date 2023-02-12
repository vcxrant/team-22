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

  getResponsiveMaintainerScore = async () => {
    const query = `{
      repository(owner: "${this.owner}", name: "${this.repo}") {
        name
        stargazers {
          totalCount
        }
        issues(last:100) {
          totalCount
          edges{
            node {
              createdAt
              updatedAt
              closedAt
            }
          }
        }
        pullRequests (last : 100) {
          totalCount
          edges {
            node {
              createdAt
              updatedAt
              closedAt
            }
          }
        }
        defaultBranchRef {
          target {
            ... on Commit {
              history {
                totalCount
              }
              repository {
                milestones {
                  totalCount
                }
                pullRequests(states: CLOSED) {
                  totalCount
                }
              }
            }
          }
        }
        forks {
          totalCount
        }
        hasIssuesEnabled
        hasVulnerabilityAlertsEnabled
        watchers {
          totalCount
        }
        discussions {
          totalCount
        }
            releases {
          totalCount
        }
        updatedAt
        vulnerabilityAlerts {
          totalCount
        }
        watchers {
          totalCount
        }
      }
      securityAdvisories {
        totalCount
      }
      securityVulnerabilities {
        totalCount
      }
    }`;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Token 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`,
      },
      body: JSON.stringify({ query: query }),
    });
  
    const result = (await response.json()).data;
    const repository = result.repository;

    let issuesResponseTime = 0;
    for (const edge of repository.issues.edges) {
      const issue = edge.node;
      if (issue.closedAt) {
        issuesResponseTime +=
          (new Date(issue.closedAt).getTime() -
            new Date(issue.createdAt).getTime()) /
          1000;
      } else {
        issuesResponseTime +=
          (new Date().getTime() - new Date(issue.createdAt).getTime()) / 1000;
      }
    }
    issuesResponseTime /= repository.issues.totalCount;

    let pullRequestsResponseTime = 0;
    for (const edge of repository.pullRequests.edges) {
      const pullRequest = edge.node;
      if (pullRequest.closedAt) {
        pullRequestsResponseTime +=
          (new Date(pullRequest.closedAt).getTime() -
            new Date(pullRequest.createdAt).getTime()) /
          1000;
      } else {
        pullRequestsResponseTime +=
          (new Date().getTime() - new Date(pullRequest.createdAt).getTime()) /
          1000;
      }
    }
    pullRequestsResponseTime /= repository.pullRequests.totalCount;

    const maxIssuesResponseTime = 7 * 24 * 60 * 60;
    const maxPullRequestsResponseTime = 14 * 24 * 60 * 60;
  
    const issuesResponseTimeScore = Math.min(
      1,
      Math.max(0, maxIssuesResponseTime / issuesResponseTime)
    );
  
    const pullRequestsResponseTimeScore = Math.min(
      1,
      Math.max(0, maxPullRequestsResponseTime / pullRequestsResponseTime)
    );
  
    const popularityScore =
      0.5 * (Math.log10(repository.stargazers.totalCount + 1) / Math.log10(1000)) +
      0.4 * (Math.log10(repository.forks.totalCount + 1) / Math.log10(1000)) +
      0.1 * (Math.log10(repository.watchers.totalCount + 1) / Math.log10(1000));
  
    const score =
      0.3 * issuesResponseTimeScore +
      0.3 * pullRequestsResponseTimeScore +
      0.4 * popularityScore;
      
      console.log(
        "The maintainer score for the repository is:",
        score
      );
    };  
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
