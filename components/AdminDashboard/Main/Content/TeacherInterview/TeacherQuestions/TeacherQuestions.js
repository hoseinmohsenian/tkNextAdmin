import { useState, useCallback } from "react";
import Box from "../../Elements/Box/Box";
import Modal from "../../../../../Modal/Modal";
import Alert from "../../../../../Alert/Alert";
import AddEdit_Question from "./AddEdit_Question/AddEdit_Question";

const formDataSchema = {
    id: "",
    teacher_id: "",
    question: "",
    answer: "",
};

function TeacherQuestions({ fetchedList, teacher, token }) {
    const [list, setList] = useState(fetchedList);
    const [formData, setFormData] = useState(formDataSchema);
    const [loadings, setLoadings] = useState(
        Array(fetchedList?.length).fill(false)
    );
    const [selectedItem, setSelectedItem] = useState(formDataSchema);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fullName = `${teacher.name} ${teacher.family}`;
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const deleteQuestion = async (question_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/interview/${question_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "پرسش حذف شد";
                showAlert(true, "danger", message);
                removeQuestionFromList(question_id);
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting question", error);
        }
    };

    const removeQuestionFromList = (question_id) => {
        let filteredItems = list.filter((cms) => cms.id !== question_id);
        setList(() => filteredItems);
    };

    const readQuestions = useCallback(async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/interview/list?teacher_id=${teacher.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setList(data);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading questions", error);
        }
    }, []);

    const openModal = () => {
        setFormData(() => {
            return { ...formDataSchema, teacher_id: teacher.id };
        });
        setIsModalOpen(true);
    };

    return (
        <div>
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteQuestion}
            />

            <Box
                title={`لیست پرسش های استاد ${fullName}`}
                buttonInfo={{
                    name: "تعریف پرسش",
                    onClick: openModal,
                    color: "primary",
                }}
            >
                <Modal
                    show={isModalOpen}
                    setter={setIsModalOpen}
                    showHeader
                    padding
                >
                    <AddEdit_Question
                        showAlert={showAlert}
                        setIsModalOpen={setIsModalOpen}
                        token={token}
                        readQuestions={readQuestions}
                        alertData={alertData}
                        formData={formData}
                        setFormData={setFormData}
                        data={selectedItem}
                    />
                </Modal>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">پرسش</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {list?.map((item, i) => (
                                <tr className="table__body-row" key={item?.id}>
                                    <td className="table__body-item">
                                        {item?.question}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn primary`}
                                            onClick={() => {
                                                setFormData(item);
                                                setSelectedItem(item);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteQuestion(item?.id, i)
                                            }
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {list.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={2}
                                    >
                                        پرسشی وجود ندارد!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}

export default TeacherQuestions;
