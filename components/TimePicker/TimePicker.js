import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import styles from "./TimePicker.module.css";
const TimePicker = ({ time, setTime, className }) => {
    const [isNight, setIsNight] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (time.hour >= 0 && time.hour < 12) {
            setIsNight(false);
        } else {
            setIsNight(true);
        }
    }, [time.hour]);

    const handleUp = (type) => {
        if (type === "hour") {
            let hour = time.hour;

            if (hour + 1 >= 24) {
                hour = 0;
            } else {
                hour += 1;
            }
            setTime({ ...time, hour });
        } else if (type === "min") {
            let min = time.min;
            if (min + 30 >= 60) min = 0;
            else min += 30;
            setTime({
                ...time,
                min,
            });
        }
    };

    const handleChangeHour = (e) => {
        const { value } = e.target;

        if (value >= 0 && value < 24) {
            setTime({
                ...time,
                hour: value,
            });
        }
    };

    const handleDown = (type) => {
        if (type === "hour") {
            let hour = time.hour;
            if (hour - 1 < 0) {
                hour = 0;
            } else {
                hour -= 1;
            }
            setTime({ ...time, hour });
        } else if (type === "min") {
            let min = time.min;
            if (min - 30 < 0) min = 0;
            else min -= 30;
            setTime({
                ...time,
                min,
            });
        }
    };

    return (
        <div>
            <input
                readOnly
                type="text"
                className={className}
                value={`${time.hour}:${time.min == 0 ? "00" : time.min}`}
                onClick={setShowTimePicker}
            />
            {showTimePicker && (
                <div className={styles.timePickerWrapper}>
                    <div className={styles["modal"]}>
                        <div>
                            <p
                                c
                                style={{
                                    fontSize: "0.8rem",
                                    width: "70px",
                                    padding: "4px 0",
                                    textAlign: "center",
                                    background: isNight ? "#78909c" : "#90caf9",
                                    color: isNight ? "#fff" : "#fff",
                                    borderRadius: "16px",
                                    fontWeight: "700",
                                    margin: "0 auto",
                                }}
                            >
                                {isNight ? "بعد از ظهر" : " صبح"}
                            </p>
                        </div>
                        <div className={styles["container"]}>
                            <div className={`col-5 ${styles.time}`}>
                                <div>دقیقه</div>
                                <div className={styles["box-wrapper"]}>
                                    <div>
                                        <button
                                            onClick={() => handleUp("min")}
                                            className={`btn ${styles["arrow-btn"]}`}
                                        >
                                            <FaAngleUp />
                                        </button>
                                    </div>
                                    <input
                                        className={styles.timeInput}
                                        type="number"
                                        readOnly
                                        value={time.min}
                                    />
                                    <div>
                                        <button
                                            onClick={() => handleDown("min")}
                                            className={`btn ${styles["arrow-btn"]}`}
                                        >
                                            <FaAngleDown />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div clasName={`col-2 ${styles["devider"]}`}>
                                <span> : </span>
                            </div>
                            <div className={`col-5 ${styles.time}`}>
                                <div>ساعت</div>
                                <div className={styles["box-wrapper"]}>
                                    <div>
                                        <button
                                            onClick={() => handleUp("hour")}
                                            className={`btn ${styles["arrow-btn"]}`}
                                        >
                                            <FaAngleUp />
                                        </button>
                                    </div>
                                    <input
                                        className={styles.timeInput}
                                        type="number"
                                        onChange={handleChangeHour}
                                        value={time.hour}
                                    />
                                    <div>
                                        <button
                                            onClick={() => handleDown("hour")}
                                            className={`btn ${styles["arrow-btn"]}`}
                                        >
                                            <FaAngleDown />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={() => setShowTimePicker(false)}
                            className={styles["btn-container"]}
                        >
                            <button
                                className={`btn btn-primary ${styles["btn"]}`}
                            >
                                تایید
                            </button>
                            <button
                                onClick={() => setShowTimePicker(false)}
                                className={`btn btn-outline-danger ${styles["btn"]}`}
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
