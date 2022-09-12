import { useEffect, useState } from "react";
import Error from "../../../../../../../../Error/Error";
import SearchSelect from "../../../../../../../../SearchSelect/SearchSelect";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import Alert from "../../../../../../../../Alert/Alert";
import PhoneInput from "../../../../../../../../PhoneInput/PhoneInput";

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
const languageSchema = {
    id: -1,
    persian_name: "",
    english_name: "",
    url: "",
    flag_image: "",
    flag_image_thumbnail: "",
    created_at: "",
    updated_at: "",
};

function Step1({ token, alertData, showAlert }) {
    const [formData, setFormData] = useState({
        id: "",
        gender: 1,
        name: "",
        family: "",
        birth_date: "",
        email: "",
        mobile: "",
        country_id: "",
        province_id: "",
        city_id: "",
        mother_tongue_id: "",
    });
    const [fetchedData, setFetchedData] = useState({});
    const [errors, setErrors] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [countries, setCountries] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(countrySchema);
    const [selectedProvince, setSelectedProvince] = useState(provinceSchema);
    const [selectedCity, setSelectedCity] = useState(citySchema);
    const [selectedMotherTongue, setSelectedMotherTongue] =
        useState(languageSchema);
    const [selectedDate, setSelectedDate] = useState();
    const [loading, setLoading] = useState(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [selectedPreCode, setSelectedPreCode] = useState({
        id: 88,
        name_fa: "ایران",
        name_en: "Iran",
        code: "98",
        initial: "IR",
        flag: "https://api.barmansms.ir/public/credential/country-flags/ir.png",
    });
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const handleClick = async (e) => {
        e.preventDefault();

        if (
            (Number(formData.gender) !== 1 || Number(formData.gender) !== 2) &&
            formData.name.trim() !== "" &&
            formData.family.trim() !== ""
        ) {
            let body = {};
            if (Number(formData.gender) !== fetchedData.gender) {
                body = { ...body, gender: Number(formData.gender) };
            }
            if (formData.name.trim() && formData.name !== fetchedData.name) {
                body = { ...body, name: formData.name };
            }
            if (
                formData.family.trim() &&
                formData.family !== fetchedData.family
            ) {
                body = { ...body, family: formData.family };
            }
            if (formData.email && formData.email !== fetchedData.email) {
                body = { ...body, email: formData.email };
            }
            if (formData.mobile && formData.mobile !== fetchedData.mobile) {
                body = { ...body, mobile: formData.mobile };
            }
            if (
                selectedCountry.id &&
                selectedCountry.id !== fetchedData.country_id
            ) {
                body = { ...body, country_id: selectedCountry.id };
            }
            if (
                selectedProvince.id &&
                selectedProvince.id !== fetchedData.province_id
            ) {
                body = { ...body, province_id: selectedProvince.id };
            }
            if (selectedCity.id && selectedCity.id !== fetchedData.city_id) {
                body = { ...body, city_id: selectedCity.id };
            }
            if (
                selectedMotherTongue.id !== -1 &&
                selectedMotherTongue.id !== fetchedData.mother_tongue_id
            ) {
                body = { ...body, mother_tongue_id: selectedMotherTongue.id };
            }
            if (selectedDate?.year) {
                let birth_date = `${selectedDate?.year}-${selectedDate?.month}-${selectedDate?.day}`;
                if (birth_date !== fetchedData.birth_date) {
                    body = {
                        ...body,
                        birth_date: birth_date,
                    };
                }
            }

            await editPublicInfo(body);
        } else {
            // Error Handling
            let temp = errors;
            let nameMessage = "لطفا نام خود را وارد نمایید.";
            let familyMessage = "لطفا نام خانوادگی خود را وارد نمایید.";

            const findError = (items, target) => {
                return items?.find((item) => item === target);
            };
            if (formData.name.trim() === "") {
                if (findError(errors, nameMessage) === undefined) {
                    temp = [nameMessage, ...temp];
                }
            } else {
                temp = temp?.filter((item) => item !== nameMessage);
            }
            if (formData.family.trim() === "") {
                if (findError(errors, familyMessage) === undefined) {
                    temp = [familyMessage, ...temp];
                }
            } else {
                temp = temp?.filter((item) => item !== familyMessage);
            }

            setErrors(() => temp);
            showAlert(true, "danger", "لطفا فیلدهای ضروری را تکمیل کنید");
        }
    };

    const readLanguages = async () => {
        try {
            const res = await fetch(`${BASE_URL}/data/language`, {
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setLanguages(() => [
                {
                    id: 0,
                    persian_name: "فارسی",
                },
                ...data,
            ]);
        } catch (error) {
            console.log("error fetching languages ", error);
        }
    };

    const readCountries = async () => {
        try {
            const res = await fetch(`${BASE_URL}/data/country`, {
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setCountries(() => data);
        } catch (error) {
            console.log("error fetching countries ", error);
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

    const getPublicInfo = async () => {
        setPageLoaded(false);
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/return/public`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setFormData(data);
            setFetchedData(data);
            if (data.birth_date) {
                let DateBirth = data.birth_date.split("-");
                setSelectedDate({
                    year: parseInt(DateBirth[0]),
                    month: parseInt(DateBirth[1]),
                    day: parseInt(DateBirth[2]),
                });
            }
            if (data.country_id) {
                setSelectedCountry({
                    ...selectedCountry,
                    id: data.country_id,
                    name_fa: data.country_name,
                });
            }
            // if (data.province_id) {
            //     setSelectedProvince({
            //         id: data.province_id,
            //         name: data.province_name,
            //         country_id: data.country_id,
            //     });
            // }
            if (data.city_id) {
                setSelectedCity({
                    id: data.city_id,
                    name: data.city_name,
                    province_id: data.province_id,
                });
            }
        } catch (error) {
            console.log("Error reading public info ", error);
        }
        setPageLoaded(true);
    };

    const editPublicInfo = async (body) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/teacher/profile/edit/public`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "پروفایل شما با موفقیت ویرایش شد");
                setErrors([]);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error editing public info ", error);
        }
        setLoading(false);
    };

    const findItem = (list, id) => {
        return list?.find((item) => item?.id === id);
    };

    // Fetching form data, countries list and languages list
    useEffect(() => {
        if (token) {
            getPublicInfo();
            readCountries();
            readLanguages();
        }
    }, [token]);

    // Getting the selected mother tongue from when languages list are fetched
    useEffect(() => {
        if (languages.length) {
            let lanRes = findItem(languages, formData?.mother_tongue_id);
            if (lanRes !== undefined) {
                setSelectedMotherTongue(lanRes);
            }
        }
    }, [languages]);

    useEffect(() => {
        // Filling selected country
        // let coRes = findItem(countries, fetchedData?.country_id);
        // if (coRes !== undefined) {
        //     setSelectedCountry(() => coRes);
        // }

        setSelectedProvince(() => {
            return {
                id: fetchedData?.province_id || "",
                name: fetchedData?.province_name || "",
                country_id: fetchedData?.country_id || "",
            };
        });
        setSelectedCity(() => {
            return {
                id: fetchedData?.city_id || "",
                name: fetchedData?.city_name || "",
                province_id: fetchedData?.province_id || "",
            };
        });
    }, [fetchedData]);

    useEffect(() => {
        setCities([]);
        // setSelectedCity(citySchema);
        if (selectedCountry.id) {
            getProvinces(selectedCountry.id);
        }
        if (selectedCountry.id !== selectedProvince.country_id) {
            setSelectedProvince(provinceSchema);
        }
    }, [selectedCountry, fetchedData]);

    useEffect(() => {
        if (selectedProvince.id) {
            getCities(selectedProvince.id);
        } else {
            setCities([]);
            setSelectedCity(citySchema);
        }
        if (
            selectedCity.province_id &&
            selectedProvince.id !== selectedCity.province_id
        ) {
            setSelectedCity(citySchema);
        }
    }, [selectedProvince, fetchedData]);

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleClick}
            />

            <h1 style={{ fontSize: "1.5rem", marginBottom: 40 }}>
                مشخصات استاد {formData.name + " " + formData.family}
            </h1>

            {pageLoaded ? (
                <form onSubmit={handleClick}>
                    <div className="input-wrapper">
                        <label htmlFor="status" className="form__label">
                            جنسیت :<span className="form__star">*</span>
                        </label>
                        <div className="form-control form-control-radio">
                            <div className="input-radio-wrapper">
                                <label htmlFor="male" className="radio-title">
                                    آقا
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
                                    خانم
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
                        <label htmlFor="name" className="form__label">
                            نام :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData.name || ""}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="family" className="form__label">
                            نام خانوادگی :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="family"
                                id="family"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData.family || ""}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="publish_time" className="form__label">
                            تاریخ تولد :
                        </label>
                        <div className="form-control">
                            <DatePicker
                                value={selectedDate}
                                onChange={setSelectedDate}
                                shouldHighlightWeekends
                                locale="fa"
                                wrapperClassName="date-input-wrapper"
                                inputClassName="date-input"
                                colorPrimary="#545cd8"
                                inputPlaceholder="انتخاب کنید"
                                calendarPopperPosition="bottom"
                            />
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
                                noResText="کشور پیدا نشد"
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
                                noResText="استان پیدا نشد"
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
                                noResText="شهر پیدا نشد"
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
                        <label htmlFor="title" className="form__label">
                            زبان مادری :
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <SearchSelect
                                list={languages}
                                defaultText="انتخاب کنید"
                                selected={selectedMotherTongue}
                                displayKey="persian_name"
                                setSelected={setSelectedMotherTongue}
                                noResText="زبان پیدا نشد"
                                listSchema={languageSchema}
                                stylesProps={{
                                    width: "100%",
                                }}
                                id="id"
                            />
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
                                value={formData.email || ""}
                                onChange={handleOnChange}
                                placeholder="example@domain.com"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="mobile" className="form__label">
                            موبایل :<span className="form__star">*</span>
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
                                openBottom={false}
                            />
                        </div>
                    </div>

                    {errors?.length !== 0 && (
                        <div>
                            <Error errorList={errors} />
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ذخیره پروفایل"}
                    </button>
                </form>
            ) : (
                <div>
                    <h2>در حال خواندن اطلاعات...</h2>
                </div>
            )}
        </div>
    );
}

export default Step1;
