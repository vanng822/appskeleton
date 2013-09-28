#!/bin/bash

if [ "$#" -lt 2 ]; then
	echo "usage: skeleton.sh {target-dir} {app-name} [add-git]"
	exit 1
fi

SOURCE_DIR=$(pwd)

TARGET_DIR=$1
APP_NAME=$2
ADD_GIT=0
if [ "$#" -eq 3 ]; then
	if [ "$3" = "add-git" ]; then
		ADD_GIT=1
	fi
fi
mkdir ${TARGET_DIR}/app
mkdir ${TARGET_DIR}/bin
mkdir ${TARGET_DIR}/config
mkdir -p ${TARGET_DIR}/etc/init.d
mkdir ${TARGET_DIR}/lib
mkdir -p ${TARGET_DIR}/public/css
mkdir -p ${TARGET_DIR}/public/img/icons
mkdir -p ${TARGET_DIR}/public/js
mkdir ${TARGET_DIR}/scripts
mkdir ${TARGET_DIR}/views
mkdir ${TARGET_DIR}/tests

cp -r ${SOURCE_DIR}/app/* ${TARGET_DIR}/app/
cp ${SOURCE_DIR}/config/*.js ${TARGET_DIR}/config/
ALL_CONFIG=$(cat ${SOURCE_DIR}/config/all.js)
echo "${ALL_CONFIG}" | sed "s/APP_NAME/${APP_NAME}/g"  > ${TARGET_DIR}/config/all.js

cp -r ${SOURCE_DIR}/views/ ${TARGET_DIR}/views/
INITD=$(cat ${SOURCE_DIR}/etc/init.d/app)
touch ${TARGET_DIR}/etc/init.d/${APP_NAME}
echo "${INITD}" | sed "s/APP_NAME/${APP_NAME}/g"  > ${TARGET_DIR}/etc/init.d/${APP_NAME}
cp ${SOURCE_DIR}/app.js ${TARGET_DIR}/${APP_NAME}.js

cp ${SOURCE_DIR}/lib/*.js ${TARGET_DIR}/lib/

PACKAGE_TEMPLATE=$(cat ${SOURCE_DIR}/package.json.template)
touch ${TARGET_DIR}/package.json
echo "${PACKAGE_TEMPLATE}" | sed "s/APP_NAME/${APP_NAME}/g"  > ${TARGET_DIR}/package.json

cp ${SOURCE_DIR}/public/css/app.css ${TARGET_DIR}/public/css/${APP_NAME}.css
cp ${SOURCE_DIR}/public/js/app.js ${TARGET_DIR}/public/js/${APP_NAME}.js
cp ${SOURCE_DIR}/public/img/icons/loading.gif ${TARGET_DIR}/public/img/icons/


cp ${SOURCE_DIR}/scripts/release.sh ${TARGET_DIR}/scripts/release.sh
cp ${SOURCE_DIR}/scripts/version.sh ${TARGET_DIR}/scripts/version.sh
RELEASE_FILE_TEMPLATE=$(cat ${SOURCE_DIR}/scripts/files.spec)
touch ${TARGET_DIR}/scripts/files.spec
echo "${RELEASE_FILE_TEMPLATE}" | sed "s/APP_NAME/${APP_NAME}/g"  > ${TARGET_DIR}/scripts/files.spec
DEPLOY_TEMPLATE=$(cat ${SOURCE_DIR}/scripts/deploy.sh)
touch ${TARGET_DIR}/scripts/deploy.sh
TARGET_DIR_ESCAPE=$(echo ${TARGET_DIR} | sed 's/\//\\\//g')
echo "${DEPLOY_TEMPLATE}" | sed "s/APP_TARGET_DIR/${TARGET_DIR_ESCAPE}/g" | sed "s/APP_NAME/${APP_NAME}/g" > ${TARGET_DIR}/scripts/deploy.sh
chmod u+x ${TARGET_DIR}/scripts/deploy.sh

touch ${TARGET_DIR}/pstarter.pid
mkdir ${TARGET_DIR}/public/img/dist
mkdir ${TARGET_DIR}/releases
touch  ${TARGET_DIR}/tests/index.js

cd ${TARGET_DIR} && npm install

if [ "$ADD_GIT" = "1" ]; then
	echo "Adding files to git repo"
	touch ${TARGET_DIR}/.gitignore
	echo ".project" > ${TARGET_DIR}/.gitignore
	echo "releases/*" >> ${TARGET_DIR}/.gitignore
	echo "node_modules/*" >> ${TARGET_DIR}/.gitignore
	echo "pstarter.pid" >> ${TARGET_DIR}/.gitignore
	echo "public/img/dist/*" >> ${TARGET_DIR}/.gitignore
	
	git add ${TARGET_DIR}/.gitignore
	git add ${TARGET_DIR}/package.json
	git add ${TARGET_DIR}/app/*
	git add ${TARGET_DIR}/config/*
	git add ${TARGET_DIR}/etc/init.d/${APP_NAME}
	git add ${TARGET_DIR}/${APP_NAME}.js
	git add ${TARGET_DIR}/public/css
	git add ${TARGET_DIR}/public/js
	git add ${TARGET_DIR}/public/img/icons/loading.gif
	git add ${TARGET_DIR}/lib/*
	git add ${TARGET_DIR}/views/*
	git add ${TARGET_DIR}/scripts/*
	git add ${TARGET_DIR}/tests/*
	echo "Added all to git repo"
fi

cd ${SOURCE_DIR}
echo "Every thing done!"
echo "go to ${TARGET_DIR}"
echo "And run"
echo "node ${APP_NAME}.js NODE_ENV=development"
echo "It should work directly!"



 
