# ===========================================
# --coding:UTF-8 --
# file: push.sh
# author: william
# date: 2019-1-4
# email: v.cpp@pku.edu.cn
# description: 
# ===========================================
git pull
git add .
git commit -m $(date +%Y-%m-%d-%H-%M-%S)
git push github master
