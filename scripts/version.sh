ROOT=.
if [ "$#" -eq 2 ]; then
	ROOT=$1
fi

VERSION=$(git log $ROOT | grep commit | sed "s/^commit //g")
echo $VERSION