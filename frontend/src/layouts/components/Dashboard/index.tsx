import React, { useEffect } from "react";
import styled from "styled-components";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, BookOpen, Calendar, CheckCircle } from "lucide-react";
import { GET_TOTAL_CLASSES, GET_TOTAL_STUDENTS, GET_TOTAL_CLASSES_SESSION_TODAY } from "../../../api";
import { useTotal } from "../../../hooks/useTotal";

// ----------------- Data -----------------
interface Attendance {
  name: string;
  present: number;
}

const attendanceData: Attendance[] = [
  { name: "T2", present: 90 },
  { name: "T3", present: 85 },
  { name: "T4", present: 92 },
  { name: "T5", present: 88 },
  { name: "T6", present: 95 },
];

interface PieItem {
  name: string;
  value: number;
}

const pieData: PieItem[] = [
  { name: "Có mặt", value: 420 },
  { name: "Vắng", value: 80 },
];

const COLORS = ["#4CAF50", "#F44336"];

// ----------------- Component -----------------
const Dashboard: React.FC = () => {

  const { total: totalStudents, loading: loadingStudents, error: errorStudents } = useTotal(GET_TOTAL_STUDENTS);
  const { total: totalClasses, loading: loadingClasses, error: errorClasses } = useTotal(GET_TOTAL_CLASSES);
  const { total: totalClassesSession, loading: loadingClassesSession, error: errorClassesSession } = useTotal(GET_TOTAL_CLASSES_SESSION_TODAY);
 


  if (loadingStudents || loadingClasses || loadingClassesSession) return <p>Đang tải dữ liệu...</p>;
  if (errorStudents || errorClasses || errorClassesSession) return <p>{errorStudents || errorClasses || errorClassesSession}</p>;



  return (
    <Container>
      {/* Cards thống kê */}
      <Grid columns={4}>
        <Card>
          <CardContent>
            <IconWrapper color="#2563eb"><Users size={28} /></IconWrapper>
            <div>
              <Title>Tổng sinh viên</Title>
              <Value>{totalStudents}</Value>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <IconWrapper color="#16a34a"><BookOpen size={28} /></IconWrapper>
            <div>
              <Title>Tổng lớp học</Title>
              <Value>{totalClasses}</Value>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <IconWrapper color="#9333ea"><Calendar size={28} /></IconWrapper>
            <div>
              <Title>Buổi học hôm nay</Title>
              <Value>{totalClassesSession}</Value>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <IconWrapper color="#0d9488"><CheckCircle size={28} /></IconWrapper>
            <div>
              <Title>Tỉ lệ điểm danh</Title>
              <Value>92%</Value>
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Biểu đồ */}
      <Grid columns={2}>
        <ChartCard>
          <ChartTitle>Tỉ lệ điểm danh trong tuần</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={attendanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#3b82f6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Tỉ lệ đi học vs vắng</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>
    </Container>
  );
};


const Container = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 1}, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 16px;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: ${props => props.color};
`;

const Title = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const Value = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin: 4px 0 0 0;
`;

const ChartCard = styled(Card)`
  height: 360px;
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;


export default Dashboard;
