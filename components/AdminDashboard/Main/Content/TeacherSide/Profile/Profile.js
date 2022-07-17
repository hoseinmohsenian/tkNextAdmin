import { useState } from "react";
import styles from "./Profile.module.css";
import Steps from "./Steps/Steps";
import Contents from "./Contents/Contents";

function Profile({
    languages,
    levels,
    addedLanguages,
    countries,
    tutorToken,
    adminToken,
}) {
    const [step, setStep] = useState(1);

    return (
        <div className={styles.profile}>
            <Steps step={step} setStep={setStep} />
            <Contents
                step={step}
                setStep={setStep}
                languages={languages}
                levels={levels}
                addedLanguages={addedLanguages}
                token={tutorToken}
                countries={countries}
            />
        </div>
    );
}

export default Profile;
