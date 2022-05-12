import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { BsDownload } from "react-icons/bs";
import styles from "./exportToCSV.module.css";

export const ExportCSV = ({ data, fileName, fileExtension }) => {
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

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

    return (
        <div className={styles["dl-btn-wrapper"]}>
            <button
                type="button"
                className={`btn success ${styles["dl-btn"]}`}
                onClick={() => exportToCSV(data, fileName)}
            >
                دانلود اکسل &nbsp;
                <BsDownload />
            </button>
        </div>
    );
};
