import { useState } from "react";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import { BASE_URL } from "../../../../../constants";
import { useGlobalContext } from "../../../../../context/index";
import Modal from "../../../../Modal/Modal";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function NotPaidClasses(props) {
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
            pathname: `/tkpanel/class/notPaymentForClass`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/classroom/not-payed?page=${page}`,
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
            console.log("Error reading not payed classes", error);
        }
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    class: "????????",
                    notPaymentForClass: "???????? ???????????? ????????",
                }}
            />

            <Box title="???????? ???????? ?????? ???????????? ????????">
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>???????????? ??????????????</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ???????????? ???????? ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.user_wallet
                                        ? `${Intl.NumberFormat().format(
                                              selectedClass?.user_wallet
                                          )} ??????????`
                                        : "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.course_name}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ????????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.platform_name}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ?????????? ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.status === 0 &&
                                        "?????????? ?????????? ????????"}
                                    {selectedClass?.status === 1 &&
                                        "???????????? ??????"}
                                    {selectedClass?.status === 2 && "???????? ??????"}
                                    {selectedClass?.status === 3 &&
                                        "?????? ???????????? ??????"}
                                    {selectedClass?.status === 4 && "????????"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ???????? ??????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.first_class === 1
                                        ? "??????"
                                        : "????????"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ?????????? ????????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.pay === 1
                                        ? "???????????? ??????"
                                        : "???????????? ????????"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ?????? ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.class_time
                                        ? `${selectedClass?.class_time} ??????????`
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
                                    ?????? ???????? ????????
                                </th>
                                <th className="table__head-item">????????????</th>
                                <th className="table__head-item">??????????</th>
                                <th className="table__head-item">????????</th>
                                <th className="table__head-item">???????? ????????</th>
                                <th className="table__head-item">?????????? ????????</th>
                                <th className="table__head-item">??????????????</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((item, i) => (
                                <tr className="table__body-row" key={item.id}>
                                    <td className="table__body-item">
                                        {item.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item.user_mobile}
                                        {item?.user_mobile && (
                                            <Link
                                                href={`https://api.whatsapp.com/send?phone=${item.user_mobile}`}
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
                                        {item.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item.price
                                            ? `${Intl.NumberFormat().format(
                                                  item.price
                                              )} ??????????`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.time
                                            ? formatTime(item.time)
                                            : "-"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment
                                            .from(item.date, "en", "YYYY/MM/DD")
                                            .locale("fa")
                                            .format("YYYY/MM/DD")}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedClass(item);
                                                setOpenModal(true);
                                            }}
                                        >
                                            ????????????
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
                                        ?????????? ???????? ??????.
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

export default NotPaidClasses;
