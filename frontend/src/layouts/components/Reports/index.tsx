import React from "react";
import styled from "styled-components";
import { Download, Filter } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


// ---------------- Sample Data ----------------
const reportData = [
  { date: "01/08", present: 40, absent: 5 },
  { date: "05/08", present: 38, absent: 7 },
  { date: "10/08", present: 42, absent: 3 },
  { date: "15/08", present: 39, absent: 6 },
  { date: "20/08", present: 41, absent: 4 },
];

// ---------------- Component ----------------
const Reports: React.FC = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Báo cáo điểm danh</Title>
        <Actions>
          <Button>
            <Filter size={18} /> Lọc dữ liệu
          </Button>
          <Button primary>
            <Download size={18} /> Xuất báo cáo
          </Button>
        </Actions>
      </Header>

      {/* Stats */}
      <StatsGrid>
        <Card>
          <CardTitle>Tổng số buổi học</CardTitle>
          <CardValue>25</CardValue>
        </Card>
        <Card>
          <CardTitle>Tỷ lệ tham gia</CardTitle>
          <CardValue>92%</CardValue>
        </Card>
        <Card>
          <CardTitle>Sinh viên vắng nhiều</CardTitle>
          <CardValue>5</CardValue>
        </Card>
      </StatsGrid>

      {/* Chart */}
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="present" fill="#2563eb" name="Có mặt" />
            <Bar dataKey="absent" fill="#ef4444" name="Vắng mặt" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

// ---------------- Styled Components ----------------
const Container = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${(props) => (props.primary ? "#2563eb" : "#f3f4f6")};
  color: ${(props) => (props.primary ? "#fff" : "#374151")};
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.primary ? "#1d4ed8" : "#e5e7eb")};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const Card = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CardTitle = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const CardValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin-top: 8px;
`;

const ChartContainer = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  height: 400px;
`;


export default Reports;
