import { useState } from "react";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";
import Box from "../Elements/Box/Box";
// import Pagination from "../Pagination/Pagination";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";
import { useRouter } from "next/router";
import styles from "./Help.module.css";

const filtersSchema = { helpUrl: "" };
const appliedFiltersSchema = { helpUrl: false };

function Help({ fetchedList: data, token, searchData }) {
    const [list, setList] = useState(data);
    // const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [filters, setFilters] = useState(searchData);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const deleteItem = async (id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(`${BASE_URL}/admin/help/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "danger", "این راهنما حذف شد");
                await readList();
            }
        } catch (error) {
            console.log("Error deleting help", error);
        }
        temp = [...loadings];
        temp[i] = false;
        setLoadings(() => temp);
    };

    const readList = async (avoidFilters = false) => {
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

        router.push({
            pathname: `/tkpanel/help/admin`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/help/search/url?${searchQuery}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const {
                // data: { data, ...restData },
                data,
            } = await res.json();
            // setPagData(restData);
            setList(data);
        } catch (error) {
            console.log("Error reading help list", error);
        }
        setLoading(false);
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
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
        readStudents(true);
        router.push({
            pathname: `/tkpanel/help/admin`,
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

        await readList();
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    help: "صحفات سایت",
                    admin: "راهنما",
                }}
            />
            <Box
                title="راهنما"
                buttonInfo={{
                    name: "ایجاد",
                    url: "/tkpanel/help/admin/create",
                    color: "primary",
                }}
            >
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
                                        htmlFor="helpUrl"
                                        className={`form__label`}
                                    >
                                        URL :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="text"
                                            name="helpUrl"
                                            id="helpUrl"
                                            className="form__input form__input--ltr"
                                            onChange={handleOnChange}
                                            value={filters?.helpUrl}
                                            spellCheck={false}
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
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">URL</th>
                                <th className="table__head-item">
                                    وضعیت ریدایرکت
                                </th>
                                <th className="table__head-item">
                                    URL ریدایرکت
                                </th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {list?.map((item, i) => (
                                <tr className="table__body-row" key={item?.id}>
                                    <td className="table__body-item">
                                        {item.title}
                                    </td>
                                    <td className="table__body-item">
                                        {item.url}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.redirect_status === 1
                                            ? "1"
                                            : "0"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.redirect_url || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/help/admin/${item?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteItem(item?.id, i)
                                            }
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* {list.length !== 0 && (
                    <Pagination read={readList} pagData={pagData} />
                )} */}
            </Box>

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteItem}
            />
        </div>
    );
}

export default Help;
