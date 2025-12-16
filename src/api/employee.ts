// src/api/employee.ts
import pureApiClient from '@/api/client'
import type {
  Employee,
  EmployeeCreatePayload,
  EmployeeUpdatePayload,
  ExpenseReport,
  ExpenseReportCreatePayload,
  ExpenseReportApprovalPayload,
} from '@/types/employee'

// --- 员工 API ---
export const employeeApi = {
  getAll: () => pureApiClient.get<Employee[]>('/expenses/employees'),
  getById: (guid: string) => pureApiClient.get<Employee>(`/expenses/employees/${guid}`),
  create: (data: EmployeeCreatePayload) => {
    return pureApiClient.post<Employee>('/expenses/employees', data)
  },
  update: (guid: string, data: EmployeeUpdatePayload) => {
    return pureApiClient.put<Employee>(`/expenses/employees/${guid}`, data)
  },
  delete: (guid: string) => pureApiClient.delete(`/expenses/employees/${guid}`),
}

// --- 费用报告 API ---
export const expenseReportApi = {
  getAll: (params?: { skip?: number; limit?: number }) =>
    pureApiClient.get<ExpenseReport[]>('/expenses/reports', { params }),
  getMine: (params?: { skip?: number; limit?: number }) =>
    pureApiClient.get<ExpenseReport[]>('/expenses/my-reports', { params }),
  getById: (guid: string) => pureApiClient.get<ExpenseReport>(`/expenses/reports/${guid}`),
  create: (data: ExpenseReportCreatePayload) =>
    pureApiClient.post<ExpenseReport>('/expenses/reports', data),
  approve: (guid: string, data: ExpenseReportApprovalPayload) =>
    pureApiClient.patch<ExpenseReport>(`/expenses/reports/${guid}/approve`, data),
  delete: (guid: string) => pureApiClient.delete(`/expenses/reports/${guid}`),
}
