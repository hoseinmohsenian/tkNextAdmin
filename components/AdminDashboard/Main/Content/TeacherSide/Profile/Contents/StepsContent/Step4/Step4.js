import { useEffect, useState } from "react";
import styles from "./Step4.module.css";
import LanModal from "./LanModal/LanModal";
import Error from "../../../../../../../../Error/Error";
import DeleteModal from "../../../../../Elements/ModalDelete/ModalDelete";
import { AiFillDelete } from "react-icons/ai";

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
    const {
        languages,
        levels,
        addedLanguages: fetchedAddedLanguages,
        token,
    } = props;
    const [openModal, setOpenModal] = useState(false);
    const [visible, setVisible] = useState(false);
    const [LanguageRowID, setLanguageRowID] = useState(" ");

    const [addedLanguages, setAddedLanguages] = useState(fetchedAddedLanguages);
    const [selectedLan, setSelectedLan] = useState(languageSchema);
    const [selectedSpecialitys, setSelectedSpecialitys] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [errors, setErrors] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [specialitys, setSpecialitys] = useState([]);
    const [skills, setSkills] = useState([]);

    const handleClick = () => {
        console.log("clicked");
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
        try {
            const res = await fetch(
                "https://api.barmansms.ir/api/teacher/profile/return/languages",
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
        } catch (error) {
            console.log("Error fetching added languages ", error);
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

    const deleteLanguageHandler = async (id) => {
        await deleteLanguage(id);
        await fetchAddedLanguages();
        setVisible(false);
    };

    useEffect(() => {
        if (!openModal) {
            fetchAddedLanguages();
        }
    }, [openModal]);

    return (
        <div className={styles.step}>
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
                        />
                    )}
                </div>

                {/* Errors */}
                <div className={styles["step__row-errors"]}>
                    {errors?.length !== 0 && <Error errorList={errors} />}
                </div>

                {addedLanguages?.map((item, ind) => {
                    return (
                        <div className={styles["step__box"]} key={ind}>
                            <div>
                                <div className={styles.addedLan__row}>
                                    <span className={styles.addedLan__title}>
                                        زبان مورد تدریس
                                    </span>
                                    <div
                                        className={
                                            styles["addedLan__input-wrapper"]
                                        }
                                    >
                                        <input
                                            type="text"
                                            readOnly={true}
                                            defaultValue={item?.persian_name}
                                            className={styles.addedLan__input}
                                        />
                                        <div
                                            className={
                                                styles["addLan__btn-wrapper"]
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
                                                    setLanguageRowID(item?.id),
                                                        setVisible(true);
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
                                    <span className={styles.addedLan__title}>
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
                                                        {specItem?.persian_name}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                                <div className={styles.addedLan__row}>
                                    <span className={styles.addedLan__title}>
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
                                    <span className={styles.addedLan__title}>
                                        سطح مورد تدریس
                                    </span>
                                    <div
                                        className={
                                            styles["addedLan__items-box"]
                                        }
                                    >
                                        {item?.level?.map((levelItem, i) => {
                                            return (
                                                <div
                                                    className={
                                                        styles.addedLan__item
                                                    }
                                                    key={i}
                                                >
                                                    {levelItem?.persian_name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className={styles.addedLan__row}>
                                    <span className={styles.addedLan__sugg}>
                                        برای اینکه در صفحه اساتید بهتر دیده شوید
                                        مواردی را انتخاب کنید.
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className={styles["step__btn-wrapper"]}>
                    <button
                        type="button"
                        className={styles["step__btn"]}
                        onClick={handleClick}
                    >
                        ذخیره
                    </button>
                </div>
            </div>
            {/* visible, setVisible */}

            <DeleteModal
                visible={visible}
                hideModal={() => {
                    setVisible(false);
                }}
                type={"زبان"}
                acceptFunc={() => {
                    deleteLanguageHandler(LanguageRowID);
                }}
            />
        </div>
    );
}

export default Step4;
