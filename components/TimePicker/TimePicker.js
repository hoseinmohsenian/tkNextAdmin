import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import styles from "./TimePicker.module.css";
const TimePicker = ({ value, onChange, className }) => {
    const isNight = !(value.hour >= 0 && value.hour < 12);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleUp = (type) => {
        if (type === "hour") {
            let hour = value.hour;

            if (hour + 1 >= 24) {
                hour = 0;
            } else {
                hour += 1;
            }
            onChange({ ...value, hour });
        } else if (type === "min") {
            let min = value.min;
            if (min + 30 >= 60) min = 0;
            else min += 30;
            onChange({
                ...value,
                min,
            });
        }
    };

    const handleChangeHour = (e) => {
        const { value } = e.target;

        if (value >= 0 && value < 24) {
            onChange({
                ...value,
                hour: value,
            });
        }
    };

    const handleDown = (type) => {
        if (type === "hour") {
            let hour = value.hour;
            if (hour - 1 < 0) {
                hour = 0;
            } else {
                hour -= 1;
            }
            onChange({ ...value, hour });
        } else if (type === "min") {
            let min = value.min;
            if (min - 30 < 0) min = 0;
            else min -= 30;
            onChange({
                ...value,
                min,
            });
        }
    };

    return (
        <>
            <input
                readOnly
                type="text"
                className={`form__input ${className}`}
                value={`${value.hour}:${value.min == 0 ? "00" : value.min}`}
                onClick={setShowTimePicker}
            />
            {showTimePicker && (
                <div className={styles.timePickerWrapper}>
                    <div className={styles["modal"]}>
                        <div>
                            <p
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
                            <div className={`col-xs-5 ${styles.time}`}>
                                <div>دقیقه</div>
                                <div className={styles["box-wrapper"]}>
                                    <div>
                                        <button
                                            type="button"
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
                                        value={value.min}
                                    />
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => handleDown("min")}
                                            className={`btn ${styles["arrow-btn"]}`}
                                        >
                                            <FaAngleDown />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div clasName={`col-xs-2 ${styles["devider"]}`}>
                                <span> : </span>
                            </div>
                            <div className={`col-xs-5 ${styles.time}`}>
                                <div>ساعت</div>
                                <div className={styles["box-wrapper"]}>
                                    <div>
                                        <button
                                            type="button"
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
                                        value={value.hour}
                                    />
                                    <div>
                                        <button
                                            type="button"
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
                            <button className={`btn primary ${styles["btn"]}`}>
                                تایید
                            </button>
                            <button
                                onClick={() => setShowTimePicker(false)}
                                className={`btn danger-outline ${styles["btn"]}`}
                            >
                                انصراف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TimePicker;
