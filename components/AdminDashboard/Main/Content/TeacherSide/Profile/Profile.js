import { useState } from "react";
import styles from "./Profile.module.css";
import Steps from "./Steps/Steps";
import Contents from "./Contents/Contents";

function Profile({ tutorToken }) {
    const [step, setStep] = useState(1);

    return (
        <div className={styles.profile}>
            <Steps step={step} setStep={setStep} />
            <Contents step={step} setStep={setStep} token={tutorToken} />
        </div>
    );
}

export default Profile;
