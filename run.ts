// Main file
//#!/usr/bin/env node

import { execSync } from 'child_process'
import { NpmRegistryClient } from 'npm-registry-client'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

dotenv.config();
const logFilePath = process.env.LOG_FILE;


const log = (message: string) => {
    console.log(message);
    fs.writeFileSync(logFilePath, '${message}\n', {flag: 'a'});
};


async function checkIfFilePath(input: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        fs.stat(input, (error, stats) => {
            if(error) {
                log('${input} is not a valid file path');
                resolve(false);
            } else {
                resolve(stats.isFile());
            }
        });
    });
}

function decomposeUrl(url: string): Promise<[string, string]> {
    const registry = new NpmRegistryClient();
    if(url.startsWith('https://github.com/')) {
        return new Promise(resolve => {
        const parts = url.split('/');
        const org = parts[3];
        const repo = parts[4].split('.')[0];
        resolve([org, repo]);
        });
    } else if(url.startsWith('https://npmjs.com/')) {
        return new Promise((resolve, reject) => {
            registry.get(url, (error: any, data: any) =>{
                if(error) {
                    log('Error retrieing repository information: ${error}');
                    reject(error);
                } else {
                    const repository = data.repository;
                    if(repository && repository.type == 'git') {
                        const repoUrl = repository.url;
                        const parts = repoUrl.split('/');
                        const org = parts[3];
                        const repo = parts[4].split('.')[0];
                        resolve([org, repo]);
                    }
                }
            });
        });
    } else {
        log('Error: ${url} is invalid. The U    RL must from github or npmjs');
    }
}

async function main() {
    console.log(process.argv.length);
    if(process.argv.length != 3) {
        console.error('Error: Incorrect number of arguments');
        log('Error: Incorrect number of arguments');
        process.exit(1) 
    }


    const action = process.argv[2]
    if(action == 'build') {
        try {
            execSync('npm install', {stdio: 'inherit'});
        } catch(error) {
            log('Error: ${error}');
        }
    } else if(action == 'install') {
        try {
            execSync('npm run build', {stdio : 'inherit'});
        } catch(error) {
            log('Erro: ${error}');
        }
    } else if(action == 'test') {
        console.log("All tests run");
    } else if(await checkIfFilePath(action)) {
        const fileContent = fs.readFileSync(action, 'utf-8');
        const urls = fileContent.split('\n');
        for(const url of urls) {
            const [org, repo] = await decomposeUrl(url);
            console.log('Organization: ${org}, Repository: ${repo}');
        }
    } else {
        console.log("Error: Incorrect input arguments");
    }
}

main();
