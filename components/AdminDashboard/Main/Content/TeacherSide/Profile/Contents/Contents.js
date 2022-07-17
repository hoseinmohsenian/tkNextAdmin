import { useState } from "react";
import styles from "./Contents.module.css";
import Step1 from "./StepsContent/Step1/Step1";
import Step2 from "./StepsContent/Step2/Step2";
import Step3 from "./StepsContent/Step3/Step3";
import Step4 from "./StepsContent/Step4/Step4";
import Step5 from "./StepsContent/Step5/Step5";
import Step6 from "./StepsContent/Step6/Step6";
import Step7 from "./StepsContent/Step7/Step7";
import { useGlobalContext } from "../../../../../../../context";

function Contents({
    step,
    languages,
    levels,
    addedLanguages,
    token,
    countries,
}) {
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div className={styles.contents}>
            {step === 1 && (
                <Step1
                    token={token}
                    countries={countries}
                    languages={languages}
                    alertData={alertData}
                    showAlert={showAlert}
                />
            )}
            {step === 2 && (
                <Step2
                    token={token}
                    alertData={alertData}
                    showAlert={showAlert}
                />
            )}
            {step === 3 && <Step3 token={token} />}
            {step === 4 && (
                <Step4
                    languages={languages}
                    levels={levels}
                    addedLanguages={addedLanguages}
                    token={token}
                />
            )}
            {step === 5 && <Step5 />}
            {step === 6 && <Step6 token={token} />}
            {step === 7 && <Step7 token={token} />}
        </div>
    );
}

export default Contents;
