const child_process = require("child_process");
import { validateUrl } from "./generalFunctions";
import { retrieveFunction } from "./generalFunctions";
import { retrieveFunctionLogFile } from "./generalFunctions";
import { calcnetscore } from "./generalFunctions";
import { calculateMaintainerScore } from "./generalFunctions";
require("dotenv").config();

const test_validateUrl = () => {
  let passed = 0;
  let failed = 0;

  // Test 1: Validate a basic URL
  const url1 = "https://www.example.com";
  if (validateUrl(url1) === true) {
    passed++;
  } else {
    //console.error(`Test 1 failed: ${url1}`);
    failed++;
  }

  // Test 2: Validate a URL with a path
  const url2 = "https://www.example.com/path";
  if (validateUrl(url2) === true) {
    passed++;
  } else {
    //console.error(`Test 2 failed: ${url2}`);
    failed++;
  }

  // Test 3: Validate a URL with a query string
  const url3 = "https://www.example.com/path?query=string";
  if (validateUrl(url3) === true) {
    passed++;
  } else {
    //console.error(`Test 3 failed: ${url3}`);
    failed++;
  }

  // Test 4: Validate a URL with a fragment identifier
  const url4 = "https://www.example.com/path#fragment";
  if (validateUrl(url4) === true) {
    passed++;
  } else {
    //console.error(`Test 4 failed: ${url4}`);
    failed++;
  }

  // Test 5: Validate an HTTP URL
  const url5 = "http://www.example.com";
  if (validateUrl(url5) === true) {
    passed++;
  } else {
    //console.error(`Test 5 failed: ${url5}`);
    failed++;
  }

  // Test 6: Validate a URL with a port number
  const url6 = "https://www.example.com:8080";
  if (validateUrl(url6) === true) {
    passed++;
  } else {
    //console.error(`Test 6 failed: ${url6}`);
    failed++;
  }

  // Test 7: Validate a URL with subdomains
  const url7 = "https://subdomain.example.com";
  if (validateUrl(url7) === true) {
    passed++;
  } else {
    //console.error(`Test 7 failed: ${url7}`);
    failed++;
  }

  // Test 8: Validate a URL with uppercase letters
  const url8 = "https://www.Example.com";
  if (validateUrl(url8) === true) {
    passed++;
  } else {
    //console.error(`Test 8 failed: ${url8}`);
    failed++;
  }

  // Test 9: Invalidate a URL with a missing protocol
  const url9 = "www.example.com";
  if (validateUrl(url9) === false) {
    passed++;
  } else {
    //console.error(`Test 9 failed: ${url9}`);
    failed++;
  }

  return [passed, failed];
};

