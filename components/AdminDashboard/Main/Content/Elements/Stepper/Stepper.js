import styles from "./Stepper.module.css";

function Stepper({ currentStep, setCurrentStep, steps, lastStepAllowed }) {
    const goNextStep = () => {
        if (currentStep !== steps?.length) {
            setCurrentStep(currentStep + 1);
        }
    };
    const goPrevStep = () => {
        if (currentStep !== 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className={styles.stepper}>
            {/* Stepper Header */}
            <div className={styles.stepper__header}>
                {steps?.map((step, ind) => (
                    <button
                        className={`${styles["stepper__header-item"]} ${
                            currentStep === ind &&
                            styles["stepper__header-item--active"]
                        }`}
                        type="button"
                        onClick={() => setCurrentStep(ind)}
                        key={ind}
                        disabled={ind > lastStepAllowed}
                    >
                        <span className={styles["stepper__header-number"]}>
                            {ind + 1}
                        </span>
                        <span className={styles["stepper__header-title"]}>
                            {step.title}
                        </span>
                    </button>
                ))}
            </div>

            <div className={styles.stepper__body}>
                {steps?.map((step, ind) => (
                    <div
                        className={`${styles["stepper__body-item"]} ${
                            currentStep === ind &&
                            styles["stepper__body-item--active"]
                        }`}
                        key={ind}
                    >
                        <step.Component
                            goNextStep={goNextStep}
                            goPreviousStep={goPrevStep}
                            step={ind}
                            currentStep={currentStep}
                            isFirst={ind === 0}
                            isLast={ind === steps?.length - 1}
                            {...step.props}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Stepper;
