import LineChart from "../theme/svg/line-chart.svg";
import Clipboard from "../theme/svg/clipboards.svg";
import Course from "../theme/svg/language.svg";
import Icon from "../theme/svg/icon.svg";
import Institution from "../theme/svg/university-building.svg";
import Accounts from "../theme/svg/account.svg";
import Hash from "../theme/svg/hashtag.svg";
import Avatar from "../theme/svg/avatar.svg";
import Avatar2 from "../theme/svg/avatar2.svg";

// Menu items

export const statistic = {
  label: "Thống Kê",
  icon: LineChart,
};
export const trainingProgram = {
  label: "Chương Trình Đào Tạo",
  icon: Clipboard,
  items: [
    { label: "Danh sách chương trình đào tạo", url: "/training-programs" },
    { label: "Tạo mới chương trình đào tạo", url: "/training-program/add" },
    { label: "Quản lý tài liệu", url: "/training-program-documents" },
  ],
};
export const course = {
  label: "Học Phần",
  icon: Course,
  items: [
    { label: "Danh sách học phần", url: "/courses" },
    { label: "Tạo mới học phần", url: "/courses/add" },
    { label: "Quản lý tài liệu", url: "/course-documents" },
  ],
};
export const learningOutcome = {
  label: "Chuẩn Đầu Ra",
  icon: Icon,
  items: [
    { label: "Danh sách chuẩn đầu ra", url: "/learning-outcomes" },
    { label: "Tạo mới chuẩn đầu ra", url: "/learning-outcomes/add" },
    { label: "Quản lý tài liệu", url: "/learning-outcome-documents" },
  ],
};
export const institute = {
  label: "Đơn Vị Chuyên Môn",
  icon: Institution,
  items: [
    { label: "Danh sách đơn vị chuyên môn", url: "/institutions" },
    { label: "Tạo mới đơn vị chuyên môn", url: "/institutions/add" },
  ],
};
export const account = {
  label: "Tài Khoản",
  icon: Accounts,
  items: [
    { label: "Danh sách tài khoản", url: "/accounts" },
    { label: "Tạo mới tài khoản cán bộ", url: "/accounts/add" },
  ],
};
export const others = {
  label: "Khác",
  icon: Hash,
  items: [
    { label: "Ngành", url: "/majors" },
    { label: "Văn bản", url: "/texts" },
  ],
};

// Accounts

export const test = [
  {
    id: "dsad",
    avatar: Avatar2,
    fullName: "Nguyễn Văn A",
    role: "Sinh viên",
    institution: "Đại học công nghệ",
    phoneNumber: "012345678",
    faculty: "Công nghệ thông tin",
    vnuMail: "abc@vnu.edu.vn",
    birthday: "12/3/1999",
    email: "abc@gmail.com",
    studentCode: "123456789",
    major: "KHMT",
    majorCode: "74B01D1",
    year: "K62",
    class: "CLC",
    note: "Hello World",
  },
  {
    id: "fdgd",
    avatar: Avatar,
    fullName: "Phạm Văn C",
    role: "Sinh viên",
    institution: "Đại học công nghệ",
    phoneNumber: "012345678",
    faculty: "Công nghệ thông tin",
    vnuMail: "abc@vnu.edu.vn",
    birthday: "17/5/1999",
    email: "abc@gmail.com",
    studentCode: "123456789",
    major: "KHMT",
    majorCode: "74B01D1",
    year: "K62",
    class: "CLC",
    note: "Hello World",
  },
  {
    id: "bgfd",
    avatar: Avatar,
    fullName: "Lê K",
    role: "Sinh viên",
    institution: "Đại học công nghệ",
    phoneNumber: "012345678",
    faculty: "Công nghệ thông tin",
    vnuMail: "abc@vnu.edu.vn",
    birthday: "15/9/1999",
    email: "abc@gmail.com",
    studentCode: "123456789",
    major: "KHMT",
    majorCode: "74B01D1",
    year: "K62",
    class: "CLC",
    note: "Hello World",
  },
  {
    id: "wrte",
    avatar: Avatar,
    fullName: "Lê Văn B",
    role: "Giảng viên",
    academicRank: "Phó giáo sư",
    degree: "Tiến sĩ",
    institution: "Đại học công nghệ",
    phoneNumber: "045645678",
    faculty: "Điện tử viễn thông",
    vnuMail: "def@vnu.edu.vn",
    email: "dsa@gmail.com",
    note: "Hello world",
  },
];
