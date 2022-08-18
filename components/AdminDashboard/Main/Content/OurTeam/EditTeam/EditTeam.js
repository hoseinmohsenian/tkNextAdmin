import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import API from "../../../../../../api/index";

function EditTeam({ member }) {
    const [formData, setFormData] = useState(member);
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
            formData.name.trim() &&
            formData.title.trim() &&
            formData.desc.trim() &&
            formData.image
        ) {
            const fd = new FormData();
            if (formData.name !== member?.name) {
                fd.append("name", formData.name);
            }
            if (formData.title !== member?.title) {
                fd.append("title", formData.title);
            }
            if (formData.desc !== member?.desc) {
                fd.append("desc", formData.desc);
            }
            if (typeof formData.image !== "string" && formData.image) {
                fd.append("image", formData.image);
            }
            await editMember(fd);
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

    const editMember = async (fd) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/our-team/${formData.id}`,
                fd
            );

            if (status === 200) {
                showAlert(true, "success", "عضو با موفقیت ویرایش شد");
                router.push("/tkpanel/ourTeams");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error editing member", error);
        }
        setLoading(false);
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="ویرایش عضو">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="name" className="form__label">
                            نام :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form__input"
                                onChange={handleOnChange}
                                required
                                value={formData.name || ""}
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
                                required
                                value={formData.title || ""}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="desc" className="form__label">
                            توضیحات :<span className="form__star">*</span>
                        </label>
                        <textarea
                            name="desc"
                            id="desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                            required
                            value={formData.desc || ""}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="image" className="form__label">
                            تصویر :<span className="form__star">*</span>
                        </label>
                        <div className="upload-box">
                            <div
                                className="upload-btn"
                                onChange={(e) => handleSelectFile(e)}
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

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش عضو"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default EditTeam;
