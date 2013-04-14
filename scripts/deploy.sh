#!/bin/bash


###=== NEED TO FILL ===
## fill in connection to server
RELEASE_TARGET=FOLDER_ON_SERVER_FOR_STORE_RELEASE
TARGET=FOLDER_WHERE_APP_WILL_UNPACK_AND_RUN
## Have permission to write
SSH_CONNECT=CONNECT_INFO
## have permission to run /etc/init.d/APP_NAME
SSH_COMMAND=COMMAND_INFO

###=== NO NEED TO TOUCH those bellow ===

SOURCE_DIR=APP_TARGET_DIR/
RELEASE_DIR=APP_TARGET_DIR/releases/


START_ACTION=""
DO_RELEASE=""
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
			DO_RELEASE=1
			;;
		?)
			usage
			exit
			;;
	esac
done

SPEC_FILE=${SOURCE_DIR}scripts/files.spec

RELEASE=$(./version.sh ${SOURCE_DIR})
RELEASE_FILE=${RELEASE}.zip

if [ "$DO_RELEASE" = "1" ]; then

	./release.sh $SOURCE_DIR $RELEASE_DIR $SPEC_FILE $RELEASE_FILE
	
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
	
	echo "Distributed the release to server"
	
	ssh $SSH_CONNECT "cd ${RELEASE_TARGET} && rm -fr ${RELEASE_TARGET}pack/* && unzip -qo ${RELEASE_TARGET}${RELEASE_FILE} -d ${RELEASE_TARGET}pack && cp -r ${RELEASE_TARGET}/pack/* -t ${TARGET}"

	res=$?
	
	if [ ! $res -eq 0 ]; then
		echo "Could not distribute the release into target"
		exit 1
	fi
	
	echo "Distributed the release into target"

fi 

if [ "$NPM_INSTALL" = "1" ]; then
	ssh $SSH_CONNECT "cd ${TARGET} && npm install"
	res=$?
	
	if [ ! $res -eq 0 ]; then
		echo "Could not run npm install"
		exit 1
	fi
	
	echo "npm install done"
fi

if [ "$START_ACTION" != "" ]; then
	case "$START_ACTION" in
		start)
			ssh $SSH_COMMAND 'sudo /etc/init.d/APP_NAME start'
			;;
		stop)
			ssh $SSH_COMMAND 'sudo /etc/init.d/APP_NAME stop'
			;;
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