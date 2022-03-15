import { useEffect, useState } from "react";
import styles from "./CreateGroupClass.module.css";
import Stepper from "../../Elements/Stepper/Stepper";
import AddSessions from "./StepperScreens/AddSessions/AddSessions";
import CreateClass from "./StepperScreens/CreateClass/CreateClass";

function CreateGroupClass({ token, languages, levels }) {
    const [formData, setFormData] = useState({
        title: "",
        language_id: 1,
        seo_key: "",
        image: null,
        title_seo: "",
        seo_desc: "",
        desc: "",
        teacher_name: "",
        level_id: 0,
        class_number: "",
        class_capacity: "",
        session_time: "",
        price: "",
        commission: "",
        id: "",
        session: [],
    });
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [currentStep, setCurrentStep] = useState(0);

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    useEffect(() => {
        if (formData.id) {
            let message = "مرحله اول باموفقیت ثبت شد";
            showAlert(true, "success", message);
        }
    }, [formData.id]);

    return (
        <div>
            <div className={styles.stepper}>
                <Stepper
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    steps={[
                        {
                            title: "مرحله اول",
                            Component: CreateClass,
                            props: {
                                token,
                                languages,
                                levels,
                                currentStep,
                                setCurrentStep,
                                formData,
                                setFormData,
                                showAlert,
                                alertData,
                            },
                        },
                        {
                            title: "ثبت جلسات",
                            Component: AddSessions,
                            props: {
                                token,
                                showAlert,
                                alertData,
                                formData,
                                setFormData,
                            },
                        },
                    ]}
                    lastStepAllowed={formData.id ? 1 : 0}
                />
            </div>
        </div>
    );
}

export default CreateGroupClass;
