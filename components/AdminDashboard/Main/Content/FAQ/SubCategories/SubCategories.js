import Link from "next/link";
import Box from "../../Elements/Box/Box";
import styles from "./SubCategories.module.css";
import SearchSelect from "../../../../../SearchSelect/SearchSelect";
import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import API from "../../../../../../api/index";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

function SubCategories({ categories }) {
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({
        id: 0,
        parent_id: null,
        title: "",
        image: "",
        url: "",
        meta_desc: "",
        meta_key: "",
        meta_title: "",
        created_at: "",
        updated_at: "",
    });
    const [loading, setLoading] = useState(false);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const readSubCategories = async () => {
        try {
            setLoading(true);
            const { response, status, data } = await API.get(
                `admin/faq/category/sub/${selectedCategory.id}`
            );

            if (status === 200) {
                setSubCategories(data.data || []);
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
            setLoading(false);
        } catch (error) {
            console.log("Error reading sub-categories", error);
        }
    };

    const handleClick = async () => {
        if (selectedCategory.id) {
            await readSubCategories();
        } else {
            showAlert(true, "danger", "لطفا دسته‌بندی اصلی را انتخاب کنید");
        }
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    FaqSubCategory: "زیرگروه دسته بندی FAQ",
                }}
            />

            <Box
                title="زیرگروه دسته بندی FAQ"
                buttonInfo={{
                    name: "ایجاد زیرگروه دسته بندی",
                    url: "/tkpanel/FaqSubCategory/create",
                    color: "primary",
                }}
            >
                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={handleClick}
                />

                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`${styles["search-row"]}`}>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="publish_time"
                                    className={`form__label ${styles["search-label"]}`}
                                >
                                    دسته بندی اصلی :
                                    <span className="form__star">*</span>
                                </label>
                                <div
                                    className={`form-control form-control-searchselect`}
                                >
                                    <SearchSelect
                                        list={categories}
                                        defaultText="انتخاب کنید"
                                        selected={selectedCategory}
                                        displayKey="title"
                                        displayPattern={[
                                            { member: true, key: "title" },
                                        ]}
                                        setSelected={setSelectedCategory}
                                        noResText="یافت نشد"
                                        listSchema={{}}
                                        stylesProps={{
                                            width: "100%",
                                        }}
                                        background="#fafafa"
                                        id="id"
                                    />
                                </div>
                            </div>
                            <div className={styles["btn-wrapper"]}>
                                <button
                                    type="button"
                                    className={`btn primary ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={handleClick}
                                >
                                    {loading
                                        ? "در حال جستجو ..."
                                        : "اعمال فیلتر"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان</th>
                                <th
                                    className="table__head-item"
                                    style={{ fontSize: "1rem" }}
                                >
                                    url
                                </th>
                                <th className="table__head-item">عنوان متا</th>
                                <th className="table__head-item">تصویر</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {subCategories?.map((catg) => (
                                <tr className="table__body-row" key={catg?.id}>
                                    <td className="table__body-item">
                                        {catg.title}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.url}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.meta_title || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <img
                                            src={catg.image}
                                            alt={catg.title}
                                            style={{ height: 40, width: 40 }}
                                        />
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/FaqSubCategory/${catg.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {subCategories.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={5}
                                    >
                                        دسته بندی وجود ندارد.
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

export default SubCategories;
