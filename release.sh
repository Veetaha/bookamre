#!/usr/bin/env bash

set -euxo pipefail

git add .
git commit -m "${0:-Unnamed update}"
git tag v1 --force
git push --tags --force
