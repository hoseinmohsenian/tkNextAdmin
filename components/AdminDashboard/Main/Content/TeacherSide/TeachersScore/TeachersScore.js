import { useState } from "react";
import { BASE_URL } from "../../../../../../constants";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import ReactTooltip from "react-tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";

function TeachersScore(props) {
    const {
        fetchedTeachers: { data, ...restData },
        token,
    } = props;
    const [teachers, setTeachers] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });

    const readTeachers = async (page = 1) => {
        let searchParams = {};

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/score/minus/getAllScores`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/point?page=${page}`,
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
            setTeachers(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading teachers", error);
        }
    };

    return (
        <div>
            <Box
                title="امتیاز منفی اساتید"
                buttonInfo={{
                    name: "ایجاد",
                    url: "/score/minus/createScore",
                    color: "primary",
                }}
            >
                <ReactTooltip className="tooltip" />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">امتیاز</th>
                                <th className="table__head-item">
                                    تاثیر در حسابداری
                                </th>
                                <th
                                    className="table__head-item table__head-item-ellipsis"
                                    style={{ width: 300 }}
                                >
                                    توضیحات
                                </th>
                                <th className="table__head-item">ثبت کننده</th>
                                <th className="table__head-item">
                                    تاریخ ایجاد
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {teachers?.map((teacher, i) => (
                                <tr
                                    className="table__body-row"
                                    key={teacher?.id}
                                >
                                    <td
                                        className="table__body-item"
                                        data-tip={
                                            teacher?.teacher_mobile || "-"
                                        }
                                    >
                                        {teacher?.teacher_name}
                                        <span className="info-icon">
                                            <AiOutlineInfoCircle />
                                        </span>
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {`${
                                            teacher?.point_type === 0
                                                ? "-"
                                                : "+"
                                        }${teacher?.number}`}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.accounting_effect === 1
                                            ? "بله"
                                            : "خیر"}
                                    </td>
                                    <td
                                        className="table__body-item table__body-item--ellipsis"
                                        style={{
                                            width: 300,
                                        }}
                                    >
                                        {teacher?.desc}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.admin_name}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment(teacher?.created_at).format(
                                            "YYYY/MM/DD hh:mm:ss"
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {teachers?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={7}
                                    >
                                        استادی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {teachers?.length !== 0 && teachers && (
                    <Pagination read={readTeachers} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default TeachersScore;
