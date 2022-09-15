import { useState } from "react";
import Box from "../Elements/Box/Box";
import Link from "next/link";
import { BASE_URL } from "../../../../../constants";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import styles from "./Profile.module.css";
import Modal from "../../../../Modal/Modal";
import { AiOutlineWhatsApp } from "react-icons/ai";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

const filtersSchema = { input: "" };
const appliedFiltersSchema = { input: false };

function Profiles(props) {
    const {
        fetchedStudents: { data, ...restData },
        token,
        searchData,
    } = props;
    const [students, setStudents] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [filters, setFilters] = useState(searchData);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState({
        email: "",
        gender: 0,
    });
    const router = useRouter();

    const readStudents = async (page = 1, avoidFilters = false) => {
        setLoading(true);

        // Constructing search parameters
        let searchQuery = "";
        let searchParams = {};
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    searchQuery += `${key}=${filters[key]}&`;
                    tempFilters[key] = true;
                    searchParams = {
                        ...searchParams,
                        [key]: filters[key],
                    };
                } else {
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/tkpanel/profiles`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/student/return?${searchQuery}`,
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

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readStudents(1, true);
        router.push({
            pathname: `/tkpanel/profiles`,
            query: {},
        });
    };

    const showFilters = () => {
        let values = Object.values(appliedFilters);
        for (let i = 0; i < values.length; i++) {
            let value = values[i];
            if (value) {
                return true;
            }
        }
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await readStudents();
    };

    return (
        <div>
            <BreadCrumbs substituteObj={{ profiles: "زبان آموز" }} />

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
                        <h3 className={"modal__title"}>جزئیات زبان آموز</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    جنسیت
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedStudent?.gender === 1
                                        ? "مرد"
                                        : "زن"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ایمیل
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedStudent?.email ? (
                                        <span style={{ fontSize: 15 }}>
                                            {selectedStudent?.email}
                                        </span>
                                    ) : (
                                        "-"
                                    )}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>سطح</span>
                                <span className={"modal__item-body"}>
                                    {selectedStudent?.academy
                                        ? selectedStudent?.academy
                                        : "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    کشور
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedStudent?.country_name || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    نحوه عضویت
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedStudent?.register_with || "-"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className={styles["search"]}>
                    <form
                        className={styles["search-wrapper"]}
                        onSubmit={handleSubmit}
                    >
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
                                        type="submit"
                                        className={`btn primary ${styles["btn"]}`}
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "در حال انجام ..."
                                            : "اعمال فیلتر"}
                                    </button>
                                    {showFilters() && (
                                        <button
                                            type="button"
                                            className={`btn danger-outline ${styles["btn"]}`}
                                            disabled={loading}
                                            onClick={() => removeFilters()}
                                        >
                                            {loading
                                                ? "در حال انجام ..."
                                                : "حذف فیلتر"}
                                        </button>
                                    )}
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
                                <th className="table__head-item">موجودی</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {students?.map((student) => (
                                <tr
                                    className="table__body-row"
                                    key={student.id}
                                >
                                    <td className="table__body-item">
                                        {student.name_family}
                                    </td>
                                    <td className="table__body-item">
                                        {student.mobile || "-"}
                                        {student.mobile && (
                                            <Link
                                                href={`https://wa.me/${student.mobile}`}
                                            >
                                                <a
                                                    className="whatsapp-icon"
                                                    target="_blank"
                                                >
                                                    <span>
                                                        <AiOutlineWhatsApp />
                                                    </span>
                                                </a>
                                            </Link>
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        {student.credit !== null
                                            ? `${Intl.NumberFormat().format(
                                                  student.credit
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/profiles/${student.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/dashboard/student/${student.id}`}
                                        >
                                            <a
                                                className={`action-btn primary`}
                                                target="_blank"
                                            >
                                                ورودی به پنل
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
                                        <Link
                                            href={`/tkpanel/multiSessionsList/logs/${student.id}?type=student`}
                                        >
                                            <a
                                                className={`action-btn warning`}
                                                target="_blank"
                                            >
                                                لاگ پیگیری
                                            </a>
                                        </Link>
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
