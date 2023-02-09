const {execSync} = require('child_process');
const fs = require('fs')

const LicenseCompatible = ['MIT', 'Apache-2.0', 'GPL-3.0', 'MPL-2.0', 'BSD-3-New', 'BSD-3-Revised', 'GPLv2', 'LGPLv2.1'];

function isLicenseCompatible(org, repo) : Promise<number> {
    return new Promise((resolve, reject) => {
        execSync(`git clone https://github.com/${org}/${repo}`, {stdio : 'ignore'});
        process.chdir("small");
        const packageJson = JSON.parse(fs.readFileSync('package.json').toString());
        console.log(packageJson.license);
        process.chdir('..');
        execSync("rm -rf small");
        resolve(LicenseCompatible.includes(packageJson.license) ? 1 : 0);         
    });
}