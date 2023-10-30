import HttpClient from '@/utils/axios-base'
export default {
  get: () => HttpClient.get('bill'),
  start: (consoleId, rateId, startTime) => HttpClient.post(`bill/${consoleId}/${rateId}/0`, startTime),
  setFood: (billId, food) => HttpClient.put(`bill/${billId}/set-foods`, food),
  close: (billId, endTime) => HttpClient.put(`bill/${billId}/close`, endTime),
  delete: (consoleId) => HttpClient.delete(`bill/${consoleId}`),
  changeMoney: (billId, moneyId) => HttpClient.put(`bill/${billId}/change-rate`, moneyId),
  changeStartTime: (billId, startTime) => HttpClient.put(`bill/${billId}/adjust-start-time`, startTime),
};