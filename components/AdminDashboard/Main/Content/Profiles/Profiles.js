import { useState } from "react";
import Box from "../Elements/Box/Box";
import Link from "next/link";
import { BASE_URL } from "../../../../../constants";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import styles from "./Profile.module.css";

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
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.input}
                                            autoComplete="off"
                                            spellCheck={false}
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
                                <th className="table__head-item">جنسیت</th>
                                <th className="table__head-item">موبایل</th>
                                <th className="table__head-item">ایمیل</th>
                                <th className="table__head-item">کشور</th>
                                <th className="table__head-item">نحوه عضویت</th>
                                <th className="table__head-item">اعتبار</th>
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
                                    <td className="table__body-item">
                                        {student?.gender === 1 ? "مرد" : "زن"}
                                    </td>
                                    <td className="table__body-item">
                                        {student?.mobile}
                                    </td>
                                    <td className="table__body-item">
                                        {student?.email || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {student?.country_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {student?.register_with}
                                    </td>
                                    <td className="table__body-item">
                                        {student?.credit || "-"}
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
                                            className={`action-btn warning`}
                                            onClick={() => alert(":)")}
                                        >
                                            لاگ پیگیری
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Box>

            {students && <Pagination read={readStudents} pagData={pagData} />}
        </div>
    );
}

export default Profiles;
