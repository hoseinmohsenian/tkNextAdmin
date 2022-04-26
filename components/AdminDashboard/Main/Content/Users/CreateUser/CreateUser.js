import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";
import styles from "./CreateUser.module.css";
import SearchMultiSelect from "../../../../../SearchMultiSelect/SearchMultiSelect";

const permissionsSchema = {
    id: "",
    persian_name: "",
    english_name: "",
    created_at: "",
    updated_at: "",
};

function CreateUser({ token, permissions }) {
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        email: "",
        image: null,
        status: 1,
    });
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.email.trim() && formData.password.trim()) {
            const fd = new FormData();
            fd.append("email", formData.email);
            fd.append("password", formData.password);
            fd.append("status", Number(formData.status));
            if (formData.name) {
                fd.append("name", formData.name);
            }
            if (formData.image) {
                fd.append("image", formData.image);
            }
            for (let i = 0; i < selectedPermissions.length; i++) {
                fd.append(`permission[${i}]`, selectedPermissions[i].id);
            }
            await addAdmin(fd);
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

    const addAdmin = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/management/add`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "ادمین جدید با موفقیت اضافه شد");
                router.push("/tkpanel/users");
            } else {
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
            console.log("Error adding a new admin", error);
        }
    };

    const handleSelectFile = (e, name) => {
        let file = e.target.files[0];
        setFormData({ ...formData, [name]: file });
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="ایجاد ادمین">
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
                                required
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
                    <div className={styles["row-wrapper"]}>
                        <div
                            className={`input-wrapper ${styles["input-wrapper"]}`}
                        >
                            <label
                                htmlFor="permissions"
                                className="form__label"
                            >
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
                                    fontSize={16}
                                    openBottom={false}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد ادمین"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateUser;
