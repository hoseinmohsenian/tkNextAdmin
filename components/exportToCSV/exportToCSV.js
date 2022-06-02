import { useState } from "react";
import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { BsDownload } from "react-icons/bs";
import styles from "./exportToCSV.module.css";
import Alert from "../Alert/Alert";

export const ExportCSV = ({
    data,
    fileName,
    fileExtension,
    onClick,
    disabled = false,
    errorOnEmpry,
    downloadOnEmpty = true,
}) => {
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });

    const exportToCSV = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const wb = {
            Sheets: { data: worksheet },
            SheetNames: ["data"],
        };
        worksheet["!cols"] = [{ wch: 10 }, { wch: 10 }, { wch: 11 }];

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blobData = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(blobData, fileName + "." + fileExtension);
    };

    const onClickHandler = () => {
        if (data.length === 0 && errorOnEmpry) {
            showAlert(true, "danger", errorOnEmpry);
        }
        if (data.length !== 0 || (data.length === 0 && downloadOnEmpty)) {
            exportToCSV(data, fileName);
        }
        if (onClick) {
            onClick();
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div className={styles["dl-btn-wrapper"]}>
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={onClickHandler}
            />
            <button
                type="button"
                className={`btn success ${styles["dl-btn"]} ${
                    disabled ? styles["dl-btn--disabled"] : undefined
                }`}
                onClick={onClickHandler}
                disabled={disabled}
            >
                دانلود اکسل &nbsp;
                <BsDownload />
            </button>
        </div>
    );
};
