import { useState, useEffect } from "react";
import styles from "./Step5.module.css";
import SearchSelect from "../../../../../../../../SearchSelect/SearchSelect";
import { useRouter } from "next/router";

const formSchema = {
    language_id: "",
    pricePer1: 0,
    pricePer5: 0,
    pricePer16: 0,
};

function Step5({ token, addedLanguages }) {
    const [selectedLanguage, setSelectedLanguage] = useState({});
    const [selectedFree, setSelectedFree] = useState("");
    const [formData, setFormData] = useState([]);
    const [targetGroups, setTargetGroups] = useState(new Array(4).fill(false));
    const router = useRouter();

    let freePrices = [
        { id: 1, name: "رایگان" },
        { id: 2, name: "5 هزار تومان" },
        { id: 3, name: "10 هزار تومان" },
        { id: 4, name: "15 هزار تومان" },
        { id: 5, name: "20 هزار تومان" },
        { id: 6, name: "25 هزار تومان" },
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
        console.log("formData",formData);
        addCourse(course_id);
    };

    const handleClick = () => {
        router.push("/tutor/step6");
    };

    const addCourse = async (course_id) => {
        const currentFormItem = formData?.find(
            (item) => item?.language_id === selectedLanguage?.id
        );
        let price;
        if (course_id === 1) {
            price = currentFormItem?.pricePer1;
        } else if (course_id === 2) {
            price = currentFormItem?.pricePer5;
        } else if (course_id === 3) {
            price = currentFormItem?.pricePer16;
        }
        const body = {
            language_id: selectedLanguage?.id,
            price: price,
        };

        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/course/${course_id}`,
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
                `https://api.barmansms.ir/api/teacher/course/${course_id}`,
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

    const readCourses = async () => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/course`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
 
            let tempFormData = [...formData];
            for(let i=0; i<tempFormData?.length; i++) {
                for(let j=0;j<data?.length;j++){
                    if(tempFormData[i]?.language_id === data[j]?.language_id){
                        if(data[j]?.course_id === 1){
                            tempFormData[i]?.pricePer1 = data[j]?.price;
                        }
                        else if(data[j]?.course_id === 2){
                            tempFormData[i]?.pricePer5 = data[j]?.price;
                        }
                        else if(data[j]?.course_id === 3){
                            tempFormData[i]?.pricePer16 = data[j]?.price;        
                        }
                    }
                }
            }
            setFormData(()=>tempFormData)
        } catch (error) {
            console.log("Error fetching courses ", error);
        }
    };

    const addAgeCategory = async (category_id) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/age/${category_id}`,
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
                `https://api.barmansms.ir/api/teacher/profile/age/${category_id}`,
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
                `https://api.barmansms.ir/api/teacher/profile/age`,
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
            readCourses();

            readAgeCategorys();
        }
    }, [token]); 

    return (
        <div>
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
                                    selectedLanguage?.persian_name ===
                                        lan?.persian_name &&
                                    styles["lan__pricing-tab-item--active"]
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
                    <h4 className={styles["box__title"]}>
                        مبلغ پیشنهادی برای جلسه آزمایشی
                    </h4>
                    <p className={styles["box__color-red"]}>
                        جلسه آزمایشی در تیکا نیم ساعت است و صرفا جهت تعیین
                        سطح زبان آموز و آشنایی بیشتر و معرفی کتاب و شیوه
                        تدریس می باشد.
                    </p>
                    <div className={styles["lan__tab-content-row"]}>
                        <span
                            className={styles["lan__tab-content-row-title"]}
                        >
                            مبلغ مورد نظر را انتخاب کنید
                        </span>
                        <div
                            className={
                                styles["lan__tab-content-row-wrapper"]
                            }
                        >
                            {/* <SearchSelect
                                list={freePrices}
                                selected={selectedFree}
                                setSelected={setSelectedFree}
                                defaultText="انتخاب کنید"
                                noResText="یافت نشد"
                                displayKey="name"
                                noResText="یافت نشد"
                                listSchema={{ name: "",id:"" }}
                                stylesProps={[
                                    styles["lan__tab-content-row-input"],
                                ]}
                            /> */}
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
                                            <span
                                                className={
                                                    styles[
                                                        "lan__tab-content-row-title"
                                                    ]
                                                }
                                            >
                                                هزینه هر جلسه آنلاین
                                            </span>

                                            <div
                                                className={
                                                    styles[
                                                        "lan__tab-content-row-wrapper"
                                                    ]
                                                }
                                            >
                                                <input
                                                    type="number"
                                                    className={
                                                        styles[
                                                            "lan__tab-content-row-input"
                                                        ]
                                                    }
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            e,
                                                            ind,
                                                            "pricePer1"
                                                        )
                                                    }
                                                    value={
                                                        formItem.pricePer1
                                                    }
                                                    onBlur={() =>
                                                        onBlurHandler(1)
                                                    }
                                                />
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
                                        </div>
                                        <div
                                            className={
                                                styles[
                                                    "lan__tab-content-row"
                                                ]
                                            }
                                        >
                                            <span
                                                className={
                                                    styles[
                                                        "lan__tab-content-row-title"
                                                    ]
                                                }
                                            >
                                                هزینه 5 جلسه ای (به ازای هر
                                                جلسه آنلاین)
                                            </span>

                                            <div
                                                className={
                                                    styles[
                                                        "lan__tab-content-row-wrapper"
                                                    ]
                                                }
                                            >
                                                <input
                                                    type="number"
                                                    className={
                                                        styles[
                                                            "lan__tab-content-row-input"
                                                        ]
                                                    }
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            e,
                                                            ind,
                                                            "pricePer5"
                                                        )
                                                    }
                                                    value={
                                                        formItem.pricePer5
                                                    }
                                                    onBlur={() =>
                                                        onBlurHandler(2)
                                                    }
                                                />
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
                                                    <span>
                                                        {formItem.pricePer5 *
                                                            5}
                                                    </span>
                                                    &nbsp;
                                                    <span>تومان</span>
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
                                            <span
                                                className={
                                                    styles[
                                                        "lan__tab-content-row-title"
                                                    ]
                                                }
                                            >
                                                هزینه 16 جلسه ای - ترم (به
                                                ازای هر جلسه آنلاین)
                                            </span>

                                            <div
                                                className={
                                                    styles[
                                                        "lan__tab-content-row-wrapper"
                                                    ]
                                                }
                                            >
                                                <input
                                                    type="number"
                                                    className={
                                                        styles[
                                                            "lan__tab-content-row-input"
                                                        ]
                                                    }
                                                    onChange={(e) =>
                                                        handleFormChange(
                                                            e,
                                                            ind,
                                                            "pricePer16"
                                                        )
                                                    }
                                                    value={
                                                        formItem.pricePer16
                                                    }
                                                    onBlur={() =>
                                                        onBlurHandler(3)
                                                    }
                                                />
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
                                                    <span>
                                                        {formItem.pricePer16 *
                                                            16}
                                                    </span>
                                                    &nbsp;
                                                    <span>تومان</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>

            <div className={styles.box}>
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
                            کودک (3 تا 12 سال)
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
                            نوجوان (12 تا 15 سال)
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
                            بزرگسال (15 تا 40 سال)
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
                            میانسال (بالای 40 سال)
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Step5;
