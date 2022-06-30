import {
    FaUserGraduate,
    FaUserPlus,
    FaUserSecret,
    FaChalkboardTeacher,
    FaUserMinus,
    FaSearch,
    FaPlusCircle,
    FaMoneyBill,
    FaChartArea,
    FaCommentDots,
    FaListUl,
    FaListAlt,
    FaRegMoneyBillAlt,
    FaLevelUpAlt,
    FaQuestionCircle,
} from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";
import {
    MdSchool,
    MdOutlineMonitor,
    MdAccountBalance,
    MdOutlineManageAccounts,
    MdPayment,
    MdPriceChange,
    MdOutlineContentPaste,
    MdDescription,
    MdFolderSpecial,
    MdGolfCourse,
    MdCategory,
} from "react-icons/md";
import { GrStatusWarningSmall } from "react-icons/gr";
import {
    IoToday,
    IoCheckmarkDoneSharp,
    IoPulseOutline,
    IoLanguage,
} from "react-icons/io5";
import {
    AiTwotoneUnlock,
    AiFillInteraction,
    AiOutlinePercentage,
    AiFillInfoCircle,
} from "react-icons/ai";
import {
    BiSupport,
    BiGitPullRequest,
    BiTable,
    BiSitemap,
} from "react-icons/bi";
import { BsArrowRepeat } from "react-icons/bs";
import {
    GiSkills,
    GiDirectionSign,
    GiLogicGateAnd,
    GiPlatform,
} from "react-icons/gi";
import { RiArticleFill, RiAdminLine } from "react-icons/ri";
import { BsPinAngleFill } from "react-icons/bs";
import { FiPercent, FiUserX } from "react-icons/fi";
import { GoReport } from "react-icons/go";
import { SiStatuspage } from "react-icons/si";

