import { useEffect, useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../../Elements/Box/Box";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../../Editor/Editor"), {
    ssr: false,
});
import SearchSelect from "../../../../../../SearchSelect/SearchSelect";
import SearchMultiSelect from "../../../../../../SearchMultiSelect/SearchMultiSelect";
import BreadCrumbs from "../../../Elements/Breadcrumbs/Breadcrumbs";

const categorySchema = {
    id: 0,
    parent_id: 0,
    title: "",
    url: "",
    meta_desc: "",
    meta_key: "",
    meta_title: "",
};

function EditQuestion({ token, categories, question }) {
    const [formData, setFormData] = useState(question);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categorySchema);
    const [desc, setDesc] = useState(question.desc || "");
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.title.trim() && formData.url.trim()) {
            let body = {};
            if (formData.title && formData.title !== question.title) {
                body = { ...body, title: formData.title };
            }
            if (formData.url && formData.url !== question.url) {
                body = { ...body, url: formData.url };
            }
            if (desc && desc !== question.desc) {
                body = { ...body, desc: desc };
            }
            if (
                formData.meta_desc &&
                formData.meta_desc !== question.meta_desc
            ) {
                body = { ...body, meta_desc: formData.meta_desc };
            }
            if (formData.meta_key && formData.meta_key !== question.meta_key) {
                body = { ...body, meta_key: formData.meta_key };
            }
            if (
                formData.meta_title &&
                formData.meta_title !== question.meta_title
            ) {
                body = { ...body, meta_title: formData.meta_title };
            }
            let category_id = [];
            for (let i = 0; i < selectedCategories.length; i++) {
                category_id.push(selectedCategories[i].id);
            }

            await editQuestion({ ...body, category_id });
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

    const readSubCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/faq/category/sub/${selectedCategory.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setSubcategories(data);
                showAlert(true, "success", "اکنون زیردسته بندی را انتخاب کنید");
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
            console.log("Error reading sub-categories", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const editQuestion = async (body) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/faq/question/${question.id}`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "success", "سوال باموفقیت ویرایش شد");
                router.push("/tkpanel/FaqSite");
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
            console.log("Error adding a new question", error);
        }
    };

    useEffect(() => {
        if (selectedCategory.id) {
            readSubCategories();
        } else {
            setSubcategories([]);
            setSelectedCategories([]);
        }
    }, [selectedCategory]);

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
                    FaqSite: "سوالات FAQ",
                    edit: "ویرایش",
                }}
            />

            <Box title="ویرایش سوال">
                <div className="form">
                    <div className={`input-wrapper input-wrapper`}>
                        <label
                            htmlFor="category"
                            className={`form__label search-label`}
                        >
                            دسته بندی :
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <SearchSelect
                                list={categories}
                                defaultText="انتخاب کنید"
                                selected={selectedCategory}
                                displayKey="title"
                                displayPattern={[
                                    { member: true, key: "title" },
                                ]}
                                setSelected={setSelectedCategory}
                                noResText="یافت نشد"
                                listSchema={categorySchema}
                                stylesProps={{
                                    width: "100%",
                                }}
                                background="#fafafa"
                                id="id"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="sub-category" className="form__label">
                            زیردسته بندی :
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <SearchMultiSelect
                                list={subcategories}
                                displayKey="persian_name"
                                id="id"
                                defaultText="زیردسته بندی را انتخاب کنید."
                                selected={selectedCategories}
                                setSelected={setSelectedCategories}
                                noResText="یافت نشد"
                                stylesProps={{
                                    width: "100%",
                                }}
                                displayPattern={[
                                    { member: true, key: "title" },
                                ]}
                                min={3}
                                max={5}
                                showAlert={showAlert}
                                fontSize={16}
                                background="#fafafa"
                            />
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
                                value={formData.title}
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
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                required
                                value={formData.url}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="summary_desc" className="form__label">
                            توضیحات :
                        </label>
                        <div>
                            <Editor
                                value={desc}
                                setValue={setDesc}
                                token={token}
                                uploadImageUrl="/admin/blog/article/add/image"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="meta_title"
                            className="form__label"
                            style={{ fontSize: 14 }}
                        >
                            Meta title :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="meta_title"
                                id="meta_title"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                                value={formData.meta_title || ""}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="meta_desc"
                            className="form__label"
                            style={{ fontSize: 14 }}
                        >
                            Meta description :
                        </label>
                        <textarea
                            type="text"
                            name="meta_desc"
                            id="meta_desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                            spellCheck={false}
                            value={formData.meta_desc || ""}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="meta_key"
                            className="form__label"
                            style={{ fontSize: 14 }}
                        >
                            Meta keyword:
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="meta_key"
                                id="meta_key"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                                value={formData.meta_key || ""}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش سوال‌"}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default EditQuestion;
