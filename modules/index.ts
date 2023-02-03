import { Octokit } from "octokit";
import { averageFunction, validateUrl } from "./generalFunctions";
import {repositoryClass} from "./classes"

/* try {
  
  console.log(secretKey);
} catch (e) {
  console.log(e);
} */


let repo = new repositoryClass(
  "axios",
  "https://github.com/axios/axios",
  "axios"
);
console.log(repo.printProperties());
repo.getRepoInfo();
console.log(repo.printProperties());

const customAlgo = () => {};
