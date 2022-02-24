import React from "react";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";

const DateInput = (props) => {
    const renderCustomInput = ({ ref }) => (
        <input
            readOnly
            ref={ref}
            placeholder={props.placeholder}
            value={
                props.value
                    ? `${props.value.year}-${props.value.month}-${props.value.day}`
                    : ""
            }
            className={props.className}
            style={{ width: "100%" }}
        />
    );

    return (
        <DatePicker
            {...props}
            renderInput={renderCustomInput}
            style={{ width: "100%" }}
        />
    );
};

export default DateInput;
