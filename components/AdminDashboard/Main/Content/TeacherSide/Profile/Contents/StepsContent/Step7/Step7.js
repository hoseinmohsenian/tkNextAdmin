import styles from "./Step7.module.css";
import { useEffect, useState } from "react";
import Alert from "../../../../../../../../Alert/Alert";

function Step7({ token, BASE_URL, alertData, showAlert }) {
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);

    const getVideo = async () => {
        setPageLoaded(false);
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/return/video`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setVideo(data);
        } catch (error) {
            console.log("error fetching cities", error);
        }
        setPageLoaded(true);
    };

    const handleSelectFile = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("video", file);
        await addVideo(formData);
    };

    const addVideo = async (formData) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/teacher/profile/add/video`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "ویدئو معرفی با موفقیت آپلود شد");
                await getVideo();
                await acceptRules();
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding video ", error);
        }
        setLoading(false);
    };

    const acceptRules = async () => {
        try {
            const res = await fetch(`${BASE_URL}/teacher/profile/add/rule`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                },
            });
        } catch (error) {
            console.log("Error accepting the rules", error);
        }
    };

    useEffect(() => {
        getVideo();
    }, []);

    return (
        <div className={styles.box}>
            <Alert {...alertData} removeAlert={showAlert} envoker={addVideo} />

            {pageLoaded ? (
                <>
                    <p>لطفا ویدئو معرفی خود را بارگذاری نمایید.</p>
                    <div className={styles["box__btn-wrapper"]}>
                        <div
                            className={styles["step__upload-btn"]}
                            onChange={handleSelectFile}
                        >
                            <span>آپلود ویدئو</span>
                            <input
                                type="file"
                                className={styles["step__upload-input"]}
                                accept="video/*"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className={styles.step__content}>
                        {video ? (
                            <video
                                src={video}
                                style={{ width: "40vw" }}
                                className="mt-2"
                                controls
                            />
                        ) : (
                            <span
                                style={{ fontSize: "1.05rem" }}
                                className="danger-color"
                            >
                                ویدئویی وجود ندارد!
                            </span>
                        )}

                        {loading && (
                            <span
                                style={{ fontSize: "1.05rem", marginTop: 10 }}
                                className="primary-color"
                            >
                                درحال آپلود ویدئو. لطفا صبر کنید.
                            </span>
                        )}
                    </div>
                </>
            ) : (
                <div>
                    <h2>در حال خواندن اطلاعات...</h2>
                </div>
            )}
        </div>
    );
}

export default Step7;
