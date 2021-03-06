import { useEffect, useState } from "react";
import styles from "./CreateScore.module.css";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../../constants";
import Box from "../../../Elements/Box/Box";
import FetchSearchSelect from "../../../Elements/FetchSearchSelect/FetchSearchSelect";
import SearchSelect from "../../../../../../SearchSelect/SearchSelect";

const teacherSchema = { id: "", name: "", family: "" };
const studentSchema = { id: "", name: "", family: "" };

function CreateScore({ token }) {
    const [formData, setFormData] = useState({
        desc: "",
        desc: false,
        point_type: "1",
        notify_teacher: false,
        number: 1,
        teacher_side_desc: "",
        accounting_effect: false,
    });
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [selectedStudent, setSelectedStudent] = useState(studentSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedTeacher.id && formData.number && formData.point_type) {
            const fd = new FormData();
            fd.append("teacher_id", selectedTeacher.id);
            fd.append("number", Number(formData.number));
            fd.append("point_type", Number(formData.point_type));
            if (
                Number(formData.point_type) === 0 &&
                formData.accounting_effect
            ) {
                fd.append(
                    "accounting_effect",
                    Number(formData.accounting_effect)
                );
                if (formData.teacher_side_desc) {
                    fd.append("teacher_side_desc", formData.teacher_side_desc);
                }
            }
            if (formData.desc) {
                fd.append("desc", formData.desc);
            }
            if (selectedStudent.id) {
                fd.append("user_id", Number(selectedStudent.id));
            }
            fd.append("notify_teacher", Number(formData.notify_teacher));

            await addScore(fd);
        } else {
            showAlert(true, "danger", "???????? ???????????? ???? ?????????? ????????");
        }
    };

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addScore = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/teacher/point`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                let message = "???????????? ???? ???????????? ?????? ????";
                showAlert(true, "success", message);
                router.push("/score/minus/getAllScores");
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "?????????? ?????? ????????"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error adding point", error);
        }
    };

    const searchTeachers = async (teacher_name) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/name/search?name=${teacher_name}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setTeachers(data);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "?????????? ?????? ????????"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error searching teachers", error);
        }
    };

    const readStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/student/${selectedTeacher.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setStudents(data);
            } else {
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "?????????? ?????? ????????"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error reading students", error);
        }
    };

    useEffect(() => {
        if (selectedTeacher.id) {
            readStudents();
        } else {
            setStudents([]);
        }
        setSelectedStudent(studentSchema);
    }, [selectedTeacher]);

    return (
        <form onSubmit={handleSubmit}>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="?????????? ???????????? ???????? ??????????">
                <div className="form">
                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="language_id"
                                    className={`form__label ${styles.form__label}`}
                                >
                                    ???????????? :
                                    <span className="form__star">*</span>
                                </label>
                                <div
                                    className={`form-control form-control-searchselect`}
                                >
                                    <FetchSearchSelect
                                        list={teachers}
                                        setList={setTeachers}
                                        placeholder="?????????? ????????"
                                        selected={selectedTeacher}
                                        displayKey="family"
                                        displayPattern={[
                                            { member: true, key: "name" },
                                            { member: false, key: " " },
                                            { member: true, key: "family" },
                                            { member: false, key: " - " },
                                            { member: true, key: "mobile" },
                                        ]}
                                        setSelected={setSelectedTeacher}
                                        noResText="???????????? ???????? ??????"
                                        listSchema={teacherSchema}
                                        stylesProps={{
                                            width: "100%",
                                        }}
                                        background="#fafafa"
                                        fontSize={16}
                                        onSearch={(value) =>
                                            searchTeachers(value)
                                        }
                                        id="id"
                                        openBottom={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="language_id"
                                    className={`form__label ${styles.form__label}`}
                                >
                                    ???????? ??????????????? :
                                </label>
                                <div
                                    className={`form-control form-control-searchselect`}
                                >
                                    <SearchSelect
                                        list={students}
                                        defaultText="???????????? ????????"
                                        selected={selectedStudent}
                                        displayKey="name_family"
                                        displayPattern={[
                                            {
                                                member: true,
                                                key: "name_family",
                                            },
                                        ]}
                                        setSelected={setSelectedStudent}
                                        noResText="???????? ??????"
                                        listSchema={studentSchema}
                                        stylesProps={{
                                            width: "100%",
                                        }}
                                        background="#fafafa"
                                        openBottom={true}
                                        id="id"
                                        fontSize={16}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="desc" className="form__label">
                            ?????????????? :
                        </label>
                        <textarea
                            type="text"
                            name="desc"
                            id="desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                            spellCheck={false}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="notify_teacher"
                            className={`form__label`}
                        >
                            ?????????? ???????? ?????????? :
                        </label>
                        <div className="form-control form-control-radio">
                            <div className="input-radio-wrapper">
                                <label
                                    htmlFor="notify_teacher"
                                    className="radio-title"
                                >
                                    ?????????? ??????
                                </label>
                                <input
                                    type="checkbox"
                                    name="notify_teacher"
                                    onChange={handleOnChange}
                                    checked={
                                        Number(formData.notify_teacher) === 1
                                    }
                                    id="notify_teacher"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="point_type"
                                    className={`form__label`}
                                >
                                    ?????? ???????????? :
                                    <span className="form__star">*</span>
                                </label>
                                <div className="form-control form-control-radio">
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="positive"
                                            className="radio-title"
                                        >
                                            ????????
                                        </label>
                                        <input
                                            type="radio"
                                            name="point_type"
                                            onChange={handleOnChange}
                                            value={1}
                                            checked={
                                                Number(formData.point_type) ===
                                                1
                                            }
                                            id="positive"
                                            required
                                        />
                                    </div>
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="negative"
                                            className="radio-title"
                                        >
                                            ????????
                                        </label>
                                        <input
                                            type="radio"
                                            name="point_type"
                                            onChange={handleOnChange}
                                            value={0}
                                            checked={
                                                Number(formData.point_type) ===
                                                0
                                            }
                                            id="negative"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="number"
                                    className={`form__label`}
                                >
                                    ???????????? :
                                    <span className="form__star">*</span>
                                </label>
                                <div className="form-control">
                                    <select
                                        name="number"
                                        id="number"
                                        className="form__input input-select"
                                        onChange={handleOnChange}
                                        value={formData.number}
                                        required
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    {Number(formData.point_type) === 0 && (
                        <div className="input-wrapper">
                            <label
                                htmlFor="teacher_side_desc"
                                className="form__label"
                            >
                                ?????????????? ?????? ?????????? :
                            </label>
                            <textarea
                                type="text"
                                name="teacher_side_desc"
                                id="teacher_side_desc"
                                className="form__textarea"
                                onChange={handleOnChange}
                                spellCheck={false}
                            />
                        </div>
                    )}
                    {Number(formData.point_type) === 0 && (
                        <div className="input-wrapper">
                            <label
                                htmlFor="accounting_effect"
                                className={`form__label`}
                            >
                                ?????????? ???? ???????????????? :
                            </label>
                            <div className="form-control form-control-radio">
                                <div className="input-radio-wrapper">
                                    <label
                                        htmlFor="accounting_effect"
                                        className="radio-title"
                                    >
                                        ???????? ??????
                                    </label>
                                    <input
                                        type="checkbox"
                                        name="accounting_effect"
                                        onChange={handleOnChange}
                                        checked={
                                            Number(
                                                formData.accounting_effect
                                            ) === 1
                                        }
                                        id="accounting_effect"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "???? ?????? ?????????? ..." : "?????????? "}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default CreateScore;
