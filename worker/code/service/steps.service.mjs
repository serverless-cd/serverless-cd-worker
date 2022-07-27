#!/usr/bin/env zx

const myname = await $`cat package.json`;

echo`${myname}`;


let sName = 'dankun'
await $`mkdir -p ./tmp/${sName}`