#!/bin/bash

version=`npm version patch`
npm publish --access public --verbose
git push 
git push --tag
