#!/bin/sh

rm -rf out

# Build the server
npx swc -d out src/*

# Build the client
cd src/client
npx next build

# Copy the client build to the server
mkdir -p ../../out/src/client
cp -r .next ../../out/src/client/


