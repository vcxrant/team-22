import {
  averageFunction,
  validateUrl,
  isLicenseCompatible,
  log,
  calcnetscore,
  calculateMaintainerScore,
} from "./generalFunctions";
import { Octokit } from "octokit";
const fetch = require("node-fetch");

const secretKey: string = process.env.GITHUB_TOKEN;
const octokit = new Octokit({
  auth: secretKey,
});

export class repositoryClass {
  licenses: number = 0;
  busFactor: number = 0.0;
  CorrectNess: number = -1; // Not done
  responsiveMaintainer: number = 0;
  netScore: number = 0;
  commits: number = 0;
  rampUp: number = -1; // not done
  pullRequest: number = 0;
  issuesClosed: number = 0;
  issuesOpen: number = 0;
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
    this.licenses = await isLicenseCompatible(this.owner, this.repo);
  };

  getBusFactor = async (loglevel: number): Promise<number> => {
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
      this.numContributors++; // Increment one more time since index starts at zero

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
      return (raw_busfactor - 1) / (this.numContributors - 1);
    } catch (error) {
      console.error("some Error occured in the Rest Api Function");
      log("some Error occured in the Rest Api Function", error, loglevel);
    }
  };

  classMain = async (loglevel: number): Promise<number> => {
    try {
      this.licenses = await isLicenseCompatible(this.owner, this.repo);
      this.busFactor = await this.getBusFactor(
        parseInt(process.env.LOG_LEVEL) || 0
      );
      this.responsiveMaintainer = await this.getResponsiveMaintainerScore();
      this.netScore = await calcnetscore(
        this.licenses,
        0,
        this.busFactor,
        this.responsiveMaintainer
      );
      return 1;
    } catch (error) {
      console.error("An error occured in the main function");

      log("An error occured in the main function", error, loglevel);
      return 0;
    }
  };

  free() {
    let i = repositoryClass.all.indexOf(this);
    repositoryClass.all.splice(i, 1);
  }

  static all = new Array(); // Array of each version of this class

  getResponsiveMaintainerScore = async (): Promise<number> => {
    try {
      const query = `{
        repository(owner: "${this.owner}", name: "${this.repo}") {
          name
          stargazers {
            totalCount
          }
          issues(last: 100) {
            totalCount
            edges {
              node {
                createdAt
                updatedAt
                closedAt
              }
            }
          }
          pullRequests(last: 100) {
            totalCount
            edges {
              node {
                createdAt
                updatedAt
                closedAt
              }
            }
          }
          openPullRequest: pullRequests(states: OPEN) {
            totalCount
          }
          closedPullRequest: pullRequests(states: OPEN) {
            totalCount
          }
          openIssues: issues(states: OPEN) {
            totalCount
          }
          closedIssues: issues(states: CLOSED) {
            totalCount
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
        securityVulnerabilities(severities: HIGH) {
          totalCount
        }
      }`;

      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Token ${secretKey}`,
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

      const score = calculateMaintainerScore(
        issuesResponseTime,
        pullRequestsResponseTime,
        repository.stargazers.totalCount,
        repository.forks.totalCount,
        repository.watchers.totalCount
      );
      console.log("The maintainer score for the repository is:", score);
      return score;
    } catch (error) {
      console.log(" I am at the reponsive maintainer function");
      log(
        "I am at the reponsive maintainer function",
        error,
        parseInt(process.env.LOG_LEVEL)
      );
      return 0;
    }
  };
}
