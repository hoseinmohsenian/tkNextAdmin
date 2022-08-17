import { useEffect, useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../../constants";
import Box from "../../../Elements/Box/Box";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../../Editor/Editor"), {
    ssr: false,
});
import SearchSelect from "../../../../../../SearchSelect/SearchSelect";
import SearchMultiSelect from "../../../../../../SearchMultiSelect/SearchMultiSelect";
import API from "../../../../../../../api/index";

const categorySchema = {
    id: 0,
    parent_id: 0,
    title: "",
    url: "",
    meta_desc: "",
    meta_key: "",
    meta_title: "",
};

function CreateQuestion({ token, categories }) {
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        meta_desc: "",
        meta_key: "",
        meta_title: "",
    });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categorySchema);
    const [desc, setDesc] = useState("");
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.title.trim() && formData.url.trim()) {
            let body = {};
            body = { title: formData.title, url: formData.url };
            if (desc) {
                body = { ...body, desc: desc };
            }
            if (formData.meta_desc) {
                body = { ...body, meta_desc: formData.meta_desc };
            }
            if (formData.meta_key) {
                body = { ...body, meta_key: formData.meta_key };
            }
            if (formData.meta_title) {
                body = { ...body, meta_title: formData.meta_title };
            }
            let category_id = [];
            for (let i = 0; i < selectedCategories.length; i++) {
                category_id.push(selectedCategories[i].id);
            }

            await addQuestion({ ...body, category_id });
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
            const { data, status, response } = await API.get(
                `/admin/faq/category/sub/${selectedCategory.id}`
            );

            if (status === 200) {
                setSubcategories(data?.data);
                showAlert(true, "success", "اکنون زیردسته بندی را انتخاب کنید");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error reading sub-categories", error);
        }
        setLoading(false);
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addQuestion = async (body) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/faq/question`,
                fd
            );

            if (status === 200) {
                showAlert(true, "success", "سوال باموفقیت اضافه شد");
                router.push("/tkpanel/FaqSite");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding a new question", error);
        }
        setLoading(false);
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

            <Box title="ایجاد سوال">
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
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد سوال‌"}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default CreateQuestion;
