import { useState } from "react";
import Box from "../../../../Elements/Box/Box";
import styles from "./GroupClass.module.css";
import FetchSearchSelect from "../../../../Elements/FetchSearchSelect/FetchSearchSelect";
import API from "../../../../../../../../api/index";
import Alert from "../../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import BreadCrumbs from "../../../../Elements/Breadcrumbs/Breadcrumbs";
import moment from "jalali-moment";
import DeleteModal from "../../../../../../../DeleteModal/DeleteModal";

const GCSchema = { id: "", name: "", family: "", mobile: "" };

function GroupClass({ fetchedClasses, organization_id, groupClassesList }) {
    const [classes, setClasses] = useState(fetchedClasses);
    const [selectedClass, setSelectedClass] = useState({});
    const [groupClasses, setGroupClasses] = useState(groupClassesList);
    const [selectedGC, setSelectedGC] = useState(GCSchema);
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(
        Array(fetchedClasses?.length).fill(false)
    );
    const [dModalVisible, setDModalVisible] = useState(false);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const searchGroupClasses = async (title) => {
        setLoading(true);
        try {
            const { data, status, response } = await API.get(
                `/admin/group-class?title=${title}`
            );

            if (status === 200) {
                setGroupClasses(data?.data?.data || []);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error searching groupClasses", error);
        }
        setLoading(false);
    };

    const addGroupClass = async () => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/organization/marketing/group-class`,
                JSON.stringify({
                    organization_id,
                    group_class_id: selectedGC.id,
                })
            );

            if (status === 200) {
                showAlert(true, "success", `کلاس گروهی باموفقیت اضافه شد`);
                await readclasses();
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding group class", error);
        }
        setLoading(false);
    };

    const addGroupClassHandler = async () => {
        if (selectedGC.id) {
            await addGroupClass();
        } else {
            showAlert(true, "danger", "لطفا کلاس گروهی‌ را انتخاب کنید");
        }
    };

    const readclasses = async () => {
        setLoading(true);
        try {
            const { data, status, response } = await API.get(
                `/admin/organization/marketing/group-class?organization_id=${organization_id}`
            );

            if (status === 200) {
                setClasses(data.data);
                setLoadings(Array(data.data?.length).fill(false));
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error reading classes", error);
        }
        setLoading(false);
    };

    const handleLoadings = (state, i) => {
        let temp = [...loadings];
        temp[i] = state;
        setLoadings(() => temp);
    };

    const deleteGroupClass = async (gc_id, i) => {
        handleLoadings(true, i);
        try {
            const { status, response } = await API.delete(
                `/admin/organization/marketing/group-class/${gc_id}`
            );

            if (status === 200) {
                const filteredClasses = classes.filter(
                    (cls) => cls.id !== gc_id
                );
                setClasses(filteredClasses);
                showAlert(true, "danger", "این کلاس گروهی حذف شد");
                setDModalVisible(false);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error deleting group class!", error);
        }
        handleLoadings(false, i);
    };

    return (
        <div>
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={searchGroupClasses}
            />
            <BreadCrumbs
                substituteObj={{
                    landing: "لندینگ",
                    company: "لندینگ شرکتی",
                    groupClass: "کلاس‌های گروهی",
                }}
            />

            <Box title="کلاس‌های گروهی لندینگ شرکتی">
                <DeleteModal
                    visible={dModalVisible}
                    setVisible={setDModalVisible}
                    title="حذف کلاس گروهی"
                    bodyDesc={`آیا از حذف کلاس گروهی «${selectedClass.group_class?.title}» اطمینان دارید؟`}
                    handleOk={() => {
                        deleteGroupClass(
                            selectedClass?.id,
                            selectedClass.index
                        );
                    }}
                    confirmLoading={loadings[selectedClass.index]}
                />

                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`${styles["search-row"]}`}>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="teacher_name"
                                    className={`form__label ${styles["search-label"]}`}
                                >
                                    کلاس‌های گروهی :
                                    <span className="form__star">*</span>
                                </label>
                                <div
                                    className={`form-control form-control-searchselect`}
                                >
                                    <FetchSearchSelect
                                        list={groupClasses}
                                        setList={setGroupClasses}
                                        placeholder="جستجو کنید"
                                        selected={selectedGC}
                                        id="id"
                                        displayKey="title"
                                        displayPattern={[
                                            {
                                                member: true,
                                                key: "title",
                                            },
                                        ]}
                                        setSelected={setSelectedGC}
                                        noResText="کلاسی پیدا نشد"
                                        listSchema={GCSchema}
                                        stylesProps={{
                                            width: "100%",
                                        }}
                                        background="#fafafa"
                                        onSearch={(value) =>
                                            searchGroupClasses(value)
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
                                    onClick={() => addGroupClassHandler()}
                                >
                                    {loading ? "در حال جستجو ..." : "افزودن"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">تاریخ شروع</th>
                                <th className="table__head-item">تاریخ ثبت</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((cls, i) => (
                                <tr className="table__body-row" key={cls.id}>
                                    <td className="table__body-item">
                                        {cls.group_class?.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.group_class?.title}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.group_class?.start_date
                                            ? moment(
                                                  cls.group_class.start_date
                                              ).format("DD MMM YYYY ساعت HH:mm")
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {cls?.created_at
                                            ? moment(cls?.created_at).format(
                                                  "DD MMM YYYY ساعت HH:mm"
                                              )
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            className={`action-btn danger`}
                                            onClick={() => {
                                                setSelectedClass({
                                                    ...cls,
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

                            {classes.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={5}
                                    >
                                        استادی وجود ندارد!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}

export default GroupClass;
