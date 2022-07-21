import { Modal, Button, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function DeleteModal({ visible, hideModal, type, acceptFunc }) {
    return (
        <>
            <Modal
                title={`حذف ${type}`}
                visible={visible}
                onOk={() => {
                    acceptFunc();
                }}
                onCancel={hideModal}
                okText="بلی"
                cancelText="خیر"
                okType={"danger"}
            >
                <div
                    className="d-flex align-items-center "
                    style={{ fontSize: "15px" }}
                >
                    <ExclamationCircleOutlined style={{ color: "red" }} />
                    <p style={{ marginRight: 3 }}>
                        آیا از حذف این {type} مطمئن هستید ؟
                    </p>
                </div>
            </Modal>
        </>
    );
}
