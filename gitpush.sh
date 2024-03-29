#!/bin/bash

set -e

if [ ! -d cache ]; then
	echo ">>> Fresh working directory, fetching cache repo..."
	git clone https://github.com/prochazkaml/CoachiumCached cache
	cd cache
	git remote set-url origin git@github.com:prochazkaml/CoachiumCached
	cd ..
fi

echo ">>> Generating cache..."
node node/compress.node.js cache
cp favicon.ico cache/
cp -r about privacy-policy cache/
date "+%y%m%d%H%M%S" > cache/timestamp

gitver=`cat .git/refs/heads/master | cut -c1-7`

echo ">>> Auto-commiting to cache repo..."
cd cache
git add -A .
git commit -a -m "Syncing cache build with parent $gitver"
echo ">>> Pushing cache repo..."
git push

echo ">>> Pushing parent repo..."
cd ..
git push
