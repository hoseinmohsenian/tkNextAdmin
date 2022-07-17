import { useEffect } from "react";
import styles from "./LanModal.module.css";
import SearchMultiSelect from "../../../../../../../../../SearchMultiSelect/SearchMultiSelect";

function LanModal(props) {
    const {
        selectedLan,
        setSelectedLan,
        selectedSpecialitys,
        setSelectedSpecialitys,
        selectedSkills,
        setSelectedSkills,
        selectedLevels,
        setSelectedLevels,
        show,
        setter,
        errors,
        setErrors,
        languages,
        levels,
        token,
        currentStep,
        setCurrentStep,
        specialitys,
        setSpecialitys,
        skills,
        setSkills,
        languageSchema,
        showAlert,
    } = props;

    const checkLanguageStatus = async () => {
        // Error Handling
        let temp = errors;
        let specMessage = "لطفا حداقل ۳ تخصص اضافه کنید.";
        let skillMessage = "لطفا حداقل ۱ مهارت اضافه کنید.";
        let levelMessage = "لطفا حداقل ۱ سطح اضافه کنید.";

        console.log(selectedSpecialitys);
        console.log(selectedSkills);
        console.log(selectedLevels);

        const findError = (items, target) => {
            return items?.find((item) => item === target);
        };

        if (selectedSpecialitys?.length < 3) {
            if (findError(errors, specMessage) === undefined) {
                setErrors((oldErrors) => [...oldErrors, specMessage]);
            }
        } else {
            temp = temp?.filter((item) => item != specMessage);
            setErrors(() => temp);
        }
        if (selectedSkills?.length < 1) {
            if (findError(errors, skillMessage) === undefined) {
                setErrors((oldErrors) => [...oldErrors, skillMessage]);
            }
        } else {
            temp = temp?.filter((item) => item != skillMessage);
            setErrors(() => temp);
        }
        if (selectedLevels?.length < 1) {
            if (findError(errors, levelMessage) === undefined) {
                setErrors((oldErrors) => [...oldErrors, levelMessage]);
            }
        } else {
            temp = temp?.filter((item) => item != levelMessage);
            setErrors(() => temp);
        }
        // await returnLanguage()

        closeModal();
    };

    const closeModal = () => {
        setSelectedLan(languageSchema);
        setSelectedSpecialitys([]);
        setSelectedSkills([]);
        setSelectedLevels([]);
        setCurrentStep(1);
        setter(!show);
    };

    const fetchSpecialitys = async (languageId) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/data/language/speciality/${languageId}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setSpecialitys(() => data);
        } catch (error) {
            console.log("Error fetching specialitys ", error);
        }
    };

    const fetchSkills = async () => {
        let params = selectedSpecialitys
            ?.map((specItem, ind) => {
                return `speciality[${ind}]=${specItem?.id}`;
            })
            .join("&");
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/data/language/skill?${params}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setSkills(() => data);
        } catch (error) {
            console.log("Error fetching skills ", error);
        }
    };

    const addLanguage = async (id) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/add/language/${id}`,
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
            console.log("Error adding new language ", error);
        }
    };

    const deleteLanguage = async (id) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/delete/language/${id}`,
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
            console.log("Error deleting language ", error);
        }
    };

    const addSpeciality = async (languageId, specId) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/add/language/${languageId}/speciality/${specId}`,
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
            console.log("Error adding speciality ", error);
        }
    };

    const deleteSpeciality = async (specId) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/delete/speciality/${specId}`,
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
            console.log("Error deleting speciality ", error);
        }
    };

    const addSkill = async (specId, skillId) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/add/speciality/${specId}/skill/${skillId}`,
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
            console.log("Error adding skill ", error);
        }
    };

    const deleteSkill = async (skillId) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/delete/skill/${skillId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            console.log("delete res", res);
        } catch (error) {
            console.log("Error deleting skill ", error);
        }
    };

    const addLevel = async (languageId, levelId) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/add/language/${languageId}/level/${levelId}`,
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
            console.log("Error adding level ", error);
        }
    };

    const deleteLevel = async (levelId) => {
        try {
            const res = await fetch(
                `https://api.barmansms.ir/api/teacher/profile/delete/language/${selectedLan?.id}/level/${levelId}`,
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
            console.log("Error deleting level ", error);
        }
    };

    // Selecting a language in step 1
    const newLanguageHandler = async (newLan) => {
        if (selectedLan?.id) {
            deleteLanguage(selectedLan?.id);
        }
        setSelectedLan(() => newLan);
        addLanguage(newLan?.id);
        setCurrentStep(2);
        fetchSpecialitys(newLan.id);
        setSelectedSpecialitys([]);
    };

    useEffect(() => {
        if (selectedSpecialitys?.length !== 0) {
            // Add new speciality
            addSpeciality(
                selectedLan?.id,
                selectedSpecialitys[selectedSpecialitys?.length - 1]?.id
            );
            fetchSkills();
        }
    }, [selectedSpecialitys]);

    useEffect(() => {
        if (selectedSkills?.length !== 0) {
            // Add new skill
            let skillId = selectedSkills[selectedSkills?.length - 1]?.id;
            let specId =
                selectedSkills[selectedSkills?.length - 1]?.speciality_id;
            addSkill(specId, skillId);
        }
    }, [selectedSkills]);

    useEffect(() => {
        if (selectedLan?.id) {
            // Add new skill
            // let skillId = selectedSkills[selectedSkills?.length - 1]?.id;
            // let specId =
            //     selectedSkills[selectedSkills?.length - 1]?.speciality_id;
            // addSkill(specId, skillId);
            fetchSpecialitys(selectedLan?.id);
        }
    }, [selectedLan]);

    useEffect(() => {
        if (selectedLevels?.length !== 0) {
            // Add new level
            let skillId = selectedLevels[selectedLevels?.length - 1]?.id;
            let languageId = selectedLan?.id;
            addLevel(languageId, skillId);
        }
    }, [selectedLevels]);

    return (
        <div className={styles.modal}>
            <div className={styles.modal__overlay} onClick={closeModal}></div>

            <div className={styles.modal__wrapper}>
                <div className={styles.modal__header}>
                    <h5>اضافه کردن زبان جدید</h5>
                </div>

                <div className={styles.modal__body}>
                    {currentStep == 1 && (
                        <div className={styles.lan__row}>
                            <div className={`row ${styles["lan__lans-list"]}`}>
                                {languages?.map((lanItem) => {
                                    return (
                                        <div
                                            className={`col-xs-6 col-md-3 ${styles["lan__lan-wrapper"]}`}
                                            key={lanItem?.id}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    newLanguageHandler(lanItem);
                                                }}
                                                className={`${
                                                    styles["lan__lan-item"]
                                                } ${
                                                    selectedLan?.id ===
                                                        lanItem?.id &&
                                                    styles[
                                                        "lan__lan-item--selected"
                                                    ]
                                                }`}
                                            >
                                                <img
                                                    src={
                                                        lanItem?.flag_image
                                                            ? `${lanItem?.flag_image}`
                                                            : "https://tikkaa.ir/img/index/header/turkey.png"
                                                    }
                                                    alt={lanItem?.english_name}
                                                />
                                                <span>
                                                    {lanItem?.persian_name}
                                                </span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {currentStep === 2 && (
                        <>
                            <div className={styles.lan__row}>
                                <span className={styles.lan__title}>
                                    تخصص مورد تدریس
                                </span>

                                <SearchMultiSelect
                                    list={specialitys}
                                    displayKey="persian_name"
                                    id="id"
                                    defaultText="تخصص مورد تدریس خود را انتخاب کنید."
                                    selected={selectedSpecialitys}
                                    setSelected={setSelectedSpecialitys}
                                    noResText="یافت نشد"
                                    width="100%"
                                    onRemove={deleteSpeciality}
                                    min={3}
                                    max={8}
                                    showAlert={showAlert}
                                />
                            </div>
                            <div className={styles.lan__row}>
                                <span className={styles.lan__title}>
                                    مهارت مورد تدریس
                                </span>

                                <SearchMultiSelect
                                    list={skills}
                                    displayKey="persian_name"
                                    id="id"
                                    defaultText="مهارت مورد تدریس خود را انتخاب کنید."
                                    selected={selectedSkills}
                                    setSelected={setSelectedSkills}
                                    noResText="یافت نشد"
                                    width="100%"
                                    onRemove={deleteSkill}
                                    min={1}
                                    max={3}
                                    showAlert={showAlert}
                                />
                            </div>
                            <div className={styles.lan__row}>
                                <span className={styles.lan__title}>
                                    سطح مورد تدریس
                                </span>

                                <div
                                    style={{
                                        width: "100%",
                                        position: "relative",
                                    }}
                                >
                                    <SearchMultiSelect
                                        list={levels}
                                        displayKey="persian_name"
                                        displayKeySecond="english_name"
                                        id="id"
                                        defaultText="سطح مورد تدریس خود را انتخاب کنید."
                                        selected={selectedLevels}
                                        setSelected={setSelectedLevels}
                                        noResText="یافت نشد"
                                        width="100%"
                                        onRemove={deleteLevel}
                                        min={1}
                                        max={6}
                                        showAlert={showAlert}
                                    />
                                </div>
                            </div>
                            <div className={styles.lan__row}>
                                <span className={styles.lan__sugg}>
                                    برای اینکه در صفحه اساتید بهتر دیده شوید
                                    مواردی را انتخاب کنید.
                                </span>
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.modal__footer}>
                    {currentStep === 2 && (
                        <>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className={`${styles["modal__fooer-btn"]} ${styles["modal__fooer-btn--gray"]}`}
                            >
                                مرحله قبل
                            </button>
                            <button
                                type="button"
                                onClick={checkLanguageStatus}
                                className={`${styles["modal__fooer-btn"]} ${styles["modal__fooer-btn--purple"]}`}
                            >
                                ذخیره
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LanModal;
