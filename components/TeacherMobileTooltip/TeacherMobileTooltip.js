import { memo } from "react";
import { Tooltip } from "antd";
import { AiOutlineInfoCircle } from "react-icons/ai";

function TeacherMobileTooltip({ mobile }) {
    return (
        <Tooltip title={mobile} overlayStyle={{ fontSize: 12 }}>
            <span
                className="info-icon"
                onClick={() => {
                    navigator.clipboard.writeText(mobile);
                }}
            >
                <AiOutlineInfoCircle />
            </span>
        </Tooltip>
    );
}

export default memo(TeacherMobileTooltip);
