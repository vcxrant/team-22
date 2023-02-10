# team-22
<img src="https://img.shields.io/github/contributors/varshney00/team-22" />  
### ECE 461  

### Project Description
We have created a command-line interface that you can use to obtain a ranking of the most reliable npm modules based on your needs. The solution implements REST and GraphQL APIs to query data from Github that we use in our algorithm to calculate and output a list of the best modules for you.

### Team Members:

<img src="https://contrib.rocks/image?repo=varshney00/team-22" />
1. Vickrant
2. Riya
3. Hasan
4. Daniyal <br />
<br />
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=vcxrant" />

## Setup
1. Clone this repository
2. Run the following command:
```
npm install
./run install
```
3. Create a testfile with the following content:
```
https://github.com/cloudinary/cloudinary_npm
```
4. Obtain a Github Token?
  
## Instructions
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
