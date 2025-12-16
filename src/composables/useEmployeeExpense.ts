// src/composables/useEmployeeExpense.ts

import { storeToRefs } from 'pinia'
import { useEmployeeStore } from '@/stores/useEmployeeStore'

export function useEmployeeExpense() {
  const employeeStore = useEmployeeStore()

  // --- 状态 ---
  // 员工相关
  const { employees, activeEmployees, isLoadingEmployees } = storeToRefs(employeeStore)
  // 费用报告相关
  const { expenseReports, isLoadingReports } = storeToRefs(employeeStore)

  // --- 方法 ---
  // 员工相关
  const { fetchEmployees, createEmployeeAction, updateEmployeeAction, deleteEmployeeAction } =
    employeeStore
  // 费用报告相关
  const { fetchReports, submitReportAction, approveReportAction } = employeeStore

  // --- 暴露给组件使用 ---
  return {
    // --- 状态
    employees,
    activeEmployees,
    isLoadingEmployees,
    expenseReports,
    isLoadingReports,

    // --- 员工操作
    loadEmployees: fetchEmployees,
    createEmployee: createEmployeeAction,
    updateEmployee: updateEmployeeAction,
    deleteEmployee: deleteEmployeeAction,

    // --- 费用报告操作
    loadReports: fetchReports,
    submitReport: submitReportAction,
    approveReport: approveReportAction,
  }
}
