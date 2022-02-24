import { useEffect, useState } from "react";
import cstyles from "./CreateCategory.module.css";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../Editor/Editor"), {
    ssr: false,
});
import SearchSelect from "../../../../../SearchSelect/SearchSelect";
import Box from "../../Elements/Box/Box";

function CreateCategory({ token, categoriesLevel1, title, mainPage }) {
    const [formData, setFormData] = useState({
        title: "",
        header: "",
        summary_desc: "",
        seo_key: "",
        image: null,
        seo_desc: "",
        schema_desc: "",
        desc: "",
        video_name: "",
        video_script: "",
        faq_title: "",
        parent_id: null,
        type: 0,
        questions: [],
    });
    const [desc, setDesc] = useState("");
    const [selectedCatg1, setSelectedCatg1] = useState({
        id: "",
        title: "",
    });
    const [selectedCatg2, setSelectedCatg2] = useState({
        id: "",
        title: "",
    });
    const [subCategories, setSubCategories] = useState([]);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState([]);
    const router = useRouter();
    let asPath = router.asPath,
        category_level;

    if (asPath === "/tkpanel/newsSubCategories/create") {
        category_level = 1;
    } else if (asPath === "/tkpanel/siteNewsCategories/create") {
        category_level = 2;
    } else if (asPath === "/tkpanel/categoriesLevel3/create") {
        category_level = 3;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData.title.trim() &&
            formData.header.trim() &&
            formData.summary_desc.trim()
        ) {
            const fd = new FormData();
            fd.append("desc", desc);
            fd.append("type", category_level);
            for (const key in formData) {
                if (formData[key] && typeof formData[key] !== "object") {
                    fd.append(key, formData[key]);
                }
            }

            // For category 2 and 3
            if (category_level >= 2) {
                // For category 3
                if (category_level === 3) {
                    if (selectedCatg2.title) {
                        fd.append("parent_id", selectedCatg2.id);
                    } else {
                        showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
                        return;
                    }
                }
                // For category 2
                else if (category_level === 2) {
                    if (selectedCatg1.title) {
                        fd.append("parent_id", selectedCatg1.id);
                    } else {
                        showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
                        return;
                    }
                }
            }

            if (formData?.id) {
                router.push(mainPage);
            } else {
                await addCategory(fd);
            }
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectFile = (e) => {
        let file = e.target.files[0];
        setFormData({ ...formData, image: file });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addCategory = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/blog/category`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                let message = "اکنون سوالات دسته بندی را اضافه کنید";
                showAlert(true, "success", message);
                const { data } = await res.json();
                setFormData({
                    ...formData,
                    id: data,
                });
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error adding a new category", error);
        }
    };

    const readSubCategories = async () => {
        try {
            const res = await fetch(
                `${BASE_URL}/admin/blog/subcategory/${selectedCatg1.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setSubCategories(data);
        } catch (error) {
            console.log("Error reading subcategories", error);
        }
    };

    const addNewRow = () => {
        let newRow = ["question", "answer"].reduce(
            (acc, curr) => ((acc[curr] = ""), acc),
            {}
        );
        setFormData({
            ...formData,
            questions: [...formData?.questions, newRow],
        });
    };

    const onAddHandler = async (rowInd) => {
        if (!isEmpty(rowInd)) {
            await addQuestion(rowInd);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleFAQOnChange = (e, rowInd) => {
        const name = e.target.name;
        let updated = [...formData?.questions];
        updated[rowInd] = { ...updated[rowInd], [name]: e.target.value };
        setFormData({
            ...formData,
            questions: updated,
        });
    };

    const deleteRow = (rowInd) => {
        let updated = [...formData?.questions];
        updated = updated.filter((item, ind) => rowInd !== ind);
        setFormData({
            ...formData,
            questions: updated,
        });
    };

    const onDeleteHandler = async (rowInd, id) => {
        if (id) {
            await deleteQuestion(rowInd, id);
        }
        deleteRow(rowInd);
    };

    const deleteQuestion = async (i, question_id) => {
        try {
            let temp = [...loadings];
            temp[i] = true;
            setLoadings(() => temp);

            const res = await fetch(
                `${BASE_URL}/admin/blog/question/${question_id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "danger", "این سوال حذف شد");
            }

            temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting question");
        }
    };

    const addQuestion = async (rowInd) => {
        try {
            let temp = [...loadings];
            temp[rowInd] = true;
            setLoadings(() => temp);

            const res = await fetch(
                `${BASE_URL}/admin/blog/question/${formData?.id}`,
                {
                    method: "POST",
                    body: JSON.stringify(formData?.questions[rowInd]),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "سوال جدید با موفقیت اضافه شد";
                showAlert(true, "success", message);
                const { data } = await res.json();
                let updated = [...formData?.questions];
                updated[rowInd] = { ...updated[rowInd], id: data };
                setFormData({
                    ...formData,
                    questions: updated,
                });
            }

            temp = [...loadings];
            temp[rowInd] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error adding new question");
        }
    };

    const editQuestion = async (i, id) => {
        try {
            let temp = [...loadings];
            temp[i] = true;
            setLoadings(() => temp);

            const res = await fetch(
                `${BASE_URL}/admin/blog/question/edit/${id}`,
                {
                    method: "POST",
                    body: JSON.stringify(formData?.questions[i]),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "این سوال با موفقیت ویرایش شد";
                showAlert(true, "success", message);
            }

            temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error editing question", error);
        }
    };

    const onEditHandler = async (rowInd, id) => {
        if (!isEmpty(rowInd)) {
            await editQuestion(rowInd, id);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const isEmpty = (rowInd) => {
        if (
            !formData?.questions[rowInd]?.question ||
            !formData?.questions[rowInd]?.answer
        ) {
            return true;
        }
        return false;
    };

    // For category 3
    useEffect(() => {
        if (category_level === 3) {
            if (selectedCatg1.title) {
                readSubCategories();
            } else {
                setSubCategories([]);
                setSelectedCatg2({ id: "", title: "" });
            }
        }
    }, [selectedCatg1]);

    return (
        <form onSubmit={handleSubmit}>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title={title}>
                <div className="form">
                    {category_level >= 2 && (
                        <div className="input-wrapper">
                            <label htmlFor="title" className="form__label">
                                دسته بندی اول :
                                <span className="form__star">*</span>
                            </label>
                            <div
                                className={`form-control ${cstyles["form-control-searchselect"]}`}
                            >
                                <SearchSelect
                                    list={categoriesLevel1}
                                    defaultText="انتخاب کنید"
                                    selected={selectedCatg1}
                                    displayKey="title"
                                    setSelected={setSelectedCatg1}
                                    noResText="یافت نشد"
                                    listSchema={{
                                        id: "",
                                        title: "",
                                    }}
                                    stylesProps={{
                                        width: "100%",
                                    }}
                                    background="#fafafa"
                                    disabled={formData?.id ? true : false}
                                />
                            </div>
                        </div>
                    )}
                    {category_level === 3 && (
                        <div className="input-wrapper">
                            <label htmlFor="title" className="form__label">
                                دسته بندی دوم :
                                <span className="form__star">*</span>
                            </label>
                            <div
                                className={`form-control ${cstyles["form-control-searchselect"]}`}
                            >
                                <SearchSelect
                                    list={subCategories}
                                    defaultText="انتخاب کنید"
                                    selected={selectedCatg2}
                                    displayKey="title"
                                    setSelected={setSelectedCatg2}
                                    noResText="یافت نشد"
                                    listSchema={{
                                        id: "",
                                        title: "",
                                    }}
                                    stylesProps={{
                                        width: "100%",
                                    }}
                                    background="#fafafa"
                                    disabled={formData?.id ? true : false}
                                />
                            </div>
                        </div>
                    )}
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
                                disabled={formData?.id ? true : false}
                                autoComplete="off"
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="header" className="form__label">
                            header :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="header"
                                id="header"
                                className="form__input"
                                onChange={handleOnChange}
                                disabled={formData?.id ? true : false}
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="video_name" className="form__label">
                            نام ویدئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="video_name"
                                id="video_name"
                                className="form__input"
                                onChange={handleOnChange}
                                disabled={formData?.id ? true : false}
                                autoComplete="off"
                                spellCheck={false}
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
                                style={{
                                    direction: "ltr",
                                    textAlign: "right",
                                }}
                                onChange={handleOnChange}
                                disabled={formData?.id ? true : false}
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="faq_title" className="form__label">
                            عنوان FAQ :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="faq_title"
                                id="faq_title"
                                className="form__input"
                                onChange={handleOnChange}
                                disabled={formData?.id ? true : false}
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="image" className="form__label">
                            تصویر :
                        </label>
                        <div className="upload-btn" onChange={handleSelectFile}>
                            <span>آپلود تصویر</span>
                            <input
                                type="file"
                                className="upload-input"
                                accept="image/png, image/jpg, image/jpeg"
                                disabled={formData?.id ? true : false}
                            ></input>
                        </div>
                    </div>
                </div>
            </Box>

            <Box title="توضیحات">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="summary_desc" className="form__label">
                            توضیحات :
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
                            disabled={formData?.id ? true : false}
                            autoComplete="off"
                            required
                        />
                    </div>
                </div>
            </Box>

            <Box title="سئو">
                <div className="form">
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
                                disabled={formData?.id ? true : false}
                                autoComplete="off"
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
                            disabled={formData?.id ? true : false}
                            autoComplete="off"
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
                            disabled={formData?.id ? true : false}
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </div>

                    {!formData?.id && (
                        <button
                            type="submit"
                            className="btn primary"
                            disabled={loading}
                        >
                            {loading ? "در حال انجام ..." : "ایجاد دسته بندی"}
                        </button>
                    )}
                </div>
            </Box>

            {formData?.id && (
                <Box title="سوال و جواب">
                    <div className="form">
                        {formData?.questions?.map((item, i) => (
                            <div className={cstyles["question-row"]} key={i}>
                                <div
                                    className={`row ${cstyles["question-row-wrapper"]}`}
                                >
                                    <div
                                        className={`col-md-6 ${cstyles["question-col"]}`}
                                    >
                                        <div
                                            className={`input-wrapper ${cstyles["question-input-wrapper"]}`}
                                        >
                                            <label
                                                htmlFor="question"
                                                className={`form__label ${cstyles["question-label"]}`}
                                            >
                                                سوال :
                                            </label>
                                            <div className="form-control">
                                                <input
                                                    type="text"
                                                    name="question"
                                                    id="question"
                                                    className="form__input"
                                                    onChange={(e) =>
                                                        handleFAQOnChange(e, i)
                                                    }
                                                    value={item?.question}
                                                    autoComplete="off"
                                                    spellCheck={false}
                                                    required
                                                    disabled={loadings[i]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`col-md-6 ${cstyles["question-col"]}`}
                                    >
                                        <div
                                            className={`input-wrapper ${cstyles["question-input-wrapper"]}`}
                                        >
                                            <label
                                                htmlFor="answer"
                                                className={`form__label ${cstyles["question-label"]}`}
                                            >
                                                جواب :
                                            </label>
                                            <div className="form-control">
                                                <input
                                                    type="text"
                                                    name="answer"
                                                    id="answer"
                                                    className="form__input"
                                                    onChange={(e) =>
                                                        handleFAQOnChange(e, i)
                                                    }
                                                    value={item?.answer}
                                                    autoComplete="off"
                                                    spellCheck={false}
                                                    required
                                                    disabled={loadings[i]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={
                                        cstyles["question-row-btn-wrapper"]
                                    }
                                >
                                    <button
                                        className={`${cstyles["question-btn"]} ${cstyles["question-btn--delete"]}`}
                                        type="button"
                                        onClick={() =>
                                            onDeleteHandler(i, item?.id)
                                        }
                                        disabled={loadings[i]}
                                    >
                                        -
                                    </button>
                                    {item?.id ? (
                                        <button
                                            type="button"
                                            className={`${cstyles["question-btn"]} ${cstyles["question-btn--edit"]}`}
                                            onClick={() =>
                                                onEditHandler(i, item?.id)
                                            }
                                            style={{ fontSize: 15 }}
                                            disabled={loadings[i]}
                                        >
                                            &#x270E;
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className={`${cstyles["question-btn"]} ${cstyles["question-btn--edit"]}`}
                                            onClick={() => onAddHandler(i)}
                                            style={{ fontSize: 15 }}
                                            disabled={loadings[i]}
                                        >
                                            &#x2713;
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div className={cstyles["question-addbtn-wrapper"]}>
                            <button
                                className={`${cstyles["question-btn"]} ${cstyles["question-btn--add"]}`}
                                type="button"
                                onClick={addNewRow}
                            >
                                +
                            </button>
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

export default CreateCategory;
