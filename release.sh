#!/bin/bash

USER=${GH_USER:-kenota}
REPO=${GH_REPO:-kommentator}
TARGET=${GH_BRANCH:-master}
PRELREASE=${PRERELEASE:-false}



if [ -z "$GH_TOKEN" ]
then
    echo "Please supply github token via GH_TOKEN environment variable"
    exit
fi

if [ -z "$1" ]
then
    echo "Please supply version: ./build.sh version"
    exit
fi


echo "Testing..."
go test
if (( $? )); then
    echo "Test failed. Please fix code" >&2
    exit 1
fi


VERSION=$1
COMMIT=$(git rev-parse HEAD)
RELNOTES=`cat RELNOTES.md`

echo "Tagging release"
git tag -a $VERSION -m "Release $VERSION"
git push --tags

xgo --targets=darwin-10.9/amd64,linux/amd64 -ldflags "-X main.version=$VERSION -X main.commit=$COMMIT" --out kommentator-$VERSION --pkg cli ./

res=`curl --user "$USER:$GH_TOKEN" -X POST https://api.github.com/repos/${USER}/${REPO}/releases \
-d "
{
  \"tag_name\": \"v$VERSION\",
  \"target_commitish\": \"$COMMIT\",
  \"name\": \"v$VERSION\",
  \"body\": \"$RELNOTES\",
  \"draft\": false,
  \"prerelease\": $PRELREASE
}"`

echo Create release result: ${res}
rel_id=`echo ${res} | python -c 'import json,sys;print(json.load(sys.stdin)["id"])'`

find . -type f -iname "kommentator-$VERSION*" | while read path
do
    FILENAME=$(basename $path)
    echo Uploading $FILENAME
    curl --user "$USER:$GH_TOKEN" -X POST https://uploads.github.com/repos/${USER}/${REPO}/releases/${rel_id}/assets?name=${FILENAME}\
 --header 'Content-Type: text/javascript ' --upload-file ./${FILENAME}
done

echo "Cleanup"
rm kommentator-$VERSION*