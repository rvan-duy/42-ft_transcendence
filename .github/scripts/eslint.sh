#!/bin/bash

# This script runs ESLint on the codebase and exits with a non-zero exit code if there are any errors.

config_file="./frontend/rubenpong/.eslintrc.cjs"
lint_path="./frontend/rubenpong/node_modules/.bin/eslint"
flags="--max-warnings=0"

echo -e "\033[33mRunning ESLint...\033[0m"
output=$($lint_path . $flags -c $config_file)

if [ $? -ne 0 ]; 
then
    echo -e "\033[31mESLint found errors in the codebase. Fix them and try again.\033[0m"
    echo "$output"
    echo -e "\033[31mPlease note we are treating warnings as errors.\033[0m"
    exit 1
else
    echo -e "\033[32mESLint successfully ran. No errors found in the codebase.\033[0m"
    exit 0
fi
