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
    country_id: "89",
    name: "",
};
const citySchema = {
    id: "",
    province_id: "",
    name: "",
};
const languageSchema = {
    id: "",
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
    const [selectedPreCode, setSelectedPreCode] = useState({
        id: 88,
        name_fa: "??????????",
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
        console.log("hhhh");

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
                selectedMotherTongue.id &&
                selectedMotherTongue.id !== fetchedData.mother_tongue_id
            ) {
                body = { ...body, mother_tongue_id: selectedMotherTongue.id };
            }
            if (selectedDate.year) {
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
            let nameMessage = "???????? ?????? ?????? ???? ???????? ????????????.";
            let familyMessage = "???????? ?????? ???????????????? ?????? ???? ???????? ????????????.";

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
            showAlert(true, "danger", "???????? ?????????????? ?????????? ???? ?????????? ????????");
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
            setLanguages(() => data);
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

    const getCities = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/data/country/city/${selectedProvince.id}`,
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
        } catch (error) {
            console.log("Error reading public info ", error);
        }
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
                showAlert(true, "success", "?????????????? ?????? ???? ???????????? ???????????? ????");
                setErrors([]);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "?????????? ?????? ????????"
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

    useEffect(() => {
        if (token) {
            getPublicInfo();
            readCountries();
            readLanguages();
        }
    }, [token]);

    // Updating selected country, selected province, and selected city field with fetched country_id
    useEffect(() => {
        if (formData.country_id) {
            let coRes = findItem(countries, formData?.country_id);
            let pRes = findItem(provinces, formData?.province_id);
            let ciRes = findItem(cities, formData?.city_id);
            let lanRes = findItem(languages, formData?.mother_tongue_id);
            if (coRes !== undefined) {
                setSelectedCountry(coRes);
            }
            if (pRes !== undefined) {
                setSelectedProvince(pRes);
            }
            if (ciRes !== undefined) {
                setSelectedCity(ciRes);
            }
            if (lanRes !== undefined) {
                setSelectedMotherTongue(lanRes);
            }
        }
    }, [formData.country_id, provinces, cities, languages]);

    // Filling Provinces
    useEffect(() => {
        let countryId = selectedCountry.id;
        if (countryId) {
            getProvinces(countryId);
        }
    }, [selectedCountry]);

    // Filling Cities
    useEffect(() => {
        let provinceId = selectedProvince.id;
        // province_id:data.province_id,
        setFormData({ ...formData, province_id: provinceId });
        if (provinceId) {
            getCities(provinceId);
        }
    }, [selectedProvince]);

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleClick}
            />

            <form onSubmit={handleClick}>
                <div className="input-wrapper">
                    <label htmlFor="status" className="form__label">
                        ?????????? :<span className="form__star">*</span>
                    </label>
                    <div className="form-control form-control-radio">
                        <div className="input-radio-wrapper">
                            <label htmlFor="male" className="radio-title">
                                ??????
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
                                ????
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
                        ?????? :<span className="form__star">*</span>
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
                        ?????? ???????????????? :<span className="form__star">*</span>
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
                        ?????????? ???????? :
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
                            inputPlaceholder="???????????? ????????"
                        />
                    </div>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="title" className="form__label">
                        ???????? :
                    </label>
                    <div className={`form-control form-control-searchselect`}>
                        <SearchSelect
                            list={countries}
                            defaultText="???????????? ????????"
                            selected={selectedCountry}
                            displayKey="name_fa"
                            setSelected={setSelectedCountry}
                            noResText="???????? ???????? ??????"
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
                        ?????????? :
                    </label>
                    <div className={`form-control form-control-searchselect`}>
                        <SearchSelect
                            list={provinces}
                            defaultText="???????????? ????????"
                            selected={selectedProvince}
                            displayKey="name"
                            setSelected={setSelectedProvince}
                            noResText="?????????? ???????? ??????"
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
                        ?????? :
                    </label>
                    <div className={`form-control form-control-searchselect`}>
                        <SearchSelect
                            list={cities}
                            defaultText="???????????? ????????"
                            selected={selectedCity}
                            displayKey="name"
                            setSelected={setSelectedCity}
                            noResText="?????? ???????? ??????"
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
                        ???????? ?????????? :
                    </label>
                    <div className={`form-control form-control-searchselect`}>
                        <SearchSelect
                            list={languages}
                            defaultText="???????????? ????????"
                            selected={selectedMotherTongue}
                            displayKey="persian_name"
                            setSelected={setSelectedMotherTongue}
                            noResText="???????? ???????? ??????"
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
                        ?????????? :
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
                        ???????????? :<span className="form__star">*</span>
                    </label>
                    <div className={`form-control form-control-searchselect`}>
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
                    {loading ? "???? ?????? ?????????? ..." : "?????????? ??????????????"}
                </button>
            </form>
        </div>
    );
}

export default Step1;
