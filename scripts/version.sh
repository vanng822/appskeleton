ROOT="."
if [ "$#" -eq 1 ]; then
	ROOT=$1
fi

VERSION=$(git show ${ROOT} | grep commit | sed "s/^commit //g")
echo $VERSION