import { useState, useEffect } from "react";
import styles from "./Step5.module.css";
import { useRouter } from "next/router";
import { 
    checkValidPriceKeys, 
    getFormattedPrice, 
    getUnformattedPrice 
} from "../../../../../../../../../utils/priceFormat";

const formSchema = {
    language_id: "",
    pricePer1: 0,
    pricePer5: 0,
    pricePer10: 0,
    pricePer16: 0,
};

function Step5({ token, addedLanguages, BASE_URL, alertData, showAlert }) {
    const [selectedLanguage, setSelectedLanguage] = useState(addedLanguages[0]);
    const [formData, setFormData] = useState(
        addedLanguages?.map((lan) => {
            return { ...formSchema, language_id: lan?.id };
        })
    );
    const [targetGroups, setTargetGroups] = useState(new Array(4).fill(false));
    const router = useRouter();
    const [errors, setErrors] = useState([]);

    let freePrices = [
        { id: 1, name: "رایگان" },
        { id: 2, name: "۵ هزار تومان" },
        { id: 3, name: "۱۰ هزار تومان" },
        { id: 4, name: "۱۵ هزار تومان" },
        { id: 5, name: "۲۰ هزار تومان" },
        { id: 6, name: "۲۵ هزار تومان" },
    ];

    const handleFormChange = (e, rowInd, name) => {
        let updated = [...formData];
        updated[rowInd] = { ...updated[rowInd], [name]: e.target.value };
        setFormData(() => updated);
    };

    // Onchange for categories
    const handleOnChange = (position) => {
        setTargetGroups((oldValues) =>
            oldValues.map((item, index) => {
                if (index === position) {
                    if (item === true) {
                        deleteAgeCategory(position + 1);
                    } else {
                        addAgeCategory(position + 1);
                    }
                }
                return index === position ? !item : item;
            })
        );
    };

    const onBlurHandler = (course_id) => {
         addCourse(course_id);
    };

    const handleClick = () => {
        let inputsFilled = true;
        let targetsChecked = targetGroups.indexOf(true) !== -1;
        

        for(let i=0; i<formData?.length ;i++){
            // if(Number(formData[i].pricePer1) === 0 && Number(formData[i].pricePer5) === 0 && Number(formData[i].pricePer16) === 0){
            if( formData[i].pricePer1  === '' ||  formData[i].pricePer5  === '' ||  formData[i].pricePer16  === ''){
                inputsFilled = false;
                break;
            }
        }
        console.log("inputsFilled"+inputsFilled)

        if(inputsFilled && targetsChecked){
            if (currentStep === 4) {
                // setCookie("tutor_step", 5, 730);
            }
            router.push("/tutor/step6");
        }
        else{
            // Error Handling
            let temp = errors;
            let priceMessage = "لطفا قیمت جلسات را وارد کنید.";
            let targetMessage = "لطفا حداقل یک گروه سنی انتخاب کنید.";

            const findError = (items, target) => {
                return items?.find((item) => item === target);
            };

            if (!inputsFilled) {
                if (findError(errors, priceMessage) === undefined) {
                    temp = [priceMessage, ...temp];
                }
            } else {
                temp = temp?.filter((item) => item !== priceMessage);
            }
            if (!targetsChecked) {
                if (findError(errors, targetMessage) === undefined) {
                    temp = [...temp, targetMessage];
                }
            } else {
                temp = temp?.filter((item) => item !== targetMessage);
            }
            setErrors(() => temp);
        }
    };
console.log(formData);
    const addCourse = async (course_id) => {
        const currentFormItem = formData?.find(
            (item) => item?.language_id === selectedLanguage?.id
        );
        let price;
        if (course_id === 2) {
            price = currentFormItem.pricePer1;
        } else if (course_id === 3) {
            price = currentFormItem.pricePer5;
        } else if (course_id === 4) {
            price = currentFormItem.pricePer10;
        } else if (course_id === 5) {
            price = currentFormItem.pricePer16;
        }
        const body = {
            language_id: selectedLanguage.id,
            price: Number(getUnformattedPrice(price)),
        };

        try {
            const res = await fetch(
                `${BASE_URL}/teacher/course/${course_id}`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error adding course ", error);
        }
    };

    const deleteCourse = async (course_id) => {
        const currentFormItem = formData?.find(
            (item) => item?.language_id === selectedLanguage?.id
        );
        

        try {
            const res = await fetch(
                `${BASE_URL}/teacher/course/${course_id}`,
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
            console.log("Error deleting course ", error);
        }
    };

    const readCourses = async (language_id) => {
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
 
            let updatedLanguage = formData.find((lan) =>lan.language_id === language_id)
            for(let i=0; i<data?.length; i++) {
                if(data[i].pivot?.course_id === 2){
                    updatedLanguage?.pricePer1 = data[i]?.price;
                }
                else if(data[i].pivot?.course_id === 3){
                    updatedLanguage?.pricePer5 = data[i]?.price;
                }
                else if(data[i].pivot?.course_id === 4){
                    updatedLanguage?.pricePer10 = data[i]?.price;        
                }
                else if(data[i].pivot?.course_id === 5){
                    updatedLanguage?.pricePer16 = data[i]?.price;        
                }
            }

            setFormData(() => 
                formData.map((lan) => lan.language_id === language_id ?
                updatedLanguage : lan)
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

    const readAgeCategorys = async () => {
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

            setTargetGroups([false, false, false, false]);
            const updatedTargets = data?.map((item) => item?.id - 1);
            let temp = [...targetGroups];
            updatedTargets?.map((item) => {
                temp[item] = true;
                return item;
            });
            setTargetGroups(() => temp);
        } catch (error) {
            console.log("Error adding category ", error);
        }
    };

    useEffect(() => {
        if (token) {
            for(let i=0; i<addedLanguages.length; i++){
                readCourses(addedLanguages[i].id);
            }

            readAgeCategorys();
        }
    }, [token]);

    return (
        <div>
            <div className="container">
                <div className={styles["step__row"]}>
                    {errors?.length !== 0 && <Error errorList={errors} />}
                </div>
                <div className={styles.box}>
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
                                    onClick={() => setSelectedLanguage(lan)}
                                    key={i}
                                >
                                    {lan?.persian_name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Free session */}
                    <div>
                        <div className="input-wrapper">
                            <label htmlFor="freePrices" className="form__label">
                                جلسه آزمایشی
                            </label>
                            <div className="form-control">
                                <select
                                    name="freePrices" 
                                    id="freePrices"
                                    className="form__input input-select"
                                    onChange={handleOnChange}
                                    // value={formData.language_id}
                                    required
                                >
                                    <option value="-1">انتخاب کنید</option>
                                        {freePrices.map((item)=><option key={item.id}>{item.name}</option>)}
                                </select>
                            </div>
                        </div>
                        
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
                                                                onBlurHandler(2)
                                                            }
                                                            id="pricePer1"
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
                                                                onBlurHandler(3)
                                                            }
                                                            id="pricePer5"
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
                                                                {Intl.NumberFormat().format(formItem.pricePer5 * 5)}
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
                                                                onBlurHandler(4)
                                                            }
                                                            id="pricePer10"
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
                                                                {Intl.NumberFormat().format(formItem.pricePer10 * 10)}
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
                                                                onBlurHandler(5)
                                                            }
                                                            id="pricePer16"
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
                                                                {Intl.NumberFormat().format(formItem.pricePer16 * 16)}
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
                </div>

                <div className={styles.box} style={{marginTop: 36}}>
                    <h4 className={styles["box__title"]}>
                        گروه سنی مدنظر زبان آموزان شما
                    </h4>
                    <div className={`row`}>
                        <div
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
                        </div>
                        <div
                            className={`col-sm-6 col-md-6 ${styles["ages__item"]}`}
                        >
                            <label className={styles.checkbox__wrapper}>
                                <input
                                    type="checkbox"
                                    id="age1"
                                    name="age1"
                                    className={styles.checkbox__input}
                                    value="age01"
                                    onChange={() => handleOnChange(1)}
                                    checked={targetGroups[1]}
                                />
                                <span className={styles.checkmark}></span>
                            </label>
                            <label
                                htmlFor="age1"
                                className={styles["ages__item-text"]}
                            >
                                نوجوان (۱۲ تا ۱۵ سال)
                            </label>
                        </div>
                        <div
                            className={`col-sm-6 col-md-6 ${styles["ages__item"]}`}
                        >
                            <label className={styles.checkbox__wrapper}>
                                <input
                                    type="checkbox"
                                    id="age2"
                                    name="age2"
                                    className={styles.checkbox__input}
                                    value="age2"
                                    onChange={() => handleOnChange(2)}
                                    checked={targetGroups[2]}
                                />
                                <span className={styles.checkmark}></span>
                            </label>
                            <label
                                htmlFor="age2"
                                className={styles["ages__item-text"]}
                            >
                                بزرگسال (۱۵ تا ۴۰ سال)
                            </label>
                        </div>
                        <div
                            className={`col-sm-6 col-md-6 ${styles["ages__item"]}`}
                        >
                            <label className={styles.checkbox__wrapper}>
                                <input
                                    type="checkbox"
                                    id="age3"
                                    name="age3"
                                    className={styles.checkbox__input}
                                    value="age3"
                                    onChange={() => handleOnChange(3)}
                                    checked={targetGroups[3]}
                                />
                                <span className={styles.checkmark}></span>
                            </label>
                            <label
                                htmlFor="age3"
                                className={styles["ages__item-text"]}
                            >
                                میانسال (بالای ۴۰ سال)
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Step5;
