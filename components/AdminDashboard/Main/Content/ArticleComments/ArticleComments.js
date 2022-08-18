import { useState } from "react";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import DeleteModal from "../../../../DeleteModal/DeleteModal";

function ArticleComments({ fetchedSpecialitys: { data, ...restData }, token }) {
    const [specialities, setSpecialities] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [filters, setFilters] = useState(filtersSchema);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [dModalVisible, setDModalVisible] = useState(false);
    const [selectedSpec, setSelectedSpec] = useState({});
    const router = useRouter();

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const deleteSpecialty = async (spec_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teaching/speciality/${spec_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "danger", "این تخصص حذف شد");
                setDModalVisible(false);
                await readSpecialtys();
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting specialty", error);
        }
    };

    const readSpecialtys = async (page = 1, avoidFilters = false) => {
        // Constructing search parameters
        let searchQuery = "";
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    searchQuery += `${key}=${filters[key]}&`;
                    tempFilters[key] = true;
                } else {
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/content/specialty`,
            query: { page },
        });

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/teaching/speciality?${searchQuery}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const {
                data: { data, ...restData },
            } = await res.json();
            setSpecialities(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading specialtys", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readSpecialtys(1, true);
        router.push({
            pathname: `/content/specialty`,
            query: {},
        });
    };

    const showFilters = () => {
        let values = Object.values(appliedFilters);
        for (let i = 0; i < values.length; i++) {
            let value = values[i];
            if (value) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await readSpecialtys();
    };

    return (
        <div>
            <Box
                title="لیست کامنت مقالات"
                buttonInfo={{
                    name: "ایجاد تخصص",
                    url: "/content/specialty/create",
                    color: "primary",
                }}
            >
                <DeleteModal
                    visible={dModalVisible}
                    setVisible={setDModalVisible}
                    title="حذف تخصص"
                    bodyDesc={`آیا از حذف تخصص «${selectedSpec.persian_name}» اطمینان دارید؟`}
                    handleOk={() => {
                        deleteSpecialty(selectedSpec?.id, selectedSpec.index);
                    }}
                    confirmLoading={loadings[selectedSpec.index]}
                />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام زبان</th>
                                <th className="table__head-item">
                                    عنوان فارسی
                                </th>
                                <th className="table__head-item">
                                    عنوان انگلیسی
                                </th>
                                <th
                                    className="table__head-item"
                                    style={{ fontSize: "1rem" }}
                                >
                                    url
                                </th>
                                <th className="table__head-item">توضیحات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {specialities?.map((spec, i) => (
                                <tr className="table__body-row" key={spec?.id}>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/specialty/${spec?.id}/edit`}
                                        >
                                            <a className="table__body-link">
                                                {spec?.language?.persian_name}
                                            </a>
                                        </Link>
                                    </td>
                                    <td className="table__body-item">
                                        {spec?.persian_name}
                                    </td>
                                    <td className="table__body-item">
                                        {spec?.english_name}
                                    </td>
                                    <td className="table__body-item">
                                        {spec?.url}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/specialty/${spec?.id}`}
                                        >
                                            <a className={`action-btn primary`}>
                                                افزودن&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/content/specialty/${spec?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() => {
                                                setSelectedSpec({
                                                    ...spec,
                                                    index: i,
                                                });
                                                setDModalVisible(true);
                                            }}
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        {specialities?.length === 0 && (
                            <tr className="table__body-row">
                                <td className="table__body-item" colSpan={5}>
                                    تخصصی پیدا نشد !
                                </td>
                            </tr>
                        )}
                    </table>
                </div>

                {specialities.length !== 0 && (
                    <Pagination read={readSpecialtys} pagData={pagData} />
                )}
            </Box>

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteSpecialty}
            />
        </div>
    );
}

export default ArticleComments;
