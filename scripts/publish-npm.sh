#!/bin/bash

version=`npm version patch`
npm publish --access public --verbose
git tag $version
git push --tag
