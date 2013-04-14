#!/bin/bash

START_ACTION=""
BUILD_RELEASE=""
RELEASE=""
NPM_INSTALL=""

usage() {
	echo "Usage: deploy.sh -h, -a release|graceful|restart|force-restart, -i => npm install, -r => release, -ri => do all two"
}

while getopts "a:hirb" OPTION
do
	case $OPTION in
		h)
			usage
			exit
			;;
		a)
			START_ACTION=$OPTARG
			;;
		i)
			NPM_INSTALL=1
			;;
		r)
			RELEASE=1
			;;
		?)
			usage
			exit
			;;
	esac
done

SOURCE_DIR=APP_TARGET_DIR/
RELEASE_DIR=APP_TARGET_DIR/releases/
RELEASE_TARGET=FOLDER_ON_SERVER_FOR_STORE_RELEASE
TARGET=FOLDER_WHERE_APP_WILL_UNPACK_AND_RUN

## fill in connection to server
SSH_CONNECT=CONNECT_INFO
SSH_COMMAND=COMMAND_INFO

SPEC_FILE=${SOURCE_DIR}scripts/files.spec

RELEASE=$(./version.sh ${SOURCE_DIR})
FILE_LIST=$( cat $SPEC_FILE )
RELEASE_FILE=${RELEASE}.zip

if [ "$RELEASE" = "1" ]; then

	./release.sh $SOURCE_DIR $RELEASE_DIR $SPEC_FILE $RELEASE
	
	res=$?
	
	if [ ! $res -eq 0 ]; then
		echo "Could not build release"
		exit 1
	fi
	
	echo "Building release done"

	scp $RELEASE_DIR$RELEASE_FILE $SSH_CONNECT:$RELEASE_TARGET
	
	res=$?
	
	if [ ! $res -eq 0 ]; then
		echo "Could not distribute the release to server"
		exit 1
	fi
	
	ssh $SSH_CONNECT "cd ${RELEASE_TARGET} && rm -fr ${RELEASE_TARGET}pack/* && unzip -qo ${RELEASE_TARGET}${RELEASE_FILE} -d ${RELEASE_TARGET}pack && cp -r ${RELEASE_TARGET}/pack/* -t ${TARGET}"

	res=$?
	
	if [ ! $res -eq 0 ]; then
		echo "Could not distribute the release into target"
		exit 1
	fi

fi 

if [ "$START_ACTION" != "" ]; then
	case "$START_ACTION" in
		force-restart)
			ssh $SSH_COMMAND 'sudo /etc/init.d/APP_NAME force-restart'
			;;
		restart)
			ssh $SSH_COMMAND 'sudo /etc/init.d/APP_NAME restart'
			;;
		graceful)
			ssh $SSH_COMMAND 'sudo /etc/init.d/APP_NAME graceful'
			;;
		*)
			usage
			;;
	esac

fi