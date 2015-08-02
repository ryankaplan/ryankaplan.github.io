declare -a MODULES_TO_COMPILE=(\
    "animation_user_drawn_pentagon" \
    "animation_random_quad_and_midpoint_construction" \
)

SCRIPTS_FOLDER_NAME='scripts'
COMPILED_SCRIPTS_FOLDER_NAME='compiled'

clean () {
    rm -rf "$COMPILED_SCRIPTS_FOLDER_NAME"
}

build () {
    for JS_FILE_NAME in "${MODULES_TO_COMPILE[@]}"
    do
        SCRIPT_PATH="$SCRIPTS_FOLDER_NAME/$JS_FILE_NAME.js"
        pushd scripts;
        r.js -o baseUrl=. \
            name="${JS_FILE_NAME}" \
            out="../$COMPILED_SCRIPTS_FOLDER_NAME/${JS_FILE_NAME}_compiled.js" \
            optimize=none # Do not minify. Want to debug!
        popd;
    done
}

clean
build
