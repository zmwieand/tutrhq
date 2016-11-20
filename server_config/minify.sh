#!/bin/bash
for file in `find ../app/public/ -name "*.js" -o -name "*.css"`
do
#echo "Compressing $file …"
    if [[ $file != *.min.* ]]
    then
	if [[ $file == *.css ]]
        then
            echo $file
            outputname=`echo $file | sed -e 's/\.[^.]*$//'`.min.css
            type="css"
        fi

        if [[ $file == *.js ]]
        then
            echo $file
            outputname=`echo $file | sed -e 's/\.[^.]*$//'`.min.js
            type="js"
        fi
        yui-compressor --type $type $file -o $outputname
    fi
done
