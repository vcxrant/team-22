const { execSync } = require("child_process");
const fs = require("fs");

export const averageFunction = (
  totalContributors: number,
  totalContributions: number
): number => {
  return totalContributions / totalContributors;
};

export const validateUrl = (url: string) => {
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

export const isLicenseCompatible = (org, repo): Promise<number> => {
  return new Promise((resolve, reject) => {
    execSync(`git clone https://github.com/${org}/${repo}`, {
      stdio: "ignore",
    });
    //console.log("Current directory:", process.cwd());
    const packageJson = JSON.parse(fs.readFileSync("package.json").toString());
    //console.log(packageJson.license);
    execSync(`rm -rf ${repo}`);
    resolve(LicenseCompatible.includes(packageJson.license) ? 1 : 0);
  });
};

export const log = (message: string, messageFormal: string, code: number) => {
  if (code == undefined) {
    code = Number(process.env.LOG_LEVEL);
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

export const retrieveFunction = () => {
  const token = process.env.GITHUB_TOKEN;
  return token;
};

export const retrieveFunctionLogFile = () => {
  const logFilePath = process.env.LOG_FILE;
  const level = process.env.LOG_LEVEL || 0;
  console.log(level);
  return [logFilePath, level];
};
