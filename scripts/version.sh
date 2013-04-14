ROOT=.
if [ "$#" -eq 2 ]; then
	ROOT=$1
fi

VERSION=$(git log $ROOT | grep commit | head -n 1 | sed "s/^commit //g")
echo $VERSION