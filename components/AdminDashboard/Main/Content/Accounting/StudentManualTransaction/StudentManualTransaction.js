import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import FetchSearchSelect from "../../Elements/FetchSearchSelect/FetchSearchSelect";
import API from "../../../../../../api/index";
import {
    checkValidPriceKeys,
    getFormattedPrice,
    getUnformattedPrice,
} from "../../../../../../utils/priceFormat";

const studentSchema = { id: "", name_family: "", mobile: "" };

function StudentManualTransaction() {
    const [formData, setFormData] = useState({
        desc: "",
        status: 0,
        amount: "",
        image: null,
    });
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(studentSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let amount = getUnformattedPrice(formData.amount?.toString());

        if (amount && formData.desc && selectedStudent.id) {
            const fd = new FormData();
            fd.append("amount", Number(amount));
            fd.append("desc", formData.desc);
            fd.append("status", Number(formData.status));
            if (formData.image) {
                fd.append("image", formData.image);
            }
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

    const handleSelectFile = (e) => {
        let file = e.target.files[0];
        setFormData({ ...formData, image: file });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addTransaction = async (fd) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/accounting/student/manual/transaction/${selectedStudent.id}`,
                fd
            );

            if (status === 200) {
                showAlert(true, "success", "اعتبار باموفقیت ثبت شد");
                router.push("/tkpanel/logUser/profile/accountingCredite");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding transaction", error);
        }
        setLoading(false);
    };

    const searchStudents = async (input) => {
        setLoading(true);
        try {
            const { data, status, response } = await API.get(
                `/admin/student/search?input=${input}`
            );

            if (status === 200) {
                setStudents(data?.data?.data || []);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error searching students", error);
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

            <Box title="افزایش اعتبار زبان آموز">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="student" className="form__label">
                            زبان آموز :<span className="form__star">*</span>
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <FetchSearchSelect
                                list={students}
                                setList={setStudents}
                                placeholder="جستجو کنید"
                                selected={selectedStudent}
                                displayKey="family"
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
                                onSearch={(value) => searchStudents(value)}
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
                                type="text"
                                name="amount"
                                id="amount"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                value={getFormattedPrice(formData.amount)}
                                onKeyDown={(e) => checkValidPriceKeys(e)}
                                placeholder="تومان"
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
                    <div className="input-wrapper">
                        <label htmlFor="flag_image" className="form__label">
                            عکس :
                        </label>
                        <div className="upload-box">
                            <div
                                className="upload-btn"
                                onChange={handleSelectFile}
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
                        {loading ? "در حال انجام ..." : "ثبت اعتبار"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default StudentManualTransaction;
