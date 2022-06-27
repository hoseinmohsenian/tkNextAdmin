import { useEffect, useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../../constants";
import Box from "../../../Elements/Box/Box";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../../Editor/Editor"), {
    ssr: false,
});

function EditSkillsDesc({ token, skill }) {
    const [formData, setFormData] = useState(skill);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [desc1, setDesc1] = useState("");
    const [desc2, setDesc2] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        if (formData.h1 && formData.h1 !== skill?.h1) {
            fd.append("h1", formData.h1);
        }
        if (formData.title_seo && formData.title_seo !== skill?.title_seo) {
            fd.append("title_seo", formData.title_seo);
        }
        if (formData.seo_key && formData.seo_key !== skill?.seo_key) {
            fd.append("seo_key", formData.seo_key);
        }
        if (formData.seo_desc && formData.seo_desc !== skill?.seo_desc) {
            fd.append("seo_desc", formData.seo_desc);
        }
        if (formData.seo_schema && formData.seo_schema !== skill?.seo_schema) {
            fd.append("seo_schema", formData.seo_schema);
        }
        if (desc1 && desc1 !== skill?.first_desc) {
            fd.append("first_desc", desc1);
        }
        if (desc2 && desc2 !== skill?.second_desc) {
            fd.append("second_desc", desc2);
        }

        await editSkillDesc(fd);
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const editSkillDesc = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teaching/skill/desc/${formData?.id}`,
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
                showAlert(
                    true,
                    "success",
                    `توضیحات مهارت ${formData?.persian_name} با موفقیت ویرایش شد`
                );
                router.push("/content/skill/description/inf");
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error editing skill desc", error);
        }
    };

    useEffect(() => {
        setDesc1(skill.first_desc);
        setDesc2(skill.second_desc);
    }, []);

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />
            <Box title="ویرایش توضیحات مهارت">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="h1" className="form__label">
                            h1 :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="h1"
                                id="h1"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData?.h1 || ""}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="first_desc" className="form__label">
                            توضیحات اول :
                        </label>
                        <div>
                            <Editor
                                value={desc1}
                                setValue={setDesc1}
                                token={token}
                                uploadImageUrl="/admin/blog/article/add/image"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="second_desc" className="form__label">
                            توضیحات دوم :
                        </label>
                        <div>
                            <Editor
                                value={desc2}
                                setValue={setDesc2}
                                token={token}
                                uploadImageUrl="/admin/blog/article/add/image"
                            />
                        </div>
                    </div>
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
                                value={formData?.title_seo || ""}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="seo_key" className="form__label">
                            کلید سئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="seo_key"
                                id="seo_key"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData?.seo_key || ""}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="seo_desc" className="form__label">
                            توضیحات سئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="seo_desc"
                                id="seo_desc"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData?.seo_desc || ""}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="seo_schema" className="form__label">
                            اسکیما سئو :
                        </label>
                        <textarea
                            type="text"
                            name="seo_schema"
                            id="seo_schema"
                            className="form__textarea form__textarea--ltr"
                            onChange={handleOnChange}
                            value={formData?.seo_schema || ""}
                            style={{ minHeight: 140, maxHeight: 200 }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش توضیحات مهارت"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default EditSkillsDesc;
