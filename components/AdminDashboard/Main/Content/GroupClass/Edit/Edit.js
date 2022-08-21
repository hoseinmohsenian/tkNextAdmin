import { useState } from "react";
import styles from "../Create/CreateGroupClass.module.css";
import Stepper from "../../Elements/Stepper/Stepper";
import AddSessions from "./StepperScreens/AddSessions/AddSessions";
import CreateClass from "./StepperScreens/EditClass/EditClass";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

function EditGroupClass({ token, languages, levels, fetchedClass }) {
    const [formData, setFormData] = useState(fetchedClass);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [currentStep, setCurrentStep] = useState(0);

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    groupClass: "کلاس گروهی",
                    edit: "ویرایش",
                }}
            />

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
                                fetchedClass,
                            },
                        },
                    ]}
                    lastStepAllowed={formData.id ? 1 : 0}
                />
            </div>
        </div>
    );
}

export default EditGroupClass;
