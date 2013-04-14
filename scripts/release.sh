#!/bin/bash
#echo "$#"
if [ "$#" -lt 3 ]; then
	echo "release.sh: You need to specify the source directory and the file spec"
	exit 1
fi

SOURCE_DIR=$1
TARGET_DIR=$2
RELEASE=$4
SPEC_FILE=$3

RELEASE_FILE=$RELEASE.zip

cd $SOURCE_DIR
echo $SOURCE_DIR

FILE_LIST=$( cat $SPEC_FILE )
echo "Start packaging files"
for FILE in $FILE_LIST; do
	if [ ! -e "$FILE" ]; then 
		echo "File does not exist: $FILE"
		exit 1
	fi
	
	$( zip -qr $RELEASE_FILE $FILE )

	
	if [ "$?" = "1" ]; then
		echo "Cannot zip file: $FILE"
		exit 1
	fi
done

#echo "Remove old releases/files"
#rm -rf $TARGET_DIR
echo "Move release to release folder ..."
mv $RELEASE_FILE $TARGET_DIR

exit 0