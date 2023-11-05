import HttpClient from '@/utils/axios-base'
export default {
  get: (query) => HttpClient.get('api/bill', { params: query }),
  start: (consoleId, rateId, startTime) => HttpClient.post(`api/bill/${consoleId}/${rateId}/0`, startTime),
  setFood: (billId, food) => HttpClient.put(`api/bill/${billId}/set-foods`, food),
  close: (billId, endTime) => HttpClient.put(`api/bill/${billId}/close`, endTime),
  delete: (consoleId) => HttpClient.delete(`api/bill/${consoleId}`),
  changeMoney: (billId, moneyId) => HttpClient.put(`api/bill/${billId}/change-rate`, moneyId),
  changeStartTime: (billId, startTime) => HttpClient.put(`api/bill/${billId}/adjust-start-time`, startTime),
  open: () => HttpClient.get('opens'),
};