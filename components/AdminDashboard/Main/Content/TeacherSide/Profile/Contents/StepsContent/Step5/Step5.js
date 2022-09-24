import { useState, useEffect } from "react";
import styles from "./Step5.module.css";
import { 
    checkValidPriceKeys, 
    getFormattedPrice, 
    getUnformattedPrice 
} from "../../../../../../../../../utils/priceFormat";
import Alert from "../../../../../../../../Alert/Alert";

const formSchema = {
    language_id: "",
    pricePerTest: -1,
    pricePerTestID: 0,
    perTestCourseId: 0,
    pricePer1: "",
    pricePer1ID: 0,
    per1CourseId: 0,
    pricePer5: "",
    pricePer5ID: 0,
    per5CourseId: 0,
    pricePer10: "",
    pricePer10ID: 0,
    per10CourseId: 0,
    pricePer16: "",
    pricePer16ID: 0,
    per16CourseId: 0,
};

const loadingsSchema = {
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false
};

function Step5({ token, BASE_URL, alertData, showAlert }) {
    const [addedLanguages, setAddedLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState({});
    const [formData, setFormData] = useState([]);
    const [ageCategories, setAgeCategories] = useState([]);
    const [targetGroups, setTargetGroups] = useState([]);
    const [loadings, setLoadings] = useState(loadingsSchema);
    const [pricesLoaded, setPricesLoaded] = useState(false);
    const [catgsLoaded, setCatgsLoaded] = useState(false);
    const [errors, setErrors] = useState([]);

    let freePrices = [
        { value: 0, name: "رایگان" },
        { value: 5000, name: "۵ هزار تومان" },
        { value: 10000, name: "۱۰ هزار تومان" },
        { value: 15000, name: "۱۵ هزار تومان" },
        { value: 20000, name: "۲۰ هزار تومان" },
        { value: 25000, name: "۲۵ هزار تومان" },
    ];

    const handleFormChange = (e, rowInd, name) => {
        const value = e.target.value;
        let updated = [...formData];
        updated[rowInd] = { ...updated[rowInd], [name]: value };
        setFormData(() => updated);

        // Call the API for Test Session here. bacause <select> doesn't have onBlur
        if(name === "pricePerTest" && Number(value) !== -1){
            onBlurHandler(formData[rowInd].pricePerTestID, Number(value), "1")
        }
    };

    // Onchange for categories
    const handleOnChange = (position) => {
        setTargetGroups((oldValues) =>
            oldValues.map((item, index) => {
                if (index === position) {
                    if (item === true) {
                        deleteAgeCategory(position);
                    } else {
                        addAgeCategory(position);
                    }
                }
                return index === position ? !item : item;
            })
        );
    };

    const onBlurHandler = async (id, price, course_id) => {
        let unformattedPrice = Number(getUnformattedPrice(price));
        const formItem = formData.find((formItem, ind) => formItem?.language_id === selectedLanguage?.id)

        // const callPriceAPI = async (id, price, course_id) => {
        //     if(id){
        //         await editCourse(id, price, course_id);
        //     } else{
        //         await createCourse(price, course_id);
        //     }
        // }

        // // Single session
        // if(Number(course_id) === 2){
        //     const res = await callPriceAPI(id, unformattedPrice, "2");
        //     console.log(res);
        //     if(res.ok){
        //         await Promise.all([
        //             callPriceAPI(formItem.pricePer5ID, "0", "3"),
        //             callPriceAPI(formItem.pricePer10ID, "0", "4"),
        //             callPriceAPI(formItem.pricePer16ID, "0", "5"),
        //         ])
        //     }
        // } else{
        //     await callPriceAPI(id, unformattedPrice, course_id);
        // }

        if(id){
            editCourse(id, unformattedPrice, course_id);
        } else{
            createCourse(unformattedPrice, course_id);
        }
    };

    const editCourse = async (id, price, course_id) => {
        setLoadings({...loadings, [course_id]:true})
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/course/edit/${id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ price }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if(res.ok){
                showAlert(true, "success", "هزینه کلاس ویرایش شد");
            } else{
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error editing course ", error);
        }
        setLoadings({...loadings, [course_id]:false})
    };

    const createCourse = async (price, course_id) => {
        setLoadings({...loadings, [course_id]:true})
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/course/${course_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ price, language_id: selectedLanguage.id }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if(res.ok){
                showAlert(true, "success", "هزینه کلاس ویرایش شد");
                let index = selectedLanguage.index;
                await readCourses(selectedLanguage.id, formData, index);
            } else{
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error editing course ", error);
        }
        setLoadings({...loadings, [course_id]:false})
    };

    const readCourses = async (language_id, tempFormData, lanInd) => {
        try {
            const res = await fetch(`${BASE_URL}/teacher/course/language/${language_id}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();

            let updatedLanguage = tempFormData[lanInd];

            for (let i=0; i<data?.length; i++) {
                if(data[i].course_id === 1){
                    updatedLanguage?.pricePerTestID = data[i]?.id;
                    updatedLanguage?.pricePerTest = data[i]?.price;
                    updatedLanguage?.perTestCourseId = data[i]?.course_id;
                }
                if(data[i].course_id === 2){
                    updatedLanguage?.pricePer1ID = data[i]?.id;
                    updatedLanguage?.pricePer1 = data[i]?.price;
                    updatedLanguage?.per1CourseId = data[i]?.course_id;
                }
                else if(data[i].course_id === 3){
                    updatedLanguage?.pricePer5ID = data[i]?.id;
                    updatedLanguage?.pricePer5 = data[i]?.price;
                    updatedLanguage?.per5CourseId = data[i]?.course_id;
                }
                else if(data[i].course_id === 4){
                    updatedLanguage?.pricePer10ID = data[i]?.id;
                    updatedLanguage?.pricePer10 = data[i]?.price;
                    updatedLanguage?.per10CourseId = data[i]?.course_id;
                }
                else if(data[i].course_id === 5){
                    updatedLanguage?.pricePer16ID = data[i]?.id;
                    updatedLanguage?.pricePer16 = data[i]?.price;
                    updatedLanguage?.per16CourseId = data[i]?.course_id;
                }
            }

            tempFormData[lanInd] = updatedLanguage;
            setFormData(() => 
                tempFormData
            );

        } catch (error) {
            console.log("Error fetching language courses ", error);
        }
    };

    const addAgeCategory = async (category_id) => {
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/age/${category_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error adding category ", error);
        }
    };

    const deleteAgeCategory = async (category_id) => {
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/age/${category_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error deleting category ", error);
        }
    };

    const readAgeCategories =  async () => {
        setCatgsLoaded(false);
        try {
            const res = await fetch(
                `${BASE_URL}/data/age-category`,
                {
                    headers: {
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if(res.ok){
                const { data } = await res.json();
                setAgeCategories(data);

                const newTargetGroups = new Array(data.length + 1).fill(false);
                setTargetGroups(newTargetGroups);
                await readAddedAgeCategorys(newTargetGroups);
            }

            
        } catch (error) {
            console.log("Error adding age category groups", error);
        }
        setCatgsLoaded(true);
    };

    const readAddedAgeCategorys = async (currTargetGroups) => {
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/age`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            let temp = [...currTargetGroups];
            data?.map((item) => {
                const id = item.id;
                temp[id] = true;
                return item;
            });
            setTargetGroups(() => temp);
        } catch (error) {
            console.log("Error adding category ", error);
        }
    };

    const fetchAddedLanguages = async () => {
        setPricesLoaded(false);
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/return/languages`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setAddedLanguages(() => data);

            setSelectedLanguage(data[0]);
            let tempFormData = data?.map((lan) => {
                return { ...formSchema, language_id: lan?.id };
            });
            setFormData(()=> tempFormData);

            // Fetching course prices for each language
            for(let i=0; i<data.length; i++){
                await readCourses(data[i].id, tempFormData, i);
            }
        } catch (error) {
            console.log("Error fetching added languages ", error);
        }
        setPricesLoaded(true);
    };

    useEffect(() => {
        if (token) {
            fetchAddedLanguages();
            readAgeCategories();
        }
    }, [token]);

    return (
        <div>
            <div className="container">
                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={editCourse}
                />

                <div className={styles["step__row"]}>
                    {errors?.length !== 0 && <Error errorList={errors} />}
                </div>
                {pricesLoaded ? (<div className={styles.box}>
                    {/* Language tabs */}
                    <div className={styles["lan__pricing-tabs"]}>
                        {addedLanguages?.map((lan, i) => {
                            return (
                                <button
                                    type="button"
                                    className={`${
                                        styles["lan__pricing-tab-item"]
                                    } ${
                                        selectedLanguage?.id === lan?.id ?
                                        styles["lan__pricing-tab-item--active"] : undefined
                                    }`}
                                    onClick={() => setSelectedLanguage({...lan, index: i})}
                                    key={i}
                                >
                                    {lan?.persian_name}
                                </button>
                            );
                        })}
                    </div>

                    <div className={styles["lan__pricing"]}>
                        {/* Content */}
                        <div>
                            {formData.map((formItem, ind) => {
                                if (formItem?.language_id === selectedLanguage?.id) {
                                    return (
                                        <div
                                            className={
                                                styles["lan__tab-content"]
                                            }
                                            key={ind}
                                        >
                                            <div
                                                className={
                                                    styles[
                                                        "lan__tab-content-row"
                                                    ]
                                                }
                                            >
                                                <div className={`input-wrapper ${styles["input-wrapper"]}`}>
                                                    <label htmlFor="freePrices" className={`form__label ${styles["form__label"]}`}>
                                                        جلسه آزمایشی
                                                    </label>
                                                    <div className="form-control">
                                                        <select
                                                            name="freePrices" 
                                                            id="freePrices"
                                                            className="form__input input-select"
                                                            onChange={(e) =>
                                                                handleFormChange(
                                                                    e,
                                                                    ind,
                                                                    "pricePerTest"
                                                                )
                                                            }
                                                            value={formItem.pricePerTest}
                                                            required
                                                            disabled={loadings["1"]}
                                                        >
                                                            <option value={-1}>انتخاب کنید</option>
                                                            {freePrices.map((item) => (
                                                                <option 
                                                                    key={item.value}
                                                                    value={item.value}
                                                                >
                                                                        {item.name}
                                                                </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className={
                                                    styles[
                                                        "lan__tab-content-row"
                                                    ]
                                                }
                                            >
                                                <div className={`input-wrapper ${styles["input-wrapper"]}`}>
                                                    <label htmlFor="pricePer1" className={`form__label ${styles["form__label"]}`}>
                                                        هزینه هر جلسه آنلاین
                                                    </label>
                                                    <div className="form-control">
                                                        <input
                                                            type="text"
                                                            className="form__input"
                                                            onChange={(e) =>
                                                                handleFormChange(
                                                                    e,
                                                                    ind,
                                                                    "pricePer1"
                                                                )
                                                            }
                                                            value={getFormattedPrice(
                                                                formItem.pricePer1
                                                            )}
                                                            onKeyDown={(e) =>
                                                                checkValidPriceKeys(e)
                                                            }
                                                            onBlur={() =>
                                                                onBlurHandler(formItem.pricePer1ID, formItem.pricePer1, "2")
                                                            }
                                                            id="pricePer1"
                                                            disabled={loadings["2"]}
                                                        />
                                                    </div>
                                                </div>
                                                <span
                                                    className={
                                                        styles[
                                                            "lan__tab-content-row-curr"
                                                        ]
                                                    }
                                                >
                                                    تومان
                                                </span>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "lan__tab-content-row"
                                                    ]
                                                }
                                            >
                                                <div className={`input-wrapper ${styles["input-wrapper"]}`}>
                                                    <label htmlFor="pricePer5" className={`form__label ${styles["form__label"]}`}>
                                                        هزینه ۵ جلسه ای (به ازای هر
                                                        جلسه آنلاین)
                                                    </label>
                                                    <div className="form-control">
                                                        <input
                                                            type="text"
                                                            className="form__input"
                                                            onChange={(e) =>
                                                                handleFormChange(
                                                                    e,
                                                                    ind,
                                                                    "pricePer5"
                                                                )
                                                            }
                                                            value={getFormattedPrice(
                                                                formItem.pricePer5
                                                            )}
                                                            onKeyDown={(e) =>
                                                                checkValidPriceKeys(e)
                                                            }
                                                            onBlur={() =>
                                                                onBlurHandler(formItem.pricePer5ID, formItem.pricePer5, "3")
                                                            }
                                                            id="pricePer5"
                                                            disabled={loadings["3"] || !formItem.pricePer1ID}
                                                        />
                                                    </div>
                                                </div>
                                                <span
                                                    className={
                                                        styles[
                                                            "lan__tab-content-row-curr"
                                                        ]
                                                    }
                                                >
                                                    تومان
                                                </span>
                                                <div
                                                        className={
                                                            styles[
                                                                "lan__tab-content-row-total"
                                                            ]
                                                        }
                                                    >
                                                        <span>هزینه کل:</span>
                                                        &nbsp;
                                                        <b>
                                                            <span>
                                                                {Intl.NumberFormat().format(Number(getUnformattedPrice(formItem.pricePer5)) * 5)}
                                                            </span>
                                                            &nbsp;
                                                            <span>تومان</span>
                                                        </b>
                                                    </div>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "lan__tab-content-row"
                                                    ]
                                                }
                                            >
                                                <div className={`input-wrapper ${styles["input-wrapper"]}`}>
                                                    <label htmlFor="pricePer10" className={`form__label ${styles["form__label"]}`}>
                                                        هزینه ۱۰ جلسه ای (به ازای هر
                                                        جلسه آنلاین)
                                                    </label>
                                                    <div className="form-control">
                                                        <input
                                                            type="text"
                                                            className="form__input"
                                                            onChange={(e) =>
                                                                handleFormChange(
                                                                    e,
                                                                    ind,
                                                                    "pricePer10"
                                                                )
                                                            }
                                                            value={getFormattedPrice(
                                                                formItem.pricePer10
                                                            )}
                                                            onKeyDown={(e) =>
                                                                checkValidPriceKeys(e)
                                                            }
                                                            onBlur={() =>
                                                                onBlurHandler(formItem.pricePer10ID, formItem.pricePer10, "4")
                                                            }
                                                            id="pricePer10"
                                                            disabled={loadings["4"]}
                                                        />
                                                    </div>
                                                </div>
                                                <span
                                                    className={
                                                        styles[
                                                            "lan__tab-content-row-curr"
                                                        ]
                                                    }
                                                >
                                                    تومان
                                                </span>
                                                <div
                                                        className={
                                                            styles[
                                                                "lan__tab-content-row-total"
                                                            ]
                                                        }
                                                    >
                                                        <span>هزینه کل:</span>
                                                        &nbsp;
                                                        <b>
                                                            <span>
                                                            {Intl.NumberFormat().format(Number(getUnformattedPrice(formItem.pricePer10)) * 10)}
                                                            </span>
                                                            &nbsp;
                                                            <span>تومان</span>
                                                        </b>
                                                    </div>
                                            </div>
                                            <div
                                                className={
                                                    styles[
                                                        "lan__tab-content-row"
                                                    ]
                                                }
                                            >
                                                <div className={`input-wrapper ${styles["input-wrapper"]}`}>
                                                    <label htmlFor="pricePer16" className={`form__label ${styles["form__label"]}`}>
                                                        هزینه ۱۶ جلسه ای (به ازای هر
                                                        جلسه آنلاین)
                                                    </label>
                                                    <div className="form-control">
                                                        <input
                                                            type="text"
                                                            className="form__input"
                                                            onChange={(e) =>
                                                                handleFormChange(
                                                                    e,
                                                                    ind,
                                                                    "pricePer16"
                                                                )
                                                            }
                                                            value={getFormattedPrice(
                                                                formItem.pricePer16
                                                            )}
                                                            onKeyDown={(e) =>
                                                                checkValidPriceKeys(e)
                                                            }
                                                            onBlur={() =>
                                                                onBlurHandler(formItem.pricePer16ID, formItem.pricePer16, "5")
                                                            }
                                                            id="pricePer16"
                                                            disabled={loadings["5"]}
                                                        />
                                                    </div>
                                                </div>
                                                <span
                                                    className={
                                                        styles[
                                                            "lan__tab-content-row-curr"
                                                        ]
                                                    }
                                                >
                                                    تومان
                                                </span>
                                                <div
                                                        className={
                                                            styles[
                                                                "lan__tab-content-row-total"
                                                            ]
                                                        }
                                                    >
                                                        <span>هزینه کل:</span>
                                                        &nbsp;
                                                        <b>
                                                            <span>
                                                            {Intl.NumberFormat().format(Number(getUnformattedPrice(formItem.pricePer16)) * 16)}
                                                            </span>
                                                            &nbsp;
                                                            <span>تومان</span>
                                                        </b>
                                                    </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>) : (<div>
                    <h2>در حال خواندن هزینه‌ها...</h2>
                </div>)
                }

                {catgsLoaded?(<div className={styles.box} style={{marginTop: 36}}>
                    <h4 className={styles["box__title"]}>
                        گروه سنی مدنظر زبان آموزان شما
                    </h4>
                    <div className={`row`}>
                        {ageCategories.map((age) => (
                            <div
                                key={age.id}
                                className={`col-sm-6 col-md-6 ${styles["ages__item"]}`}
                            >
                                <label className={styles.checkbox__wrapper}>
                                    <input
                                        type="checkbox"
                                        id={`age${age.id}`}
                                        // name="age0"
                                        className={styles.checkbox__input}
                                        // value="age0"
                                        onChange={() => handleOnChange(age.id)}
                                        checked={targetGroups[age.id]}
                                    />
                                    <span className={styles.checkmark}></span>
                                </label>
                                <label
                                    htmlFor={`age${age.id}`}
                                    className={styles["ages__item-text"]}
                                >
                                    {age.persian_name}
                                </label>
                            </div>
                        ))}

                        {/* <div
                            className={`col-sm-6 col-md-6 ${styles["ages__item"]}`}
                        >
                            <label className={styles.checkbox__wrapper}>
                                <input
                                    type="checkbox"
                                    id="age0"
                                    name="age0"
                                    className={styles.checkbox__input}
                                    value="age0"
                                    onChange={() => handleOnChange(0)}
                                    checked={targetGroups[0]}
                                />
                                <span className={styles.checkmark}></span>
                            </label>
                            <label
                                htmlFor="age0"
                                className={styles["ages__item-text"]}
                            >
                                کودک (۳ تا ۱۲ سال)
                            </label>
                        </div> */}
                    </div>
                </div>) : (
                    <div>
                        <h2>در حال خواندن دسته بندی‌ها...</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Step5;
