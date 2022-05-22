import { useState } from "react";
import { BASE_URL } from "../../../../../../constants";
import Pagination from "../../Pagination/Pagination";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import { useRouter } from "next/router";

function RequestDetails(props) {
    const {
        fetchedClasses: { data, ...restData },
        token,
    } = props;
    const [classes, setClasses] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });

    const readClasses = async (page = 1) => {
        let searchQuery = "";
        searchQuery += `page=${page}`;

        let searchParams = {};
        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }
        router.push({
            pathname: `/tkpanel/teacher/request/lists`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/classroom/first-request?${searchQuery}`,
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
            console.log("Error reading classes", error);
        }
    };

    return (
        <div>
            <Box title="وضعیت درخواست کلاس">
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                <th className="table__head-item">
                                    شماره زبان آموز
                                </th>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">
                                    شماره استاد
                                </th>
                                <th className="table__head-item">
                                    قابل پرداخت
                                </th>
                                <th className="table__head-item">تخفیف</th>
                                <th className="table__head-item">مدت زمان</th>
                                <th className="table__head-item">استپ</th>
                                <th className="table__head-item">
                                    وضعیت درخواست
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((item) => (
                                <tr className="table__body-row" key={item?.id}>
                                    <td className="table__body-item">
                                        {item?.user_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.user_mobile}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.teacher_mobile}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.payable
                                            ? `${Intl.NumberFormat().format(
                                                  item?.payable
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.payable
                                            ? `${Intl.NumberFormat().format(
                                                  item?.discount
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.time
                                            ? `${item?.time} دقیقه`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.step || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.status === 1
                                            ? "فعال"
                                            : "غیرفعال"}
                                    </td>
                                </tr>
                            ))}

                            {classes?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={12}
                                    >
                                        کلاسی پیدا نشد
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

export default RequestDetails;
