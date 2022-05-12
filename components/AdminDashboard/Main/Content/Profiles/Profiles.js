import { useState } from "react";
import Box from "../Elements/Box/Box";
import Link from "next/link";
import { BASE_URL } from "../../../../../constants";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import styles from "./Profile.module.css";
import Modal from "../../../../Modal/Modal";

function Profiles(props) {
    const {
        fetchedStudents: { data, ...restData },
        token,
        searchData: fetchedData,
    } = props;
    const [students, setStudents] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [filters, setFilters] = useState(fetchedData);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState({
        email: "",
        gender: 0,
    });
    const router = useRouter();

    const readStudents = async (page = 1) => {
        setLoading(true);

        // Constructing search parameters
        let searchQuery = "";
        Object.keys(filters).forEach((key) => {
            if (Number(filters[key]) !== 0) {
                searchQuery += `${key}=${filters[key]}&`;
            }
        });
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/tkpanel/profiles`,
            query: { page },
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/student/search?${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const {
                data: { data, ...restData },
            } = await res.json();
            setStudents(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading students", error);
        }
    };

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    return (
        <div>
            <Box
                title="لیست  زبان آموزان"
                buttonInfo={{
                    name: "ایجاد زبان آموز",
                    url: "/tkpanel/profiles/create",
                    color: "primary",
                }}
            >
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={styles["modal__title"]}>
                            جزئیات زبان آموز
                        </h3>
                        <div className={styles["modal__wrapper"]}>
                            <span>
                                <b>جنسیت</b> :{" "}
                                {selectedStudent?.gender === 1 ? "مرد" : "زن"}
                            </span>
                            <span>
                                <b>ایمیل</b> :{" "}
                                {selectedStudent?.email ? (
                                    <span style={{ fontSize: 15 }}>
                                        {selectedStudent?.email}
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </span>
                            <span>
                                <b>کشور</b> :{" "}
                                {selectedStudent?.country_name || "-"}
                            </span>
                            <span>
                                <b>نحوه عضویت</b> :
                                {selectedStudent?.register_with ? (
                                    <span style={{ fontSize: 15 }}>
                                        {selectedStudent?.register_with}
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </span>
                        </div>
                    </Modal>
                )}

                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="input"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        جستجو :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="text"
                                            name="input"
                                            id="input"
                                            className="form__input form__input--ltr"
                                            onChange={handleOnChange}
                                            value={filters?.input}
                                            spellCheck={false}
                                            placeholder="جستجو بر اساس نام، شماره موبایل و ایمیل"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className={styles["btn-wrapper"]}>
                                    <button
                                        type="button"
                                        className={`btn primary ${styles["btn"]}`}
                                        disabled={loading}
                                        onClick={() => readStudents()}
                                    >
                                        {loading
                                            ? "در حال انجام ..."
                                            : "اعمال فیلتر"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام</th>
                                <th className="table__head-item">موبایل</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {students?.map((student) => (
                                <tr
                                    className="table__body-row"
                                    key={student?.id}
                                >
                                    <td className="table__body-item">
                                        {student?.name_family}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {student?.mobile}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/profiles/${student?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedStudent(student);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                        <button
                                            className={`action-btn warning`}
                                            onClick={() =>
                                                alert("Coming soooon:)")
                                            }
                                        >
                                            لاگ پیگیری
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {students.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={3}
                                    >
                                        زبان آموزی پیدا نشد !
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {students.length !== 0 && (
                    <Pagination read={readStudents} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default Profiles;
