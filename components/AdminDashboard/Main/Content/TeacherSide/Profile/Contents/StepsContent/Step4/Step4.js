import { useEffect, useState } from "react";
import styles from "./Step4.module.css";
import LanModal from "./LanModal/LanModal";
import Error from "../../../../../../../../Error/Error";
import DeleteModal from "../../../../../../../../DeleteModal/DeleteModal";
import { AiFillDelete } from "react-icons/ai";
import Alert from "../../../../../../../../Alert/Alert";

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

function Step4(props) {
    const { token, alertData, showAlert, BASE_URL } = props;
    const [openModal, setOpenModal] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [levels, setLevels] = useState([]);
    const [addedLanguages, setAddedLanguages] = useState([]);
    const [selectedLan, setSelectedLan] = useState(languageSchema);
    const [selectedSpecialitys, setSelectedSpecialitys] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [errors, setErrors] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [specialitys, setSpecialitys] = useState([]);
    const [skills, setSkills] = useState([]);
    const [toBeDeletedLan, setToBeDeletedLan] = useState({});
    const [dModalVisible, setDModalVisible] = useState(false);
    const [loadings, setLoadings] = useState([]);
    const [pageLoaded, setPageLoaded] = useState(false);

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

    const readLevels = async () => {
        try {
            const res = await fetch(`${BASE_URL}/data/level`, {
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setLevels(() => data);
        } catch (error) {
            console.log("error fetching levels ", error);
        }
    };

    const findLan = (lanId) => {
        return languages?.find((lan) => lan?.id === lanId);
    };

    const editLanguage = async (lan) => {
        setSelectedLan(findLan(lan?.id));
        setSelectedSpecialitys(lan?.speciality);
        setSelectedSkills(Object.values(lan?.skill));
        setSelectedLevels(lan?.level);

        setCurrentStep(2);
        setOpenModal(true);
    };

    const fetchAddedLanguages = async () => {
        setPageLoaded(false);
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
            setLoadings(Array(data?.length).fill(false));
        } catch (error) {
            console.log("Error fetching added languages ", error);
        }
        setPageLoaded(true);
    };

    const deleteLanguage = async (id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/delete/language/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "danger", "این زبان حذف شد");
                setDModalVisible(false);
                await fetchAddedLanguages();
            }
        } catch (error) {
            console.log("Error deleting language ", error);
        }

        temp = [...loadings];
        temp[i] = false;
        setLoadings(() => temp);
    };

    useEffect(() => {
        if (!openModal) {
            fetchAddedLanguages();
        }
    }, [openModal]);

    useEffect(() => {
        if (token) {
            fetchAddedLanguages();
            readLanguages();
            readLevels();
        }
    }, [token]);

    return (
        <div className={styles.step}>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteLanguage}
            />

            <DeleteModal
                visible={dModalVisible}
                setVisible={setDModalVisible}
                title="حذف زبان"
                bodyDesc={`آیا از حذف زبان «${toBeDeletedLan.persian_name}» اطمینان دارید؟`}
                handleOk={() => {
                    deleteLanguage(toBeDeletedLan?.id, toBeDeletedLan.index);
                }}
                confirmLoading={loadings[toBeDeletedLan.index]}
            />

            {pageLoaded ? (
                <div className="container">
                    <div className={styles.step__row}>
                        {/* Add new language button */}
                        <div className={styles["step__newlan-wrapper"]}>
                            <button
                                className={styles["step__newlan-btn"]}
                                type="button"
                                onClick={() => setOpenModal(true)}
                            >
                                <img
                                    src="/icons/plus.png"
                                    alt="plus icon"
                                    width={38}
                                    height={38}
                                />
                                <span>اضافه کردن زبان جدید</span>
                            </button>
                        </div>

                        {/* New language modal */}
                        {openModal && (
                            <LanModal
                                show={openModal}
                                setter={setOpenModal}
                                selectedLan={selectedLan}
                                setSelectedLan={setSelectedLan}
                                selectedSpecialitys={selectedSpecialitys}
                                setSelectedSpecialitys={setSelectedSpecialitys}
                                selectedSkills={selectedSkills}
                                setSelectedSkills={setSelectedSkills}
                                selectedLevels={selectedLevels}
                                setSelectedLevels={setSelectedLevels}
                                errors={errors}
                                setErrors={setErrors}
                                languages={languages}
                                levels={levels}
                                token={token}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                specialitys={specialitys}
                                setSpecialitys={setSpecialitys}
                                skills={skills}
                                setSkills={setSkills}
                                languageSchema={languageSchema}
                                showAlert={showAlert}
                                BASE_URL={BASE_URL}
                            />
                        )}
                    </div>

                    {addedLanguages?.map((item, ind) => {
                        return (
                            <div className={styles["step__box"]} key={ind}>
                                <div>
                                    <div className={styles.addedLan__row}>
                                        <span
                                            className={styles.addedLan__title}
                                        >
                                            زبان مورد تدریس
                                        </span>
                                        <div
                                            className={
                                                styles[
                                                    "addedLan__input-wrapper"
                                                ]
                                            }
                                        >
                                            <input
                                                type="text"
                                                readOnly={true}
                                                defaultValue={
                                                    item?.persian_name
                                                }
                                                className={
                                                    styles.addedLan__input
                                                }
                                            />
                                            <div
                                                className={
                                                    styles[
                                                        "addLan__btn-wrapper"
                                                    ]
                                                }
                                            >
                                                <button
                                                    className={`${styles["addLan__btn"]} ${styles["addLan__btn--edit"]}`}
                                                    onClick={() =>
                                                        editLanguage(item)
                                                    }
                                                >
                                                    <span>&#x270E;</span>
                                                    <span>ویرایش</span>
                                                </button>
                                                <button
                                                    className={`${styles["addLan__btn"]} ${styles["addLan__btn--delete"]}`}
                                                    onClick={() => {
                                                        setToBeDeletedLan({
                                                            ...item,
                                                            index: ind,
                                                        });
                                                        setDModalVisible(true);
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <AiFillDelete className="ml-2" />
                                                        <span>حذف</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.addedLan__row}>
                                        <span
                                            className={styles.addedLan__title}
                                        >
                                            تخصص مورد تدریس
                                        </span>
                                        <div
                                            className={
                                                styles["addedLan__items-box"]
                                            }
                                        >
                                            {item?.speciality?.map(
                                                (specItem, i) => {
                                                    return (
                                                        <div
                                                            className={
                                                                styles.addedLan__item
                                                            }
                                                            key={i}
                                                        >
                                                            {
                                                                specItem?.persian_name
                                                            }
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.addedLan__row}>
                                        <span
                                            className={styles.addedLan__title}
                                        >
                                            مهارت مورد تدریس
                                        </span>
                                        <div
                                            className={
                                                styles["addedLan__items-box"]
                                            }
                                        >
                                            {Object.values(item?.skill).map(
                                                (skillItem, i) => {
                                                    return (
                                                        <div
                                                            className={
                                                                styles.addedLan__item
                                                            }
                                                            key={i}
                                                        >
                                                            {
                                                                skillItem?.persian_name
                                                            }
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.addedLan__row}>
                                        <span
                                            className={styles.addedLan__title}
                                        >
                                            سطح مورد تدریس
                                        </span>
                                        <div
                                            className={
                                                styles["addedLan__items-box"]
                                            }
                                        >
                                            {item?.level?.map(
                                                (levelItem, i) => {
                                                    return (
                                                        <div
                                                            className={
                                                                styles.addedLan__item
                                                            }
                                                            key={i}
                                                        >
                                                            {
                                                                levelItem?.persian_name
                                                            }
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.addedLan__row}>
                                        <span className={styles.addedLan__sugg}>
                                            برای اینکه در صفحه اساتید بهتر دیده
                                            شوید مواردی را انتخاب کنید.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Errors */}
                    <div className={styles["step__row-errors"]}>
                        {errors?.length !== 0 && <Error errorList={errors} />}
                    </div>
                </div>
            ) : (
                <div>
                    <h2>در حال خواندن اطلاعات...</h2>
                </div>
            )}
        </div>
    );
}

export default Step4;
