import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";
import FetchSearchSelect from "../../Elements/FetchSearchSelect/FetchSearchSelect";

const studentSchema = { id: "", name_family: "", mobile: "" };
const teacherSchema = { id: "", name: "", family: "", mobile: "" };

function CreateLog({ token, statusList, admins, logs }) {
    const [formData, setFormData] = useState({
        desc: "",
        status: 0,
        admin_assign_id: 0,
        parent_id: 0,
    });
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(studentSchema);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(formData.status) !== 0) {
            const fd = new FormData();
            fd.append("status", Number(formData.status));
            if (formData.desc) {
                fd.append("desc", formData.desc);
            }
            if (selectedStudent.id) {
                fd.append("user_id", selectedStudent.id);
            }
            if (selectedTeacher.id) {
                fd.append("teacher_id", selectedTeacher.id);
            }
            if (Number(formData.admin_assign_id) !== 0) {
                fd.append("admin_assign_id", Number(formData.admin_assign_id));
            }
            if (Number(formData.parent_id) !== 0) {
                fd.append("parent_id", Number(formData.parent_id));
            }

            await submitLog(fd);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const submitLog = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/tracking-log`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "لاگ باموفقیت ثبت شد");
                router.push("/tkpanel/logReport/show");
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error adding log", error);
        }
    };

    const searchStudents = async (input) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/student/search?input=${input}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const {
                    data: { data },
                } = await res.json();
                setStudents(data);
            } else {
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error searching students", error);
        }
    };

    const searchTeachers = async (input) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/name/search?name=${input}`,
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
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error searching teachers", error);
        }
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box
                title="ایجاد لاگ"
                buttonInfo={{
                    name: "ایجاد وضعیت",
                    url: "/tkpanel/logReport/status/create",
                    color: "primary",
                }}
            >
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="status" className="form__label">
                            وضعیت :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="status"
                                id="status"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.status}
                                required
                            >
                                <option value={0}>انتخاب کنید</option>
                                {statusList?.map((status) => (
                                    <option key={status?.id} value={status?.id}>
                                        {status?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="admin_assign_id"
                            className="form__label"
                        >
                            ادمین :
                        </label>
                        <div className="form-control">
                            <select
                                name="admin_assign_id"
                                id="admin_assign_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.admin_assign_id}
                            >
                                <option value={0}>انتخاب کنید</option>
                                {admins?.map((admin) => (
                                    <option key={admin?.id} value={admin?.id}>
                                        {admin?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="parent_id" className="form__label">
                            لاگ والد :
                        </label>
                        <div className="form-control">
                            <select
                                name="parent_id"
                                id="parent_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.parent_id}
                            >
                                <option value={0}>انتخاب کنید</option>
                                {logs.data?.map((lg) => (
                                    <option key={lg?.id} value={lg?.id}>
                                        {lg?.desc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="student" className="form__label">
                            زبان آموز :
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <FetchSearchSelect
                                list={students}
                                setList={setStudents}
                                placeholder="جستجو کنید"
                                selected={selectedStudent}
                                displayKey="name_family"
                                displayPattern={[
                                    { member: true, key: "name_family" },
                                    { member: false, key: " - " },
                                    { member: true, key: "mobile" },
                                ]}
                                setSelected={setSelectedStudent}
                                noResText="زبان آموزی پیدا نشد"
                                listSchema={studentSchema}
                                stylesProps={{
                                    width: "100%",
                                }}
                                background="#fafafa"
                                fontSize={16}
                                onSearch={(value) => searchStudents(value)}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="student" className="form__label">
                            استاد :
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <FetchSearchSelect
                                list={teachers}
                                setList={setTeachers}
                                placeholder="جستجو کنید"
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
                                noResText="استادی پیدا نشد"
                                listSchema={teacherSchema}
                                stylesProps={{
                                    width: "100%",
                                }}
                                background="#fafafa"
                                fontSize={16}
                                onSearch={(value) => searchTeachers(value)}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="english_name" className="form__label">
                            توضیحات :
                        </label>
                        <textarea
                            type="text"
                            name="desc"
                            id="desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ثبت لاگ"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateLog;
