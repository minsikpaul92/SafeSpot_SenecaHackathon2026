export const getAlertLevel = (temperature) => {
  if (temperature >= 40) {
    return { level: 'extreme', message: 'Extreme Heat Warning — Find a Cool Space Now' };
  }

  if (temperature >= 35) {
    return { level: 'danger', message: 'Danger — Find a cooling centre immediately' };
  }

  if (temperature >= 30) {
    return { level: 'caution', message: 'Caution — Stay hydrated and monitor conditions' };
  }

  return { level: 'safe', message: 'Safe — No heat alert at this time' };
};
