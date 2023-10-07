import HttpClient from '@/utils/axios-base'
export default {
  get: () => HttpClient.get('bill'),
  new: (consoleId, rateId) => HttpClient.post(`bill/${consoleId}/${rateId}/0`),
  setFood: (consoleId, food) => HttpClient.put(`bill/${consoleId}/set-foods`, food),
  close: (billId, endTime) => HttpClient.put(`bill/${billId}/close`, endTime),
  delete: (consoleId) => HttpClient.delete(`bill/${consoleId}`),
  changeMoney: (consoleId, moneyId) => HttpClient.put(`bill/${consoleId}/change-rate`, moneyId),
  changeStartTime: (consoleId, startTime) => HttpClient.put(`bill/${consoleId}/adjust-start-time`, startTime),
};