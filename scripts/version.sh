VERSION=$(git rev-parse --short HEAD)
if [ "$VERSION" != "" ]; then
	echo $VERSION
else
	echo "1"
fi
