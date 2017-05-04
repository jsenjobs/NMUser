#!/bin/bash  

msg='develop'
p="--m"
if [ "--m"x == "$1"x -o  "-m"x == "$1"x ] && [ $# -ge 2 ];
then  
    msg=$2  
fi  

echo 'git add start'
git add *
git add -A
echo 'git add end'
echo 'git commit start'
git commit -m \'$msg\'
echo 'git commit end'
