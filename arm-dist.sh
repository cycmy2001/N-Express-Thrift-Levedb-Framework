#!/bin/sh

water=~/node-water
node_water_arm=~/node-water-arm

rm -rf $node_water_arm/*


$water/arm/level-arm.sh


rsync -a --exclude arm --exclude test --exclude tools --exclude arm-dist.sh --exclude node_modules/level --exclude bin/node-log $water/* $node_water_arm


rsync -a $water/arm/level $node_water_arm/node_modules
rsync -a $water/arm/node-log $node_water_arm/bin

cd $node_water_arm

#remove test and src directory
find $node_water_arm/ -type d -name "test" -exec rm -fr {} \;
find $node_water_arm/ -type f -name "test*.js" -exec rm -fr {} \;
find $node_water_arm/ -type f -name "*.md" -exec rm -fr {} \;
find $node_water_arm/ -type d -name "src" -exec rm -fr {} \;
find $node_water_arm/ -type d -name "examples" -exec rm -fr {} \;
find $node_water_arm/ -type f -name "thrift-0.9.2.tgz" -exec rm -fr {} \;

tar -cf node-water.tar *
