import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { AccessDeniedPage } from "@/pages/AccessDeniedPage";
import { AboutPage } from "@/pages/AboutPage";
import { AttendancePage } from "@/pages/AttendancePage";
import { BudgetsPage } from "@/pages/BudgetsPage";
import { ContactPage } from "@/pages/ContactPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { DepartmentsPage } from "@/pages/DepartmentsPage";
import { EmployeesPage } from "@/pages/EmployeesPage";
import { ExpensesPage } from "@/pages/ExpensesPage";
import { FinancePage } from "@/pages/FinancePage";
import { HomePage } from "@/pages/HomePage";
import { LeavePage } from "@/pages/LeavePage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PayrollPage } from "@/pages/PayrollPage";
import { ProfitLossPage } from "@/pages/ProfitLossPage";
import { RevenuePage } from "@/pages/RevenuePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="profit-loss" element={<ProfitLossPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="access-denied" element={<AccessDeniedPage />} />
          <Route element={<ProtectedRoute module="payroll" />}>
            <Route path="payroll" element={<PayrollPage />} />
          </Route>
          <Route element={<ProtectedRoute module="budgets" />}>
            <Route path="budgets" element={<BudgetsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
