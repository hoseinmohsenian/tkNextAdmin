import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./Step2.module.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ImageCrop from "./ImageCrop/ImageCrop";
import tikkaaImg from "../../../../../../../../../public/images/tikka-default.png";
import Alert from "../../../../../../../../Alert/Alert";

function Step2({ token, alertData, showAlert, BASE_URL }) {
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

    const addProfileImage = async (image) => {
        try {
            const res = await fetch(`${BASE_URL}/teacher/profile/add/image`, {
                method: "POST",
                body: image,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(
                    true,
                    "success",
                    "عکس پروفایل شما با موفقیت ویرایش شد"
                );
                // router.push("/tutor/step2");
            }
        } catch (error) {
            console.log("Error adding profile image ", error);
        }
    };

    const getProfileImage = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/return/image`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setResultImg(data?.image);
        } catch (error) {
            console.log("Error getting profile image ", error);
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

        let dataURL = canvas.toDataURL("image/jpeg", 0.6);
        let blob = dataURItoBlob(dataURL);
        let formData = new FormData();
        formData.append("image", blob);
        await addProfileImage(formData); // Call api
        await getProfileImage();
    };

    // Reading image
    useEffect(() => {
        if (token) {
            getProfileImage();
        }
    }, [token]);

    return (
        <div className={styles.step}>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSelectFile}
            />

            <div className={styles.step__box}>
                <div className={styles["step__box-wrapper"]}>
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
            </div>
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

export default Step2;
