import { useEffect, useState } from "react";
import styles from "./Carousel.module.css";
import moment from "jalali-moment";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

function Caresoul(props) {
    const {
        selectedHours,
        setSelectedHours,
        teacherFreeTime,
        time,
        course_id,
        readTeacherFreeTime,
        showAlert,
    } = props;
    const [count, setcount] = useState(false);
    const [checkTrial, setCheckTrial] = useState(true);
    const [calendarlInd, setCalendarlInd] = useState(0);
    const [timeList, setTimeList] = useState([]);
    const [ReservedtimeList, setReservedTimeList] = useState([]);
    moment.locale("fa");
    const m = moment().add(1, "day");
    const months = m._locale._jMonths;
    const weekdays = [
        "شنبه",
        "یک‌شنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنج‌شنبه",
        "جمعه",
    ];

    useEffect(() => {
        if (teacherFreeTime) {
            let teacherTimeList = Object.values(teacherFreeTime);
            let ListItem = teacherTimeList.map((item, index) =>
                item.free.map(
                    (hour, i) => (index + 1).toString() + hour.toString()
                )
            );
            let ListItemFlat = ListItem.reduce(
                (acc, val) => acc.concat(val),
                []
            );

            let ListItemReserve = teacherTimeList.map((item, index) =>
                item.reserve.map(
                    (hour, i) => (index + 1).toString() + hour.toString()
                )
            );
            let ListItemFlatReserve = ListItemReserve.reduce(
                (acc, val) => acc.concat(val),
                []
            );

            setTimeList(ListItemFlat);
            setReservedTimeList(ListItemFlatReserve);
        }
    }, [teacherFreeTime]);

    const calendarData = {
        startDay: m.add(calendarlInd * 7 + 1, "days").format("DD"),
        startMonth: months[m.month()],
        endDay: m.add(6, "days").format("DD"),
        endMonth: months[m.month()],
    };

    const nextWeekBtn = () => {
        if (calendarlInd !== 4 - 1) {
            readTeacherFreeTime(calendarlInd + 1);
            setCalendarlInd(calendarlInd + 1);
        }
    };

    const prevWeekBtn = () => {
        if (calendarlInd !== 0) {
            readTeacherFreeTime(calendarlInd - 1);
            setCalendarlInd(calendarlInd - 1);
        }
    };

    function checkIndexSelectedHour(isItemSelected, startHour, startMin) {
        for (let i = 0; i < isItemSelected.hours.length; i++) {
            if (
                isItemSelected.hours[i]["start"] === startHour &&
                isItemSelected.hours[i]["min"] === startMin
            ) {
                return i;
            }
        }
        return -1;
    }

    const getHourCount = () => {
        if (Number(course_id) === 1) {
            return "trial";
        }
        if (Number(course_id) === 2) {
            return 1;
        }
        if (Number(course_id) === 3) {
            return 5;
        }
        if (Number(course_id) === 4) {
            return 10;
        }
        if (Number(course_id) === 5) {
            return 16;
        }
    };

    const selectedHoursHandler = (
        e,
        weekday,
        day,
        month,
        year,
        startHour,
        startMin,
        allDay
    ) => {
        if (
            !e.currentTarget?.classList?.contains(
                styles["caresoul__item-hour--active"]
            )
        ) {
            // Selecting a not selected hour
            let duration = Number(time) / 60;
            let HourCount = getHourCount();
            if (selectedHours?.length < HourCount || HourCount === "trial") {
                if (HourCount === "trial") {
                    let sibling = e.currentTarget;
                    sibling.classList.add(
                        styles["caresoul__item-hour--active"]
                    );
                    setCheckTrial(true);
                } else {
                    let siblingsCount = Number(duration) / 0.5;

                    while (siblingsCount--) {
                        if (siblingsCount === 3) {
                            if (
                                e.currentTarget?.nextSibling?.nextSibling
                                    ?.nextSibling !== null
                            ) {
                                let sibling =
                                    e.currentTarget?.nextSibling?.nextSibling
                                        ?.nextSibling;
                                sibling?.classList.add(
                                    styles["caresoul__item-hour--active"]
                                );
                            }
                        }
                        if (siblingsCount === 2) {
                            if (
                                e.currentTarget?.nextSibling?.nextSibling !==
                                null
                            ) {
                                let sibling =
                                    e.currentTarget?.nextSibling?.nextSibling;
                                sibling?.classList.add(
                                    styles["caresoul__item-hour--active"]
                                );
                            }
                        }
                        if (siblingsCount === 1) {
                            if (e.currentTarget?.nextSibling !== null) {
                                let sibling = e.currentTarget?.nextSibling;
                                sibling?.classList.add(
                                    styles["caresoul__item-hour--active"]
                                );
                            }
                        }
                        if (siblingsCount === 0) {
                            let sibling = e.currentTarget;
                            sibling.classList.add(
                                styles["caresoul__item-hour--active"]
                            );
                        }
                    }
                }
            }
            // Checking number of selected hours
            if (
                selectedHours?.length < HourCount ||
                (HourCount === "trial" && checkTrial === true)
            ) {
                const t = m;
                // console.log("duration")
                // console.log(duration)
                // t.add((Number(duration) / 60) * 30, "minute");
                t.add((Number(duration) / 0.5) * 30, "minute");
                let endHour = t.format("HH");
                let endMin = t.format("mm");

                let Start = Number(startHour) + (startMin === "30" ? 0.5 : 0.0);
                let finish = Number(endHour) + (endMin === "30" ? 0.5 : 0.0);
                let hours = [];

                for (let i = Start; i < finish; i = i + 0.5) {
                    let decimal = i - Math.floor(i);
                    hours.push({
                        start: ("0" + Math.trunc(i).toString()).slice(-2),
                        min: decimal === 0.5 ? "30" : "00",
                    });
                }

                const newHour = {
                    weekday,
                    day,
                    month,
                    year,
                    startHour,
                    startMin,
                    endHour,
                    endMin,
                    hours,
                    allDay,
                };
                // console.log(startHour)
                // console.log(endHour)

                setSelectedHours([...selectedHours, newHour]);
                e.currentTarget?.classList.add(
                    styles["caresoul__item-hour--active"]
                );
            } else {
                setcount(!count);
                alert(
                    "بیش از تعداد جلسات مشخش شده نمی توانید کلاس رزرو نمایید."
                );
            }
        } else {
            // Deselecting a hour
            setcount(!count);

            let isItemSelected = selectedHours?.find(
                (item) =>
                    item?.day === day &&
                    item.hours.some(
                        (ecah) =>
                            ecah.start === startHour && ecah.min === startMin
                    )
            );

            if (isItemSelected !== undefined) {
                selectedHours.splice(
                    selectedHours?.findIndex(
                        (item) =>
                            item?.day === day &&
                            item.hours.some(
                                (ecah) =>
                                    ecah.start === startHour &&
                                    ecah.min === startMin
                            )
                    ),
                    1
                );
                setSelectedHours(selectedHours);
                let indexHour = checkIndexSelectedHour(
                    isItemSelected,
                    startHour,
                    startMin
                );

                let siblingsCounts = isItemSelected.hours.length - indexHour;
                let BeforIndex = indexHour + 1;

                while (siblingsCounts--) {
                    if (siblingsCounts === 3) {
                        if (
                            e.currentTarget?.nextSibling?.nextSibling
                                ?.nextSibling !== null
                        ) {
                            let sibling =
                                e.currentTarget?.nextSibling?.nextSibling
                                    ?.nextSibling;
                            sibling?.classList.remove(
                                styles["caresoul__item-hour--active"]
                            );
                        }
                    }
                    if (siblingsCounts === 2) {
                        if (
                            e.currentTarget?.nextSibling?.nextSibling !== null
                        ) {
                            let sibling =
                                e.currentTarget?.nextSibling?.nextSibling;
                            sibling?.classList.remove(
                                styles["caresoul__item-hour--active"]
                            );
                        }
                    }
                    if (siblingsCounts === 1) {
                        if (e.currentTarget?.nextSibling !== null) {
                            let sibling = e.currentTarget?.nextSibling;
                            sibling?.classList.remove(
                                styles["caresoul__item-hour--active"]
                            );
                        }
                    }
                    if (siblingsCounts === 0) {
                        let sibling = e.currentTarget;
                        sibling.classList.remove(
                            styles["caresoul__item-hour--active"]
                        );
                    }
                    // let sibling = e.currentTarget?.nextSibling;
                    // console.log(e.currentTarget?.nextSibling.nextSibling)
                    // sibling.classList.add(styles["caresoul__item-hour--active"]);
                }

                while (BeforIndex--) {
                    if (BeforIndex === 3) {
                        if (
                            e.currentTarget?.previousSibling?.previousSibling
                                ?.previousSibling !== null
                        ) {
                            let sibling =
                                e.currentTarget?.previousSibling
                                    ?.previousSibling?.previousSibling;
                            sibling?.classList.remove(
                                styles["caresoul__item-hour--active"]
                            );
                        }
                    }
                    if (BeforIndex === 2) {
                        if (
                            e.previousSibling?.previousSibling
                                ?.previousSibling !== null
                        ) {
                            let sibling =
                                e.currentTarget?.previousSibling
                                    ?.previousSibling;
                            sibling?.classList.remove(
                                styles["caresoul__item-hour--active"]
                            );
                        }
                    }
                    if (BeforIndex === 1) {
                        if (e.currentTarget?.previousSibling !== null) {
                            let sibling = e.currentTarget?.previousSibling;

                            sibling?.classList.remove(
                                styles["caresoul__item-hour--active"]
                            );
                        }
                    }
                    if (BeforIndex === 0) {
                        let sibling = e.currentTarget;
                        sibling.classList.remove(
                            styles["caresoul__item-hour--active"]
                        );
                    }
                }
                showAlert(true, "success", "ساعت انتخاب شده با موفقیت حذف شد.");
                e.currentTarget?.classList.remove(
                    styles["caresoul__item-hour--active"]
                );
            }
        }
    };

    return (
        <div className={styles.caresoul} style={{ marginTop: "16px" }}>
            {/* Caresoul Navigation  */}
            <div className={styles.caresoul__navigation}>
                <button
                    className={`${styles["caresoul__navigation-btn"]} ${styles["caresoul__navigation-btn--prev"]}`}
                    onClick={prevWeekBtn}
                    disabled={calendarlInd === 0}
                    type="button"
                >
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <AiOutlineRight /> هفته قبل{" "}
                    </span>
                </button>

                <button
                    className={`${styles["caresoul__navigation-btn"]} ${styles["caresoul__navigation-btn--next"]}`}
                    onClick={nextWeekBtn}
                    disabled={calendarlInd === 3}
                    type="button"
                >
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        هفته بعد <AiOutlineLeft />
                    </span>
                </button>
            </div>
            {/* Caresoul Navigation  */}

            <div className={styles.carousel__wrapper}>
                {[...Array(4)].map((_, index) => {
                    let position = styles["carousel__item--next"];

                    if (calendarlInd === index) {
                        position = styles["carousel__item--active"];
                    }

                    if (
                        calendarlInd === index - 1 ||
                        (index === 0 && calendarlInd === 3)
                    ) {
                        position = styles["carousel__item--last"];
                    }

                    m.subtract(7, "days");

                    return (
                        <div
                            className={`${styles.carousel__item} ${position}`}
                            key={index}
                        >
                            <div className={styles["carousel__item-title"]}>
                                <span>
                                    {calendarData.startDay}{" "}
                                    {calendarData.startMonth}
                                </span>{" "}
                                تا{" "}
                                <span>
                                    {calendarData.endDay}{" "}
                                    {calendarData.endMonth}
                                </span>
                            </div>

                            <div className={styles["carousel__item-body"]}>
                                <button
                                    className={styles["caresoul__item-week"]}
                                    type="button"
                                >
                                    {[...Array(7)].map((_, ind) => {
                                        m.set("hour", 0);
                                        m.set("minute", 0);

                                        return (
                                            <div
                                                className={
                                                    styles[
                                                        "caresoul__item-weekday"
                                                    ]
                                                }
                                                key={ind}
                                            >
                                                <div
                                                    className={
                                                        styles[
                                                            "caresoul__item-weekday-date"
                                                        ]
                                                    }
                                                >
                                                    <span>
                                                        {
                                                            weekdays[
                                                                m
                                                                    .add(
                                                                        0,
                                                                        "days"
                                                                    )
                                                                    .weekday()
                                                            ]
                                                        }
                                                    </span>
                                                    <span>
                                                        {m.format("DD")}
                                                    </span>
                                                </div>
                                                <ul
                                                    className={
                                                        styles[
                                                            "caresoul__item-hours"
                                                        ]
                                                    }
                                                >
                                                    {[...Array(48).fill()].map(
                                                        (_, i) => (
                                                            <li
                                                                // className={
                                                                //   timeList.includes(
                                                                //     (7 * index + ind + 1).toString() +
                                                                //       i.toString()
                                                                //   )
                                                                //     ? "d-block"
                                                                //     : "d-none"
                                                                // }

                                                                className={
                                                                    timeList.includes(
                                                                        (
                                                                            ind +
                                                                            1
                                                                        ).toString() +
                                                                            i.toString()
                                                                    )
                                                                        ? "d-block"
                                                                        : ReservedtimeList.includes(
                                                                              (
                                                                                  ind +
                                                                                  1
                                                                              ).toString() +
                                                                                  i.toString()
                                                                          )
                                                                        ? styles[
                                                                              "caresoul__item-hour--reserved"
                                                                          ]
                                                                        : "d-none"
                                                                }
                                                                //   // id={(ind + 1).toString() + i.toString()}
                                                                //   id={ (7 * index + ind + 1).toString() +
                                                                //     i.toString()
                                                                // }
                                                                key={i}
                                                                onClick={(e) =>
                                                                    selectedHoursHandler(
                                                                        e,
                                                                        weekdays[
                                                                            m
                                                                                .subtract(
                                                                                    7 -
                                                                                        ind,
                                                                                    "days"
                                                                                )
                                                                                .set(
                                                                                    "hour",
                                                                                    0
                                                                                )
                                                                                .set(
                                                                                    "minute",
                                                                                    0
                                                                                )
                                                                                .add(
                                                                                    30 *
                                                                                        i,
                                                                                    "minute"
                                                                                )
                                                                                .weekday()
                                                                        ],
                                                                        m.format(
                                                                            "DD"
                                                                        ),
                                                                        months[
                                                                            m.month()
                                                                        ],
                                                                        m.year(),
                                                                        m.format(
                                                                            "HH"
                                                                        ),
                                                                        m.format(
                                                                            "mm"
                                                                        ),
                                                                        m.format(
                                                                            " YYYY/M/D"
                                                                        )
                                                                    )
                                                                }
                                                            >
                                                                <span>
                                                                    {m.format(
                                                                        "HH"
                                                                    )}
                                                                    :
                                                                    {m.format(
                                                                        "mm"
                                                                    )}
                                                                </span>
                                                                <div
                                                                    className={
                                                                        styles[
                                                                            "caresoul__item-hours-hover"
                                                                        ]
                                                                    }
                                                                >
                                                                    <span>
                                                                        {
                                                                            weekdays[
                                                                                m.weekday()
                                                                            ]
                                                                        }
                                                                        &nbsp;
                                                                        {m.format(
                                                                            "DD"
                                                                        )}
                                                                        &nbsp;
                                                                        {
                                                                            months[
                                                                                m.month()
                                                                            ]
                                                                        }
                                                                    </span>
                                                                    <span>
                                                                        {m.format(
                                                                            "HH"
                                                                        )}
                                                                        :
                                                                        {m.format(
                                                                            "mm"
                                                                        )}
                                                                        &nbsp;
                                                                        تا
                                                                        &nbsp;
                                                                        {m.format(
                                                                            "HH"
                                                                        )}
                                                                        :
                                                                        {m
                                                                            .add(
                                                                                30,
                                                                                "minutes"
                                                                            )
                                                                            .format(
                                                                                "mm"
                                                                            )}
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Caresoul;