const test_retrieveFunction = () => {
  let testResults = [];
  let testsPassed = 0;
  let testsFailed = 0;

  const token = retrieveFunction();

  const token2 = retrieveFunction();
  if (token === token2) {
    testResults.push("Test 1: Retrieve Function Result Consistency - PASSED");
    testsPassed++;
  } else {
    testResults.push("Test 1: Retrieve Function Result Consistency - FAILED");
    testsFailed++;
  }

  try {
    process.env.GITHUB_TOKEN = "";
    const token3 = retrieveFunction();
    if (!token3) {
      testResults.push("Test 2: Token Value - PASSED");
      testsPassed++;
    } else {
      testResults.push("Test 2: Token Value - FAILED");
      testsFailed++;
    }
  } catch (error) {
    testResults.push("Test 2: Token Value - ERROR");
    testsFailed++;
  }

  try {
    process.env.GITHUB_TOKEN = "123";
    const token4 = retrieveFunction();
    if (token4 === "123") {
      testResults.push("Test 3: Token Type Conversion - PASSED");
      testsPassed++;
    } else {
      testResults.push("Test 3: Token Type Conversion - FAILED");
      testsFailed++;
    }
  } catch (error) {
    testResults.push("Test 3: Token Type Conversion - ERROR");
    testsFailed++;
  }

  try {
    process.env.GITHUB_TOKEN = "a".repeat(3000);
    const token5 = retrieveFunction();
    if (token5.length === 3000) {
      testResults.push("Test 4: Token Length with Large String - PASSED");
      testsPassed++;
    } else {
      testResults.push("Test 4: Token Length with Large String - FAILED");
      testsFailed++;
    }
  } catch (error) {
    testResults.push("Test 4: Token Length with Large String - ERROR");
    testsFailed++;
  }

  try {
    process.env.GITHUB_TOKEN = "a".repeat(5);
    const token6 = retrieveFunction();
    if (token6.length === 5) {
      testResults.push("Test 5: Token Length with Small String - PASSED");
      testsPassed++;
    } else {
      testResults.push("Test 5: Token Length with Small String - FAILED");
      testsFailed++;
    }
  } catch (error) {
    testResults.push("Test 5: Token Length with Small String - ERROR");
    testsFailed++;
  }

  try {
    process.env.GITHUB_TOKEN = "";
    const token7 = retrieveFunction();
    if (token7.length === 0) {
      testResults.push("Test 6: Token Length with Empty String - PASSED");
      testsPassed++;
    } else {
      testResults.push("Test 6: Token Length with Empty String - FAILED");
      testsFailed++;
    }
  } catch (error) {
    testResults.push("Test 6: Token Length with Empty String - ERROR");
    testsFailed++;
  }

  return [testsPassed, testsFailed];
};

function test_retrieveFunctionLogFile() {
  let oldLogFilePath = process.env.LOG_FILE;
  let oldLogLevel = process.env.LOG_LEVEL;
  let passed = 0;
  let failed = 0;

  child_process.execSync(`export LOG_LEVEL="2"`);
  const [logFilePath4, level4] = retrieveFunctionLogFile();
  if (level4 === 2) {
    passed++;
  } else {
    failed++;
  }

  oldLogLevel = "invalid";
  delete process.env.LOG_LEVEL;
  const [logFilePath2, level2] = retrieveFunctionLogFile();
  if (level2 === 0) {
    passed++;
  } else {
    failed++;
  }

  return [passed, failed];
}

const test_calcnetscore = async () => {
  const testCases = [
    [0, 0, 0, 0, 0.0],
    [1, 0, 0, 0, 0.0],
    [1, 1, 0, 0, 0.2],
    [1, 1, 1, 0, 0.6],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 0.4],
    [1, 0, 1, 1, 0.8],
  ];

  let numPassed = 0;
  let numFailed = 0;

  testCases.forEach(
    async ([
      licenses,
      CorrectNess,
      busFactor,
      responsiveMaintainer,
      expectedScore,
    ]) => {
      const result = await calcnetscore(
        licenses,
        CorrectNess,
        busFactor,
        responsiveMaintainer
      );

      if (result === expectedScore) {
        /* console.log(
          `Test case passed: licenses=${licenses}, CorrectNess=${CorrectNess}, busFactor=${busFactor}, responsiveMaintainer=${responsiveMaintainer}, expectedScore=${expectedScore}, result=${result}`
        ); */
        numPassed++;
      } else {
        /* console.error(
          `Test case failed: licenses=${licenses}, CorrectNess=${CorrectNess}, busFactor=${busFactor}, responsiveMaintainer=${responsiveMaintainer}, expectedScore=${expectedScore}, result=${result}`
        ); */
        numFailed++;
      }
    }
  );

  const temp = [numPassed, numFailed];

  return temp;
};

