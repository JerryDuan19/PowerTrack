let trainingData = [];

module.exports = {
  addTraining: function(training) {
    trainingData.push(training);
  },
  getAllTrainings: function() {
    return trainingData;
  },
  // 添加其他必要的方法
};