export default [
    {
        title: "زبان آموز",
        icon: <FaUserGraduate />,
        path: "#",
        subNav: [
            {
                title: "ایجاد زبان آموز جدید",
                path: "/tkpanel/profiles/create",
                icon: <FaUserPlus />,
            },
            {
                title: "لیست زبان آموزان",
                path: "/tkpanel/profiles",
                icon: <IoIosListBox />,
            },
            {
                title: "تعیین سطح زبان آموزان",
                path: "/tkpanel/profileDetermineLevel",
                icon: <FaUserSecret />,
            },
        ],
    },
    {
        title: "استاد",
        icon: <FaChalkboardTeacher />,
        path: "#",
        subNav: [
            {
                title: "لیست اساتید",
                path: "/tkpanel/teachers",
                icon: <IoIosListBox />,
            },
            {
                title: "کمیسیون متغیر استاد",
                path: "/tkpanel/teacher/commission",
                icon: <FiPercent />,
            },
            {
                title: "امتیاز منفی اساتید",
                path: "/score/minus/getAllScores",
                icon: <FaUserMinus />,
            },
            {
                title: "جستجو ساعات خالی",
                path: "/tkpanel/search/calender/view",
                icon: <FaSearch />,
            },
        ],
    },
    {
        title: "کلاس",
        icon: <MdSchool />,
        path: "#",
        subNav: [
            {
                title: "ایجاد کلاس جدید (ست کردن کلاس)",
                path: "/tkpanel/newTeacher/addStudent",
                icon: <FaPlusCircle />,
            },
            {
                title: "وضعیت درخواست کلاس",
                path: "/tkpanel/teacher/request/lists",
                icon: <GrStatusWarningSmall />,
            },
            {
                title: "تغییر قیمت کلاس",
                path: "/tkpanel/requestDetails/changePrice",
                icon: <FaMoneyBill />,
            },
            {
                title: "کلاس های امروز",
                path: "/tkpanel/class/requestDetails/today",
                icon: <IoToday />,
            },
            {
                title: "نمودار ثبت کلاس",
                path: "/tkpanel/class/request/chart",
                icon: <FaChartArea />,
            },
            {
                title: "وضعیت کلی کلاس ها",
                path: "/tkpanel/class/requestDetails/list",
                icon: <GrStatusWarningSmall />,
            },
            {
                title: "کلاس پرداخت نشده",
                path: "/tkpanel/class/notPaymentForClass",
                icon: <FaMoneyBill />,
            },
            {
                title: "کلاس برگزار نشده",
                path: "/tkpanel/class/paymentForClassNotStatus",
                icon: <MdSchool />,
            },
            {
                title: "کلاس گروهی",
                path: "#",
                icon: <AiTwotoneUnlock />,
                subNav: [
                    {
                        title: "لیست کلاس ها",
                        path: "/tkpanel/groupClass",
                        icon: <IoIosListBox />,
                    },
                    {
                        title: "ایجاد کلاس",
                        path: "/tkpanel/groupClass/create",
                        icon: <FaPlusCircle />,
                    },
                ],
            },
            {
                title: "کلاس نیمه خصوصی",
                path: "/tkpanel/newTeacher/addStudent",
                icon: <AiTwotoneUnlock />,
                subNav: [
                    {
                        title: "ایجاد کلاس",
                        path: "/tkpanel/semi-private-admin/create",
                        icon: <FaPlusCircle />,
                    },
                    {
                        title: "لیست کلاس ها",
                        path: "/tkpanel/semi-private-admin",
                        icon: <IoIosListBox />,
                    },
                    {
                        title: "لیست جلسات",
                        path: "/tkpanel/semi-private-admin/all-sessions",
                        icon: <IoIosListBox />,
                    },
                ],
            },
            {
                title: "مانیتورینگ",
                icon: <MdOutlineMonitor />,
                path: "#",
                subNav: [
                    {
                        title: "مانیتورینگ امروز",
                        path: "/tkpanel/monitoring/getTodayClasses",
                        icon: <IoToday />,
                    },
                    {
                        title: "مانیتورینگ انجام شده",
                        path: "/tkpanel/monitoring/getTodayMonitoring",
                        icon: <IoCheckmarkDoneSharp />,
                    },
                ],
            },
            {
                title: "کلاس اعتباری",
                icon: <MdSchool />,
                path: "#",
                subNav: [
                    {
                        title: "لیست کلاس ها",
                        path: "/tkpanel/installment/list",
                        icon: <IoIosListBox />,
                    },
                    {
                        title: "لیست اقساط",
                        path: "/tkpanel/installment/installments/list",
                        icon: <FaMoneyBill />,
                    },
                    {
                        title: "لیست اساتید اعتباری",
                        path: "/tkpanel/installment/teachers",
                        icon: <FaChalkboardTeacher />,
                    },
                    {
                        title: "لیست زبان آموزان اعتباری",
                        path: "/tkpanel/installment/students",
                        icon: <FaChalkboardTeacher />,
                    },
                ],
            },
        ],
    },
    {
        title: "پشتیبانی",
        icon: <BiSupport />,
        path: "#",
        subNav: [
            {
                title: "لندینگ تعاملی",
                path: "/tkpanel/landing/interactive/list",
                icon: <AiFillInteraction />,
            },
            {
                title: "لندینگ کاربران",
                path: "/tkpanel/landing/users/list",
                icon: <AiFillInteraction />,
            },
            {
                title: "لیست درخواست مشاوره",
                path: "/tkpanel/adviceRequests/list",
                icon: <IoIosListBox />,
            },
            {
                title: "درخواست ناتمام",
                path: "/tkpanel/requestFailed",
                icon: <BiGitPullRequest />,
            },
            {
                title: "کامنت اساتید",
                path: "/tkpanel/teacherComments",
                icon: <FaCommentDots />,
            },
            {
                title: "5جلسه / 10 جلسه",
                path: "/tkpanel/multiSessionsList",
                icon: <FaListUl />,
            },
        ],
    },
    {
        title: "حسابداری",
        icon: <MdAccountBalance />,
        path: "#",
        subNav: [
            {
                title: "زبان آموز",
                icon: <FaUserGraduate />,
                path: "#",
                subNav: [
                    {
                        title: "افزایش اعتبار زبان آموز",
                        path: "/tkpanel/profile/credit/index",
                        icon: <FaMoneyBill />,
                    },
                    {
                        title: "جزئیات پرداخت زبان آموز",
                        path: "/tkpanel/user/credits",
                        icon: <MdPayment />,
                    },
                    {
                        title: "لیست افزایش اعتبار دستی ",
                        path: "/tkpanel/logUser/profile/accountingCredite",
                        icon: <FaListAlt />,
                    },
                    {
                        title: "لیست پرداخت های درگاه ",
                        path: "/tkpanel/payments/admin",
                        icon: <FaListAlt />,
                    },
                    {
                        title: "برگزار شده های تکراری ",
                        path: "/tkpanel/penalties/duplicateHeldClasses",
                        icon: <BsArrowRepeat />,
                    },
                    {
                        title: "پرداخت های مشابه ",
                        path: "/tkpanel/penalties",
                        icon: <FaMoneyBill />,
                    },
                ],
            },
            {
                title: "استاد",
                icon: <FaChalkboardTeacher />,
                path: "#",
                subNav: [
                    {
                        title: "درخواست تسویه اساتید",
                        path: "/tkpanel/transactions/list",
                        icon: <BiGitPullRequest />,
                    },
                    {
                        title: "تغییر اعتبار استاد",
                        path: "/tkpanel/teacher/changeWallet",
                        icon: <MdPriceChange />,
                    },
                    {
                        title: "جزئیات پرداختی برای استاد",
                        path: "/tkpanel/teacher/credits",
                        icon: <FaRegMoneyBillAlt />,
                    },
                    {
                        title: "جزئیات درآمد اساتید",
                        path: "/tkpanel/accounting/teacher/list",
                        icon: <FaRegMoneyBillAlt />,
                    },
                    {
                        title: "جزئیات درآمد تیکا",
                        path: "/tkpanel/accounting/tk/today",
                        icon: <FaRegMoneyBillAlt />,
                    },
                ],
            },
        ],
    },
    {
        title: "محتوا",
        icon: <MdOutlineContentPaste />,
        path: "#",
        subNav: [
            {
                title: "محتوای سئو جدید",
                icon: <IoPulseOutline />,
                path: "#",
                subNav: [
                    {
                        title: "زبان",
                        path: "#",
                        icon: <IoLanguage />,
                        subNav: [
                            {
                                title: "زبان ها",
                                path: "/content/language",
                                icon: <IoLanguage />,
                            },
                            {
                                title: "توضیحات زبان",
                                path: "/content/lang/des",
                                icon: <MdDescription />,
                            },
                        ],
                    },
                    {
                        title: "تخصص",
                        path: "#",
                        icon: <MdFolderSpecial />,
                        subNav: [
                            {
                                title: "تخصص ها",
                                path: "/content/specialty",
                                icon: <MdFolderSpecial />,
                            },
                            {
                                title: "توضیحات تخصص",
                                path: "/content/specialty/information/desc",
                                icon: <MdDescription />,
                            },
                        ],
                    },
                    {
                        title: "مهارت",
                        path: "#",
                        icon: <GiSkills />,
                        subNav: [
                            {
                                title: "مهارت ها",
                                path: "/content/skill",
                                icon: <GiSkills />,
                            },
                            {
                                title: "توضیحات مهارت",
                                path: "/content/skill/description/inf",
                                icon: <MdDescription />,
                            },
                        ],
                    },
                    {
                        title: "سطح",
                        path: "#",
                        icon: <FaLevelUpAlt />,
                        subNav: [
                            {
                                title: "سطح ها",
                                path: "/content/level",
                                icon: <FaLevelUpAlt />,
                            },
                        ],
                    },
                    {
                        title: "کورس",
                        path: "#",
                        icon: <MdGolfCourse />,
                        subNav: [
                            {
                                title: "کورس ها",
                                path: "/content/course",
                                icon: <MdGolfCourse />,
                            },
                        ],
                    },
                ],
            },
            {
                title: "سئو",
                icon: <IoPulseOutline />,
                path: "#",
                subNav: [
                    {
                        title: "ریدایرکت سئو",
                        path: "/tkpanel/redirects",
                        icon: <GiDirectionSign />,
                    },
                ],
            },
            {
                title: "FAQ",
                icon: <FaQuestionCircle />,
                path: "#",
                subNav: [
                    {
                        title: "دسته بندی FAQ",
                        path: "/tkpanel/FaqCategory",
                        icon: <MdCategory />,
                    },
                    {
                        title: "زیر گروه دسته بندی FAQ",
                        path: "/tkpanel/FaqSubCategory",
                        icon: <MdCategory />,
                    },
                    {
                        title: "ایجاد سوال FAQ",
                        path: "/tkpanel/FaqSite",
                        icon: <FaPlusCircle />,
                    },
                ],
            },
        ],
    },
    {
        title: "وبلاگ",
        icon: <RiArticleFill />,
        path: "#",
        subNav: [
            {
                title: "ایجاد مقاله جدید",
                path: "/tkpanel/siteNews/create",
                icon: <FaPlusCircle />,
            },
            {
                title: "لیست مقالات",
                path: "/tkpanel/siteNews",
                icon: <IoIosListBox />,
            },
            {
                title: "دسته بندی اول مقالات",
                path: "/tkpanel/newsSubCategories",
                icon: <MdCategory />,
            },
            {
                title: "دسته بندی دوم مقالات",
                path: "/tkpanel/siteNewsCategories",
                icon: <MdCategory />,
            },
            {
                title: "دسته بندی سوم مقالات",
                path: "/tkpanel/categoriesLevel3",
                icon: <MdCategory />,
            },
            {
                title: "کامنت های مقالات",
                path: "/tkpanel/comments/list",
                icon: <FaCommentDots />,
            },
            {
                title: "لیست بارگذاری مقالات اساتید",
                path: "/tkpanel/siteNews/teachers/lists",
                icon: <IoIosListBox />,
            },
            {
                title: "اساتید پین شده",
                path: "/tkpanel/showPinTeachers",
                icon: <BsPinAngleFill />,
            },
            {
                title: "پین کردن استاد",
                path: "/tkpanel/pinTeacher",
                icon: <BsPinAngleFill />,
            },
        ],
    },
    {
        title: "صفحات سایت",
        icon: <BiSitemap />,
        path: "#",
        subNav: [
            {
                title: "لیست صفحات سایت",
                path: "/tkpanel/pages",
                icon: <IoIosListBox />,
            },
            {
                title: "ایجاد صفحه",
                path: "/tkpanel/pages/create",
                icon: <FaPlusCircle />,
            },
            {
                title: "تیم ما",
                path: "/tkpanel/ourTeams",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "درباره ما",
                path: "/tkpanel/siteAbouts",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "دوره ها",
                path: "/tkpanel/page/doreh",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "تماس ما",
                path: "/tkpanel/siteContacts",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "همکاری با ما",
                path: "/tkpanel/cooperations",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "قوانین و مقررات",
                path: "/tkpanel/policies",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "درخواست مدرک",
                path: "/tkpanel/degrees",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "نحوه تدریس",
                path: "/tkpanel/methods",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "حامیان ما",
                path: "/tkpanel/supporters",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "مصاحبه با اساتید",
                path: "/tkpanel/teacherInterviewsCategories",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "دعوت از دوستان فوتر",
                path: "/tkpanel/referralFooter",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "داستان تیکا",
                path: "/tkpanel/tikkaaStory",
                icon: <AiFillInfoCircle />,
            },
            {
                title: "راهنما",
                path: "/tkpanel/help/admin",
                icon: <AiFillInfoCircle />,
            },
        ],
    },
    {
        title: "مدیریت سایت",
        icon: <MdOutlineManageAccounts />,
        path: "#",
        subNav: [
            {
                title: "لیست کوپن های تخفیف",
                path: "/tkpanel/copens",
                icon: <AiOutlinePercentage />,
            },
            {
                title: "کدهای تخفیف استفاده شده",
                path: "/tkpanel/useCopen",
                icon: <AiOutlinePercentage />,
            },
            {
                title: "گزارش گیری استاد",
                path: "/tkpanel/report/teachers",
                icon: <GoReport />,
            },
            {
                title: "لیست جدول در کوئری",
                path: "/tkpanel/database/query/building",
                icon: <BiTable />,
            },
            {
                title: "لاگ سیستم",
                path: "/tkpanel/logReport/show",
                icon: <GiLogicGateAnd />,
            },
            {
                title: "وضعیت لاگ های سیستم",
                path: "/tkpanel/logReport/status",
                icon: <SiStatuspage />,
            },
            {
                title: "لیست ادمین ها",
                path: "/tkpanel/users",
                icon: <RiAdminLine />,
            },
            {
                title: "لیست سیاه کاربران",
                path: "/tkpanel/blackLists",
                icon: <FiUserX />,
            },
            {
                title: "پلتفرم ها",
                path: "/tkpanel/multiplatform",
                icon: <GiPlatform />,
            },
        ],
    },
];
