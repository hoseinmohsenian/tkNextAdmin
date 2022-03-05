import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import Modal from "../../../../../Modal/Modal";
import AddCommission from "./AddCommission/AddCommission";

function Commission({ fetchedCommissions: { data, ...restData }, token }) {
    const [commissions, setCommissions] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const removeCommissionFromList = (commission_id) => {
        setCommissions(() =>
            commissions.filter((cms) => cms.id !== commission_id)
        );
    };

    const deleteCommission = async (commission_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/changeable/commission/${commission_id}`,
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
                let message = "این کمیسیون حذف شد";
                showAlert(true, "danger", message);
                removeCommissionFromList(commission_id);
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting commission", error);
        }
    };

    const readTeachers = async (page = 1) => {
        let searchParams = {};

        const isFilterEnabled = (key) =>
            Number(filters[key]) !== 0 &&
            filters[key] !== undefined &&
            filters[key];

        // Constructing search parameters
        let searchQuery = "";
        Object.keys(filters).forEach((key) => {
            if (Number(filters[key]) !== 0) {
                if (key === "draft" && filters["draft"]) {
                    searchQuery += `draft=1&`;
                } else {
                    searchQuery += `${key}=${filters[key]}&`;
                }
            }
        });
        searchQuery += `page=${page}`;

        if (isFilterEnabled("name")) {
            searchParams = {
                ...searchParams,
                name: filters?.name,
            };
        }
        if (isFilterEnabled("email")) {
            searchParams = {
                ...searchParams,
                email: filters?.email,
            };
        }
        if (isFilterEnabled("mobile")) {
            searchParams = {
                ...searchParams,
                mobile: filters?.mobile,
            };
        }
        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/teachers`,
            query: searchParams,
        });

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/teacher/search?${searchQuery}`,
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
            setTeachers(data);
            setFormData(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading teachers", error);
        }
    };

    const changeCommission = async (e, teacher_id, i) => {
        try {
            let temp = [...loadings];
            temp[i] = true;
            setLoadings(() => temp);

            const res = await fetch(
                `${BASE_URL}/admin/teacher/commission/${teacher_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ commission: e.target.value }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `کمیسیون به ${e.target.value} تغییر کرد`;
                showAlert(true, "success", message);
            }

            temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error changing commission", error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteCommission}
            />

            <Box
                title="لیست کمیسیون متغیر استاد"
                buttonInfo={{
                    name: "تعریف کمیسیون",
                    onClick: openModal,
                    color: "primary",
                }}
            >
                <Modal
                    show={isModalOpen}
                    setter={setIsModalOpen}
                    showHeader
                    padding
                >
                    <AddCommission
                        showAlert={showAlert}
                        setIsModalOpen={setIsModalOpen}
                        token={token}
                    />
                </Modal>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">زبان آموز</th>
                                <th className="table__head-item">کمیسیون</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {commissions?.map((commission, i) => (
                                <tr
                                    className="table__body-row"
                                    key={commission?.id}
                                >
                                    <td className="table__body-item">
                                        {commission?.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {commission?.student_name}
                                    </td>
                                    <td className="table__body-item">
                                        {commission?.commission}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn warning`}
                                            onClick={() =>
                                                alert("edit commission")
                                            }
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteCommission(
                                                    commission?.id,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {commissions.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={4}
                                    >
                                        کمیسیونی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>

            {commissions.length !== 0 && (
                <Pagination read={readTeachers} pagData={pagData} />
            )}
        </div>
    );
}

export default Commission;
