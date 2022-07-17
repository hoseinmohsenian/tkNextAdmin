import styles from "./Step7.module.css";
import {useEffect,useState} from 'react'

function Step7({ token }) {
    const[video,setVideo]=useState(null)

    useEffect(()=>{
        getVideo()
    },[])




    const getVideo = async () => {
        try {
            const res =await fetch("https://api.barmansms.ir/api/teacher/profile/return/video", {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                } );
            const { data } = await res.json();

        
            console.log(data)
             setVideo(data)
        } catch (error) {
            console.log("error fetching cities", error);
        }
    };







    const handleSelectFile = async(e) => {
        const file = e.target.files[0];
        setVideo(URL.createObjectURL(file))
        const formData = new FormData();
        formData.append("video", file);
        // addVideo(formData);
        await addVideo(file);
    };




    const addVideo = async (formData) => {
        console.log(formData)
        try {
            const res = await fetch(
                "https://api.barmansms.ir/api/teacher/profile/add/video",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: formData,
                }
            );
            if (res.ok) {
                console.log(res)
            }
        } catch (error) {
            console.log("Error adding video ", error);
        }
    };

    return (
        <div>
            <div className="container">
                <div className={styles.box}>
                    <p>لطفا ویدئو معرفی خود را بارگذاری نمایید..</p>
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
                                />
                        </div>
                    </div>
                     <div className="d-flex justify-content-center">
                          <video src={video} style={{width:"40vw"}} className="mt-2"/>  
                     </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Step7;
