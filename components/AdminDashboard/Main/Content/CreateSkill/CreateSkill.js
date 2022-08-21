import { useEffect, useState } from "react";
import Alert from "../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../Elements/Box/Box";
import API from "../../../../../api/index";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function CreateSkill({ languages }) {
    const [formData, setFormData] = useState({
        language_id: 0,
        speciality_id: 0,
        persian_name: "",
        english_name: "",
        url: "",
    });
    const [specialities, setSpecialities] = useState([]);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            Number(formData.language_id) !== 0 &&
            Number(formData.speciality_id) !== 0 &&
            formData.persian_name.trim()
        ) {
            let body = {
                speciality_id: formData.speciality_id,
                persian_name: formData.persian_name,
                english_name: formData.english_name,
                url: formData.url,
            };
            if (formData.english_name) {
                body = {
                    ...body,
                    english_name: formData.english_name,
                };
            }
            if (formData.url) {
                body = {
                    ...body,
                    url: formData.url,
                };
            }
            await addSkill(body);
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

    const addSkill = async (body) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/teaching/skill`,
                JSON.stringify(body)
            );

            if (status === 200) {
                showAlert(true, "success", "مهارت جدید با موفقیت اضافه شد");
                router.push("/content/skill");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding a new skill", error);
        }
        setLoading(false);
    };

    const fetchSpecialitys = async () => {
        try {
            const { data, status, response } = await API.get(
                `/data/language/speciality/${formData.language_id}`
            );

            if (status === 200) {
                setSpecialities(data?.data);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error fetching specialitys ", error);
        }
    };

    useEffect(() => {
        if (Number(formData.language_id) !== 0) {
            fetchSpecialitys();
        } else {
            setFormData({ ...formData, speciality_id: 0 });
            setSpecialities([]);
        }
    }, [formData.language_id]);

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
                    content: "محتوا",
                    skill: "مهارت ها",
                    create: "ایجاد",
                }}
            />

            <Box title="ایجاد مهارت">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="language_id" className="form__label">
                            زبان :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="language_id"
                                id="language_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.language_id}
                                required
                            >
                                <option value={0}>انتخاب کنید</option>
                                {languages?.map((lan) => (
                                    <option key={lan?.id} value={lan?.id}>
                                        {lan?.persian_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="speciality_id" className="form__label">
                            تخصص :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="speciality_id"
                                id="speciality_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.speciality_id}
                                required
                            >
                                <option value={0}>انتخاب کنید</option>
                                {specialities?.map((spec) => (
                                    <option key={spec?.id} value={spec?.id}>
                                        {spec?.persian_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="persian_name" className="form__label">
                            نام فارسی :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="persian_name"
                                id="persian_name"
                                className="form__input"
                                onChange={handleOnChange}
                                autoComplete="off"
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="english_name" className="form__label">
                            نام انگلیسی :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="english_name"
                                id="english_name"
                                className="form__input"
                                onChange={handleOnChange}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="url" className="form__label">
                            url :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="url"
                                id="url"
                                className="form__input"
                                style={{ direction: "ltr", textAlign: "right" }}
                                onChange={handleOnChange}
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد مهارت‌"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateSkill;
