import { useState } from "react";
import styles from "./Table.module.css";

function Table(props) {
    const {
        title,
        newRowText,
        headers,
        inputTypes,
        inputNames,
        rows,
        setRows,
        onDelete,
        onAdd,
        read,
        onEdit,
        showAlert,
    } = props;

    // For selecting file
    const handleSelectFile = (e, rowInd) => {
        let file = e.target.files[0];
        let updated = [...rows];
        updated[rowInd] = { ...updated[rowInd], file: file };
        setRows(() => updated);
    };

    const addNewRow = () => {
        let newRow = inputNames.reduce(
            (acc, curr) => ((acc[curr] = ""), acc),
            {}
        );
        setRows((oldRows) => [...oldRows, newRow]);
    };

    const handleOnChange = (e, rowInd, name) => {
        let updated = [...rows];
        updated[rowInd] = { ...updated[rowInd], [name]: e.target.value };
        setRows(() => updated);
    };

    const deleteRow = (rowInd) => {
        let updated = [...rows];
        updated = updated.filter((item, ind) => rowInd !== ind);
        setRows(() => updated);
    };

    const onDeleteHandler = async (rowInd, id) => {
        deleteRow(rowInd);
        if (id) {
            await onDelete(id);
            showAlert(true, "danger", "این فیلد با موفقیت حذف شد");
        }
    };

    const onAddHandler = async (rowInd) => {
        console.log(rowInd)
        console.log(!isEmpty(rowInd))
        if (!isEmpty(rowInd)) {
            await onAdd(rowInd);
            await read();
            let message = "فیلد جدید با موفقیت اضافه شد";
            showAlert(true, "success", message);
        } else {
            alert("fill the fields");
        }
    };

    const onEditHandler = async (rowInd, id) => {
        if (!isEmpty(rowInd)) {
            await onEdit(rowInd, id);
            await read();
            let message = "این فیلد با موفقیت ویرایش شد";
            showAlert(true, "success", message);
        } else {
            alert("fill the fields");
        }
    };

    // Checks if the inputs are empty or not
    const isEmpty = (rowInd) => {
        console.log(rows[rowInd])
        for (let i = 0; i < inputNames?.length; i++) {
            let item = inputNames[i];
           
            console.log(item)
            console.log(rows[rowInd][item])

            if (!rows[rowInd][item]) {
                return true;
            }
        }
        return false;
    };

    return (
        <div className={styles.box}>
            {title !== undefined && (
                <h3 className={styles.box__title}>{title}</h3>
            )}

            <div className={styles["table__wrapper"]}>
                <table className={styles.table}>
                    <thead className={styles["table__head"]}>
                        <tr>
                            {headers?.map((item, ind) => (
                                <th
                                    className={styles["table__head-item"]}
                                    key={ind}
                                >
                                    {item}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={styles["table__body"]}>
                        {rows?.map((item, rowInd) => {
                            return (
                                <tr key={rowInd}>
                                    {inputTypes.map((type, typeInd) => {
                                        if (type === "text") {
                                            return (
                                                <td
                                                    className={
                                                        styles[
                                                            "table__body-item"
                                                        ]
                                                    }
                                                    key={typeInd}
                                                >
                                                    <input
                                                        type="text"
                                                        className={
                                                            styles[
                                                                "table__input"
                                                            ]
                                                        }
                                                        value={
                                                            item[
                                                                inputNames[
                                                                    typeInd
                                                                ]
                                                            ]
                                                        }
                                                        onChange={(e) =>
                                                            handleOnChange(
                                                                e,
                                                                rowInd,
                                                                inputNames[
                                                                    typeInd
                                                                ]
                                                            )
                                                        }
                                                    />
                                                </td>
                                            );
                                        }
                                        if (type === "time") {
                                            return (
                                                <td
                                                    className={
                                                        styles[
                                                            "table__body-item"
                                                        ]
                                                    }
                                                    key={typeInd}
                                                >
                                                    <span>از</span>
                                                    <select
                                                        className={
                                                            styles[
                                                                "table__select"
                                                            ]
                                                        }
                                                        value={item["start"]}
                                                        onChange={(e) =>
                                                            handleOnChange(
                                                                e,
                                                                rowInd,
                                                                "start"
                                                            )
                                                        }
                                                    >
                                                           <option value="1401">
                                                            1401
                                                        </option>
                                                         <option value="1400">
                                                            1400
                                                        </option>
                                                        <option value="1399">
                                                            1399
                                                        </option>
                                                        <option value="1398">
                                                            1398
                                                        </option>
                                                        <option value="1397">
                                                            1397
                                                        </option>
                                                        <option value="1396">
                                                            1396
                                                        </option>
                                                        <option value="1395">
                                                            1395
                                                        </option>
                                                        <option value="1394">
                                                            1394
                                                        </option>
                                                        <option value="1393">
                                                            1393
                                                        </option>
                                                        <option value="1392">
                                                            1392
                                                        </option>
                                                        <option value="1391">
                                                            1391
                                                        </option>
                                                        <option value="1390">
                                                            1390
                                                        </option>
                                                        <option value="1389">
                                                            1389
                                                        </option>
                                                        <option value="1388">
                                                            1388
                                                        </option>
                                                        <option value="1387">
                                                            1387
                                                        </option>
                                                        <option value="1386">
                                                            1386
                                                        </option>
                                                        <option value="1385">
                                                            1385
                                                        </option>
                                                        <option value="1384">
                                                            1384
                                                        </option>
                                                        <option value="1383">
                                                            1383
                                                        </option>
                                                        <option value="1382">
                                                            1382
                                                        </option>
                                                        <option value="1381">
                                                            1381
                                                        </option>
                                                        <option value="1380">
                                                            1380
                                                        </option>
                                                        <option value="1379">
                                                            1379
                                                        </option>
                                                        <option value="1378">
                                                            1378
                                                        </option>
                                                        <option value="1377">
                                                            1377
                                                        </option>
                                                        <option value="1376">
                                                            1376
                                                        </option>
                                                        <option value="1375">
                                                            1375
                                                        </option>
                                                        <option value="1374">
                                                            1374
                                                        </option>
                                                        <option value="1373">
                                                            1373
                                                        </option>
                                                        <option value="1372">
                                                            1372
                                                        </option>
                                                        <option value="1371">
                                                            1371
                                                        </option>
                                                        <option value="1370">
                                                            1370
                                                        </option>
                                                        <option value="1369">
                                                            1369
                                                        </option>
                                                        <option value="1368">
                                                            1368
                                                        </option>
                                                        <option value="1367">
                                                            1367
                                                        </option>
                                                        <option value="1366">
                                                            1366
                                                        </option>
                                                        <option value="1365">
                                                            1365
                                                        </option>
                                                        <option value="1364">
                                                            1364
                                                        </option>
                                                        <option value="1363">
                                                            1363
                                                        </option>
                                                        <option value="1362">
                                                            1362
                                                        </option>
                                                        <option value="1361">
                                                            1361
                                                        </option>
                                                        <option value="1360">
                                                            1360
                                                        </option>
                                                        <option value="1359">
                                                            1359
                                                        </option>
                                                        <option value="1358">
                                                            1358
                                                        </option>
                                                        <option value="1357">
                                                            1357
                                                        </option>
                                                    </select>

                                                    <span>تا</span>
                                                    <select
                                                        className={
                                                            styles[
                                                                "table__select"
                                                            ]
                                                        }
                                                        value={item["end"]}
                                                        onChange={(e) =>
                                                            handleOnChange(
                                                                e,
                                                                rowInd,
                                                                "end"
                                                            )
                                                        }
                                                    >
                                                        <option value="1401">
                                                            1401
                                                        </option>
                                                         <option value="1400">
                                                            1400
                                                        </option>
                                                        <option value="1399">
                                                            1399
                                                        </option>
                                                        <option value="1398">
                                                            1398
                                                        </option>
                                                        <option value="1397">
                                                            1397
                                                        </option>
                                                        <option value="1396">
                                                            1396
                                                        </option>
                                                        <option value="1395">
                                                            1395
                                                        </option>
                                                        <option value="1394">
                                                            1394
                                                        </option>
                                                        <option value="1393">
                                                            1393
                                                        </option>
                                                        <option value="1392">
                                                            1392
                                                        </option>
                                                        <option value="1391">
                                                            1391
                                                        </option>
                                                        <option value="1390">
                                                            1390
                                                        </option>
                                                        <option value="1389">
                                                            1389
                                                        </option>
                                                        <option value="1388">
                                                            1388
                                                        </option>
                                                        <option value="1387">
                                                            1387
                                                        </option>
                                                        <option value="1386">
                                                            1386
                                                        </option>
                                                        <option value="1385">
                                                            1385
                                                        </option>
                                                        <option value="1384">
                                                            1384
                                                        </option>
                                                        <option value="1383">
                                                            1383
                                                        </option>
                                                        <option value="1382">
                                                            1382
                                                        </option>
                                                        <option value="1381">
                                                            1381
                                                        </option>
                                                        <option value="1380">
                                                            1380
                                                        </option>
                                                        <option value="1379">
                                                            1379
                                                        </option>
                                                        <option value="1378">
                                                            1378
                                                        </option>
                                                        <option value="1377">
                                                            1377
                                                        </option>
                                                        <option value="1376">
                                                            1376
                                                        </option>
                                                        <option value="1375">
                                                            1375
                                                        </option>
                                                        <option value="1374">
                                                            1374
                                                        </option>
                                                        <option value="1373">
                                                            1373
                                                        </option>
                                                        <option value="1372">
                                                            1372
                                                        </option>
                                                        <option value="1371">
                                                            1371
                                                        </option>
                                                        <option value="1370">
                                                            1370
                                                        </option>
                                                        <option value="1369">
                                                            1369
                                                        </option>
                                                        <option value="1368">
                                                            1368
                                                        </option>
                                                        <option value="1367">
                                                            1367
                                                        </option>
                                                        <option value="1366">
                                                            1366
                                                        </option>
                                                        <option value="1365">
                                                            1365
                                                        </option>
                                                        <option value="1364">
                                                            1364
                                                        </option>
                                                        <option value="1363">
                                                            1363
                                                        </option>
                                                        <option value="1362">
                                                            1362
                                                        </option>
                                                        <option value="1361">
                                                            1361
                                                        </option>
                                                        <option value="1360">
                                                            1360
                                                        </option>
                                                        <option value="1359">
                                                            1359
                                                        </option>
                                                        <option value="1358">
                                                            1358
                                                        </option>
                                                        <option value="1357">
                                                            1357
                                                        </option>
                                                    </select>
                                                </td>
                                            );
                                        }
                                        if (type === "file") {
                                            return (
                                                <td
                                                    className={
                                                        styles[
                                                            "table__body-item"
                                                        ]
                                                    }
                                                    key={typeInd}
                                                >
                                                    <div
                                                        className={
                                                            styles[
                                                                "table__upload-btn"
                                                            ]
                                                        }
                                                        onChange={(e) =>
                                                            handleSelectFile(
                                                                e,
                                                                rowInd
                                                            )
                                                        }
                                                    >
                                                        <span>آپلود تصویر</span>
                                                        <input
                                                            type="file"
                                                            className={
                                                                styles[
                                                                    "table__upload-input"
                                                                ]
                                                            }
                                                            accept="image/png, image/jpg, image/jpeg"
                                                        ></input>
                                                    </div>
                                                </td>
                                            );
                                        }
                                    })}

                                    <td className={styles["table__body-item"]}>
                                        <button
                                            type="button"
                                            className={`${styles["row-btn"]} ${styles["row-btn--delete"]}`}
                                            onClick={() =>
                                                onDeleteHandler(
                                                    rowInd,
                                                    item?.id
                                                )
                                            }
                                        >
                                            X
                                        </button>
                                    </td>

                                    <td className={styles["table__body-item"]}>
                                        {item?.id ? (
                                            <button
                                                type="button"
                                                className={`${styles["row-btn"]} ${styles["row-btn--add"]}`}
                                                onClick={() =>
                                                    onEditHandler(
                                                        rowInd,
                                                        item?.id
                                                    )
                                                }
                                            >
                                                &#x270E;
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className={`${styles["row-btn"]} ${styles["row-btn--add"]}`}
                                                onClick={() =>
                                                    onAddHandler(rowInd)
                                                }
                                            >
                                                &#x2713;
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <button
                type="button"
                className={styles["new-row-btn"]}
                onClick={addNewRow}
            >
                <span>+</span>&nbsp;
                <span>{newRowText}</span>
            </button>
        </div>
    );
}

export default Table;
