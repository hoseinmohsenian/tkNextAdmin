import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";
import FetchSearchSelect from "../../Elements/FetchSearchSelect/FetchSearchSelect";

const teacherSchema = { id: "", name: "", family: "", mobile: "" };

function TeacherManualTransaction({ token }) {
    const [formData, setFormData] = useState({
        desc: "",
        status: 0,
        amount: "",
    });
    const [students, setTeachers] = useState([]);
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

        if (formData.amount && formData.desc && selectedTeacher.id) {
            const fd = new FormData();
            fd.append("amount", formData.amount);
            fd.append("desc", formData.desc);
            fd.append("status", Number(formData.status));
            await addTransaction(fd);
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

    const addTransaction = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/accounting/teacher/manual/transaction/${selectedTeacher.id}`,
                {
                    method: "POST",
                    body: fd,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "success", "اعتبار باموفقیت ثبت شد");
                router.push("/tkpanel/teacher/credits");
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
            console.log("Error adding transaction", error);
        }
    };

    const searchTeachers = async (input) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/search?name=${input}`,
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

            <Box title="تغییر اعتبار استاد">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="student" className="form__label">
                            استاد :<span className="form__star">*</span>
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <FetchSearchSelect
                                list={students}
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
                        <label htmlFor="status" className="form__label">
                            نوع عملیات :<span className="form__star">*</span>
                        </label>
                        <div className="form-control form-control-radio">
                            <div className="input-radio-wrapper">
                                <label
                                    htmlFor="deposit"
                                    className="radio-title"
                                >
                                    افزایش
                                </label>
                                <input
                                    type="radio"
                                    name="status"
                                    onChange={handleOnChange}
                                    value={0}
                                    checked={Number(formData.status) === 0}
                                    id="deposit"
                                    required
                                />
                            </div>
                            <div className="input-radio-wrapper">
                                <label
                                    htmlFor="withdrawal"
                                    className="radio-title"
                                >
                                    کاهش
                                </label>
                                <input
                                    type="radio"
                                    name="status"
                                    onChange={handleOnChange}
                                    value={1}
                                    checked={Number(formData.status) === 1}
                                    id="withdrawal"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="amount" className="form__label">
                            مبلغ به تومان :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                placeholder="تومان"
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="english_name" className="form__label">
                            توضیحات :<span className="form__star">*</span>
                        </label>
                        <textarea
                            type="text"
                            name="desc"
                            id="desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ثبت اعتبار"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default TeacherManualTransaction;