const test_calculateMaintainerScore = () => {
  const testCases = [
    [0, 0, 0, 0, 0, 0.0],
    [60 * 60, 60 * 60, 0, 0, 0, 0.0],
    [7 * 24 * 60 * 60, 7 * 24 * 60 * 60, 0, 0, 0, 0.0],
    [14 * 24 * 60 * 60, 14 * 24 * 60 * 60, 0, 0, 0, 0.15],
    [10 * 60, 10 * 60, 1000, 0, 0, 0.20002893849862127],
    [10 * 60, 10 * 60, 1000, 1000, 0, 0.3600520892975183],
    [10 * 60, 10 * 60, 1000, 1000, 1000, 0.40005787699724255],
    [10 * 60, 10 * 60, 10000, 10000, 10000, 0.533339123636915],
    [100 * 24 * 60 * 60, 100 * 24 * 60 * 60, 1000, 0, 0, 0.7370289384986212],
    [100 * 24 * 60 * 60, 100 * 24 * 60 * 60, 1000, 1000, 0, 0.8970520892975182],
  ];

  let numPassed = 0;
  let numFailed = 0;

  testCases.forEach(
    ([
      issuesResponseTime,
      pullRequestsResponseTime,
      stars,
      forks,
      watchers,
      expectedScore,
    ]) => {
      const result = calculateMaintainerScore(
        issuesResponseTime,
        pullRequestsResponseTime,
        stars,
        forks,
        watchers
      );

      if (result === expectedScore) {
        /* console.log(
          `Test case passed: issuesResponseTime=${issuesResponseTime}, pullRequestsResponseTime=${pullRequestsResponseTime}, stars=${stars}, forks=${forks}, watchers=${watchers}, expectedScore=${expectedScore}, result=${result}`
        ); */
        numPassed++;
      } else {
        /* console.error(
          `Test case failed: issuesResponseTime=${issuesResponseTime}, pullRequestsResponseTime=${pullRequestsResponseTime}, stars=${stars}, forks=${forks}, watchers=${watchers}, expectedScore=${expectedScore}, result=${result}`
        ); */
        numFailed++;
      }
    }
  );

  return [numPassed, numFailed];
};

const main = async () => {
  let passed_test_validateUrl = 0;
  let failed_test_validateUrl = 0;
  let passed_retrieveFunction = 0;
  let failed_retrieveFunction = 0;
  let passed_retrieveFunctionLogFile = 0;
  let failed_retrieveFunctionLogFile = 0;
  let passed_calculateMaintainerScore = 0;
  let failed_calculateMaintainerScore = 0;
  let passed_calcNetScore = 0;
  let failed_calcNetScore = 0;
  let total_passed_cases = 0;
  let total_cases = 0;
  let coverage = 0;

  [passed_test_validateUrl, failed_test_validateUrl] = test_validateUrl();
  [passed_retrieveFunction, failed_retrieveFunction] = test_retrieveFunction();
  [passed_retrieveFunctionLogFile, failed_retrieveFunction] =
    test_retrieveFunctionLogFile();
  [passed_calculateMaintainerScore, failed_calculateMaintainerScore] =
    test_calculateMaintainerScore();
  [passed_calcNetScore, failed_calcNetScore] = await test_calcnetscore();

  total_passed_cases =
    passed_test_validateUrl +
    passed_retrieveFunction +
    passed_retrieveFunctionLogFile +
    passed_calculateMaintainerScore +
    passed_calcNetScore;
  total_cases =
    passed_test_validateUrl +
    passed_retrieveFunction +
    passed_retrieveFunctionLogFile +
    passed_calculateMaintainerScore +
    passed_calcNetScore +
    failed_test_validateUrl +
    failed_retrieveFunction +
    failed_retrieveFunctionLogFile +
    failed_calculateMaintainerScore +
    failed_calcNetScore;

  coverage = (total_passed_cases / total_cases) * 100;

  console.log("Total:", total_cases);
  console.log("Passed:", total_passed_cases);
  console.log("Coverage:", coverage, "%");
  console.log(
    `${total_passed_cases}/${total_cases} passed \n${coverage} % coverage achieved`
  );
};

main();
