import { useEffect, useState } from "react";
import styles from "./Create.module.css";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";
import FetchSearchSelect from "../../Elements/FetchSearchSelect/FetchSearchSelect";
import SearchMultiSelect from "../../../../../SearchMultiSelect/SearchMultiSelect";

const teacherSchema = { id: "", name: "", family: "" };
const studentSchema = { id: "", name: "", family: "" };

function CreateSemiPrivate({ token }) {
    const [formData, setFormData] = useState({
        title: "",
        price: 0,
        language_id: 1,
        rate: 0,
    });
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData.title.trim() &&
            formData.language_id &&
            selectedTeacher.id &&
            selectedStudents.length >= 2 &&
            Number(formData.price) !== 0
        ) {
            const fd = new FormData();
            fd.append("title", formData.title);
            fd.append("language_id", Number(formData.language_id));
            fd.append("teacher_id", selectedTeacher.id);
            for (let i = 0; i < selectedStudents.length; i++) {
                fd.append(`user_id[${i}]`, selectedStudents[i].id);
            }
            fd.append("price", Number(formData.price));
            await addClass(fd);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
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

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addClass = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/semi-private`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "کلاس جدید با موفقیت اضافه شد");
                router.push("/tkpanel/semi-private-admin");
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error adding a new semi-private class", error);
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
                        "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error reading students", error);
        }
    };

    const clacPrice = () => {
        let rt = formData.rate;
        let len = selectedStudents.length;
        if (rt !== null) {
            if (len === 2) {
                setFormData({ ...formData, price: rt * 1.3 });
            }
            if (len === 3) {
                setFormData({ ...formData, price: rt * 1.6 });
            }
            if (len === 4) {
                setFormData({ ...formData, price: rt * 2 });
            } else if (len <= 1) {
                setFormData({ ...formData, price: 0 });
            }
        } else {
            setFormData({ ...formData, price: 0 });
        }
    };

    const readPrice = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/semi-private/course/price?teacher_id=${selectedTeacher.id}&language_id=${formData.language_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setFormData({ ...formData, rate: data === null ? 0 : data });
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
            console.log("Error reading price", error);
        }
    };

    const readTeacherLanguages = async () => {
        setLoading(true);

        try {
            const res = await fetch(
                `${BASE_URL}/data/teacher/language?teacher_id=${selectedTeacher.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setLanguages(data);
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
            console.log("Error reading teacher languages", error);
        }
    };

    useEffect(() => {
        // Reading students based on teacher_id
        if (selectedTeacher.id) {
            readStudents();
            readTeacherLanguages();
        } else {
            setStudents([]);
            setLanguages([]);
        }
        setSelectedStudents([]);
        setFormData({ ...formData, price: 0, language_id: 0 });
    }, [selectedTeacher]);

    // Reading price based on teacher_id and language_id
    useEffect(() => {
        if (selectedTeacher.id && formData.language_id) {
            readPrice();
        }
    }, [selectedTeacher, formData.language_id]);

    useEffect(() => {
        clacPrice();
    }, [selectedStudents, formData.language_id]);

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="ایجاد کلاس نیمه خصوصی">
                <form onSubmit={handleSubmit} className="form">
                    <div className={styles["inputs-container"]}>
                        <div className={styles["row-wrapper"]}>
                            <div className={styles["number"]}>1</div>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="teacher_name"
                                    className="form__label"
                                >
                                    استاد :<span className="form__star">*</span>
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
                                        onSearch={(value) =>
                                            searchTeachers(value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles["row-wrapper"]}>
                            <div className={styles["number"]}>2</div>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="persian_name"
                                    className="form__label"
                                >
                                    زبان :<span className="form__star">*</span>
                                </label>
                                <div className="form-control">
                                    <select
                                        name="language_id"
                                        id="language_id"
                                        className="form__input input-select"
                                        onChange={handleOnChange}
                                        value={formData.language_id}
                                        required
                                    >
                                        <option value={0}>انتخاب کنید</option>
                                        {languages?.map((lan) => (
                                            <option
                                                key={lan?.id}
                                                value={lan?.id}
                                            >
                                                {lan?.persian_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className={styles["row-wrapper"]}>
                            <div className={styles["number"]}>3</div>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="teacher_name"
                                    className="form__label"
                                >
                                    زبان آموزان‌ :
                                    <span className="form__star">*</span>
                                </label>
                                <div
                                    className={styles["form-control-container"]}
                                >
                                    <div
                                        className={
                                            styles["form__second-label-wrapper"]
                                        }
                                    >
                                        <span>حداقل دو مورد</span>
                                        <span>
                                            {selectedStudents.length} از 4
                                        </span>
                                    </div>
                                    <div
                                        className={`form-control form-control-searchselect`}
                                    >
                                        <SearchMultiSelect
                                            list={students}
                                            defaultText="انتخاب کنید"
                                            selected={selectedStudents}
                                            displayKey="name_family"
                                            id="id"
                                            setSelected={setSelectedStudents}
                                            noResText="یافت نشد"
                                            listSchema={studentSchema}
                                            stylesProps={{
                                                width: "100%",
                                            }}
                                            background="#fafafa"
                                            max={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles["row-wrapper"]}>
                            <div className={styles["number"]}>4</div>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label htmlFor="title" className="form__label">
                                    عنوان :<span className="form__star">*</span>
                                </label>
                                <div className="form-control">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="form__input"
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles["row-wrapper"]}>
                            <div className={styles["number"]}>5</div>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label htmlFor="price" className="form__label">
                                    قیمت :
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        className="form__input form__input--ltr"
                                        onChange={handleOnChange}
                                        value={formData.price}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد کلاس"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateSemiPrivate;
