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

## create top directory structure
mkdir ${TARGET_DIR}/bin
mkdir ${TARGET_DIR}/config
mkdir -p ${TARGET_DIR}/etc/init.d
mkdir -p ${TARGET_DIR}/etc/nginx
mkdir ${TARGET_DIR}/lib
mkdir -p ${TARGET_DIR}/app/public/css
mkdir -p ${TARGET_DIR}/app/public/img/icons
mkdir -p ${TARGET_DIR}/app/public/js
mkdir ${TARGET_DIR}/app/views
mkdir ${TARGET_DIR}/app/routehandlers
mkdir ${TARGET_DIR}/scripts
mkdir ${TARGET_DIR}/tests

cp -r ${SOURCE_DIR}/app/routehandlers/* ${TARGET_DIR}/app/routehandlers/
cp -r ${SOURCE_DIR}/app/views/ ${TARGET_DIR}/app/views/
cp ${SOURCE_DIR}/app/bootstrap.js ${TARGET_DIR}/app/bootstrap.js
cp ${SOURCE_DIR}/app/public/css/app.css ${TARGET_DIR}/app/public/css/${APP_NAME}.css
cp ${SOURCE_DIR}/app/public/js/app.js ${TARGET_DIR}/app/public/js/${APP_NAME}.js
cp ${SOURCE_DIR}/app/public/img/icons/loading.gif ${TARGET_DIR}/app/public/img/icons/

cp ${SOURCE_DIR}/config/*.js ${TARGET_DIR}/config/
ALL_CONFIG=$(cat ${SOURCE_DIR}/config/all.js)
echo "${ALL_CONFIG}" | sed "s/APP_NAME/${APP_NAME}/g"  > ${TARGET_DIR}/config/all.js

INITD=$(cat ${SOURCE_DIR}/etc/init.d/app)
touch ${TARGET_DIR}/etc/init.d/${APP_NAME}
echo "${INITD}" | sed "s/APP_NAME/${APP_NAME}/g"  > ${TARGET_DIR}/etc/init.d/${APP_NAME}
cp ${SOURCE_DIR}/app.js ${TARGET_DIR}/${APP_NAME}.js

NGINXCONF=$(cat ${SOURCE_DIR}/etc/nginx/app.conf)
touch ${TARGET_DIR}/etc/nginx/${APP_NAME}.conf
echo "${NGINXCONF}" | sed "s/APP_NAME/${APP_NAME}/g"  > ${TARGET_DIR}/etc/nginx/${APP_NAME}.conf

cp ${SOURCE_DIR}/lib/*.js ${TARGET_DIR}/lib/

PACKAGE_TEMPLATE=$(cat ${SOURCE_DIR}/package.json.template)
touch ${TARGET_DIR}/package.json
echo "${PACKAGE_TEMPLATE}" | sed "s/APP_NAME/${APP_NAME}/g"  > ${TARGET_DIR}/package.json


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
mkdir ${TARGET_DIR}/app/public/img/dist
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
	git add ${TARGET_DIR}/etc/nginx/${APP_NAME}.conf
	git add ${TARGET_DIR}/${APP_NAME}.js
	git add ${TARGET_DIR}/lib/*
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



 
