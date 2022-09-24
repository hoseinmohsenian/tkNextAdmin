import { useEffect, useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import styles from "../CreateUser/CreateUser.module.css";
import SearchMultiSelect from "../../../../../SearchMultiSelect/SearchMultiSelect";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

const permissionsSchema = {
    id: "",
    persian_name: "",
    english_name: "",
    created_at: "",
    updated_at: "",
};

function CreateUser({ token, permissions, admin }) {
    const [formData, setFormData] = useState(admin);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.email.trim()) {
            const fd = new FormData();
            if (formData.email && formData.email !== admin.email) {
                fd.append("email", formData.email);
            }
            if (formData.password && formData.password !== admin.password) {
                fd.append("password", formData.password);
            }
            if (Number(formData.status) !== admin.status) {
                fd.append("status", Number(formData.status));
            }
            if (formData.name && formData.name !== admin.name) {
                fd.append("name", formData.name);
            }
            if (formData.desc && formData.desc !== admin.desc) {
                fd.append("desc", formData.desc);
            }
            if (formData.image && typeof formData.image !== "string") {
                fd.append("image", formData.image);
            }
            for (let i = 0; i < selectedPermissions.length; i++) {
                fd.append(`permission[${i}]`, selectedPermissions[i].id);
            }
            await editAdmin(fd);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const editAdmin = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/management/edit/${formData.id}`,
                {
                    method: "POST",
                    body: fd,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "success", "ادمین با موفقیت ویرایش شد");
                router.push("/tkpanel/users");
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error editing admin", error);
        }
    };

    const handleSelectFile = (e, name) => {
        let file = e.target.files[0];
        setFormData({ ...formData, [name]: file });
    };

    const deleteArticleCategory = async (permission_id) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/management/permission?admin_id=${formData.id}&permission_id=${permission_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (!res.ok) {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error deleting permission", error);
        }
    };

    useEffect(() => {
        setSelectedPermissions(admin.permission);
    }, []);

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />
            <BreadCrumbs
                substituteObj={{
                    users: "ادمین ها",
                    edit: "ویرایش",
                }}
            />

            <Box title="ویرایش ادمین">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="name" className="form__label">
                            نام :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                                value={formData.name || ""}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="email" className="form__label">
                            ایمیل :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                required
                                value={formData.email}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password" className="form__label">
                            پسورد :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                spellCheck={false}
                                value={formData.password || ""}
                            />
                        </div>
                    </div>
                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="status"
                                    className={`form__label`}
                                >
                                    وضعیت :<span className="form__star">*</span>
                                </label>
                                <div className="form-control form-control-radio">
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="active"
                                            className="radio-title"
                                        >
                                            فعال
                                        </label>
                                        <input
                                            type="radio"
                                            name="status"
                                            onChange={handleOnChange}
                                            value={1}
                                            checked={
                                                Number(formData.status) === 1
                                            }
                                            id="active"
                                            required
                                        />
                                    </div>
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="inactive"
                                            className="radio-title"
                                        >
                                            غیرفعال
                                        </label>
                                        <input
                                            type="radio"
                                            name="status"
                                            onChange={handleOnChange}
                                            value={0}
                                            checked={
                                                Number(formData.status) === 0
                                            }
                                            id="inactive"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label htmlFor="image" className="form__label">
                                    تصویر :
                                </label>
                                <div
                                    className="upload-btn"
                                    onChange={(e) =>
                                        handleSelectFile(e, "image")
                                    }
                                >
                                    <span>آپلود تصویر</span>
                                    <input
                                        type="file"
                                        className="upload-input"
                                        accept="image/png, image/jpg, image/jpeg"
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`input-wrapper ${styles["input-wrapper"]}`}>
                        <label htmlFor="permissions" className="form__label">
                            دسترسی ها :
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <SearchMultiSelect
                                list={permissions}
                                defaultText="انتخاب کنید"
                                selected={selectedPermissions}
                                displayKey="persian_name"
                                id="id"
                                setSelected={setSelectedPermissions}
                                noResText="یافت نشد"
                                listSchema={permissionsSchema}
                                displayPattern={[
                                    {
                                        member: true,
                                        key: "persian_name",
                                    },
                                ]}
                                stylesProps={{
                                    width: "100%",
                                }}
                                background="#fafafa"
                                max={24}
                                openBottom={false}
                                onRemove={deleteArticleCategory}
                                showAlert={showAlert}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="desc" className="form__label">
                            توضیحات کوتاه :<span className="form__star">*</span>
                        </label>
                        <textarea
                            type="text"
                            name="desc"
                            id="desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                            spellCheck={false}
                            value={formData.desc || ""}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش ادمین"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateUser;
