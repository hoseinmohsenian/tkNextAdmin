import styles from "./Table.module.css";
import moment from "jalali-moment";

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
    moment.locale("fa");
    const m = moment();
    const diff = m.year() - 1356;

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
        if (inputNames?.indexOf("start") !== -1) {
            newRow["start"] = newRow["end"] = m.year();
        }
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
        if (!isEmpty(rowInd)) {
            await onAdd(rowInd);
            await read();
            let message = "فیلد جدید با موفقیت اضافه شد";
            showAlert(true, "success", message);
        } else {
            alert("لطفا فیلدها را تکمیل کنید");
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
        for (let i = 0; i < inputNames?.length; i++) {
            let name = inputNames[i];
            if (!rows[rowInd][name] && name !== "file") {
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
                        {rows.map((item, rowInd) => {
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
                                                            ] || ""
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
                                                        value={
                                                            item["start"] || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOnChange(
                                                                e,
                                                                rowInd,
                                                                "start"
                                                            )
                                                        }
                                                    >
                                                        {[...Array(diff)].map(
                                                            (year, k) => {
                                                                return (
                                                                    <option
                                                                        value={
                                                                            m.year() -
                                                                            k
                                                                        }
                                                                        key={k}
                                                                    >
                                                                        {m.year() -
                                                                            k}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>

                                                    <span>تا</span>
                                                    <select
                                                        className={
                                                            styles[
                                                                "table__select"
                                                            ]
                                                        }
                                                        value={
                                                            item["end"] || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOnChange(
                                                                e,
                                                                rowInd,
                                                                "end"
                                                            )
                                                        }
                                                    >
                                                        {[...Array(diff)].map(
                                                            (year, k) => {
                                                                return (
                                                                    <option
                                                                        value={
                                                                            m.year() -
                                                                            k
                                                                        }
                                                                        key={k}
                                                                    >
                                                                        {m.year() -
                                                                            k}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
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
