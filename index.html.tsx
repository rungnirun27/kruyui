import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Download, Printer, CheckCircle, XCircle, Clock, BarChart3 } from 'lucide-react';

const StudentAttendanceSystem = () => {
  // ข้อมูลโรงเรียนและชั้นเรียน
  const schoolInfo = {
    className: "ประถมศึกษาปีที่ 6/1",
    semester: "ภาคเรียนที่ 1",
    academicYear: "2568",
    schoolName: "โรงเรียนหนองสำโรงวิทยา",
    district: "สพป.อุดรธานี เขต 1",
    teachers: ["ครูรุ่งนิรันดร์ โพธิ์เพชรเล็บ", "ครูนงนุช มงคลนำพร", "ครูศรัณย์พร กาญจนศรี"]
  };

  // ข้อมูลนักเรียน (ตัวอย่างจากไฟล์ที่อัปโหลด)
  const [students] = useState([
    { no: 1, studentId: "7802", citizenId: "1419902956046", fullName: "เด็กชายก้องภพ พลวาปี" },
    { no: 2, studentId: "7809", citizenId: "1419902926562", fullName: "เด็กชายพงศกร อินสอาด" },
    { no: 3, studentId: "7811", citizenId: "1419902937122", fullName: "เด็กชายภูตะวัน สาธารณะ" },
    { no: 4, studentId: "7812", citizenId: "1419902945435", fullName: "เด็กชายวิชญ์พล ทองเมือง" },
    { no: 5, studentId: "7814", citizenId: "1419902907487", fullName: "เด็กชายสุทธิพงษ์ คงนารา" },
    { no: 6, studentId: "7816", citizenId: "1419902911234", fullName: "เด็กหญิงกมลชนก สวยงาม" },
    { no: 7, studentId: "7818", citizenId: "1419902923456", fullName: "เด็กหญิงนิภา ใจดี" },
    { no: 8, studentId: "7820", citizenId: "1419902934567", fullName: "เด็กหญิงปรียา สุขใจ" },
    { no: 9, studentId: "7822", citizenId: "1419902945678", fullName: "เด็กหญิงมินตรา อยู่เย็น" },
    { no: 10, studentId: "7824", citizenId: "1419902956789", fullName: "เด็กหญิงสุดา รักเรียน" }
  ]);

  // State สำหรับระบบ
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState({});
  const [currentView, setCurrentView] = useState('daily'); // daily, monthly, yearly, reports
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(2025); // ปี ค.ศ.

  // โหลดข้อมูลการเข้าเรียนจาก localStorage
  useEffect(() => {
    const savedAttendance = localStorage.getItem('student-attendance');
    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance));
    }
  }, []);

  // บันทึกข้อมูลการเข้าเรียนลง localStorage
  useEffect(() => {
    localStorage.setItem('student-attendance', JSON.stringify(attendance));
  }, [attendance]);

  // ฟังก์ชันสำหรับจัดการการเช็คชื่อ
  const handleAttendance = (studentId, date, status) => {
    const dateStr = date.toDateString();
    setAttendance(prev => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [studentId]: status
      }
    }));
  };

  // ฟังก์ชันตรวจสอบว่าเป็นวันจันทร์-ศุกร์หรือไม่
  const isWeekday = (date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // จันทร์ = 1, ศุกร์ = 5
  };

  // ฟังก์ชันแปลงวันเป็นภาษาไทย
  const getDayInThai = (date) => {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    return days[date.getDay()];
  };

  // ฟังก์ชันแปลงเดือนเป็นภาษาไทย
  const getMonthInThai = (monthIndex) => {
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return months[monthIndex];
  };

  // ฟังก์ชันคำนวณสถิติ
  const calculateStats = (month = null, year = null) => {
    let totalDays = 0;
    let presentCount = {};
    let absentCount = {};
    let lateCount = {};

    students.forEach(student => {
      presentCount[student.studentId] = 0;
      absentCount[student.studentId] = 0;
      lateCount[student.studentId] = 0;
    });

    Object.keys(attendance).forEach(dateStr => {
      const date = new Date(dateStr);
      if (month !== null && date.getMonth() !== month) return;
      if (year !== null && date.getFullYear() !== year) return;
      if (!isWeekday(date)) return;

      totalDays++;
      const dayAttendance = attendance[dateStr];
      
      students.forEach(student => {
        const status = dayAttendance[student.studentId];
        if (status === 'present') presentCount[student.studentId]++;
        else if (status === 'absent') absentCount[student.studentId]++;
        else if (status === 'late') lateCount[student.studentId]++;
      });
    });

    return { totalDays, presentCount, absentCount, lateCount };
  };

  // ฟังก์ชันส่งออกข้อมูลเป็น Excel
  const exportToExcel = (type = 'monthly') => {
    // จำลองการส่งออก Excel
    alert(`กำลังส่งออกรายงาน${type === 'monthly' ? 'รายเดือน' : 'รายปี'}เป็นไฟล์ Excel...`);
  };

  // ฟังก์ชันส่งออกข้อมูลเป็น PDF
  const exportToPDF = (type = 'monthly') => {
    // จำลองการส่งออก PDF
    alert(`กำลังส่งออกรายงาน${type === 'monthly' ? 'รายเดือน' : 'รายปี'}เป็นไฟล์ PDF...`);
  };

  // คอมโพเนนต์สำหรับแสดงการเช็คชื่อรายวัน
  const DailyAttendanceView = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-800">เช็คชื่อรายวัน</h2>
            <p className="text-gray-600">
              วัน{getDayInThai(selectedDate)} ที่ {selectedDate.getDate()} {getMonthInThai(selectedDate.getMonth())} {selectedDate.getFullYear() + 543}
            </p>
          </div>
        </div>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {!isWeekday(selectedDate) && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700 font-medium">⚠️ วันที่เลือกเป็นวันหยุด (เช็คชื่อเฉพาะวันจันทร์-ศุกร์)</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(student => {
          const dateStr = selectedDate.toDateString();
          const status = attendance[dateStr]?.[student.studentId] || 'none';
          
          return (
            <div key={student.studentId} className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{student.fullName}</h3>
                  <p className="text-sm text-gray-600">รหัส: {student.studentId}</p>
                </div>
                <span className="text-2xl font-bold text-gray-400">#{student.no}</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAttendance(student.studentId, selectedDate, 'present')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    status === 'present' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                  }`}
                  disabled={!isWeekday(selectedDate)}
                >
                  <CheckCircle size={16} className="inline mr-1" />
                  มา
                </button>
                <button
                  onClick={() => handleAttendance(student.studentId, selectedDate, 'late')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    status === 'late' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-yellow-100'
                  }`}
                  disabled={!isWeekday(selectedDate)}
                >
                  <Clock size={16} className="inline mr-1" />
                  สาย
                </button>
                <button
                  onClick={() => handleAttendance(student.studentId, selectedDate, 'absent')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    status === 'absent' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                  }`}
                  disabled={!isWeekday(selectedDate)}
                >
                  <XCircle size={16} className="inline mr-1" />
                  ขาด
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // คอมโพเนนต์สำหรับแสดงรายงานรายเดือน
  const MonthlyReportView = () => {
    const stats = calculateStats(selectedMonth, selectedYear);
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="text-green-600" size={24} />
            <div>
              <h2 className="text-xl font-bold text-gray-800">รายงานรายเดือน</h2>
              <p className="text-gray-600">
                เดือน{getMonthInThai(selectedMonth)} {selectedYear + 543}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {Array.from({length: 12}, (_, i) => (
                <option key={i} value={i}>{getMonthInThai(i)}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value={2024}>2567</option>
              <option value={2025}>2568</option>
              <option value={2026}>2569</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-blue-700">วันเรียนทั้งหมด</h3>
            <p className="text-3xl font-bold text-blue-800">{stats.totalDays}</p>
            <p className="text-sm text-blue-600">วัน</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-green-700">นักเรียนทั้งหมด</h3>
            <p className="text-3xl font-bold text-green-800">{students.length}</p>
            <p className="text-sm text-green-600">คน</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-purple-700">เปอร์เซ็นต์เฉลี่ย</h3>
            <p className="text-3xl font-bold text-purple-800">
              {stats.totalDays > 0 ? Math.round(
                (Object.values(stats.presentCount).reduce((a, b) => a + b, 0) / (students.length * stats.totalDays)) * 100
              ) : 0}%
            </p>
            <p className="text-sm text-purple-600">การเข้าเรียน</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <th className="p-3 text-left">ลำดับ</th>
                <th className="p-3 text-left">ชื่อ-นามสกุล</th>
                <th className="p-3 text-center">มา</th>
                <th className="p-3 text-center">สาย</th>
                <th className="p-3 text-center">ขาด</th>
                <th className="p-3 text-center">เปอร์เซ็นต์</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const present = stats.presentCount[student.studentId] || 0;
                const late = stats.lateCount[student.studentId] || 0;
                const absent = stats.absentCount[student.studentId] || 0;
                const percentage = stats.totalDays > 0 ? Math.round((present / stats.totalDays) * 100) : 0;
                
                return (
                  <tr key={student.studentId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 font-medium">{student.no}</td>
                    <td className="p-3">{student.fullName}</td>
                    <td className="p-3 text-center">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {present}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                        {late}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                        {absent}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        percentage >= 80 ? 'bg-green-100 text-green-800' :
                        percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {percentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => exportToExcel('monthly')}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            <span>ส่งออก Excel</span>
          </button>
          <button
            onClick={() => exportToPDF('monthly')}
            className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Printer size={20} />
            <span>ส่งออก PDF</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">ระบบเช็คชื่อนักเรียน</h1>
            <div className="space-y-1">
              <p className="text-lg font-semibold">{schoolInfo.className} {schoolInfo.semester}</p>
              <p className="text-base">{schoolInfo.schoolName}</p>
              <p className="text-sm opacity-90">{schoolInfo.district}</p>
              <p className="text-sm opacity-80">
                ครูประจำชั้น: {schoolInfo.teachers.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center space-x-1 py-4">
            {[
              { key: 'daily', label: 'เช็คชื่อรายวัน', icon: Calendar },
              { key: 'monthly', label: 'รายงานรายเดือน', icon: BarChart3 },
              { key: 'yearly', label: 'รายงานรายปี', icon: FileText },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  currentView === key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {currentView === 'daily' && <DailyAttendanceView />}
        {(currentView === 'monthly' || currentView === 'yearly') && (
          <MonthlyReportView />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">
            ระบบเช็คชื่อนักเรียน | ปีการศึกษา {schoolInfo.academicYear} | 
            พัฒนาเพื่อการศึกษาไทย
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StudentAttendanceSystem;