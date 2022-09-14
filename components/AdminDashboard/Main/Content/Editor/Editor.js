import React from "react";
import "suneditor/dist/css/suneditor.min.css";
import styles from "./Editor.module.css";
import SunEditor from "suneditor-react";
import { BASE_URL } from "../../../../../constants";

function Editor(props) {
    const {
        value,
        setValue,
        disabled,
        token,
        uploadImageUrl,
        placeholder = "توضیحات",
    } = props;
    const addImage = async (fd) => {
        try {
            const res = await fetch(`${BASE_URL}${uploadImageUrl}`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            return data;
        } catch (error) {
            console.log("Error adding image for article", error);
        }
    };

    const handleImageUploadError = (errorMessage, result) => {
        console.log(errorMessage, result);
    };

    // const handleImageUploadBefore = async (files, info, uploadHandler) => {
    //     let images = [];

    //     for (const file of files) {
    //         const fd = new FormData();
    //         fd.append("image", file);
    //         const url = await addImage(fd);
    //         let image = {
    //             url: url,
    //             name: file.name,
    //             size: file.size,
    //         };

    //         images.push(image);
    //     }

    //     const response = {
    //         result: images,
    //     };
    //     uploadHandler(response);
    //     return undefined;
    // };

    const handleImageUploadBefore = (files, info, uploadHandler) => {
        (async () => {
            let images = [];

            for (const file of files) {
                const fd = new FormData();
                fd.append("image", file);
                const url = await addImage(fd);
                let image = {
                    url: url,
                    name: file.name,
                    size: file.size,
                };

                images.push(image);
            }

            const response = {
                result: images,
            };
            uploadHandler(response);
        })();
        uploadHandler();
    };

    return (
        <div>
            <div className={styles.editor__wrapper}>
                <SunEditor
                    lang="en"
                    name="Tikkaa Editor"
                    data={value}
                    onChange={(data) => {
                        setValue(() => data);
                    }}
                    disable={disabled}
                    onImageUploadError={handleImageUploadError}
                    onImageUploadBefore={handleImageUploadBefore}
                    width="100%"
                    height="100%"
                    setOptions={{
                        showPathLabel: false,
                        width: "100%",
                        minWidth: "100%",
                        maxWidth: "100%",
                        height: "100%",
                        minHeight: "200px",
                        placeholder: placeholder,
                        requestHeaders: {
                            Authorization: `Bearer ${token}`,
                            "Access-Control-Allow-Origin": "*",
                        },
                        mode: "classic",
                        rtl: true,
                        katex: "window.katex",
                        imageMultipleFile: true,
                        videoFileInput: false,
                        tabDisable: false,
                        font: [
                            "Lalezar",
                            "IranianSans",
                            "Arial",
                            "tahoma",
                            "Courier New,Courier",
                        ],
                        templates: [
                            {
                                name: "Template-1",
                                html: "<p>قالب شماره یک</p>",
                            },
                            {
                                name: "Template-2",
                                html: "<p>قالب شماره دو</p>",
                            },
                        ],
                        buttonList: [
                            [
                                "formatBlock",
                                "font",
                                "fontSize",
                                "fontColor",
                                "align",
                                "paragraphStyle",
                                "outdent",
                                "indent",

                                "bold",
                                "underline",
                                "italic",
                                "strike",
                                "subscript",
                                "superscript",
                                "blockquote",

                                "table",
                                "link",
                                "image",
                                "video",
                                "audio",

                                "undo",
                                "redo",
                                "hiliteColor",
                                "textStyle",
                                "removeFormat",
                                "horizontalRule",
                                "list",
                                "lineHeight",
                                "fullScreen",
                                "showBlocks",
                                "preview",
                                "print",
                                "save",
                                "template",
                                "codeView",
                            ],
                        ],
                        "lang(In nodejs)": "en",
                        // iframe: true,
                        // iframeAttributes: {
                            // scrolling: "no",
                        // },
                        // iframeCSSFileName: "",
                    }}
                    setContents={value}
                />
            </div>
        </div>
    );
}

export default Editor;
