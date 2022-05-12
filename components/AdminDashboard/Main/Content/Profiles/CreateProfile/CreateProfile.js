import { useState, useEffect } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";
import SearchSelect from "../../../../../SearchSelect/SearchSelect";
import styles from "./CreateProfile.module.css";
import PhoneInput from "../../../../../PhoneInput/PhoneInput";

const countrySchema = {
    id: "",
    name_fa: "",
    name_en: "",
    code: "",
    initial: "",
    flag: "",
};
const provinceSchema = {
    id: "",
    country_id: "",
    name: "",
};
const citySchema = {
    id: "",
    province_id: "",
    name: "",
};

function CreateProfile({ token, countries }) {
    const [formData, setFormData] = useState({
        name_family: "",
        mobile: "",
        gender: 1,
        second_mobile: "",
        second_mobile_type: 0,
        email: "",
        country_id: "",
        province_id: "",
        city_id: "",
        admin_desc: "",
        academy: 0,
    });
    const [selectedCountry, setSelectedCountry] = useState({
        id: 89,
        name_fa: "ایران",
        name_en: "Iran",
        code: "98",
        initial: "IR",
        flag: "https://api.barmansms.ir/public/credential/country-flags/ir.png",
    });
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(provinceSchema);
    const [selectedCity, setSelectedCity] = useState(citySchema);
    const [selectedPreCode, setSelectedPreCode] = useState({
        id: 89,
        name_fa: "ایران",
        name_en: "Iran",
        code: "98",
        initial: "IR",
        flag: "https://api.barmansms.ir/public/credential/country-flags/ir.png",
    });
    const [selectedPreCode2, setSelectedPreCode2] = useState({
        id: 89,
        name_fa: "ایران",
        name_en: "Iran",
        code: "98",
        initial: "IR",
        flag: "https://api.barmansms.ir/public/credential/country-flags/ir.png",
    });
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
            formData.name_family.trim() &&
            (Number(formData.gender) === 1 || Number(formData.gender) === 2) &&
            formData.mobile.trim() &&
            selectedPreCode.id
        ) {
            const fd = new FormData();
            fd.append("name_family", formData.name_family);
            fd.append("mobile", formData.mobile);
            fd.append("mobile_country", `+${selectedPreCode.code}`);
            fd.append("gender", Number(formData.gender));
            if (selectedPreCode2.id && formData.second_mobile) {
                fd.append("second_mobile", formData.second_mobile);
                fd.append("second_mobile_country", `+${selectedPreCode2.code}`);
            }
            if (Number(formData.second_mobile_type) !== 0) {
                fd.append(
                    "second_mobile_type",
                    Number(formData.second_mobile_type)
                );
            }
            if (formData.email) {
                fd.append("email", formData.email);
            }
            if (formData.admin_desc) {
                fd.append("admin_desc", formData.admin_desc);
            }
            if (Number(formData.academy) !== 0) {
                fd.append("academy", Number(formData.academy));
            }
            if (selectedCountry.id) {
                fd.append("country_id", selectedCountry.id);
            }
            if (selectedProvince.id) {
                fd.append("province_id", selectedProvince.id);
            }
            if (selectedCity.id) {
                fd.append("city_id", selectedCity.id);
            }

            await addStudent(fd);
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

    const addStudent = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/student/add`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "زبان آموز جدید با موفقیت اضافه شد");
                router.push("/tkpanel/profiles");
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
            console.log("Error adding a new student", error);
        }
    };

    const getProvinces = async (country_id) => {
        try {
            const res = await fetch(
                `${BASE_URL}/data/country/province/${country_id}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setProvinces(() => data);
        } catch (error) {
            console.log("error fetching provinces ", error);
        }
    };

    const getCities = async (province_id) => {
        try {
            const res = await fetch(
                `${BASE_URL}/data/country/city/${province_id}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setCities(data);
        } catch (error) {
            console.log("error fetching cities", error);
        }
    };

    useEffect(() => {
        setCities([]);
        if (selectedCountry.id) {
            getProvinces(selectedCountry.id);
        }
        if (selectedCountry.id !== selectedProvince.country_id) {
            setSelectedProvince(provinceSchema);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedProvince.id) {
            getCities(selectedProvince.id);
        }
        if (selectedProvince.id !== selectedCity.province_id) {
            setSelectedCity(citySchema);
        }
    }, [selectedProvince]);

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="ایجاد زبان آموز">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="name_family" className="form__label">
                            نام و نام خانوادگی :
                            <span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="name_family"
                                id="name_family"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label htmlFor="mobile" className="form__label">
                                    موبایل :
                                    <span className="form__star">*</span>
                                </label>
                                <div
                                    className={`form-control form-control-searchselect`}
                                >
                                    <PhoneInput
                                        list={countries}
                                        mobile={formData.mobile}
                                        mobileOnChange={(phone) =>
                                            setFormData({
                                                ...formData,
                                                mobile: phone,
                                            })
                                        }
                                        selectedCountry={selectedPreCode}
                                        setSelectedCountry={setSelectedPreCode}
                                        listSchema={countrySchema}
                                        background="#fafafa"
                                        stylesProps={{
                                            width: "100%",
                                        }}
                                        id="id"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="second_mobile"
                                    className="form__label"
                                >
                                    موبایل دوم :
                                </label>
                                <div
                                    className={`form-control form-control-searchselect`}
                                >
                                    <PhoneInput
                                        list={countries}
                                        mobile={formData.second_mobile}
                                        mobileOnChange={(phone) =>
                                            setFormData({
                                                ...formData,
                                                second_mobile: phone,
                                            })
                                        }
                                        selectedCountry={selectedPreCode2}
                                        setSelectedCountry={setSelectedPreCode2}
                                        listSchema={countrySchema}
                                        background="#fafafa"
                                        stylesProps={{
                                            width: "100%",
                                        }}
                                        id="id"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="second_mobile_type"
                            className="form__label"
                        >
                            نوع موبایل دوم :
                        </label>
                        <div className="form-control">
                            <select
                                name="second_mobile_type"
                                id="second_mobile_type"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.second_mobile_type}
                            >
                                <option value={0}>انتخاب کنید</option>
                                <option value={1}>والدین</option>
                                <option value={2}>واتساپ</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="email" className="form__label">
                            ایمیل :
                        </label>
                        <div className="form-control">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                placeholder="example@domain.com"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="status" className="form__label">
                            جنسیت :<span className="form__star">*</span>
                        </label>
                        <div className="form-control form-control-radio">
                            <div className="input-radio-wrapper">
                                <label htmlFor="male" className="radio-title">
                                    مرد
                                </label>
                                <input
                                    type="radio"
                                    name="gender"
                                    onChange={handleOnChange}
                                    value={1}
                                    checked={Number(formData.gender) === 1}
                                    id="male"
                                    required
                                />
                            </div>

                            <div className="input-radio-wrapper">
                                <label htmlFor="female" className="radio-title">
                                    زن
                                </label>
                                <input
                                    type="radio"
                                    name="gender"
                                    onChange={handleOnChange}
                                    value={2}
                                    checked={Number(formData.gender) === 2}
                                    id="female"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="title" className="form__label">
                            کشور :
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <SearchSelect
                                list={countries}
                                defaultText="انتخاب کنید"
                                selected={selectedCountry}
                                displayKey="name_fa"
                                setSelected={setSelectedCountry}
                                noResText="یافت نشد"
                                listSchema={countrySchema}
                                background="#fafafa"
                                stylesProps={{
                                    width: "100%",
                                }}
                                id="id"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="title" className="form__label">
                            استان :
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <SearchSelect
                                list={provinces}
                                defaultText="انتخاب کنید"
                                selected={selectedProvince}
                                displayKey="name"
                                setSelected={setSelectedProvince}
                                noResText="یافت نشد"
                                listSchema={provinceSchema}
                                background="#fafafa"
                                stylesProps={{
                                    width: "100%",
                                }}
                                id="id"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="title" className="form__label">
                            شهر :
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <SearchSelect
                                list={cities}
                                defaultText="انتخاب کنید"
                                selected={selectedCity}
                                displayKey="name"
                                setSelected={setSelectedCity}
                                noResText="یافت نشد"
                                listSchema={citySchema}
                                background="#fafafa"
                                stylesProps={{
                                    width: "100%",
                                }}
                                id="id"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="admin_desc" className="form__label">
                            توضیحات ادمین :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="admin_desc"
                                id="admin_desc"
                                className="form__input"
                                onChange={handleOnChange}
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="academy" className="form__label">
                            تحصیلات :
                        </label>
                        <div className="form-control">
                            <select
                                name="academy"
                                id="academy"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.academy}
                            >
                                <option value={0}>انتخاب کنید</option>
                                <option value={1}>دانش آموز</option>
                                <option value={2}>دیپلم</option>
                                <option value={3}>فوق دیپلم</option>
                                <option value={4}>کارشناسی</option>
                                <option value={5}>کارشناسی ارشد</option>
                                <option value={6}>دکتری</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد زبان آموز"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateProfile;
