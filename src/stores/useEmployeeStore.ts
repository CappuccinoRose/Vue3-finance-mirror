import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Employee,
  EmployeeCreatePayload,
  EmployeeUpdatePayload,
  ExpenseReport,
  ExpenseReportCreatePayload,
  ExpenseReportApprovalPayload,
} from '@/types/employee'
import { employeeApi, expenseReportApi } from '@/api/employee'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])
  const isLoadingEmployees = ref(false)

  const expenseReports = ref<ExpenseReport[]>([])
  const isLoadingReports = ref(false)

  const activeEmployees = computed(() => employees.value.filter((emp) => emp.active))

  const fetchEmployees = async () => {
    isLoadingEmployees.value = true
    try {
      const response = await employeeApi.getAll()
      employees.value = response
    } catch (error) {
      console.error('获取员工列表失败:', error)
    } finally {
      isLoadingEmployees.value = false
    }
  }

  const createEmployeeAction = async (payload: EmployeeCreatePayload) => {
    try {
      const response = await employeeApi.create(payload)
      employees.value.push(response)
    } catch (error) {
      console.error('创建员工失败:', error)
      throw error
    }
  }

  const updateEmployeeAction = async (guid: string, payload: EmployeeUpdatePayload) => {
    try {
      const response = await employeeApi.update(guid, payload)
      const index = employees.value.findIndex((emp) => emp.guid === guid)
      if (index !== -1) {
        employees.value[index] = response
      }
    } catch (error) {
      console.error('更新员工失败:', error)
      throw error
    }
  }

  const deleteEmployeeAction = async (guid: string) => {
    try {
      await employeeApi.delete(guid)
      employees.value = employees.value.filter((emp) => emp.guid !== guid)
    } catch (error) {
      console.error('删除员工失败:', error)
      throw error
    }
  }

  const fetchReports = async () => {
    isLoadingReports.value = true
    try {
      const response = await expenseReportApi.getAll()
      expenseReports.value = response
    } catch (error) {
      console.error('获取费用报告列表失败:', error)
    } finally {
      isLoadingReports.value = false
    }
  }

  const submitReportAction = async (payload: ExpenseReportCreatePayload) => {
    try {
      const response = await expenseReportApi.create(payload)
      expenseReports.value.unshift(response)
    } catch (error) {
      console.error('提交费用报告失败:', error)
      throw error
    }
  }

  const approveReportAction = async (guid: string, payload: ExpenseReportApprovalPayload) => {
    try {
      const response = await expenseReportApi.approve(guid, payload)
      const index = expenseReports.value.findIndex((report) => report.guid === guid)
      if (index !== -1) {
        expenseReports.value[index] = response
      }
    } catch (error) {
      console.error('审批费用报告失败:', error)
      throw error
    }
  }

  return {
    employees,
    isLoadingEmployees,
    activeEmployees,
    fetchEmployees,
    createEmployeeAction,
    updateEmployeeAction,
    deleteEmployeeAction,
    expenseReports,
    isLoadingReports,
    fetchReports,
    submitReportAction,
    approveReportAction,
  }
})
