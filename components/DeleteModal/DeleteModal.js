import { Modal, Button, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function DeleteModal({
    visible,
    setVisible,
    handleCancel,
    title,
    handleOk,
    okText = "بلی",
    cancelText = "خیر",
    bodyDesc,
    confirmLoading,
}) {
    return (
        <>
            <Modal
                title={title}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel ? handleCancel : () => setVisible(false)}
                okText={okText}
                cancelText={cancelText}
                okType={"danger"}
                confirmLoading={confirmLoading}
            >
                <div
                    className="d-flex align-items-center "
                    style={{ fontSize: "15px" }}
                >
                    <ExclamationCircleOutlined style={{ color: "red" }} />
                    <p style={{ marginRight: 3 }}>{bodyDesc}</p>
                </div>
            </Modal>
        </>
    );
}

export default DeleteModal;
