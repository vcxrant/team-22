const { execSync } = require("child_process");
const fs = require("fs");

export const validateUrl = (url: string) => {
  if (
    /^((http|https):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
      url
    )
  ) {
    return true;
  } else {
    return false;
  }
};

const LicenseCompatible = [
  "MIT",
  "Apache-2.0",
  "GPL-3.0",
  "MPL-2.0",
  "BSD-3-New",
  "BSD-3-Revised",
  "GPLv2",
  "LGPLv2.1",
  "ISC",
];

export const log = (message: string, messageFormal: string, code: number) => {
  if (code == undefined) {
    code = parseInt(process.env.LOG_LEVEL);
  }
  if (code == 0) {
    return;
  }
  if (code == 1) {
    console.log(message);
    return;
  }
  if (code == 2) {
    fs.writeFileSync(process.env.LOG_FILE, `${messageFormal}\n`, { flag: "a" });
    return;
  }
};

export const isLicenseCompatible = async (org, repo): Promise<number> => {
  /* Function returns a zero on failure or no match, 1 otherwise */
  try {
    await execSync(`git clone https://github.com/${org}/${repo}`, {
      stdio: "ignore",
    });
    const packageJson = JSON.parse(fs.readFileSync("package.json").toString());
    execSync(`rm -rf ${repo}`);
    return LicenseCompatible.includes(packageJson.license) ? 1 : 0;
  } catch (e) {
    log(
      "Error in the isLicenseCompatible Function",
      e,
      parseInt(process.env.LOG_LEVEL) || 0
    );
    return 0;
  }
};

export const retrieveFunction = (): any => {
  const token: any = process.env.GITHUB_TOKEN;
  return token;
};

export const retrieveFunctionLogFile = () => {
  const logFilePath = process.env.LOG_FILE;
  const level = parseInt(process.env.LOG_LEVEL) || 0;
  return [logFilePath, level];
};

export const calcnetscore = async (
  licenses: number,
  CorrectNess: number,
  busFactor: number,
  responsiveMaintainer: number
): Promise<number> => {
  const score =
    licenses * (0.2 * CorrectNess + 0.4 * busFactor + 0.4 * responsiveMaintainer);
  return score;
};

export function calculateMaintainerScore(
  issuesResponseTime: number,
  pullRequestsResponseTime: number,
  stars: number,
  forks: number,
  watchers: number
): number {
  const maxIssuesResponseTime = 7 * 24 * 60 * 60;
  const maxPullRequestsResponseTime = 14 * 24 * 60 * 60;

  const issuesResponseTimeScore = Math.min(
    1,
    Math.max(0, 1 - maxIssuesResponseTime / issuesResponseTime)
  );

  const pullRequestsResponseTimeScore = Math.min(
    1,
    Math.max(0, 1 - maxPullRequestsResponseTime / pullRequestsResponseTime)
  );

  const popularityScore =
    0.5 * (Math.log10(stars + 1) / Math.log10(1000)) +
    0.4 * (Math.log10(forks + 1) / Math.log10(1000)) +
    0.1 * (Math.log10(watchers + 1) / Math.log10(1000));

  const score =
    0.3 * issuesResponseTimeScore +
    0.3 * pullRequestsResponseTimeScore +
    0.4 * popularityScore;

  return score;
}

export function calculateRepositoryCorrectness(data : any) : number{

  const totalIssues = data.repository.openIssues.totalCount + data.repository.closedIssues.totalCount;
  const totalPullRequests = data.repository.pullRequests.totalCount;
  // Normalize the metrics to values in the range [0, 1]
  const normalizedOpenIssues = data.repository.openIssues.totalCount / totalIssues;
  const normalizedClosedIssues = data.repository.closedIssues.totalCount / totalIssues;
  const normalizedPullRequests = data.repository.closedPullRequest.totalCount / totalPullRequests;
  const normalizedMergedPullRequests = data.repository.mergedPullRequests.totalCount / totalPullRequests;
  const normalizedSecurityAdvisories = data.securityAdvisories.totalCount / (data.securityAdvisories.totalCount + data.repository.vulnerabilityAlerts.totalCount);
  const normalizedVulnerabilities = data.repository.vulnerabilityAlerts.totalCount / (data.securityVulnerabilities.totalCount + data.repository.vulnerabilityAlerts.totalCount);
  // Calculate the repository correctness score based on the normalized metrics
  const issueCorrectness = normalizedClosedIssues / (normalizedOpenIssues + normalizedClosedIssues);
  const pullRequestCorrectness =  normalizedPullRequests/normalizedMergedPullRequests;

  const securityCorrectness = 1 - normalizedSecurityAdvisories - normalizedVulnerabilities;
  const correctnessScore =
    0.4 * issueCorrectness + 0.4 * pullRequestCorrectness + 0.2 * securityCorrectness;
  return correctnessScore;
}