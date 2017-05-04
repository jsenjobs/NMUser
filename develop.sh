#!/bin/bash  

msg='develop'
if ['--m' == $1 || '--m' == $1]; then
	msg = $2
fi
echo msg

echo 'git add start'
git add *
git add -A
echo 'git add end'
echo 'git commit start'
git commit -m 'develop'
echo 'git commit end'
