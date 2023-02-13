# team-22
<img src="https://img.shields.io/github/contributors/varshney00/team-22" /> <img src="https://img.shields.io/npm/v/node" />    

### ECE 461

### Project Description
We have created a command-line interface that you can use to obtain a ranking of npm modules in terms of trustworthiness. The solution implements REST and GraphQL APIs to query data from Github which we use in our algorithm to calculate and output the ranking of modules and their ratings on various trustworthiness metrics.

### Team Members:

<img src="https://contrib.rocks/image?repo=varshney00/team-22" />
1. Vickrant
2. Riya
3. Hasan
4. Daniyal <br />
<br />
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=vcxrant" />

## Setup
1. Obtain a Github Token  
- Follow steps 1 through 8 in this link: https://docs.github.com/en/enterprise-server@3.4/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token  
2. Clone this repository  
3. Run the following commands:  
```
npm install
./run install
```  
4. Create an empty log file in the root directory.
4. Create a .env file in the root directory with the following content:
```
export GITHUB_TOKEN="{insert token here}"
LOG_FILE = "./log"
LOG_LEVEL = "2"
```
5. Create a testfile with the following content:
```
https://github.com/cloudinary/cloudinary_npm
```
  
## Instructions
Build with the following command:
```
./ run build
```

Here is the format of a sample command:   
(Be sure to specify the file path specific to your list of URLs)
```
./run /Users/myUser/IdeaProjects/files/sample-url-file.txt
```

The program will output a ranked list of modules and their metrics. It will look something like this:
```
{"URL":"https://github.com/nullivex/nodist", "NET_SCORE":0.9, "RAMP_UP_SCORE":0.5, "CORRECTNESS_SCORE":0.7, "BUS_FACTOR_SCORE":0.3, "RESPONSIVE_MAINTAINER_SCORE":0.4, "LICENSE_SCORE":1}
{"URL":"https://www.npmjs.com/package/browserify", "NET_SCORE":0.76, "RAMP_UP_SCORE":0.5, "CORRECTNESS_SCORE":0.7, "BUS_FACTOR_SCORE":0.3, "RESPONSIVE_MAINTAINER_SCORE":0.6, "LICENSE_SCORE":1}
{"URL":"https://github.com/cloudinary/cloudinary_npm", "NET_SCORE":0.6, "RAMP_UP_SCORE":0.5, "CORRECTNESS_SCORE":0.7, "BUS_FACTOR_SCORE":0.3, "RESPONSIVE_MAINTAINER_SCORE":0.2, "LICENSE_SCORE":1}
{"URL":"https://github.com/lodash/lodash", "NET_SCORE":0.5, "RAMP_UP_SCORE":0.5, "CORRECTNESS_SCORE":0.3, "BUS_FACTOR_SCORE":0.7, "RESPONSIVE_MAINTAINER_SCORE":0.6, "LICENSE_SCORE":1}
{"URL":"https://www.npmjs.com/package/express", "NET_SCORE":0, "RAMP_UP_SCORE":0.5, "CORRECTNESS_SCORE":0.7, "BUS_FACTOR_SCORE":0.3, "RESPONSIVE_MAINTAINER_SCORE":0.6, "LICENSE_SCORE":0}
```

To run the test scripts for this project, use the following command:
```
./run testing
```
