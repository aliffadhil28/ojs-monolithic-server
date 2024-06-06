export const workTimeSchema = {
  _id: false,
  hours: {
    type: Number,
    required: true,
    min: 0,
  },
  minutes: {
    type: Number,
    required: true,
    min: 0,
    max: 59,
  },
};