import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./Step2.module.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ImageCrop from "./ImageCrop/ImageCrop";
import tikkaaImg from "../../../../../../../public/images/tikka-default.png";
import {showMessage} from "../../../../../../../utility/Notification";

function GroupClassImage({getImage} ) {
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);

    // Crop variables
    const [uploadedImg, setUploadedImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({
        aspect: 16 / 16,
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [resultImg, setResultImg] = useState("");

    const handleSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                setUploadedImg(reader.result)
            );
            reader.readAsDataURL(e.target.files[0]);
            setOpenModal(true);
        }
    };



    // Crop image
    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    // Crop image
    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext("2d");
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );
    }, [completedCrop]);

    const handleCrop = async (canvas, crop) => {
        if (!crop || !canvas) {
            return;
        }

        // let dataURL = canvas.toDataURL("image/jpeg", 0.6);
        // let blob = dataURItoBlob(dataURL);
        // let formData = new FormData();
        // formData.append("image", blob);
        // console.log("formData ", formData.get("image"));
        // addProfileImage(blob); // Call api
        // addProfileImage(canvas, crop); // Call api
        // addProfileImage(formData.get("image") , dataURL); // Call api
        // addProfileImage(formData.get("image")); // Call api

        let dataURL = canvas.toDataURL("image/jpeg", 0.6);
        // console.log("dataURL")
        // console.log(dataURL)
        setResultImg(dataURL)
        // let FileType=blobToFile(dataURL,"groupClass");
        let FileType=new File([dataURL], "groupClass", {lastModified: new Date()});;
        // const myFile = new File([myBlob], 'image.jpeg', {
        //     type: myBlob.type,
        // });
        console.log(FileType)
        getImage(FileType)
        let blob = dataURItoBlob(dataURL);
        // console.log("blob")
        // console.log(canvas)
        // console.log(crop)
        // console.log(blob)
        let formData = new FormData();
        formData.append("image", blob);

            // getImage(blob)

        // setResultImg(blob)
        // await addProfileImage(formData); // Call api
        // await getProfileImage();
    };
 ;
 // console.log("resultImg")
 // console.log(resultImg)

    return (

                <div style={{display:"flex",flexDirection:"column"}}>
                    {/* Profile image */}
                    <div className={styles["step__profile-image"]}>
                        {resultImg ? (
                            <Image
                                blurDataURL={resultImg}
                                src={resultImg}
                                alt="Profile Image"
                                placeholder="blur"
                                width={128}
                                height={128}
                            />
                        ) : (
                            <Image
                                src={tikkaaImg}
                                alt="Profile Image"
                                placeholder="blur"
                                width={128}
                                height={128}
                            />
                        )}
                    </div>

                    {/* Upload image */}
                    <div className={styles["step__upload"]}>
                        <span className={styles["step__upload-desc"]}>
                            لطفا برای انتخاب عکس مناسب قوانین ما را دنبال کنید
                        </span>
                        <div className={styles["step__upload-row"]}>
                            <div
                                className={styles["step__upload-btn"]}
                                onChange={handleSelectFile}
                            >
                                <span>آپلود تصویر</span>
                                <input
                                    type="file"
                                    className={styles["step__upload-input"]}
                                    accept="image/png, image/jpg, image/jpeg"
                                ></input>
                            </div>
                            <span className={styles["step__upload-cond"]}>
                                فرمت مناسب JPEG یا PNG با حداکثر سایز 2MB است
                            </span>
                        </div>
                    </div>

                    {/* Image crop box */}
                    {openModal && (
                        <ImageCrop
                            show={openModal}
                            setter={setOpenModal}
                            disabled={
                                !completedCrop?.width || !completedCrop?.height
                            }
                            onClick={() =>
                                handleCrop(
                                    previewCanvasRef.current,
                                    completedCrop
                                )
                            }
                        >
                            <div className={`row ${styles["dir-ltr"]}`}>
                                <div className={`col-md-8`}>
                                    <ReactCrop
                                        src={uploadedImg}
                                        onImageLoaded={onLoad}
                                        crop={crop}
                                        onChange={(c) => setCrop(c)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        keepSelection={true}
                                        imageAlt="عکس پروفایل"
                                    />
                                </div>
                                <div
                                    className={`col-md-4 ${styles["dir-ltr"]}`}
                                >
                                    <div
                                        className={
                                            styles["modal__result-img-wrapper"]
                                        }
                                    >
                                        <canvas
                                            ref={previewCanvasRef}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </ImageCrop>
                    )}
                </div>

    );
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
        type: mimeString,
    });
}
function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

export default GroupClassImage;
