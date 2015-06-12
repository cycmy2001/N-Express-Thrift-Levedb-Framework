#!/bin/sh

export HOST=arm-linux-gnueabihf
export CC="${HOST}-gcc"
export CXX="${HOST}-g++"
export LD="${HOST}-ld"
export AR="${HOST}-ar"
export NM="${HOST}-nm"
export AS="${HOST}-as"
export RANLIB="${HOST}-ranlib"
export STRIP="${HOST}-strip"
export OBJCOPY="${HOST}-objcopy"
export OBJDUMP="${HOST}-objdump"

#npm install nan
rm -rf ~/node-water/arm/level
cp -fR ~/node-water/node_modules/level ~/node-water/arm
cd ~/node-water/arm/level/node_modules/leveldown
node-gyp clean configure --arch=arm rebuild 
