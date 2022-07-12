import { useState } from "react";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import { BASE_URL } from "../../../../../constants";
import { useGlobalContext } from "../../../../../context";
import Modal from "../../../../Modal/Modal";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function NotHeldClasses(props) {
    const {
        fetchedClasses: { data, ...restData },
        token,
    } = props;
    const [classes, setClasses] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});
    moment.locale("fa", { useGregorianParser: true });
    const { formatTime } = useGlobalContext();

    const readClasses = async (page = 1) => {
        let searchParams = {};

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/class/paymentForClassNotStatus`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/classroom/not-held?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const {
                data: { data, ...restData },
            } = await res.json();
            setClasses(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading not held classes", error);
        }
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    class: "کلاس",
                    paymentForClassNotStatus: "کلاس برگزار نشده",
                }}
            />

            <Box title="لیست کلاس های برگزار نشده">
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات کلاس‌‌</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    اعتبار زبان آموز
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.user_wallet
                                        ? `${Intl.NumberFormat().format(
                                              selectedClass?.user_wallet
                                          )} تومان`
                                        : "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    کورس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.course_name}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    پلتفرم
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.platform_name}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    وضعیت کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.status === 0 &&
                                        "تعیین وضعیت نشده"}
                                    {selectedClass?.status === 1 &&
                                        "برگزار شده"}
                                    {selectedClass?.status === 2 && "کنسل شده"}
                                    {selectedClass?.status === 3 &&
                                        "لغو بازگشت پول"}
                                    {selectedClass?.status === 4 && "غیبت"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    جلسه اول
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.first_class === 1
                                        ? "است"
                                        : "نیست"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    وضعیت پرداخت
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.pay === 1
                                        ? "پرداخت شده"
                                        : "پرداخت نشده"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    مدت کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.class_time
                                        ? `${selectedClass?.class_time} دقیقه`
                                        : "-"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                <th className="table__head-item">موبایل</th>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">قیمت</th>
                                <th className="table__head-item">زمان کلاس</th>
                                <th className="table__head-item">تاریخ کلاس</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((cls) => (
                                <tr className="table__body-row" key={cls.id}>
                                    <td className="table__body-item">
                                        {cls.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.user_mobile}
                                        {cls?.user_mobile && (
                                            <Link
                                                href={`https://api.whatsapp.com/send?phone=${cls.user_mobile}`}
                                            >
                                                <a
                                                    className="whatsapp-icon"
                                                    target="_blank"
                                                >
                                                    <span>
                                                        <AiOutlineWhatsApp />
                                                    </span>
                                                </a>
                                            </Link>
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {typeof cls.user_wallet === "number"
                                            ? `${Intl.NumberFormat().format(
                                                  cls.user_wallet
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.time ? formatTime(cls.time) : "-"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment
                                            .from(cls.date, "en", "YYYY/MM/DD")
                                            .locale("fa")
                                            .format("YYYY/MM/DD")}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedClass(cls);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {classes.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={12}
                                    >
                                        کلاسی پیدا نشد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {classes.length !== 0 && (
                    <Pagination read={readClasses} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default NotHeldClasses;
