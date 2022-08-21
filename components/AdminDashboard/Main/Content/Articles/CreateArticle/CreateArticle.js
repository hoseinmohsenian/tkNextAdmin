import { useEffect, useState } from "react";
import styles from "./CreateArticle.module.css";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import CategorySelect from "../CategorySelect/CategorySelect";
import CategoryMultiSelect from "../CategoryMultiSelect/CategoryMultiSelect";
import moment from "jalali-moment";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import Box from "../../Elements/Box/Box";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../Editor/Editor"), {
    ssr: false,
});
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

const categorySchema = { id: "", title: "" };

function CreateArticle({ token, categoriesLevel1, languages }) {
    const [formData, setFormData] = useState({
        title: "",
        language_id: 1,
        url: "",
        summary_desc: "",
        seo_key: "",
        image: null,
        index_image: null,
        seo_title: "",
        seo_desc: "",
        schema_desc: "",
        desc: "",
        video_script: "",
        type: 0,
        pin: 0,
        draft: 0,
        time: "",
    });
    const [desc, setDesc] = useState("");
    const [selectedDate, setSelectedDate] = useState();
    const [selectedCatg1, setSelectedCatg1] = useState(categorySchema);
    const [selectedCatg2, setSelectedCatg2] = useState([]);
    const [selectedCatg3, setSelectedCatg3] = useState([]);
    const [categories2, setCategories2] = useState([]);
    const [categories3, setCategories3] = useState([]);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData.title.trim() &&
            formData.url.trim() &&
            formData.summary_desc.trim() &&
            formData.title.trim() &&
            desc.trim() &&
            formData.image
        ) {
            if (formData?.id && selectedCatg1.id && selectedCatg2.length > 0) {
                router.push("/tkpanel/siteNews");
            } else {
                const fd = new FormData();
                fd.append("title", formData.title);
                fd.append("language_id", formData.language_id);
                fd.append("url", formData.url);
                fd.append("summary_desc", formData.summary_desc);
                fd.append("desc", desc);
                fd.append("image", formData.image);
                if (formData.seo_title) {
                    fd.append("seo_title", formData.seo_title);
                }
                if (formData.seo_key) {
                    fd.append("seo_key", formData.seo_key);
                }
                if (formData.seo_desc) {
                    fd.append("seo_desc", formData.seo_desc);
                }
                if (formData.video_script) {
                    fd.append("video_script", formData.video_script);
                }
                if (Number(formData.estimate_time)) {
                    fd.append("estimate_time", Number(formData.estimate_time));
                }
                if (
                    formData.index_image &&
                    typeof formData.index_image !== "string"
                ) {
                    fd.append("index_image", formData.index_image);
                }
                if (Boolean(formData.draft)) {
                    fd.append("draft", Number(formData.draft));
                }
                if (Boolean(formData.type)) {
                    fd.append("type", Number(formData.type));
                }
                if (Boolean(formData.pin)) {
                    fd.append("pin", Number(formData.pin));
                }
                if (selectedDate?.year && formData.time) {
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
                    let publish_time = `${date} ${formData.time}`;
                    fd.append("publish_time", publish_time);
                }

                await addArticle(fd);
            }
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
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

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addArticle = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/blog/article`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                let message = "اکنون دسته بندی را اضافه کنید";
                showAlert(true, "success", message);
                const { data } = await res.json();
                setFormData({
                    ...formData,
                    id: data,
                });
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
            console.log("Error adding a new article", error);
        }
    };

    const readSubCategories = async (id, oldValue, setter) => {
        try {
            const res = await fetch(
                `${BASE_URL}/admin/blog/subcategory/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setter(Array.from(new Set([...oldValue, ...data])));
        } catch (error) {
            console.log("Error reading subcategories", error);
        }
    };

    const addArticleCategory = async (category_id, pin) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/blog/article/${formData.id}/category/${category_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ pin: Boolean(pin) ? 1 : 0 }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "دسته بندی جدید اضافه شد";
                showAlert(true, "success", message);
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error adding category", error);
        }
    };

    const deleteArticleCategory = async (category_id) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/blog/article/${formData.id}/category/${category_id}`,
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
                let message = "دسته بندی حذف شد";
                showAlert(true, "danger", message);
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error deleting category", error);
        }
    };

    const addCatg1Handler = async (cat1_id, pin) => {
        // Deleting the previous catg1
        if (selectedCatg1.id) {
            await deleteArticleCategory(selectedCatg1.id);
        }
        await addArticleCategory(cat1_id, pin);
        await readSubCategories(cat1_id, categories2, setCategories2);
    };

    const addCatg2Handler = async (cat2_id, pin) => {
        await addArticleCategory(cat2_id, pin);
        await readSubCategories(cat2_id, categories3, setCategories3);
    };

    const addCatg3Handler = async (cat3_id, pin) => {
        await addArticleCategory(cat3_id, pin);
    };

    const deleteAllCategories = async () => {
        for (let i = 0; i < selectedCatg3.length; i++) {
            await deleteArticleCategory(selectedCatg3[i].id);
        }
        for (let i = 0; i < selectedCatg2.length; i++) {
            await deleteArticleCategory(selectedCatg2[i].id);
        }
        await deleteArticleCategory(selectedCatg1.id);

        setCategories2([]);
        setCategories3([]);
        setSelectedCatg1(categorySchema);
        setSelectedCatg2([]);
        setSelectedCatg3([]);
    };

    const goToToday = () => {
        const currDate = {
            year: Number(moment().format("YYYY")),
            month: Number(moment().format("MM")),
            day: Number(moment().format("DD")),
        };
        const currTime = moment().format("hh:mm:ss");
        setSelectedDate(currDate);
        setFormData({ ...formData, time: currTime });
    };

    useEffect(() => {
        setCategories2([]);
    }, [selectedCatg1]);

    return (
        <form onSubmit={handleSubmit}>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <BreadCrumbs
                substituteObj={{
                    siteNews: "مقالات",
                    create: "ایجاد",
                }}
            />

            <Box title="ایجاد مقاله">
                <div className="form">
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
                                disabled={Boolean(formData?.id)}
                                required
                            >
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
                                autoComplete="off"
                                spellCheck={false}
                                required
                                disabled={Boolean(formData?.id)}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="url" className="form__label">
                            url :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="url"
                                id="url"
                                className="form__input"
                                style={{ direction: "ltr", textAlign: "right" }}
                                onChange={handleOnChange}
                                autoComplete="off"
                                required
                                disabled={Boolean(formData?.id)}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="video_script" className="form__label">
                            اسکریپت ویدئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="video_script"
                                id="video_script"
                                className="form__input"
                                style={{ direction: "ltr", textAlign: "right" }}
                                onChange={handleOnChange}
                                autoComplete="off"
                                spellCheck={false}
                                disabled={Boolean(formData?.id)}
                            />
                        </div>
                    </div>
                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="publish_time"
                                    className="form__label"
                                >
                                    تاریخ انتشار :
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
                                <label htmlFor="time" className={`form__label`}>
                                    زمان انتشار :
                                </label>
                                <div className="form-control">
                                    <input
                                        type="time"
                                        step="1"
                                        name="time"
                                        id="time"
                                        className={`form__input form__input-time`}
                                        value={formData.time}
                                        style={{
                                            width: 150,
                                        }}
                                        onChange={handleOnChange}
                                        autoComplete="off"
                                        disabled={Boolean(formData?.id)}
                                        placeholder="ffff"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: -10 }}>
                        <button
                            className="action-btn primary-outline"
                            type="button"
                            onClick={goToToday}
                            disabled={Boolean(formData?.id)}
                        >
                            اکنون منتشر شود
                        </button>
                    </div>
                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="estimate_time"
                                    className="form__label"
                                >
                                    زمان مطالعه‌ :
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="estimate_time"
                                        id="estimate_time"
                                        className="form__input"
                                        style={{
                                            direction: "ltr",
                                            textAlign: "right",
                                        }}
                                        onChange={handleOnChange}
                                        autoComplete="off"
                                        disabled={Boolean(formData?.id)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="draft"
                                    className={`form__label`}
                                >
                                    پین :
                                </label>
                                <div className="form-control form-control-radio">
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="pin"
                                            className="radio-title"
                                        >
                                            پین شود
                                        </label>
                                        <input
                                            type="checkbox"
                                            name="pin"
                                            onChange={handleOnChange}
                                            checked={Number(formData.pin) === 1}
                                            id="pin"
                                            disabled={Boolean(formData?.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="draft"
                                    className={`form__label`}
                                >
                                    نوع :
                                </label>
                                <div className="form-control form-control-radio">
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="standard"
                                            className="radio-title"
                                        >
                                            استاندارد
                                        </label>
                                        <input
                                            type="radio"
                                            name="type"
                                            onChange={handleOnChange}
                                            value={0}
                                            checked={
                                                Number(formData.type) === 0
                                            }
                                            disabled={Boolean(formData?.id)}
                                            id="standard"
                                        />
                                    </div>
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="video"
                                            className="radio-title"
                                        >
                                            ویدئو
                                        </label>
                                        <input
                                            type="radio"
                                            name="type"
                                            onChange={handleOnChange}
                                            value={1}
                                            checked={
                                                Number(formData.type) === 1
                                            }
                                            disabled={Boolean(formData?.id)}
                                            id="video"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="draft"
                                    className={`form__label`}
                                >
                                    وضعیت :
                                </label>
                                <div className="form-control form-control-radio">
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="draft"
                                            className="radio-title"
                                        >
                                            پیش نویس
                                        </label>
                                        <input
                                            type="radio"
                                            name="draft"
                                            onChange={handleOnChange}
                                            value={1}
                                            checked={
                                                Number(formData.draft) === 1
                                            }
                                            id="draft"
                                            disabled={Boolean(formData?.id)}
                                        />
                                    </div>
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="publish"
                                            className="radio-title"
                                        >
                                            منتشر
                                        </label>
                                        <input
                                            type="radio"
                                            name="draft"
                                            onChange={handleOnChange}
                                            value={0}
                                            checked={
                                                Number(formData.draft) === 0
                                            }
                                            id="publish"
                                            disabled={Boolean(formData?.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`row`}>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label htmlFor="image" className="form__label">
                                    تصویر :<span className="form__star">*</span>
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
                                            disabled={Boolean(formData?.id)}
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.image?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="index_image"
                                    className="form__label"
                                >
                                    تصویر شاخص :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(e, "index_image")
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                            disabled={Boolean(formData?.id)}
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.index_image?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
            <Box title="توضیحات">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="summary_desc" className="form__label">
                            توضیحات :<span className="form__star">*</span>
                        </label>
                        <div>
                            <Editor
                                value={desc}
                                setValue={setDesc}
                                disabled={Boolean(formData?.id)}
                                token={token}
                                uploadImageUrl="/admin/blog/article/add/image"
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="summary_desc" className="form__label">
                            توضیحات کوتاه :<span className="form__star">*</span>
                        </label>
                        <textarea
                            type="text"
                            name="summary_desc"
                            id="summary_desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                            autoComplete="off"
                            disabled={Boolean(formData?.id)}
                        />
                    </div>
                </div>
            </Box>
            <Box title="سئو">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="seo_title" className="form__label">
                            عنوان سئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="seo_title"
                                id="seo_title"
                                className="form__input"
                                onChange={handleOnChange}
                                autoComplete="off"
                                spellCheck={false}
                                disabled={Boolean(formData?.id)}
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
                                autoComplete="off"
                                spellCheck={false}
                                disabled={Boolean(formData?.id)}
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
                            autoComplete="off"
                            disabled={Boolean(formData?.id)}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="schema_desc" className="form__label">
                            توضیحات اسکیما :
                        </label>
                        <textarea
                            type="text"
                            name="schema_desc"
                            id="schema_desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                            autoComplete="off"
                            spellCheck={false}
                            disabled={Boolean(formData?.id)}
                        />
                    </div>

                    {!formData?.id && (
                        <button
                            type="submit"
                            className="btn primary"
                            disabled={loading}
                        >
                            {loading ? "در حال انجام ..." : "ایجاد مقاله"}
                        </button>
                    )}
                </div>
            </Box>

            {formData.id && (
                <Box title="دسته بندی">
                    <div className="form">
                        <div>
                            <button
                                className={`danger ${styles["category-delete-btn"]}`}
                                type="button"
                                onClick={deleteAllCategories}
                                disabled={
                                    !selectedCatg1.id &&
                                    selectedCatg2.length === 0 &&
                                    selectedCatg3.length === 0
                                }
                            >
                                حذف همه
                            </button>
                        </div>

                        <div className="input-wrapper">
                            <label htmlFor="title" className="form__label">
                                دسته بندی اول :
                                <span className="form__star">*</span>
                            </label>
                            <div
                                className={`form-control form-control-searchselect`}
                            >
                                <CategorySelect
                                    list={categoriesLevel1}
                                    defaultText="انتخاب کنید"
                                    selected={selectedCatg1}
                                    displayKey="title"
                                    setSelected={setSelectedCatg1}
                                    noResText="یافت نشد"
                                    listSchema={categorySchema}
                                    stylesProps={{
                                        width: "100%",
                                    }}
                                    background="#fafafa"
                                    onAdd={addCatg1Handler}
                                    id="id"
                                    disabled={selectedCatg2.length !== 0}
                                    openBottom={false}
                                />
                            </div>
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="title" className="form__label">
                                دسته بندی دوم :
                                <span className="form__star">*</span>
                            </label>
                            <div
                                className={`form-control form-control-searchselect`}
                            >
                                <CategoryMultiSelect
                                    list={categories2}
                                    id="id"
                                    defaultText="انتخاب کنید"
                                    selected={selectedCatg2}
                                    displayKey="title"
                                    setSelected={setSelectedCatg2}
                                    noResText="یافت نشد"
                                    width="100%"
                                    background="#fafafa"
                                    max={3}
                                    onRemove={deleteArticleCategory}
                                    onAdd={addCatg2Handler}
                                    showAlert={showAlert}
                                    disabled={selectedCatg3.length !== 0}
                                    openBottom={false}
                                />
                            </div>
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="title" className="form__label">
                                دسته بندی سوم :
                            </label>
                            <div
                                className={`form-control form-control-searchselect`}
                            >
                                <CategoryMultiSelect
                                    list={categories3}
                                    id="id"
                                    defaultText="انتخاب کنید"
                                    selected={selectedCatg3}
                                    displayKey="title"
                                    setSelected={setSelectedCatg3}
                                    noResText="یافت نشد"
                                    width="100%"
                                    background="#fafafa"
                                    max={3}
                                    showAlert={showAlert}
                                    onRemove={deleteArticleCategory}
                                    onAdd={addCatg3Handler}
                                    openBottom={false}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn primary"
                            disabled={loading}
                        >
                            {loading ? "در حال انجام ..." : "اتمام"}
                        </button>
                    </div>
                </Box>
            )}
        </form>
    );
}

export default CreateArticle;
