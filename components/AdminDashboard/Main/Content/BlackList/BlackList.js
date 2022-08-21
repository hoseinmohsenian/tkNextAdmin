import { useState } from "react";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import Alert from "../../../../Alert/Alert";
import { useRouter } from "next/router";
import FetchSearchSelect from "../Elements/FetchSearchSelect/FetchSearchSelect";
import styles from "./BlackList.module.css";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";
import API from "../../../../../api/index";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

const studentSchema = { id: "", name_family: "", mobile: "", email: "" };

function BlackList({ fetchedList: { data, ...restData } }) {
    const [users, setUsers] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(studentSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));

    const readBlackList = async (page = 1) => {
        let searchParams = {};

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/blackLists`,
            query: searchParams,
        });

        try {
            const { data, status, response } = await API.get(
                `/admin/management/block-user?page=${page}`
            );

            if (status === 200) {
                const { data: list, ...restData } = data?.data;
                setUsers(list);
                setPagData(restData);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }

            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading black list", error);
        }
    };

    const blockUserHandler = async () => {
        if (selectedStudent.id) {
            await blockUser();
            await readBlackList();
        } else {
            showAlert(true, "danger", "لطفا زبان آموز را انتخاب نمایید");
        }
    };

    const handleLoadings = (state, i) => {
        let temp = [...loadings];
        temp[i] = state;
        setLoadings(() => temp);
    };

    const unblockUser = async (user_id, i) => {
        handleLoadings(true, i);
        try {
            const { response, status } = await API.post(
                `/admin/management/unblock-user/${user_id}`
            );

            if (status === 200) {
                const filteredUsers = users.filter(
                    (user) => user.id !== user_id
                );
                setUsers(filteredUsers);
                showAlert(true, "success", "زبان آموز آنبلاک شد");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error unblocking user", error);
        }
        handleLoadings(false, i);
    };

    const searchStudents = async (student_name) => {
        setLoading(true);
        try {
            const { data, status, response } = await API.get(
                `/admin/student/search?input=${student_name}`
            );

            if (status === 200) {
                setStudents(data?.data?.data || []);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error searching teachers", error);
        }
        setLoading(false);
    };

    const blockUser = async () => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/management/block-user/${selectedStudent.id}`
            );

            if (status === 200) {
                showAlert(
                    true,
                    "success",
                    `${selectedStudent.name_family} بلاک شد`
                );
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error blocking user", error);
        }
        setLoading(false);
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    blackLists: "لیست سیاه",
                }}
            />
            <Box title="لیست سیاه">
                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`${styles["search-row"]}`}>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="teacher_name"
                                    className={`form__label ${styles.form__label}`}
                                >
                                    زبان آموز :
                                    <span className="form__star">*</span>
                                </label>
                                <div
                                    className={`form-control form-control-searchselect`}
                                >
                                    <FetchSearchSelect
                                        list={students}
                                        setList={setStudents}
                                        placeholder="جستجو کنید"
                                        selected={selectedStudent}
                                        id="id"
                                        displayKey="name_family"
                                        displayPattern={[
                                            {
                                                member: true,
                                                key: "name_family",
                                            },
                                            { member: false, key: " - " },
                                            { member: true, key: "mobile" },
                                        ]}
                                        setSelected={setSelectedStudent}
                                        noResText="زبان آموزی پیدا نشد"
                                        listSchema={studentSchema}
                                        stylesProps={{
                                            width: "100%",
                                        }}
                                        background="#fafafa"
                                        onSearch={(value) =>
                                            searchStudents(value)
                                        }
                                        openBottom={true}
                                    />
                                </div>
                            </div>
                            <div className={styles["btn-wrapper"]}>
                                <button
                                    type="button"
                                    className={`btn primary ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={() => blockUserHandler()}
                                >
                                    {loading ? "در حال جستجو ..." : "بلاک"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={unblockUser}
                />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                <th className="table__head-item">شماره تماس</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {users?.map((user, i) => (
                                <tr className="table__body-row" key={user?.id}>
                                    <td className="table__body-item">
                                        {user.name_family || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {user.mobile || "-"}
                                        {user.mobile && (
                                            <Link
                                                href={`https://wa.me/${user.mobile}`}
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
                                        <button
                                            className={`action-btn warning`}
                                            onClick={() =>
                                                unblockUser(user.id, i)
                                            }
                                            disabled={loadings[i]}
                                        >
                                            آنبلاک
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={4}
                                    >
                                        زبان آموزی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {users.length !== 0 && (
                    <Pagination read={readBlackList} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default BlackList;
