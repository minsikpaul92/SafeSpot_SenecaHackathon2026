export const createSensorStore = () => {
  let latestReading = null;

  const save = (temperature) => {
    latestReading = {
      temperature,
      timestamp: new Date().toISOString(),
    };

    return latestReading;
  };

  const getLatest = () => latestReading;

  return {
    save,
    getLatest,
  };
};
