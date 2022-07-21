import { useEffect, useState } from "react";
import styles from "./CreateClass.module.css";
import Alert from "../../../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../../../constants";
import moment from "jalali-moment";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import Box from "../../../../Elements/Box/Box";
import SearchMultiSelect from "../../../../../../../SearchMultiSelect/SearchMultiSelect";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../../../Editor/Editor"), {
    ssr: false,
});
import FetchSearchSelect from "../../../../Elements/FetchSearchSelect/FetchSearchSelect";
import Error from "../../../../../../../Error/Error";

const teacherSchema = { id: "", name: "", family: "" };

function CreateClass(props) {
    const {
        token,
        levels,
        currentStep,
        setCurrentStep,
        formData,
        setFormData,
        showAlert,
        alertData,
    } = props;
    const [desc, setDesc] = useState("");
    const [selectedDate, setSelectedDate] = useState();
    const [selectedSpecialitys, setSelectedSpecialitys] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [specialitys, setSpecialitys] = useState([]);
    const [skills, setSkills] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [loading, setLoading] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [addedData, setAddedData] = useState({});
    const [errors, setErrors] = useState([]);
    moment.locale("fa", { useGregorianParser: true });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData.language_id &&
            selectedTeacher.id &&
            formData.title.trim() &&
            selectedSpecialitys.length >= 2 &&
            selectedSkills.length >= 3 &&
            formData.class_capacity &&
            formData.class_number &&
            formData.price
        ) {
            if (formData.id) {
                const fd = new FormData();
                if (selectedTeacher.id !== addedData.teacher_id) {
                    fd.append("teacher_id", selectedTeacher.id);
                }
                if (Number(formData.language_id) !== addedData.language_id) {
                    fd.append("language_id", Number(formData.language_id));
                }
                if (formData.title !== addedData.title) {
                    fd.append("title", formData.title);
                }
                if (
                    Number(formData.class_capacity) !== addedData.class_capacity
                ) {
                    fd.append(
                        "class_capacity",
                        Number(formData.class_capacity)
                    );
                }
                if (Number(formData.class_number) !== addedData.class_number) {
                    fd.append("class_number", Number(formData.class_number));
                }
                if (
                    Number(formData.price.replace(/,/g, "")) !== addedData.price
                ) {
                    fd.append(
                        "price",
                        Number(formData.price.replace(/,/g, ""))
                    );
                }
                let counter = 0;
                for (let i = 0; i < selectedSpecialitys.length; i++) {
                    let exsist = false;
                    for (let j = 0; j < addedData.speciality.length; j++) {
                        if (
                            selectedSpecialitys[i].id ===
                            addedData.speciality[j].speciality_id
                        ) {
                            exsist = true;
                            break;
                        }
                    }
                    if (!exsist) {
                        fd.append(
                            `speciality_id[${counter}]`,
                            selectedSpecialitys[i].id
                        );
                        counter++;
                    }
                }
                counter = 0;
                for (let i = 0; i < selectedSkills.length; i++) {
                    let exsist = false;
                    for (let j = 0; j < addedData.skill.length; j++) {
                        if (
                            selectedSkills[i].id === addedData.skill[j].skill_id
                        ) {
                            exsist = true;
                            break;
                        }
                    }
                    if (!exsist) {
                        fd.append(`skill_id[${counter}]`, selectedSkills[i].id);
                        counter++;
                    }
                }
                if (desc && desc !== addedData.desc) {
                    fd.append("desc", desc);
                }
                if (
                    formData.title_seo &&
                    formData.title_seo !== addedData.title_seo
                ) {
                    fd.append("title_seo", formData.title_seo);
                }
                if (
                    formData.seo_key &&
                    formData.seo_key !== addedData.seo_key
                ) {
                    fd.append("seo_key", formData.seo_key);
                }
                if (
                    formData.seo_desc &&
                    formData.seo_desc !== addedData.seo_desc
                ) {
                    fd.append("seo_desc", formData.seo_desc);
                }
                if (
                    Number(formData.commission) &&
                    Number(formData.commission) !== addedData.commission
                ) {
                    fd.append("commission", Number(formData.commission));
                }
                if (
                    Number(formData.session_time) &&
                    Number(formData.session_time) !== addedData.session_time
                ) {
                    fd.append(
                        "session_time",
                        Number(formData.session_time) * 30
                    );
                }
                if (selectedDate?.year) {
                    let date = moment
                        .from(
                            `${selectedDate?.year}/${selectedDate?.month}/${selectedDate?.day}`,
                            "fa",
                            "YYYY/MM/DD"
                        )
                        .locale("en")
                        .format("YYYY/MM/DD")
                        .replace("/", "-")
                        .replace("/", "-");
                    if (date !== addedData.start_date) {
                        fd.append("start_date", date);
                    }
                }
                if (formData.image && typeof formData.image === "object") {
                    fd.append("image", formData.image);
                }
                if (
                    Number(formData.level_id) &&
                    Number(formData.level_id) !== addedData.level_id
                ) {
                    fd.append("level_id", Number(formData.level_id));
                }

                await editClass(fd);
            } else {
                const fd = new FormData();
                fd.append("teacher_id", selectedTeacher.id);
                fd.append("language_id", Number(formData.language_id));
                fd.append("title", formData.title);
                fd.append("class_capacity", Number(formData.class_capacity));
                fd.append("class_number", Number(formData.class_number));
                fd.append("price", Number(formData.price.replace(/,/g, "")));
                for (let i = 0; i < selectedSpecialitys.length; i++) {
                    fd.append(`speciality_id[${i}]`, selectedSpecialitys[i].id);
                }
                for (let i = 0; i < selectedSkills.length; i++) {
                    fd.append(`skill_id[${i}]`, selectedSkills[i].id);
                }

                if (desc) {
                    fd.append("desc", desc);
                }
                if (formData.title_seo) {
                    fd.append("title_seo", formData.title_seo);
                }
                if (formData.seo_key) {
                    fd.append("seo_key", formData.seo_key);
                }
                if (formData.seo_desc) {
                    fd.append("seo_desc", formData.seo_desc);
                }
                if (Number(formData.commission)) {
                    fd.append("commission", Number(formData.commission));
                }
                if (Number(formData.session_time)) {
                    fd.append(
                        "session_time",
                        Number(formData.session_time) * 30
                    );
                }
                if (selectedDate?.year) {
                    let date = moment
                        .from(
                            `${selectedDate?.year}/${selectedDate?.month}/${selectedDate?.day}`,
                            "fa",
                            "YYYY/MM/DD"
                        )
                        .locale("en")
                        .format("YYYY/MM/DD")
                        .replace("/", "-")
                        .replace("/", "-");
                    fd.append("start_date", date);
                }
                if (formData.image && typeof formData.image === "object") {
                    fd.append("image", formData.image);
                }
                if (Number(formData.level_id)) {
                    fd.append("level_id", Number(formData.level_id));
                }

                await createClass(fd);
            }
        } else {
            showAlert(true, "danger", "لطفا فیلدهای ضروری را تکمیل کنید");

            // Error Handling
            let temp = errors;
            let teacherMessage = "لطفا استاد را انتخاب کنید.";
            let langMessage = "لطفا زبان را انتخاب کنید.";
            let titleMessage = "لطفا عنوان را وارد کنید.";
            let descMessage = "لطفا توضیحات را وارد کنید.";
            let specMessage = "لطفا حداقل ۲ تخصص انتخاب کنید.";
            let skillMessage = "لطفا حداقل ۳ مهارت انتخاب کنید.";
            let capacityMessage = "لطفا ظرفیت را وارد کنید.";
            let countMessage = "لطفا تعداد را وارد کنید.";
            let priceMessage = "لطفا قیمت را وارد کنید.";

            const findError = (items, target) => {
                return items?.find((item) => item === target);
            };

            if (!selectedTeacher.name) {
                if (findError(errors, teacherMessage) === undefined) {
                    temp = [teacherMessage, ...temp];
                }
            } else {
                temp = temp?.filter((item) => item !== teacherMessage);
            }
            if (Number(formData.language_id) === 0) {
                if (findError(errors, langMessage) === undefined) {
                    temp = [langMessage, ...temp];
                }
            } else {
                temp = temp?.filter((item) => item !== langMessage);
            }
            if (formData.title.trim() === "") {
                if (findError(errors, titleMessage) === undefined) {
                    temp = [...temp, titleMessage];
                }
            } else {
                temp = temp?.filter((item) => item !== titleMessage);
            }
            if (desc.trim() === "") {
                if (findError(errors, descMessage) === undefined) {
                    temp = [...temp, descMessage];
                }
            } else {
                temp = temp?.filter((item) => item !== descMessage);
            }
            if (selectedSpecialitys.length < 2) {
                if (findError(errors, specMessage) === undefined) {
                    temp = [...temp, specMessage];
                }
            } else {
                temp = temp?.filter((item) => item !== specMessage);
            }
            if (selectedSkills.length < 3) {
                if (findError(errors, skillMessage) === undefined) {
                    temp = [...temp, skillMessage];
                }
            } else {
                temp = temp?.filter((item) => item !== skillMessage);
            }
            if (!Number(formData.class_capacity)) {
                if (findError(errors, capacityMessage) === undefined) {
                    temp = [...temp, capacityMessage];
                }
            } else {
                temp = temp?.filter((item) => item !== capacityMessage);
            }
            if (!Number(formData.class_number)) {
                if (findError(errors, countMessage) === undefined) {
                    temp = [...temp, countMessage];
                }
            } else {
                temp = temp?.filter((item) => item !== countMessage);
            }
            if (!Number(formData.price.replace(/,/g, ""))) {
                if (findError(errors, priceMessage) === undefined) {
                    temp = [...temp, priceMessage];
                }
            } else {
                temp = temp?.filter((item) => item !== priceMessage);
            }
            setErrors(() => temp);
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

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectFile = (e, name) => {
        let file = e.target.files[0];
        setFormData({ ...formData, [name]: file });
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

    const createClass = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/group-class`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                const {
                    data: { id, ...restData },
                } = await res.json();
                setFormData({
                    ...formData,
                    id: id,
                });
                setAddedData(restData);
                setCurrentStep(1);
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
            console.log("Error creating group class", error);
        }
    };

    const editClass = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/group-class/${formData.id}`,
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
                showAlert(true, "success", "کلاس باموفقیت ویرایش شد");
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
            console.log("Error editing group class", error);
        }
    };

    const deleteSpeciality = async (speciality_id) => {
        try {
            const res = await fetch(
                `${BASE_URL}/admin/group-class/${formData.id}/speciality/${speciality_id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error deleting speciality", error);
        }
    };

    const deleteSkill = async (skill_id) => {
        try {
            const res = await fetch(
                `${BASE_URL}/admin/group-class/${formData.id}/skill/${skill_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
        } catch (error) {
            console.log("Error deleting skill ", error);
        }
    };

    const deleteSkillHandler = async (skill_id) => {
        if (formData.id) {
            await deleteSkill(skill_id);
        }
    };

    const readClassData = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/admin/group-class/${formData.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setAddedData({ ...data, ...data });
        } catch (error) {
            console.log("Error reading class data", error);
        }
    };

    const fetchSpecialitys = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/data/language/speciality/${formData.language_id}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setSpecialitys(() => data);
        } catch (error) {
            console.log("Error fetching specialitys ", error);
        }
    };

    const fetchSkills = async () => {
        let params = selectedSpecialitys
            ?.map((specItem, ind) => `speciality[${ind}]=${specItem?.id}`)
            .join("&");
        try {
            const res = await fetch(
                `${BASE_URL}/data/language/skill?${params}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setSkills(() => data);
        } catch (error) {
            console.log("Error fetching skills ", error);
        }
    };

    const deleteSpecialityHandler = async (spec_id) => {
        if (formData.id) {
            // API delete

            const filteredSkills = [];
            for (let i = 0; i < selectedSkills?.length; i++) {
                if (selectedSkills[i]?.speciality_id === spec_id) {
                    await deleteSkill(selectedSkills[i]?.id);
                } else {
                    filteredSkills.push(selectedSkills[i]);
                }
            }
            setSelectedSkills(() => filteredSkills);
            await deleteSpeciality(spec_id);
        } else {
            // Just remove item without API calls

            const filteredSkills = selectedSkills.filter(
                (skill) => skill.speciality_id !== spec_id
            );
            setSelectedSkills(() => filteredSkills);
        }
    };

    function handleKeyPress(e) {
        var key = e.key;
        // var regex = /[A-Za-z0-9]|\./;
        // if (!regex.test(key)) {
        //     e.preventDefault();
        // }
        let condition = (key >= "0" && key <= "9") || [","].includes(key);
        if (!condition) {
            e.preventDefault();
        }
    }

    useEffect(() => {
        fetchSpecialitys();
        setSelectedSpecialitys([]);
    }, [formData.language_id]);

    useEffect(() => {
        if (selectedSpecialitys.length !== 0) {
            fetchSkills();
        } else {
            setSkills([]);
        }
    }, [selectedSpecialitys]);

    useEffect(() => {
        if (currentStep === 0 && formData.id) {
            readClassData();
        }
    }, [currentStep]);

    useEffect(() => {
        if (selectedTeacher.id) {
            readTeacherLanguages();
        } else {
            setLanguages([]);
        }
        setFormData({ ...formData, language_id: 0 });
    }, [selectedTeacher]);

    return (
        <form>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="ایجاد کلاس گروهی">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="teacher_name" className="form__label">
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
                                onSearch={(value) => searchTeachers(value)}
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="language_id" className="form__label">
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
                                    <option key={lan?.id} value={lan?.id}>
                                        {lan?.persian_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-wrapper">
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
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="level_id" className="form__label">
                            سطح :
                        </label>
                        <div className="form-control">
                            <select
                                name="level_id"
                                id="level_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.level_id}
                            >
                                <option value={0}>انتخاب کنید</option>
                                {levels?.map((level) => (
                                    <option key={level?.id} value={level?.id}>
                                        {level?.persian_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="summary_desc" className="form__label">
                            توضیحات :<span className="form__star">*</span>
                        </label>
                        <div>
                            <Editor
                                value={desc}
                                setValue={setDesc}
                                token={token}
                                uploadImageUrl="/admin/blog/article/add/image"
                                placeholder="توضیحات کلاس گروهی"
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="title" className="form__label">
                            تخصص :<span className="form__star">*</span>
                        </label>
                        <div className={styles["form-control-container"]}>
                            <div
                                className={styles["form__second-label-wrapper"]}
                            >
                                <span>حداقل دو مورد</span>
                                <span>{selectedSpecialitys.length} از 3</span>
                            </div>
                            <div
                                className={`form-control form-control-searchselect`}
                            >
                                <SearchMultiSelect
                                    list={specialitys}
                                    displayKey="persian_name"
                                    id="id"
                                    defaultText="تخصص را انتخاب کنید."
                                    selected={selectedSpecialitys}
                                    setSelected={setSelectedSpecialitys}
                                    noResText="یافت نشد"
                                    stylesProps={{
                                        width: "100%",
                                    }}
                                    onRemove={deleteSpecialityHandler}
                                    min={2}
                                    max={3}
                                    showAlert={showAlert}
                                    background="#fafafa"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="title" className="form__label">
                            مهارت :<span className="form__star">*</span>
                        </label>
                        <div className={styles["form-control-container"]}>
                            <div
                                className={styles["form__second-label-wrapper"]}
                            >
                                <span>حداقل سه مورد</span>
                                <span>{selectedSkills.length} از 5</span>
                            </div>
                            <div
                                className={`form-control form-control-searchselect`}
                            >
                                <SearchMultiSelect
                                    list={skills}
                                    displayKey="persian_name"
                                    id="id"
                                    defaultText="مهارت را انتخاب کنید."
                                    selected={selectedSkills}
                                    setSelected={setSelectedSkills}
                                    noResText="یافت نشد"
                                    stylesProps={{
                                        width: "100%",
                                    }}
                                    onRemove={deleteSkillHandler}
                                    min={3}
                                    max={5}
                                    showAlert={showAlert}
                                    background="#fafafa"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
            <Box title="اطلاعات دوره">
                <div className="form">
                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="class_capacity"
                                    className="form__label"
                                >
                                    ظرفیت کلاس :
                                    <span className="form__star">*</span>
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="class_capacity"
                                        id="class_capacity"
                                        className="form__input form__input--ltr"
                                        onChange={handleOnChange}
                                        value={formData.class_capacity}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="class_number"
                                    className="form__label"
                                >
                                    تعداد جلسات :
                                    <span className="form__star">*</span>
                                </label>
                                <div className="form-control">
                                    <select
                                        name="class_number"
                                        id="class_number"
                                        className="form__input input-select"
                                        onChange={handleOnChange}
                                        value={formData.class_number}
                                        required
                                    >
                                        {Array(20)
                                            .fill(0)
                                            ?.map((_, i) => (
                                                <option key={i} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label htmlFor="price" className="form__label">
                                    قیمت دوره :
                                    <span className="form__star">*</span>
                                </label>
                                <div className="form-control">
                                    <input
                                        type="text"
                                        name="price"
                                        id="price"
                                        className="form__input form__input--ltr"
                                        onChange={handleOnChange}
                                        value={
                                            typeof formData.price === "number"
                                                ? Intl.NumberFormat().format(
                                                      formData.price
                                                  )
                                                : Intl.NumberFormat().format(
                                                      formData.price.replace(
                                                          /,/g,
                                                          ""
                                                      )
                                                  ) || ""
                                        }
                                        onKeyDown={(e) => handleKeyPress(e)}
                                        placeholder="تومان"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="commission"
                                    className="form__label"
                                >
                                    کمیسیون :
                                </label>
                                <div className="form-control">
                                    <select
                                        name="commission"
                                        id="commission"
                                        className="form__input input-select"
                                        onChange={handleOnChange}
                                        value={formData.commission}
                                    >
                                        <option value={0}>انتخاب کنید</option>
                                        {Array(13)
                                            .fill(0)
                                            ?.map((_, i) => (
                                                <option key={i} value={i * 5}>
                                                    {i * 5} درصد
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="start_date"
                                    className="form__label"
                                >
                                    تاریخ شروع :
                                </label>
                                <div className="form-control">
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        shouldHighlightWeekends
                                        locale="fa"
                                        wrapperClassName="date-input-wrapper"
                                        inputClassName="date-input"
                                        colorPrimary="#545cd8"
                                        minimumDate={{
                                            year: moment().year(),
                                            month: Number(moment().format("M")),
                                            day: Number(moment().format("DD")),
                                        }}
                                        inputPlaceholder="انتخاب کنید"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="session_time"
                                    className="form__label"
                                >
                                    مدت زمان جلسه :
                                </label>
                                <div className="form-control">
                                    <select
                                        name="session_time"
                                        id="session_time"
                                        className="form__input input-select"
                                        onChange={handleOnChange}
                                        value={formData.session_time}
                                    >
                                        <option value={0}>انتخاب کنید</option>
                                        <option value={1}>۳۰ دقیقه</option>
                                        <option value={2}>۶۰ دقیقه</option>
                                        <option value={3}>۹۰ دقیقه</option>
                                        <option value={4}>۱۲۰ دقیقه</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label htmlFor="image" className="form__label">
                                    تصویر :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(e, "image")
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.image?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
            <Box title="سئو">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="title_seo" className="form__label">
                            عنوان سئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="title_seo"
                                id="title_seo"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="seo_key" className="form__label">
                            کلمات سئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="seo_key"
                                id="seo_key"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="seo_desc" className="form__label">
                            توضیحات سئو :
                        </label>
                        <textarea
                            type="text"
                            name="seo_desc"
                            id="seo_desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                            spellCheck={false}
                        />
                    </div>

                    <div className={styles["step__row"]}>
                        {errors?.length !== 0 && <Error errorList={errors} />}
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading
                            ? "در حال انجام ..."
                            : formData.id
                            ? "ویرایش کلاس"
                            : "ثبت و مرحله بعد"}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default CreateClass;
